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

    async synthesize(tabs: ExtractedContent[], query?: string, mode: SynthesisMode = 'summary'): Promise<string> {
        const prompt = this.buildPrompt(tabs, query, mode)
        const result = await this.model.generateContent(prompt)
        return result.response.text()
    }

    async synthesizeStream(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = []
    ): Promise<AsyncGenerator<string>> {
        const prompt = this.buildPrompt(tabs, query, mode, chatHistory)
        const result = await this.model.generateContentStream(prompt)

        async function* streamGenerator() {
            for await (const chunk of result.stream) {
                yield chunk.text()
            }
        }

        return streamGenerator()
    }

    // ... (synthesize method would need update too if used, but we stick to stream for now)

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

    private buildPrompt(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = []
    ): string {
        const context = this.buildContext(tabs)

        // Format history
        const historyStr = chatHistory.length > 0
            ? chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
            : "No previous conversation.";

        const modePrompts: Record<SynthesisMode, string> = {
            chat: `
You are "Synthesis", an expert Research Assistant. You are having a conversation with the user about the provided content.

User Query: ${query}

Previous Conversation History:
${historyStr}

Context:
${context}

Instructions:
1. Answer the user's question directly and concisely based on the context.
2. If the user refers to something said earlier (e.g. "what about that second option?"), look at the Conversation History.
3. If the context does not contain the answer, use your general knowledge to answer, but mention that you are doing so.
4. Be conversational and helpful. Do NOT act like a summarizer unless specifically asked to summarize.
5. Provide specific details, numbers, and facts from the text where relevant.

IMPORTANT:
- Use markdown for formatting (bold, lists).
- Do NOT use emojis.
`,
            summary: `
You are "Synthesis", an expert Research Agent. Analyze the provided content and create a well-structured summary.

${query ? `User Question: ${query}` : ''}

Context:
${context}

Instructions:
1. Create a structured summary with clear sections
2. Use markdown formatting with **bold** for emphasis
3. If the context does not fully answer the user's request, you MAY use your general knowledge to supplement it, but prefer the context.
4. Include these sections if relevant:
   - **Overview**: Brief introduction to the topic
   - **Key Features**: Main highlights and specifications
   - **Pricing**: Price ranges and value analysis
   - **Recommendation**: Your expert recommendation

IMPORTANT:
- Do NOT use any emojis
- Use proper paragraphs with line breaks
- Format prices with currency symbols
- Be concise but comprehensive
`,

            table: `
You are "Synthesis", an expert Research Agent. Create a detailed comparison table.

${query ? `User Question: ${query}` : ''}

Context:
${context}

Instructions:
1. Identify all items/products being compared
2. Create a markdown table with key comparison attributes
3. Include columns for: Name, Price, Key Specs, Rating (if available), Pros, Cons
4. Add a summary section below the table with your recommendation
5. If specific data points (like Price) are missing in the context, use your general knowledge to estimate or state "N/A".

Format:
| Product | Price | Key Feature | Rating |
|---------|-------|-------------|--------|
| ... | ... | ... | ... |

**Summary**: Your analysis of which option is best and why.

IMPORTANT: Do NOT use any emojis. Use **bold** for emphasis.
`,

            proscons: `
You are "Synthesis", an expert Research Agent. Analyze the pros and cons.

${query ? `User Question: ${query}` : ''}

Context:
${context}

Instructions:
1. For each item/topic, identify clear pros and cons
2. If the context is limited, use your general knowledge to identify standard pros/cons for this type of product/topic.
3. Structure your response like this:

## [Item/Topic Name]

**Pros:**
- First advantage
- Second advantage
- Third advantage

**Cons:**
- First disadvantage
- Second disadvantage
- Third disadvantage

4. End with a **Verdict** section summarizing the best choice

IMPORTANT: Do NOT use any emojis. Be objective and balanced.
`,

            insights: `
You are "Synthesis", an expert Research Agent. Provide deep insights and analysis.

${query ? `User Question: ${query}` : ''}

Context:
${context}

Instructions:
1. Go beyond surface-level information. Use your broad knowledge base to provide context not found in the text.
2. Structure your response with:

## Key Insights
- Insight 1: [Detailed explanation]
- Insight 2: [Detailed explanation]
- Insight 3: [Detailed explanation]

## Market Analysis
Brief overview of how this compares to alternatives/competitors (Use general knowledge if needed).

## Recommendations
**Best for beginners**: [Option and why]
**Best value**: [Option and why]
**Premium choice**: [Option and why]

## Things to Consider
Important factors the user should think about before deciding

IMPORTANT: Do NOT use any emojis. Use **bold** for key terms. Be analytical and thorough.
`
        }

        return modePrompts[mode]
    }
}
