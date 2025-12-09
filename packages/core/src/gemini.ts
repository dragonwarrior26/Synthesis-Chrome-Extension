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
        imageData?: string
    ): Promise<string> {
        const prompt = this.buildPrompt(tabs, query, mode, [], imageData)
        const result = await this.model.generateContent(prompt)
        return result.response.text()
    }

    async synthesizeStream(
        tabs: ExtractedContent[],
        query?: string,
        mode: SynthesisMode = 'summary',
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string
    ): Promise<AsyncGenerator<string>> {
        const prompt = this.buildPrompt(tabs, query, mode, chatHistory, imageData)
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
        chatHistory: { role: 'user' | 'assistant', content: string }[] = [],
        imageData?: string
    ): any[] {
        const context = this.buildContext(tabs)

        // Format history
        const historyStr = chatHistory.length > 0
            ? chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')
            : "No previous conversation.";

        const modePrompts: Record<SynthesisMode, string> = {
            chat: `
You are "Synthesis", an expert Research Assistant with PhD-level knowledge.

Guidelines:
1. **Math**: ALWAYS use LaTeX format for mathematical formulas (e.g., $E=mc^2$ or $$ ... $$).
2. **Depth**: Provide rigorous, technical answers. Avoid surface-level summaries.
3. **Format**: Use Markdown. For comparisons, always use tables.
`,
            summary: `
You are "Synthesis". Create a **PhD-level Technical Summary**.

FORMAT RULES:
1. **Math**: ALWAYS use LaTeX format (e.g., $$ ... $$).
2. **Depth**: Focus on novel contributions, architectural details, and empirical results.
3. **Structure**:
    - **Verdict**: 1-sentence technical assessment.
    - **Key Specs/Data**: Markdown Table of architecture/hyperparameters.
    - **Technical Takeaways**: Bullet points focusing on *mechanisms* and *why* it works.
`,
            table: `
You are "Synthesis". Create a detailed **Technical Comparison Table**.

1. Extract granular specs (e.g., param count, training tokens, FLOPS, accuracy).
2. Use LaTeX for any metrics requiring it.
3. Conclude with a "Critical Analysis" selection.
`,
            proscons: `
You are "Synthesis". Analyze **Technical Trade-offs**.

1. **pros**: Focus on capabilities, efficiency, and architectural advantages.
2. **cons**: Focus on computational cost, limitations, and edge cases.
3. **Trade-off**: A precise statement on when to use this vs. alternatives.
`,
            insights: `
You are "Synthesis". Provide **Novel Research Insights**.

1. **Non-Obvious**: Do not state what the paper says directly. State the *implication*.
2. **Connections**: Relate findings to broader trends in the field.
3. **Math**: If an insight derives from a formula, show the formula in LaTeX.
4. **Structure**:
    ## Key Implications
    1. **[ Insight ]**: ...
    ## Critical Limitations
    > [ Warning ]
`
        };

        const basePrompt = modePrompts[mode];

        const textPart = `
${basePrompt}

User Query: ${query || "Provide a comprehensive technical analysis."}

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
