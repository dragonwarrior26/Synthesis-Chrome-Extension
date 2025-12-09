import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { LoadingDots } from "@/components/LoadingDots";
import { useTabManager } from "@/hooks/useTabManager";
import { useSynthesis, type SynthesisMode } from "@/hooks/useSynthesis";
import { type ExtractedContent } from "@synthesis/core";
import {
  Settings,
  FileText,
  CheckCircle2,
  Loader2,
  Table,
  Lightbulb,
  BarChart3,
  FileBarChart,
  Search,
  Mic,
  Send,
  Sparkles,
  RotateCcw,
  Download,
  Copy,
  Eye,
  EyeOff,
  Camera
} from "lucide-react";
import { ExportService } from "@/services/ExportService";
import "./index.css";

function SidePanel() {
  const { activeTabs, extractedData, isExtracting, extractAll, clearData } = useTabManager();
  const { apiKey, saveApiKey, performSynthesis, isSynthesizing } = useSynthesis();

  const [showSettings, setShowSettings] = useState(!apiKey);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string; isError?: boolean; image?: string }[]
  >([]);
  const [activeSourceTab, setActiveSourceTab] = useState<"search" | "sources">("sources");

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isSynthesizing]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isSynthesizing]);

  const handleReset = () => {
    if (confirm("Are you sure you want to clear your session? This will remove all synced content and chat history.")) {
      clearData();
      setChatMessages([]);
      setChatInput("");
    }
  };

  const handleExportPDF = async () => {
    if (chatMessages.length === 0) return;
    const currentTab = activeTabs[0] || { title: "Research", url: "https://synthesis.ai" };

    // Simple toast or feedback could be added here
    ExportService.printReport(
      chatMessages.filter(m => !m.isError && m.content) as any,
      currentTab.title,
      currentTab.url
    );
  };

  const handleExportMarkdown = () => {
    if (chatMessages.length === 0) return;
    const currentTab = activeTabs[0] || { title: "Research", url: "https://synthesis.ai" };

    const md = ExportService.generateMarkdown(
      chatMessages.filter(m => !m.isError && m.content) as any,
      currentTab.title,
      currentTab.url
    );

    navigator.clipboard.writeText(md).then(() => {
      // We could add a toast state here if we had a toast component
      alert("Research copied to clipboard as Markdown!");
    });
  };

  const getExtractedTabs = (): ExtractedContent[] => {
    return activeTabs
      .map((tab) => extractedData[tab.id])
      .filter(Boolean) as ExtractedContent[];
  };

  // Vision State
  const [isVisionEnabled, setIsVisionEnabled] = useState(false);

  const captureScreenshot = async (): Promise<string | undefined> => {
    try {
      // Need to capture from the current window
      // @ts-ignore - Chrome types might be fussy
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (!tab.windowId) return undefined;

      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg", quality: 60 });
      // Remove data:image/jpeg;base64, prefix
      return dataUrl.split(",")[1];
    } catch (e) {
      console.error("Screenshot failed", e);
      return undefined;
    }
  };

  const handleAction = async (input: string, mode?: SynthesisMode) => {
    if (!apiKey || isSynthesizing) return;

    const tabsToQuery = getExtractedTabs();
    if (tabsToQuery.length === 0) {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "Please **Sync Content** first before asking questions."
      }]);
      return;
    }

    // Capture Image if in Vision Mode
    let imageData: string | undefined;
    if (isVisionEnabled) {
      imageData = await captureScreenshot();
      if (!imageData) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "**Error**: Failed to capture visible tab. Ensure you are on a webpage." }]);
        return;
      }
    }

    // Add user message
    const visionBadge = isVisionEnabled ? " 👁️ [Vision On]" : "";
    setChatMessages((prev) => [...prev, { role: "user", content: input + visionBadge }]);
    setChatInput("");

    // Add placeholder assistant message
    setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      // Stream content into the last message
      await performSynthesis(
        tabsToQuery,
        mode || 'chat', // Default to 'chat' mode for user input
        mode ? undefined : input, // If mode is generic chat, pass input as query
        (chunk) => {
          setChatMessages((prev) => {
            const newHistory = [...prev];
            const lastMsg = newHistory[newHistory.length - 1];
            if (lastMsg.role === "assistant") {
              lastMsg.content += chunk;
            }
            return newHistory;
          });
        },
        chatMessages // Pass full history
          .filter(m => !m.isError && m.content) // Filter out errors and empty msgs
          .map(m => ({ role: m.role, content: m.content })),
        imageData // Pass image data if available
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setChatMessages((prev) => {
        const newHistory = [...prev];
        const lastMsg = newHistory[newHistory.length - 1];
        lastMsg.content = `**Error**: ${errorMessage}\n\n*Check console for details.*`;
        lastMsg.isError = true;
        return newHistory;
      });
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    handleAction(chatInput.trim());
  };

  const handleSynthesisChip = (mode: SynthesisMode) => {
    const promptMap: Record<SynthesisMode, string> = {
      summary: "Create a visual summary of this content.",
      table: "Create a detailed comparison chart.",
      proscons: "Analyze pros and cons with bullet points.",
      insights: "Provide deeper insights and specific key findings.",
      chat: "Let's discuss this."
    };
    // Display the specific label as the user message
    handleAction(promptMap[mode], mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const extractedCount = Object.keys(extractedData).length;


  const handleRetry = () => {
    // Find the last user message to retry
    const lastUserMsg = [...chatMessages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      // Remove the error message
      setChatMessages(prev => prev.filter(m => !m.isError));
      handleAction(lastUserMsg.content);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 font-sans text-slate-50 selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-900 sticky top-0 z-20">
        <h1 className="text-base font-semibold tracking-tight text-slate-50 flex items-center gap-2">
          AI Research Assistant
        </h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisionEnabled(!isVisionEnabled)}
            className={`h-8 w-8 rounded-lg transition-colors ${isVisionEnabled
              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            title={isVisionEnabled ? "Disable Vision (Screen Analysis)" : "Enable Vision (Screen Analysis)"}
          >
            {isVisionEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              if (isSynthesizing) return;

              // 1. Get Active Tab
              const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
              if (!tab?.id) return;

              // 2. Trigger Crop Mode
              try {
                // We use chrome.tabs.sendMessage to active tab
                const response = await chrome.tabs.sendMessage(tab.id, { type: 'START_CROP' });

                if (response && response.type === 'CROP_RESULT' && response.payload) {
                  const rect = response.payload;
                  // 3. User selected a region. Now capture valid full screenshot.
                  const fullScreenshotBase64 = await captureScreenshot();
                  if (!fullScreenshotBase64) return;

                  // 4. Crop it using Canvas
                  const img = new Image();
                  img.src = "data:image/jpeg;base64," + fullScreenshotBase64;
                  await new Promise((resolve) => { img.onload = resolve; });

                  const canvas = document.createElement('canvas');
                  const pixelRatio = rect.pixelRatio || 1;
                  // Set canvas to the actual pixel size of the crop
                  canvas.width = rect.width * pixelRatio;
                  canvas.height = rect.height * pixelRatio;

                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  // Draw specific region
                  // Source: x, y in physical pixels (captured image is physical size)
                  // But rect.x, rect.y are CSS pixels from getBoundingClientRect
                  // So we multiply by pixelRatio to map to the screenshots coordinate space.
                  ctx.drawImage(
                    img,
                    rect.x * pixelRatio,
                    rect.y * pixelRatio,
                    rect.width * pixelRatio,
                    rect.height * pixelRatio,
                    0, 0,
                    canvas.width,
                    canvas.height
                  );

                  const croppedBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
                  const fullDataUrl = "data:image/jpeg;base64," + croppedBase64;

                  // 5. Send to Gemini
                  // Add user message with a thumbnail
                  setChatMessages(prev => [...prev, {
                    role: "user",
                    content: "📸 Analyzed Snapshot",
                    image: fullDataUrl
                  }]);

                  // Placeholder
                  setChatMessages(prev => [...prev, { role: "assistant", content: "" }]);

                  // Perform Synthesis
                  await performSynthesis(
                    getExtractedTabs(),
                    'chat',
                    "Analyze this specific area of the screen. Explain what you see in detail.", // Contextual prompt
                    (chunk) => {
                      setChatMessages((prev) => {
                        const newHistory = [...prev];
                        const lastMsg = newHistory[newHistory.length - 1];
                        if (lastMsg.role === "assistant") {
                          lastMsg.content += chunk;
                        }
                        return newHistory;
                      });
                    },
                    chatMessages.filter(m => !m.isError && m.content).map(m => ({ role: m.role, content: m.content })),
                    croppedBase64
                  );
                }
              } catch (e) {
                console.error("Snapshot failed: ", e);
                // Could be that content script isn't loaded on this tab (e.g. chrome://)
                setChatMessages(prev => [...prev, { role: "assistant", content: "**Error**: Cannot capture snapshot on this page (Restricted URL or Content Script missing)." }]);
              }
            }}
            className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Take Snapshot (Crop Area)"
          >
            <Camera className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-800 mx-1" />
          {chatMessages.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportMarkdown}
                className="h-8 w-8 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Copy as Markdown"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportPDF}
                className="h-8 w-8 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Download PDF Report"
              >
                <Download className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-slate-800 mx-1" />
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Clear Session"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-1 overflow-auto p-5 space-y-8 scroll-smooth pb-32"
        ref={scrollContainerRef}
      >
        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs uppercase tracking-wider font-bold text-slate-500">API Key</label>
            <input
              type="password"
              defaultValue={apiKey || ""}
              className="w-full p-2.5 text-sm rounded-lg border border-slate-800 bg-slate-950 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-200 placeholder:text-slate-600"
              placeholder="Enter your API Key..."
              onChange={(e) => saveApiKey(e.target.value)}
            />
            <div className="pt-2 text-[10px] text-slate-500 flex justify-end">
              <a
                href="https://gist.githack.com/dragonwarrior26/63cdc706f9630b2e18f230828836f1ec/raw/75c9b3d9d6aecf70f4fdf428cfbdf065795ab32f/privacy.html"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 underline transition-colors"
                title="View Privacy Policy"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        )}

        {/* Section 1: Sources & Extraction */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-400">Sources & Extraction</h2>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-800 mb-3 px-2">
              <button
                onClick={() => setActiveSourceTab('search')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeSourceTab === 'search' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
              >
                Google Search
              </button>
              <button
                onClick={() => setActiveSourceTab('sources')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeSourceTab === 'sources' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
              >
                Sources
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-3 pb-3">
              {activeSourceTab === 'search' ? (
                <div className="py-8 text-center text-slate-500 text-sm italic">
                  Google Search Integration coming soon...
                </div>
              ) : (
                <>
                  {extractedCount === 0 && !isExtracting ? (
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Search className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-400">No content synced yet.</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                      {activeTabs.map(tab => (
                        <div key={tab.id} className="flex items-center gap-3">
                          {tab.favIconUrl ? (
                            <img
                              src={tab.favIconUrl}
                              className="rounded-sm opacity-80"
                              style={{ width: '16px', height: '16px', minWidth: '16px' }}
                            />
                          ) : <FileText className="w-4 h-4 text-slate-600" />}
                          <span className="text-sm text-slate-300 truncate flex-1">{tab.title}</span>
                          {extractedData[tab.id] && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={extractAll}
                    disabled={isExtracting}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 rounded-lg shadow-lg shadow-blue-900/20 transition-all"
                  >
                    {isExtracting ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Syncing...</span>
                    ) : "Sync Content"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Analytics & Insights */}
        {extractedCount > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-sm font-medium text-slate-400">Analytics & Insights</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Summary Card */}
              <button
                onClick={() => handleSynthesisChip('summary')}
                className="flex flex-col items-start p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left group"
              >
                <div className="p-2 mb-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <FileBarChart className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Summary</span>
                <span className="text-xs text-slate-500 mt-1">(Visualized)</span>
              </button>

              {/* Comparison Card */}
              <button
                onClick={() => handleSynthesisChip('table')}
                className="flex flex-col items-start p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left group"
              >
                <div className="p-2 mb-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Comparison</span>
                <span className="text-xs text-slate-500 mt-1">(Charts)</span>
              </button>

              {/* Pros/Cons Card */}
              <button
                onClick={() => handleSynthesisChip('proscons')}
                className="flex flex-col items-start p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left group"
              >
                <div className="p-2 mb-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Table className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Pros/Cons</span>
                <span className="text-xs text-slate-500 mt-1">(Bullet Points)</span>
              </button>

              {/* Insights Card */}
              <button
                onClick={() => handleSynthesisChip('insights')}
                className="flex flex-col items-start p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left group"
              >
                <div className="p-2 mb-3 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">Deeper Insights</span>
                <span className="text-xs text-slate-500 mt-1">(Key Findings)</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat Stream */}
        <div className="space-y-6 pb-20">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {msg.role === "user" ? (
                <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm max-w-[90%]">
                  {msg.content}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Snapshot"
                      className="mt-2 rounded-lg border border-white/20 max-w-full h-auto max-h-[200px] object-cover hover:scale-105 transition-transform"
                    />
                  )}
                </div>
              ) : (
                <div className={`text-sm leading-relaxed max-w-full w-full ${msg.isError ? "bg-red-900/20 border-l-4 border-red-500 p-4 text-red-200" : "bg-slate-900/50 p-0 text-slate-300"}`}>
                  {!msg.content && i === chatMessages.length - 1 && isSynthesizing ? (
                    <LoadingDots text="Analyzing..." />
                  ) : (
                    <MarkdownRenderer
                      content={msg.content}
                      isStreaming={i === chatMessages.length - 1 && isSynthesizing}
                      className="text-slate-300"
                    />
                  )}
                </div>
              )}

              {/* Retry Button */}
              {msg.isError && i === chatMessages.length - 1 && (
                <button
                  onClick={handleRetry}
                  className="mt-2 text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3 h-3" /> Retry
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Deep Dive Input */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 transition-all hover:bg-slate-900 ring-1 ring-white/5">
          <div className="px-3 pt-2 text-[10px] uppercase font-bold text-slate-500 flex items-center gap-2">
            <Search className="w-3 h-3" /> Deep Dive Analyst
          </div>
          <div className="flex items-center gap-2 px-1 pb-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask deeper questions, analyze across sources..."
              className="flex-1 bg-transparent border-0 text-slate-200 placeholder:text-slate-600 focus:ring-0 text-sm h-10 px-2 font-medium"
              disabled={!apiKey || extractedCount === 0 || isSynthesizing}
            />
            {extractedCount === 0 ? (
              <div className="px-2 text-slate-600">
                <Mic className="w-5 h-5 opacity-50" />
              </div>
            ) : (
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || !apiKey || isSynthesizing}
                size="icon"
                className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-900/20"
              >
                {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            )}
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
