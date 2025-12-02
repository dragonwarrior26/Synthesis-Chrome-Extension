import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GeminiService, type ExtractedContent } from '@synthesis/core'

interface ChatInterfaceProps {
    apiKey: string
    contextTabs: ExtractedContent[]
}

interface Message {
    role: 'user' | 'model'
    content: string
}

export function ChatInterface({ apiKey, contextTabs }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: 'user', content: input }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const service = new GeminiService(apiKey)
            // For now, we just send the query with context. 
            // Ideally, we'd maintain a chat history in the prompt.
            const response = await service.synthesize(contextTabs, input)

            const modelMessage: Message = { role: 'model', content: response }
            setMessages((prev) => [...prev, modelMessage])
        } catch (error) {
            console.error('Chat error:', error)
            setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, I encountered an error.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full border rounded-lg bg-background">
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm mt-10">
                        Ask questions about your tabs...
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 text-sm animate-pulse">Thinking...</div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
                <input
                    className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
                    Send
                </Button>
            </form>
        </div>
    )
}
