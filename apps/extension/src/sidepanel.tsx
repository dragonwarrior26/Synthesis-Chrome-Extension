import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { LoadingDots } from "@/components/LoadingDots";
import { FeatureGate } from "@/components/FeatureGate";
import { Features } from "@/config/features";
import { useTabManager } from "@/hooks/useTabManager";
import { useSynthesis, type SynthesisMode } from "@/hooks/useSynthesis";
import { type ExtractedContent, YouTubeExtractor, type YouTubeVideoInfo, GoogleSearchExtractor } from "@synthesis/core";
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
  Youtube,
  Plus,
  X
} from "lucide-react";
import { ExportService } from "@/services/ExportService";
import "./index.css";

import { Switch } from "@/components/ui/switch";

function SidePanel() {
  const { activeTabs, extractedData, isExtracting, extractAll, clearData } = useTabManager();
  const { apiKey, saveApiKey, performSynthesis, isSynthesizing } = useSynthesis();

  const [showSettings, setShowSettings] = useState(!apiKey);
  const [chatInput, setChatInput] = useState("");
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string; isError?: boolean; image?: string }[]
  >([]);
  const [activeSourceTab, setActiveSourceTab] = useState<"search" | "sources" | "youtube">("sources");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoInfo[]>([]);
  const [isExtractingYouTube, setIsExtractingYouTube] = useState(false);

  // Google Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ title: string; link: string; snippet: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [googleSearchApiKey, setGoogleSearchApiKey] = useState("");
  const [googleSearchEngineId, setGoogleSearchEngineId] = useState("");

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevSynthesizingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length, isSynthesizing]);

  // Force scroll recalculation when streaming ends to eliminate ghost space
  useEffect(() => {
    if (prevSynthesizingRef.current && !isSynthesizing) {
      // Streaming just ended - force a scroll recalculation
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        if (container) {
          // Force reflow by reading then writing
          const currentScroll = container.scrollTop;
          container.style.overflow = 'hidden';
          // Force layout recalculation
          void container.offsetHeight;
          container.style.overflow = '';
          // Restore scroll position
          container.scrollTop = currentScroll;
          // Scroll to bottom smoothly
          setTimeout(() => scrollToBottom(), 50);
        }
      });
    }
    prevSynthesizingRef.current = isSynthesizing;
  }, [isSynthesizing]);

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
      alert("Research copied to clipboard as Markdown!");
    });
  };

  const getExtractedTabs = (): ExtractedContent[] => {
    // Get regular tab extractions
    const tabContent = activeTabs
      .map((tab) => extractedData[tab.id])
      .filter(Boolean) as ExtractedContent[];

    // Add YouTube video transcripts
    const youtubeContent: ExtractedContent[] = youtubeVideos
      .filter(v => v.transcript)
      .map(video => ({
        title: `YouTube: ${video.videoId}`,
        content: video.transcript || '',
        textContent: video.transcript || '',
        length: video.transcript?.length || 0,
        excerpt: video.transcript?.substring(0, 200) + '...',
        byline: video.channelName || null,
        siteName: 'YouTube Video'
      }));

    return [...tabContent, ...youtubeContent];
  };

  // Handle Google Search
  const handleGoogleSearch = async () => {
    if (!searchQuery.trim() || !googleSearchApiKey || !googleSearchEngineId) return;

    setIsSearching(true);
    try {
      const results = await GoogleSearchExtractor.search(
        searchQuery,
        { apiKey: googleSearchApiKey, searchEngineId: googleSearchEngineId },
        10
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Google Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Vision State
  const [isVisionEnabled, setIsVisionEnabled] = useState(false);

  const captureScreenshot = async (): Promise<string | undefined> => {
    try {
      // @ts-ignore - Chrome types
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (!tab.windowId) return undefined;
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg", quality: 60 });
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
    const displayMessage = mode ? input : input + visionBadge; // Don't badge chips repeated msg

    setChatMessages((prev) => [...prev, { role: "user", content: displayMessage }]);
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
        imageData, // Pass image data if available
        isDeepMode ? 'deep' : 'standard'
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
      insights: "Provide a comprehensive Deep Research Analysis.",
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

  const extractedCount = Object.keys(extractedData).length + youtubeVideos.filter(v => v.transcript).length;


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
    <div className="dark h-screen flex flex-col bg-slate-950 font-sans text-slate-50 selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-900 sticky top-0 z-20">
        <h1 className="text-base font-semibold tracking-tight text-slate-50 flex items-center gap-2">
          AI Research Assistant
        </h1>
        <div className="flex items-center gap-1">
          {Features.visionMode && (
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
          )}
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

      {/* Content Wrapper - relative container for absolute scroll area */}
      <div className="flex-1 min-h-0 relative">
        {/* Scrollable content area - ends above input bar */}
        <div
          className="absolute inset-x-0 top-0 bottom-[108px] overflow-y-auto px-5 pt-5 pb-4 space-y-6 scroll-smooth"
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
                <FeatureGate feature="youtubeExtraction">
                  <button
                    onClick={() => setActiveSourceTab('youtube')}
                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeSourceTab === 'youtube' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    YouTube
                  </button>
                </FeatureGate>
              </div>

              {/* Tab Content */}
              <div className="px-3 pb-3">
                {activeSourceTab === 'search' ? (
                  <FeatureGate feature="googleSearch">
                    <div className="space-y-3">
                      {/* API Configuration (if not set) */}
                      {(!googleSearchApiKey || !googleSearchEngineId) && (
                        <div className="p-3 bg-slate-800/50 rounded-lg space-y-2">
                          <p className="text-xs text-slate-400">Configure Google Custom Search API</p>
                          <input
                            type="password"
                            value={googleSearchApiKey}
                            onChange={(e) => setGoogleSearchApiKey(e.target.value)}
                            placeholder="API Key"
                            className="w-full px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500"
                          />
                          <input
                            type="text"
                            value={googleSearchEngineId}
                            onChange={(e) => setGoogleSearchEngineId(e.target.value)}
                            placeholder="Search Engine ID (cx)"
                            className="w-full px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500"
                          />
                        </div>
                      )}

                      {/* Search Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !isSearching && searchQuery.trim() && handleGoogleSearch()}
                          placeholder="Search the web..."
                          className="flex-1 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <Button
                          onClick={handleGoogleSearch}
                          disabled={isSearching || !searchQuery.trim() || !googleSearchApiKey || !googleSearchEngineId}
                          size="icon"
                          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </Button>
                      </div>

                      {/* Search Results */}
                      {searchResults.length > 0 && (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {searchResults.map((result, idx) => (
                            <div key={idx} className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                              <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:underline font-medium line-clamp-1"
                              >
                                {result.title}
                              </a>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{result.snippet}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.length === 0 && googleSearchApiKey && googleSearchEngineId && (
                        <p className="text-xs text-slate-500 text-center py-4">
                          Enter a search query to find and synthesize web content
                        </p>
                      )}
                    </div>
                  </FeatureGate>
                ) : activeSourceTab === 'youtube' ? (
                  <div className="space-y-3">

                    {/* URL Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube URL..."
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                      <Button
                        onClick={async () => {
                          if (!youtubeUrl.trim()) return;
                          if (!YouTubeExtractor.isYouTube(youtubeUrl)) {
                            alert('Please enter a valid YouTube URL');
                            return;
                          }
                          setIsExtractingYouTube(true);
                          try {
                            const videoInfo = await YouTubeExtractor.getVideoInfo(youtubeUrl);
                            if (videoInfo) {
                              setYoutubeVideos(prev => [...prev, videoInfo]);
                              setYoutubeUrl('');
                            }
                          } catch (e) {
                            console.error('Failed to extract YouTube video:', e);
                          } finally {
                            setIsExtractingYouTube(false);
                          }
                        }}
                        disabled={isExtractingYouTube || !youtubeUrl.trim()}
                        size="icon"
                        className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        {isExtractingYouTube ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Video List */}
                    {youtubeVideos.length > 0 ? (
                      <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                        {youtubeVideos.map((video, idx) => (
                          <div key={video.videoId + idx} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg group">
                            <img
                              src={video.thumbnailUrl}
                              alt=""
                              className="w-16 h-9 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-200 truncate font-medium">{video.title || video.videoId}</p>
                              {video.channelName && (
                                <p className="text-[10px] text-slate-500 truncate">{video.channelName}</p>
                              )}
                              <div className="flex items-center gap-2 mt-0.5">
                                {video.hasNativeCaptions ? (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Captions ✓</span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">STT Required</span>
                                )}
                                {video.duration && (
                                  <span className="text-[10px] text-slate-500">{YouTubeExtractor.formatDuration(video.duration)}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => setYoutubeVideos(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-slate-500 text-sm">
                        No YouTube videos added yet
                      </div>
                    )}
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
          {/* Section 2: Analytics & Insights */}
          {extractedCount > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-400">Analytics & Insights</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium transition-colors ${!isDeepMode ? "text-slate-300" : "text-slate-600"}`}>Standard</span>
                  <Switch
                    checked={isDeepMode}
                    onCheckedChange={setIsDeepMode}
                    className="scale-90"
                  />
                  <span className={`text-xs font-medium transition-colors ${isDeepMode ? "text-blue-400" : "text-slate-600"}`}>Deep Mode</span>
                </div>
              </div>
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
                  <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(PhD Level)" : "(Concise)"}</span>
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
                  <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(Detailed)" : "(Table)"}</span>
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
                  <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(Analysis)" : "(List)"}</span>
                </button>

                {/* Insights Card */}
                <button
                  onClick={() => handleSynthesisChip('insights')}
                  className="flex flex-col items-start p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left group"
                >
                  <div className="p-2 mb-3 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{isDeepMode ? "Deep Analysis" : "Key Insights"}</span>
                  <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(Dissertation)" : "(Bullet Points)"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Chat Stream */}
          <div className="flex flex-col gap-6">
            {chatMessages.map((msg, i) => {
              // Skip rendering empty messages unless it's the active streaming one
              if (!msg.content && !msg.isError && !(i === chatMessages.length - 1 && isSynthesizing)) {
                return null;
              }
              return (
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
                    <div className={`text-sm leading-relaxed max-w-full w-full rounded-xl ${msg.isError ? "bg-red-900/20 border-l-4 border-red-500 p-4 text-red-200" : "bg-slate-900/60 p-4 text-slate-300 border border-slate-800/50"}`}>
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
              )
            })}
            <div ref={messagesEndRef} className="hidden" />
          </div>
        </div>
      </div>

      {/* Deep Dive Input - FIXED at viewport bottom with solid background */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-4 bg-slate-950 border-t border-slate-800 z-50">
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
