
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from '@/components/ui/button'
import { useTabManager } from '@/hooks/useTabManager'
import { useSynthesis } from '@/hooks/useSynthesis'
import './index.css'

function SidePanel() {
    const { activeTabs, extractedData, isExtracting, extractAll } = useTabManager()
    const { apiKey, saveApiKey, isSynthesizing, result, error, synthesizeTabs } = useSynthesis()

    const handleSynthesize = () => {
        const tabsToSynthesize = activeTabs
            .map(tab => extractedData[tab.id])
            .filter(Boolean)

        if (tabsToSynthesize.length === 0) {
            return
        }

        synthesizeTabs(tabsToSynthesize)
    }

    const extractedCount = Object.keys(extractedData).length

    return (
        <div className="p-4 space-y-4 h-screen flex flex-col">
            <header className="flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-bold">Synthesis</h1>
                <span className="text-xs text-muted-foreground">{activeTabs.length} tabs</span>
            </header>

            {!apiKey && (
                <div className="p-3 bg-muted rounded-lg space-y-2 shrink-0">
                    <label className="text-xs font-medium">Gemini API Key</label>
                    <input
                        type="password"
                        className="w-full p-2 text-sm rounded border bg-background"
                        placeholder="Enter API Key"
                        onChange={(e) => saveApiKey(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground">Stored locally in your browser.</p>
                </div>
            )}

            <div className="space-y-2 shrink-0">
                <Button
                    onClick={extractAll}
                    disabled={isExtracting}
                    variant="outline"
                    className="w-full"
                >
                    {isExtracting ? 'Extracting...' : '1. Extract Content'}
                </Button>

                <Button
                    onClick={handleSynthesize}
                    disabled={isSynthesizing || extractedCount === 0 || !apiKey}
                    className="w-full"
                >
                    {isSynthesizing ? 'Synthesizing...' : '2. Synthesize'}
                </Button>
            </div>

            {error && (
                <div className="p-2 text-xs text-red-500 bg-red-50 rounded shrink-0">
                    {error}
                </div>
            )}

            {result ? (
                <div className="flex-1 overflow-auto p-3 border rounded-lg bg-muted/30 prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
                </div>
            ) : (
                <div className="flex-1 overflow-auto space-y-2 min-h-0">
                    {activeTabs.map((tab) => (
                        <div key={tab.id} className="p-3 border rounded-lg bg-card text-card-foreground shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                {tab.favIconUrl && <img src={tab.favIconUrl} alt="" className="w-4 h-4" />}
                                <h3 className="font-medium text-sm truncate">{tab.title}</h3>
                            </div>
                            {extractedData[tab.id] ? (
                                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span>✓ Extracted</span>
                                    <span className="text-muted-foreground">({extractedData[tab.id].length} chars)</span>
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground">Ready to extract</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SidePanel />
    </React.StrictMode>,
)
