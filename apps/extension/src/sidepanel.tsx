
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from '@/components/ui/button'
import { useTabManager } from '@/hooks/useTabManager'
import { useSynthesis } from '@/hooks/useSynthesis'
import { ComparisonTable } from '@/components/ComparisonTable'
import { ChatInterface } from '@/components/ChatInterface'
import './index.css'

function SidePanel() {
    const { activeTabs, extractedData, isExtracting, extractAll } = useTabManager()
    const { apiKey, saveApiKey, isSynthesizing, result, tableData, error, synthesizeTabs, synthesizeTable } = useSynthesis()
    const [viewMode, setViewMode] = useState<'summary' | 'table' | 'chat'>('summary')

    const handleSynthesize = (mode: 'summary' | 'table') => {
        const tabsToSynthesize = activeTabs
            .map(tab => extractedData[tab.id])
            .filter(Boolean)

        if (tabsToSynthesize.length === 0) return

        setViewMode(mode)
        if (mode === 'summary') {
            synthesizeTabs(tabsToSynthesize)
        } else {
            synthesizeTable(tabsToSynthesize)
        }
    }

    const extractedCount = Object.keys(extractedData).length
    const contextTabs = activeTabs.map(tab => extractedData[tab.id]).filter(Boolean) as any[]

    return (
        <div className="p-4 space-y-4 h-screen flex flex-col bg-background text-foreground">
            <header className="flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-bold tracking-tight">Synthesis</h1>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{activeTabs.length} tabs</span>
            </header>

            {!apiKey && (
                <div className="p-3 bg-muted/50 border rounded-lg space-y-2 shrink-0 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-medium">Gemini API Key</label>
                    <input
                        type="password"
                        className="w-full p-2 text-sm rounded border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                    className="w-full justify-between group"
                >
                    <span>1. Extract Content</span>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {isExtracting ? 'Extracting...' : `${extractedCount} ready`}
                    </span>
                </Button>

                <div className="grid grid-cols-3 gap-2">
                    <Button
                        onClick={() => handleSynthesize('summary')}
                        disabled={isSynthesizing || extractedCount === 0 || !apiKey}
                        className="w-full px-2"
                        variant={viewMode === 'summary' ? 'default' : 'secondary'}
                        size="sm"
                    >
                        Summary
                    </Button>
                    <Button
                        onClick={() => handleSynthesize('table')}
                        disabled={isSynthesizing || extractedCount === 0 || !apiKey}
                        className="w-full px-2"
                        variant={viewMode === 'table' ? 'default' : 'secondary'}
                        size="sm"
                    >
                        Compare
                    </Button>
                    <Button
                        onClick={() => setViewMode('chat')}
                        disabled={extractedCount === 0 || !apiKey}
                        className="w-full px-2"
                        variant={viewMode === 'chat' ? 'default' : 'secondary'}
                        size="sm"
                    >
                        Chat
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-3 text-xs text-red-500 bg-red-50/50 border border-red-100 rounded-lg shrink-0">
                    {error}
                </div>
            )}

            <div className="flex-1 overflow-auto min-h-0 rounded-lg border bg-card shadow-sm">
                {viewMode === 'chat' ? (
                    <ChatInterface apiKey={apiKey} contextTabs={contextTabs} />
                ) : viewMode === 'table' && tableData ? (
                    <ComparisonTable data={tableData.data} columns={tableData.columns} className="border-0" />
                ) : viewMode === 'summary' && result ? (
                    <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
                    </div>
                ) : (
                    <div className="p-2 space-y-2">
                        {activeTabs.map((tab) => (
                            <div key={tab.id} className="p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    {tab.favIconUrl ? (
                                        <img src={tab.favIconUrl} alt="" className="w-4 h-4 rounded-sm" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-sm bg-muted" />
                                    )}
                                    <h3 className="font-medium text-sm truncate flex-1">{tab.title}</h3>
                                </div>
                                {extractedData[tab.id] ? (
                                    <div className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span>Extracted</span>
                                        <span className="text-muted-foreground ml-auto font-mono text-[10px]">
                                            {(extractedData[tab.id].length / 1024).toFixed(1)}kb
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                        <span>Ready</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SidePanel />
    </React.StrictMode>,
)

