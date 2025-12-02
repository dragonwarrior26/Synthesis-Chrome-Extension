import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { ExtractedContent } from './extractor'

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

    async synthesize(tabs: ExtractedContent[], query?: string): Promise<string> {
        const prompt = this.buildPrompt(tabs, query)
        const result = await this.model.generateContent(prompt)
        return result.response.text()
    }

    async synthesizeStream(tabs: ExtractedContent[], query?: string): Promise<AsyncGenerator<string>> {
        const prompt = this.buildPrompt(tabs, query)
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
            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json\n|\n```/g, '').trim()
            return JSON.parse(jsonStr)
        } catch (e) {
            console.error('Failed to parse JSON', e)
            return null
        }
    }

    private buildJsonPrompt(tabs: ExtractedContent[], query?: string): string {
        const context = tabs.map((tab, index) => `
---
Tab ${index + 1}: ${tab.title}
URL: ${tab.siteName || 'Unknown'}
Content:
${tab.textContent.slice(0, 10000)}
---
`).join('\n')

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

    private buildPrompt(tabs: ExtractedContent[], query?: string): string {
        const context = tabs.map((tab, index) => `
---
Tab ${index + 1}: ${tab.title}
URL: ${tab.siteName || 'Unknown'}
Content:
${tab.textContent.slice(0, 10000)} // Truncate to avoid massive context usage if not needed, though Gemini 2.0 has 1M context
---
`).join('\n')

        return `
You are "Synthesis", an expert Research Agent.
Your goal is to synthesize the information from the provided tabs into a cohesive, structured response.

User Query: ${query || "Compare and summarize these tabs."}

Context:
${context}

Instructions:
1. Identify the common topic across these tabs.
2. If they are products, create a Comparison Table (Markdown) with key specs (Price, Rating, Features).
3. If they are articles, summarize the key points and find consensus/disagreement.
4. Be concise but comprehensive.
5. Use Markdown formatting.
`
    }
}
