import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { useTabManager } from "@/hooks/useTabManager";
import { useSynthesis } from "@/hooks/useSynthesis";
import {
  Settings,
  FileText,
  CheckCircle2,
  Search,
  List,
  LayoutGrid,
  Menu,
} from "lucide-react";
import "./index.css";

function SidePanel() {
  const { activeTabs, extractedData, isExtracting, extractAll } =
    useTabManager();
  const { apiKey, saveApiKey, result, synthesizeTabs, synthesizeTable } =
    useSynthesis();
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [result]);

  const handleSynthesize = (mode: "summary" | "table") => {
    const tabsToSynthesize = activeTabs
      .map((tab) => extractedData[tab.id])
      .filter(Boolean);

    if (tabsToSynthesize.length === 0) return;

    if (mode === "summary") {
      synthesizeTabs(tabsToSynthesize);
    } else {
      synthesizeTable(tabsToSynthesize);
    }
  };

  const extractedCount = Object.keys(extractedData).length;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Top Navigation Bar (Mocked to match screenshot) */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300"></div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="h-8 bg-slate-50 rounded-full w-full max-w-[200px]"></div>
        <div className="flex gap-3 text-muted-foreground">
          <LayoutGrid className="w-5 h-5" />
          <Menu className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Mocked thin strip) */}
        <div className="w-12 border-r flex flex-col items-center py-4 gap-6 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>

        {/* Right Panel - The Actual Extension UI */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold text-slate-900">
              Research Assistant
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? (
                <Settings className="w-5 h-5 text-slate-400" />
              ) : (
                <List className="w-5 h-5 text-slate-400" />
              )}
            </Button>
          </header>

          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Settings (Conditional) */}
            {showSettings && (
              <div className="p-4 bg-slate-50 rounded-lg border space-y-3 mb-4">
                <label className="text-sm font-medium">Gemini API Key</label>
                <input
                  type="password"
                  defaultValue={apiKey || ""}
                  className="w-full p-2 text-sm rounded border focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Enter API Key"
                  onChange={(e) => saveApiKey(e.target.value)}
                />
              </div>
            )}

            {/* Primary Actions */}
            <div className="space-y-3">
              <Button
                onClick={extractAll}
                disabled={isExtracting}
                className="w-full bg-primary hover:bg-primary/90 text-white h-10 text-base font-medium shadow-sm"
              >
                {isExtracting ? "Extracting..." : "1. Extract Content"}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSynthesize("summary")}
                  disabled={extractedCount === 0}
                  className="h-10 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-normal"
                >
                  2. Summarize
                </Button>
                <Button
                  variant="outline"
                  disabled={true} // Placeholder for "Ask" flow
                  className="h-10 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-normal"
                >
                  3. Ask
                </Button>
              </div>
            </div>

            {/* Extracted Links List */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900">
                Links Extracted
              </h3>
              <div className="space-y-4">
                {activeTabs.map((tab) => (
                  <div key={tab.id} className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-slate-900 truncate">
                          {tab.title}
                        </span>
                      </div>

                      {extractedData[tab.id] ? (
                        <div className="flex items-center gap-1.5 mt-0.5 text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-green-600 text-white" />
                          <span className="text-xs font-medium">Extracted</span>
                        </div>
                      ) : tab.status === "extracting" ? (
                        <div className="text-xs text-primary mt-0.5">
                          Extracting...
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 mt-0.5">
                          Ready to extract
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            {result && (
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-medium text-slate-900">Summary</h3>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {result}
                </div>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Chat Input */}
          <div className="p-4 border-t bg-white">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about the documents..."
                className="w-full pl-4 pr-20 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 shadow-sm placeholder:text-slate-400"
              />
              <div className="absolute right-1.5 top-1.5">
                <Button
                  size="sm"
                  className="h-8 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;

if (typeof document !== "undefined" && document.getElementById("root")) {
  ReactDOM.createRoot(document.getElementById("root")!).render(<SidePanel />);
}
