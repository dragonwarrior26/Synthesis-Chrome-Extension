import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { ExtractedContent } from './extractor'

export type SynthesisMode = 'chat' | 'summary' | 'table' | 'proscons' | 'insights'

export interface SynthesisResult {
    markdown: string
    tables: any[]
}

export class GeminiService {
    private model: GenerativeModel

    constructor(apiKey: string) {
        const genAI = new GoogleGenerativeAI(apiKey)
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    }

    async synthesize(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard'
    ): Promise<string> {
        const prompt = this.buildPrompt(tabs, query, mode, [], imageData, depth)
        const result = await this.model.generateContent(prompt)
        return result.response.text()
    }

    async synthesizeStream(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard'
    ): Promise<AsyncGenerator<string>> {
        const prompt = this.buildPrompt(tabs, query, mode, chatHistory, imageData, depth)
        const result = await this.model.generateContentStream(prompt)

        async function* streamGenerator() {
            for await (const chunk of result.stream) {
                yield chunk.text()
            }
        }

        return streamGenerator()
    }

    async synthesizeJSON(tabs: ExtractedContent[], query?: string): Promise<any> {
        const prompt = this.buildJsonPrompt(tabs, query)
        const result = await this.model.generateContent(prompt)
        const text = result.response.text()
        try {
            const jsonStr = text.replace(/```json\n|\n```/g, '').trim()
            return JSON.parse(jsonStr)
        } catch (e) {
            console.error('Failed to parse JSON', e)
            return null
        }
    }

    /**
     * Transcribe audio from a URL using Gemini's multimodal capabilities.
     * Used for YouTube videos without captions (Pro tier feature).
     * 
     * @param audioUrl - Direct URL to audio file
     * @returns Transcribed text
     */
    async transcribeAudio(audioUrl: string): Promise<string> {
        try {
            // Fetch audio data
            const audioResponse = await fetch(audioUrl)
            if (!audioResponse.ok) {
                throw new Error(`Failed to fetch audio: ${audioResponse.status}`)
            }

            const audioBuffer = await audioResponse.arrayBuffer()
            const base64Audio = this.arrayBufferToBase64(audioBuffer)

            // Determine MIME type from URL or default to mp4
            const mimeType = audioUrl.includes('.mp3') ? 'audio/mp3' :
                audioUrl.includes('.webm') ? 'audio/webm' : 'audio/mp4'

            // Send to Gemini for transcription
            const result = await this.model.generateContent([
                {
                    inlineData: {
                        mimeType,
                        data: base64Audio
                    }
                },
                { text: 'Transcribe this audio accurately. Return only the transcript text, no timestamps or speaker labels.' }
            ])

            return result.response.text()
        } catch (error) {
            console.error('Audio transcription failed:', error)
            throw error
        }
    }

    /**
     * Convert ArrayBuffer to base64 string
     */
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }

    private buildJsonPrompt(tabs: ExtractedContent[], query?: string): string {
        const context = this.buildContext(tabs)

        return `
You are "Synthesis", an expert Research Agent.
Your goal is to synthesize the information from the provided tabs into a structured JSON format for a comparison table.

User Query: ${query || "Compare these items."}

Context:
${context}

Instructions:
1. Identify the common topic.
2. Extract key attributes for comparison (e.g., Price, Rating, Specs).
3. Return a JSON object with the following structure:
{
  "topic": "Topic Name",
  "columns": [{"accessorKey": "key", "header": "Label"}],
  "data": [{"key": "value", "productName": "Name"}]
}
4. Ensure "productName" (or similar identifier) is the first column.
5. Return ONLY valid JSON.
`
    }

    private buildContext(tabs: ExtractedContent[]): string {
        return tabs.map((tab, index) => `
---
Source ${index + 1}: ${tab.title}
Site: ${tab.siteName || 'Unknown'}
Content:
${tab.textContent.slice(0, 10000)}
---
`).join('\n')
    }

    private getPrompts(depth: 'standard' | 'deep'): Record<SynthesisMode, string> {
        const STANDARD_PROMPTS: Record<SynthesisMode, string> = {
            chat: `
You are "Synthesis", a helpful Research Assistant.

# GUIDELINES
- Answer clearly and concisely.
- Use Markdown (bold, lists) for readability.
- If the user asks for math, use LaTeX ($...$), but simple text explanations are also fine.
`,
            summary: `
You are "Synthesis". Create a **Concise Research Summary**.

# FORMAT
1. **Summary**: A clear, paragraph-form summary of the main points.
2. **Key Takeaways**: A bulleted list of the most important facts.
`,
            table: `
You are "Synthesis". Create a **Comparison Table**.

1. Create a Markdown table comparing the items in the text.
2. Columns should be: Feature, Details, Notes.
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

    private buildPrompt(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string,
        depth: 'standard' | 'deep' = 'standard'
    ): any[] {
        const context = this.buildContext(tabs)

        // Format history
        const historyStr = chatHistory.length > 0
            ? chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
            : "No previous conversation.";

        const modePrompts = this.getPrompts(depth);
        const basePrompt = modePrompts[mode];


        const textPart = `
${basePrompt}

User Query: ${query || "Provide a comprehensive Deep Research Analysis."}

Previous Conversation History:
${historyStr}

Context:
${context}
`;

        const parts: any[] = [{ text: textPart }];

        if (imageData) {
            parts.push({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: imageData
                }
            });
        }

        return parts;
    }

}
