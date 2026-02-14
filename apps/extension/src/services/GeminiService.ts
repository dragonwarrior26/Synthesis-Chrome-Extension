import { supabase } from '../lib/supabase'
import { type SynthesisMode, type ExtractedContent, GeminiService as CoreGemini } from '@synthesis/core'
import { TierService } from './TierService'
import { logger } from './LoggingService'

/**
 * GeminiService - Synthesis AI Integration
 * Routes requests based on user tier (Free/Pro/BYOK)
 */
export class GeminiService {
    /**
     * Synchronous synthesis - returns complete result
     */
    static async synthesize(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 200000  // FIXED: Was 10000
    ): Promise<string> {
        const tier = await TierService.getCurrentTier();
        logger.info('[GeminiService] Synthesis requested. Tier:', tier);

        if (tier === 'byok') {
            const apiKey = await TierService.getStoredApiKey();
            if (!apiKey) throw new Error('API key required for BYOK tier');

            const coreGemini = new CoreGemini(apiKey);
            return coreGemini.synthesize(
                tabs,
                query,
                mode,
                imageData,
                depth,
                contentLimit
            );
        }

        // Free & Pro tiers use server key via Edge Function
        // synthesizeWithServerKey is now a generator, we must consume it fully for non-streaming mode
        // INCREASED LIMIT: 10000 -> 100000 to prevent context loss in multi-source (YouTube + Web)
        const stream = await this.synthesizeWithServerKey(tabs, query, mode, [], depth, contentLimit);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
        }
        return fullResponse;
    }

    /**
     * Streaming synthesis - yields chunks as they arrive
     */
    static async *synthesizeStream(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 200000  // FIXED: Was 10000
    ): AsyncGenerator<string, void, unknown> {
        console.log('[GeminiService] DEBUG: synthesizeStream called with', tabs.length, 'tabs');
        const tier = await TierService.getCurrentTier();
        console.log('[GeminiService] DEBUG: Detected tier:', tier);
        logger.info('[GeminiService] Stream synthesis requested. Tier:', tier);

        if (tier === 'byok') {
            console.log('[GeminiService] DEBUG: Taking BYOK path...');
            const apiKey = await TierService.getStoredApiKey();
            if (!apiKey) {
                console.error('[GeminiService] DEBUG: BYOK but no API key!');
                yield "Error: API key required for BYOK tier";
                return;
            }

            console.log('[GeminiService] DEBUG: Calling CoreGemini with BYOK key...');
            const coreGemini = new CoreGemini(apiKey);
            const streamGenerator = await coreGemini.synthesizeStream(
                tabs,
                query,
                mode,
                chatHistory,
                imageData,
                depth,
                contentLimit
            );

            yield* streamGenerator;
            return;
        }

        // Free & Pro tiers use server key via Edge Function
        console.log('[GeminiService] DEBUG: Taking FREE/PRO path (Edge Function)...');
        // Use the passed contentLimit, not a hardcoded value!
        const stream = await this.synthesizeWithServerKey(tabs, query, mode, chatHistory, depth, contentLimit);
        for await (const chunk of stream) {
            yield chunk;
        }
    }

    /**
     * Edge Function call for Free/Pro tiers
     */
    private static async *synthesizeWithServerKey(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 200000  // FIXED: Was 10000, causing context loss for Free tier
    ): AsyncGenerator<string, void, unknown> {
        const prompt = this.buildPrompt(tabs, query, mode, chatHistory, depth, contentLimit);
        logger.info('[GeminiService] Calling Edge Function. Prompt length:', prompt.length);

        // Call Edge Function directly via fetch instead of Supabase client
        // This bypasses authentication issues for free tier users
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const functionUrl = `${supabaseUrl}/functions/v1/ai-request`;

        // Get current user session for rate limiting
        const { data: { session } } = await supabase.auth.getSession();
        const authHeader = session?.access_token
            ? `Bearer ${session.access_token}`
            : `Bearer ${supabaseAnonKey}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        try {
            console.log('[GeminiService] DEBUG: Fetching Edge Function...', functionUrl);

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                    // Pass current URL for origin checking if needed
                    'X-Client-Info': 'synthesis-extension',
                    'apikey': supabaseAnonKey
                },
                body: JSON.stringify({ prompt }),
                signal: controller.signal
            });

            // clearTimeout(timeoutId); // MOVED TO FINALLY BLOCK

            console.log('[GeminiService] DEBUG: Fetch completed. Status:', response.status);

            if (!response.ok) {
                const contentType = response.headers.get('Content-Type');
                // let errorMessage = `Request failed: ${response.status}`; // Unused

                if (contentType?.includes('application/json')) {
                    try {
                        const errorData = await response.json();
                        console.error('[GeminiService] Edge Function JSON Error:', errorData);
                        // Throw the clean error message to be displayed in UI
                        throw new Error(errorData.error || 'Unknown server error');
                    } catch (e) {
                        // Fallback if JSON parse fails
                        console.error('Failed to parse error JSON', e);
                    }
                }

                const errorText = await response.text();
                console.error('[GeminiService] DEBUG: HTTP Error!', response.status, errorText);
                logger.error(`[GeminiService] Edge Function HTTP error: ${response.status} - ${errorText}`);
                throw new Error(`Backend synthesis failed: ${response.status} - ${errorText}`);
            }

            if (!response.body) {
                console.error('[GeminiService] DEBUG: No response body!');
                throw new Error('No response body from Edge Function');
            }

            console.log('[GeminiService] DEBUG: Starting stream read...');
            // Stream reading logic
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let chunkCount = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log('[GeminiService] DEBUG: Stream complete. Total chunks:', chunkCount);
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                if (chunk) {
                    chunkCount++;
                    console.log(`[GeminiService] DEBUG: Yielding chunk #${chunkCount}, length: ${chunk.length}`);
                    yield chunk;
                }
            }
            if (chunkCount === 0) {
                throw new Error('No data received from AI.');
            }
        } catch (error) {
            console.error('[GeminiService] DEBUG: CAUGHT ERROR:', error);
            logger.error('[GeminiService] Edge Function call failed:', error);
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private static getPrompts(depth: 'standard' | 'deep'): Record<SynthesisMode, string> {
        const STANDARD_PROMPTS: Record<SynthesisMode, string> = {
            chat: `
You are "Synthesis", a helpful Research Assistant.

# GUIDELINES
- Answer clearly and concisely.
- Use Markdown (bold, lists) for readability.
- If the user asks for math, use LaTeX ($...$), but simple text explanations are also fine.
`,
            summary: `
You are "Synthesis". Create a **Visual Research Summary**.

# FORMATTING
1. **Title**: 📝 [Engaging Title]
2. **Executive Summary**: A clear, paragraph-form summary.
3. **Key Takeaways**:
   - 🎯 [Point 1]
   - ⚡ [Point 2]
   - 💡 [Point 3]
4. **Key Entities Table** (Markdown):
   | Entity | Role/Significance |
   | :--- | :--- |
   | [Name] | [Details] |
`,
            table: `
You are "Synthesis". Create a **Comparison Table**.

1. Create a Markdown table comparing the items in the text.
2. Columns should be: Feature, Details, Notes.
3. **NO CODE BLOCKS**: Do NOT wrap the table in \`\`\` or \`\`\`markdown. Return raw table syntax only.
`,
            proscons: `
You are "Synthesis". List the **Pros and Cons**.

1. **Pros**: Bulleted list of advantages.
2. **Cons**: Bulleted list of disadvantages.
`,
            insights: `
You are "Synthesis". Provide **Key Insights**.

- Identify the most significant findings from the text.
- Use bullet points for readability.
- Focus on practical takeaways.
`
        };

        const DEEP_PROMPTS: Record<SynthesisMode, string> = {
            chat: `
You are "Synthesis", an expert Research Assistant with PhD-level knowledge.

# FORMATTING RULES (CRITICAL)
1. **MATH**: You MUST use LaTeX for ALL mathematical formulas.
   - **Inline**: Wrap in single dollar signs, e.g., $E=mc^2$
   - **Block**: Wrap in double dollar signs, e.g., $$ ... $$
   - **NEVER** use plain text like "QK^T / sqrt(d_k)" or brackets like "[ ... ]".
   - **EXAMPLE**: Correct: $Attention(Q, K, V)$, Incorrect: Attention(Q, K, V)
2. **MARKDOWN**: Use bolding for key terms. Use tables for comparisons.
3. **COMPACTNESS**: Do NOT use excessive vertical whitespace. Use single newlines between paragraphs.

# CONTENT GUIDELINES
- Provide rigorous, technical answers.
- Avoid surface-level summaries; explain the *mechanism* and *implications*.
`,
            summary: `
You are "Synthesis". Create a **PhD-level Technical Summary**.

# FORMATTING RULES (CRITICAL)
1. **MATH**: LaTeX ONLY ($...$ or $$...$$). NEVER use text-based math.
2. **STRUCTURE**:
   - **Executive Verdict**: A single, powerful sentence assessing the novelty/impact.
   - **Core Innovation**: Explain the *mechanism* (with LaTeX formulas).
   - **Technical Specifications**: A markdown table of key metrics/architecture.
   - **Critical Takeaways**: 3-4 deep points on *why* this matters.
3. **COMPACTNESS**: Do NOT output multiple blank lines. Keep sections tight.
`,
            table: `
You are "Synthesis". Create a detailed **Technical Comparison Table**.

# FORMATTING RULES (STRICT)
1. **OUTPUT FORMAT**: You must generate a **MARKDOWN TABLE**.
2. **NO CODE BLOCKS**: Do NOT wrap the table in \`\`\`markdown ... \`\`\`. Return the raw table syntax directly.
3. **NO RAW LATEX**: Do NOT write a full LaTeX document (e.g., no \\documentclass, no \\begin{table}).
4. **MATH**: Use LaTeX ($...$) *only* for mathematical formulas inside the table cells.

# CONTENT
- Extract granular specs (e.g., param count, training tokens, FLOPS, accuracy).
- Conclude with a "Critical Analysis" paragraph comparing the items.
`,
            proscons: `
You are "Synthesis". Analyze **Technical Trade-offs**.

1. **Pros**: Capabilities, efficiency, architectural advantages.
2. **Cons**: Computational cost, limitations, edge cases.
3. **Trade-off Analysis**: When to use this vs. alternatives.
`,
            insights: `
You are "Synthesis", an elite Research Scientist.

# TASK
Write a **Critical Technical Analysis** on the provided content.

# FORMATTING RULES (STRICT)
1. **NO LISTS**: Do NOT use numbered lists (1., 2.) or bullet points. Write in **continuous prose (full paragraphs)**.
2. **MATH**: ALL formulas must be in LaTeX ($...$ or $$...$$).
3. **SECTIONS**: Use standard markdown headers (##).
   - ## Executive Thesis
   - ## Architectural Deconstruction
   - ## Theoretical Implications
   - ## Critical Limitations
4. **COMPACTNESS**: Do NOT use page breaks, form feeds, or excessive blank lines. Use single blank lines between paragraphs.

# CONTENT GUIDANCE
- Deconstruct the *mechanism* (Architecture).
- Explain the *why* (Theory).
- Discuss the *impact* (Implications).
- Be extremely technical and rigorous.
`
        };

        return depth === 'deep' ? DEEP_PROMPTS : STANDARD_PROMPTS;
    }

    /**
     * Build synthesis prompt from tabs and query
     */
    private static buildPrompt(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        depth: 'standard' | 'deep' = 'standard',
        contentLimit: number = 100000 // Ensure we use the higher limit consistently
    ): string {
        const formatSourceType = (tab: ExtractedContent): string => {
            if (tab.siteName === 'YouTube' || tab.title.includes('YouTube')) return 'YouTube';
            if (tab.content.includes('%PDF-') || tab.title.endsWith('.pdf')) return 'PDF';
            return 'Web';
        };

        // Distribute content limit among tabs to ensure no source is completely starved
        const perTabLimit = Math.floor(contentLimit / Math.max(tabs.length, 1));

        let content = tabs
            .map((tab, index) => {
                const type = formatSourceType(tab);
                logger.debug(`[GeminiService] Adding ${type} source to prompt: ${tab.title} (${tab.content.length} chars)`);
                // Sanitize content to avoid breaking XML (basic)
                const sanitizedContent = tab.content.replace(/]]>/g, ']]&gt;');

                // Truncate individual source if it exceeds fair share
                // (Optional: we could allow smaller sources to "donate" space, but simple fair share is safer for now)
                const truncatedContent = sanitizedContent.length > perTabLimit
                    ? sanitizedContent.slice(0, perTabLimit) + "\n...[truncated]..."
                    : sanitizedContent;

                return `<Source id="${index + 1}" type="${type}" title="${tab.title}">
<![CDATA[
${truncatedContent}
]]>
</Source>`;
            })
            .join('\n\n');

        logger.info(`[GeminiService] Built prompt with ${tabs.length} tabs. Total length: ${content.length}`);

        // Format Chat History
        const historyStr = chatHistory.length > 0
            ? chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
            : "No previous conversation.";

        const modePrompts = this.getPrompts(depth);
        const basePrompt = modePrompts[mode];

        return `
${basePrompt}

User Query: ${query || "Provide a comprehensive Deep Research Analysis."}

Previous Conversation History:
${historyStr}

Context:
${content}
`;
    }

    /**
     * Audio transcription
     */
    static async transcribeAudio(audioUrl: string): Promise<string> {
        const tier = await TierService.getCurrentTier();

        if (tier === 'byok') {
            const apiKey = await TierService.getStoredApiKey();
            if (!apiKey) throw new Error('API key required');
            const coreGemini = new CoreGemini(apiKey);
            return coreGemini.transcribeAudio(audioUrl);
        }

        const { data, error } = await supabase.functions.invoke('gemini-audio-stt', {
            body: { audioUrl }
        });

        if (error || !data?.transcription) {
            throw new Error('Transcription failed');
        }

        return data.transcription;
    }

    /**
     * Audio transcription from base64 data
     */
    static async transcribeAudioData(base64Data: string, mimeType: string = 'audio/webm'): Promise<string> {
        const tier = await TierService.getCurrentTier();

        if (tier === 'byok') {
            const apiKey = await TierService.getStoredApiKey();
            if (!apiKey) throw new Error('API key required');
            const coreGemini = new CoreGemini(apiKey);
            return coreGemini.transcribeAudioData(base64Data, mimeType);
        }

        const { data, error } = await supabase.functions.invoke('gemini-audio-stt', {
            body: { base64Data, mimeType }
        });

        if (error || !data?.transcription) {
            throw new Error('Transcription failed');
        }

        return data.transcription;
    }
}
