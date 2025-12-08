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
You are "Synthesis", an expert Research Assistant. You are having a conversation with the user about the provided content.

Guidelines:
1. Answer strictly based on the provided context (text or image).
2. If the user asks for a comparison, ALWAYS use a Markdown Table.
3. Be concise and professional.
`,
            summary: `
You are "Synthesis". Create a **VISUAL** executive summary of the content.

FORMAT RULES:
1. Start with a 1-sentence **High Level Verdict**.
2. **Key Specs/Features**: You MUST use a **Markdown Table** to display specifications or key features.
3. **Key Takeaways**: Use a bulleted list with bold headers.
4. Do NOT write long paragraphs. Block of text = BAD. Lists & Tables = GOOD.

Structure:
## Verdict
[1 sentence verdict]

## Key Data
| Feature | Details |
|---------|---------|
| [Row]   | [Val]   |
...

## Key Takeaways
*   **Point 1**: Detail...
*   **Point 2**: Detail...
`,
            table: `
You are "Synthesis". Your ONLY job is to create a detailed **Markdown Comparison Table**.

Instructions:
1. Identify the products/topics being compared.
2. Extract comparable attributes (Price, Specs, Pros, Cons, Rating).
3. Create a comprehensive Markdown table.
4. Follow the table with a "Winner" section explaining the best choice.

Output format:
## Detailed Comparison
[Markdown Table Here]

## Recommendation
**Winner**: [Product] because [reason].
`,
            proscons: `
You are "Synthesis". Analyze the Pros and Cons.

FORMAT RULES:
1. Use a clear "Pros" and "Cons" section.
2. Use bullet points only.

Structure:
## Pros
*   [Pro 1]
*   [Pro 2]

## Cons
*   [Con 1]
*   [Con 2]

## Trade-off Analysis
(One sentence summary of the trade-offs)
`,
            insights: `
You are "Synthesis". Dig deep and find non-obvious insights.

FORMAT RULES:
1. Do not summarize the obvious. Find the *implications*.
2. Use **Bold Headers** for each insight.
3. Use > Blockquotes for critical warnings or unique facts.

Structure:
## Deep Insights
1. **[Insight Title]**: [Explanation]
2. **[Insight Title]**: [Explanation]

## Critical Warnings
> [Warning or Limitation found in the text]
`
        };

        const basePrompt = modePrompts[mode];

        const textPart = `
${basePrompt}

User Query: ${query || "Summarize this content."}

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
