import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { FeatureGate } from "@/components/FeatureGate";
import { Features } from "@/config/features";
import { useTabManager } from "@/hooks/useTabManager";
import { useSynthesis, type SynthesisMode } from "@/hooks/useSynthesis";
import { type ExtractedContent, YouTubeExtractor, type YouTubeVideoInfo } from "@synthesis/core";
import {
  Settings,
  FileText,
  CheckCircle2,
  Loader2,
  FileType,
  Search,
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
import { PrivacyDisclosure } from "@/components/PrivacyDisclosure";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LogOut, Cloud } from "lucide-react";
import { SyncService } from "@/services/SyncService";

function SidePanelContent() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { activeTabs, extractedData, isExtracting, extractAll, clearData } = useTabManager();
  const { apiKey, saveApiKey, performSynthesis, isSynthesizing } = useSynthesis();

  // State
  const [chatInput, setChatInput] = useState("");
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string; isError?: boolean; image?: string }[]
  >([]);
  const [activeSourceTab, setActiveSourceTab] = useState<"text" | "sources" | "youtube">("sources");

  // YouTube State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoInfo[]>([]);
  const [isExtractingYouTube, setIsExtractingYouTube] = useState(false);
  const [extractedYouTubeContent, setExtractedYouTubeContent] = useState<ExtractedContent[]>([]);
  const [isSyncingYouTube, setIsSyncingYouTube] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Raw Text State
  const [rawText, setRawText] = useState("");
  const [rawTextTitle, setRawTextTitle] = useState("");
  const [extractedRawContent, setExtractedRawContent] = useState<ExtractedContent[]>([]);


  const [showSettings, setShowSettings] = useState(!apiKey && !import.meta.env.VITE_GEMINI_API_KEY);

  // Vision State
  const [isVisionEnabled, setIsVisionEnabled] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevSynthesizingRef = useRef(false);

  // Privacy Consent State
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    chrome.storage.local.get(["privacyConsent"], (result) => {
      setHasConsented(!!result.privacyConsent);
    });
  }, []);

  const handleConsent = () => {
    chrome.storage.local.set({ privacyConsent: true }, () => {
      setHasConsented(true);
    });
  };

  // --- Helper Functions ---

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight + 100,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length, isSynthesizing]);

  useEffect(() => {
    if (prevSynthesizingRef.current && !isSynthesizing) {
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const currentScroll = container.scrollTop;
          container.style.overflow = 'hidden';
          void container.offsetHeight;
          container.style.overflow = '';
          container.scrollTop = currentScroll;
          setTimeout(() => scrollToBottom(), 50);
        }
      });
    }
    prevSynthesizingRef.current = isSynthesizing;
    prevSynthesizingRef.current = isSynthesizing;
  }, [isSynthesizing]);

  // Auto-sync on login
  useEffect(() => {
    if (user) {
      handleCloudSync();
    }
  }, [user]);

  const handleReset = () => {
    if (confirm("Are you sure you want to clear your session? This will remove all synced content and chat history.")) {
      clearData();
      setChatMessages([]);
      setChatInput("");
      setExtractedYouTubeContent([]);
      setYoutubeVideos([]);
      setExtractedRawContent([]);
      setRawText("");
      setRawTextTitle("");
    }
  };

  const handleExportPDF = async () => {
    if (chatMessages.length === 0) return;
    const currentTab = activeTabs[0] || { title: "Research", url: "https://synthesis.ai" };
    ExportService.downloadPDF(
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

  const handleCloudSync = async () => {
    if (!user) return;
    setIsCloudSyncing(true);
    try {
      // 1. Push current chat/synthesis if valid
      if (chatMessages.length > 0) {
        const title = activeTabs[0]?.title || "Research Session";
        const content = JSON.stringify(chatMessages.filter(m => !m.isError && m.content));
        await SyncService.pushSynthesis({
          title,
          url: activeTabs[0]?.url || "https://synthesis.ai",
          content,
          source_type: 'web'
        });
      }

      // 2. Pull history (future: populate a history sidebar)
      await SyncService.pullSyntheses();

    } catch (e) {
      console.error("Cloud sync failed", e);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const getExtractedTabs = (): ExtractedContent[] => {
    const tabContent = activeTabs
      .map((tab) => extractedData[tab.id])
      .filter(Boolean) as ExtractedContent[];
    return [...tabContent, ...extractedYouTubeContent, ...extractedRawContent];
  };

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
    if ((!apiKey && !import.meta.env.VITE_GEMINI_API_KEY) || isSynthesizing) return;

    const tabsToQuery = getExtractedTabs();
    if (tabsToQuery.length === 0) {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: "Please **Sync Content** first before asking questions."
      }]);
      return;
    }

    let imageData: string | undefined;
    if (isVisionEnabled) {
      imageData = await captureScreenshot();
      if (!imageData) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "**Error**: Failed to capture visible tab. Ensure you are on a webpage." }]);
        return;
      }
    }

    const visionBadge = isVisionEnabled ? " 👁️ [Vision On]" : "";
    const displayMessage = mode ? input : input + visionBadge;

    setChatMessages((prev) => [...prev, { role: "user", content: displayMessage }]);
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      await performSynthesis(
        tabsToQuery,
        mode || 'chat',
        mode ? undefined : input,
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
        chatMessages
          .filter(m => !m.isError && m.content)
          .map(m => ({ role: m.role, content: m.content })),
        imageData,
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

  const handleAddRawText = () => {
    if (!rawText.trim()) return;

    const newContent: ExtractedContent = {
      title: rawTextTitle.trim() || "Untitled Note",
      content: rawText,
      textContent: rawText,
      length: rawText.length,
      siteName: "User Note",
      excerpt: rawText.substring(0, 150) + "...",
      byline: "User"
    };

    setExtractedRawContent(prev => [...prev, newContent]);
    setRawText("");
    setRawTextTitle("");
    alert("Note added to synthesis context!");
  };

  const handleYouTubeSync = async () => {
    if (youtubeVideos.length === 0) return;

    setIsSyncingYouTube(true);
    const newContent: ExtractedContent[] = [];

    try {
      for (const video of youtubeVideos) {
        let transcript: string | undefined;

        console.log(`[Sync] Processing video: ${video.videoId}`);

        // Step 1: Find YouTube tab with this video
        let tabs = await chrome.tabs.query({ url: `*://www.youtube.com/watch?v=${video.videoId}*` });

        if (tabs.length === 0) {
          // Try to find any YouTube tab with this video
          const allYouTubeTabs = await chrome.tabs.query({ url: "*://www.youtube.com/*" });
          const matchingTab = allYouTubeTabs.find(t => t.url?.includes(video.videoId));
          if (matchingTab) {
            tabs = [matchingTab];
          }
        }

        if (tabs.length > 0 && tabs[0].id) {
          const tabId = tabs[0].id;
          console.log(`[Sync] Found YouTube tab ${tabId} for video ${video.videoId}`);

          // Ensure content script is injected (handles tabs opened before extension reload)
          try {
            // Inject the content script file that's defined in manifest
            await chrome.scripting.executeScript({
              target: { tabId },
              func: () => {
                // Check if already injected
                if ((window as any).__synthesisContentScriptLoaded) {
                  console.log('[Synthesis] Content script already loaded');
                  return;
                }
                (window as any).__synthesisContentScriptLoaded = true;
                console.log('[Synthesis] Content script marker set');
              }
            });
            console.log(`[Sync] Content script check completed for tab ${tabId}`);
          } catch (injectErr) {
            console.log(`[Sync] Content script check failed:`, injectErr);
          }

          // Small delay to let script initialize
          await new Promise(r => setTimeout(r, 500));

          // Step 2: Request captions from content script
          try {
            const captionResult = await new Promise<{ transcript: string; segments: any[] } | null>((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error('Content script timeout'));
              }, 15000);

              chrome.tabs.sendMessage(tabId, { type: 'EXTRACT_YOUTUBE_CAPTIONS' }, (response) => {
                clearTimeout(timeout);
                if (chrome.runtime.lastError) {
                  console.warn('[Sync] Content script error:', chrome.runtime.lastError.message);
                  resolve(null);
                } else if (response?.type === 'CAPTIONS_EXTRACTED') {
                  resolve(response.payload);
                } else if (response?.type === 'ERROR') {
                  console.warn('[Sync] Caption extraction error:', response.error);
                  resolve(null);
                } else {
                  resolve(null);
                }
              });
            });

            if (captionResult?.transcript) {
              transcript = captionResult.transcript;
              console.log(`[Sync] Got captions from content script: ${transcript.length} chars`);
            }
          } catch (err) {
            console.warn('[Sync] Content script caption extraction failed:', err);
          }
        }

        // Step 3: Fallback to YouTubeExtractor (library-based)
        if (!transcript) {
          console.log(`[Sync] Trying YouTubeExtractor.extractCaptions for ${video.videoId}...`);
          try {
            const result = await YouTubeExtractor.extractCaptions(video.videoId);
            if (result?.transcript) {
              transcript = result.transcript;
              console.log(`[Sync] Got captions from YouTubeExtractor: ${transcript.length} chars`);
            }
          } catch (err) {
            console.warn('[Sync] YouTubeExtractor failed:', err);
          }
        }

        // Step 4: If still no captions and we have a tab, try audio capture (Pro feature)
        if (!transcript && tabs.length > 0 && tabs[0].id) {
          const keyToUse = (apiKey || import.meta.env.VITE_GEMINI_API_KEY) as string;

          if (!keyToUse) {
            alert(`No captions found for "${video.title}". API key required for speech-to-text.`);
            continue;
          }

          const tabId = tabs[0].id;

          // Get tier-based audio capture limit
          const hasByok = !!keyToUse && keyToUse !== import.meta.env.VITE_GEMINI_API_KEY;
          const { getAudioCaptureLimit } = await import('@/config/features');
          const maxDurationSeconds = getAudioCaptureLimit(hasByok);
          console.log(`[Sync] Trying audio capture for ${video.videoId} (max ${maxDurationSeconds}s)...`);

          try {
            const captureResult = await new Promise<{ audioData: string; mimeType: string }>((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error('Audio capture timeout'));
              }, 15000);

              chrome.tabs.sendMessage(tabId, { type: 'CAPTURE_YOUTUBE_AUDIO', payload: { maxDurationSeconds } }, (response) => {
                clearTimeout(timeout);
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                } else if (response?.type === 'AUDIO_CAPTURED') {
                  resolve(response.payload);
                } else if (response?.type === 'ERROR') {
                  reject(new Error(response.error));
                } else {
                  reject(new Error('Unexpected response'));
                }
              });
            });

            const { GeminiService } = await import('@synthesis/core');
            const gemini = new GeminiService(keyToUse);
            transcript = await gemini.transcribeAudioData(captureResult.audioData, captureResult.mimeType);
            console.log(`[Sync] Got transcript from audio capture: ${transcript.length} chars`);
          } catch (err) {
            console.error('[Sync] Audio capture failed:', err);
            alert(`Audio capture failed for "${video.title}": ${(err as Error).message}`);
            continue;
          }
        }

        // Step 5: If no tab found and no captions, inform user
        if (!transcript && tabs.length === 0) {
          alert(`Please open "${video.title}" in a YouTube tab first, then try syncing again.`);
          continue;
        }

        if (transcript) {
          newContent.push({
            title: video.title || `YouTube Video (${video.videoId})`,
            content: transcript,
            textContent: transcript,
            length: transcript.length,
            siteName: "YouTube",
            excerpt: transcript.substring(0, 150) + "...",
            byline: video.channelName || null
          });
        }
      }

      setExtractedYouTubeContent(prev => [...prev, ...newContent]);

      if (newContent.length > 0) {
        alert(`Successfully synced ${newContent.length} videos!`);
      } else {
        alert("No transcripts could be extracted. Please open the YouTube video in a tab and try again.");
      }

    } catch (e) {
      console.error("YouTube Sync Failed", e);
      alert("Sync failed: " + (e as Error).message);
    } finally {
      setIsSyncingYouTube(false);
    }
  };

  const handleSynthesisChip = (mode: SynthesisMode) => {
    const promptMap: Record<SynthesisMode, string> = {
      summary: "Create a visual summary of this content.",
      table: "Create a detailed comparison chart.",
      proscons: "Analyze pros and cons with bullet points.",
      insights: "Provide a comprehensive Deep Research Analysis.",
      chat: "Let's discuss this."
    };
    handleAction(promptMap[mode], mode);
    setTimeout(() => scrollToBottom("smooth"), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const extractedCount = Object.keys(extractedData).length + extractedYouTubeContent.length + extractedRawContent.length;

  if (hasConsented === null) {
    return <div className="dark h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
    </div>;
  }

  if (hasConsented === false) {
    return (
      <div className="dark">
        <PrivacyDisclosure onAccept={handleConsent} />
      </div>
    );
  }

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
              title={isVisionEnabled ? "Disable Vision" : "Enable Vision"}
            >
              {isVisionEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          )}
          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Upgrade Button (Placeholder) */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-500 hover:text-amber-400 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/20 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all"
            onClick={() => alert("Pro Tier: Coming Soon! Enjoy all features for free during the preview.")}
          >
            Upgrade
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

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-8 w-8 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title={`Signed in as ${user.email}`}
              >
                <LogOut className="w-4 h-4" />
              </Button>

              <div className="w-px h-4 bg-slate-800 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloudSync}
                disabled={isCloudSyncing}
                className={`h-8 w-8 rounded-lg transition-all ${isCloudSyncing ? "animate-pulse text-blue-400" : "text-green-400 hover:bg-slate-800"}`}
                title={isCloudSyncing ? "Syncing..." : "Sync to Cloud"}
              >
                <Cloud className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={signInWithGoogle}
              className="h-8 px-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="flex-1 min-h-0 relative">
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
            </div>
          )}

          {/* Source Management */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-400">Sources & Extraction</h2>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-1 overflow-hidden">
              {/* Tabs - Single Line Layout */}
              <div className="flex items-center border-b border-slate-800 mb-3">
                <FeatureGate feature="googleSearch">
                  <button
                    onClick={() => setActiveSourceTab('text')}
                    className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors text-center ${activeSourceTab === 'text' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                  >
                    Notes
                  </button>
                </FeatureGate>
                <button
                  onClick={() => setActiveSourceTab('sources')}
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors text-center ${activeSourceTab === 'sources' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                >
                  Sources
                </button>
                <FeatureGate feature="youtubeExtraction">
                  <button
                    onClick={() => setActiveSourceTab('youtube')}
                    className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors text-center ${activeSourceTab === 'youtube' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                  >
                    YouTube
                  </button>
                </FeatureGate>
              </div>

              {/* Tab Content */}
              <div className="px-3 pb-3">
                {activeSourceTab === 'text' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={rawTextTitle}
                      onChange={(e) => setRawTextTitle(e.target.value)}
                      placeholder="Note Title (Optional)"
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Paste text, meeting notes, or emails here to analyze..."
                      className="w-full h-32 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none custom-scrollbar"
                    />
                    <Button
                      onClick={handleAddRawText}
                      disabled={!rawText.trim()}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium h-9 rounded-lg shadow-lg shadow-orange-900/20 transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add to Context
                    </Button>

                    {extractedRawContent.length > 0 && (
                      <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pt-2 border-t border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Added Notes</p>
                        {extractedRawContent.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg group">
                            <FileType className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span className="text-xs text-slate-300 truncate flex-1">{item.title}</span>
                            <button
                              onClick={() => setExtractedRawContent(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : activeSourceTab === 'youtube' ? (
                  <div className="space-y-3">
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

                    {youtubeVideos.length > 0 ? (
                      <div className="space-y-4">
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
                                <div className="flex items-center gap-2 mt-0.5">
                                  {video.hasNativeCaptions ? (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Captions</span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">STT Required</span>
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
                        <Button
                          onClick={handleYouTubeSync}
                          disabled={isSyncingYouTube}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium h-10 rounded-lg shadow-lg shadow-red-900/20 transition-all"
                        >
                          {isSyncingYouTube ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span>
                          ) : "Sync YouTube Videos"}
                        </Button>
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
                        <span className="text-sm text-slate-400">No content synced. Add Tabs, Videos, or Notes.</span>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                        {activeTabs.map(tab => (
                          <div key={tab.id} className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-600" />
                            <span className="text-sm text-slate-300 truncate flex-1">{tab.title}</span>
                            {extractedData[tab.id] && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                          </div>
                        ))}
                        {extractedYouTubeContent.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Youtube className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-slate-300 truncate flex-1">{item.title}</span>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                        ))}
                        {extractedRawContent.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <FileType className="w-4 h-4 text-orange-600" />
                            <span className="text-sm text-slate-300 truncate flex-1">{item.title}</span>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
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

          {/* Chat Messages */}
          <div className="space-y-6">
            {chatMessages.map((msg, i) => {
              const isStreaming = !msg.content && i === chatMessages.length - 1 && isSynthesizing;

              if (!msg.content && !msg.isError && !isStreaming) return null;

              return (
                <div key={i} className={`flex gap-4 ${msg.role === "assistant" ? "bg-slate-900/30 -mx-5 px-5 py-4 border-y border-slate-900/50" : ""}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === "assistant" ? "bg-blue-600 shadow-lg shadow-blue-900/20" : "bg-slate-800 border border-slate-700"
                    }`}>
                    {msg.role === "assistant" ? <Sparkles className="w-4 h-4 text-white" /> : <div className="text-xs font-bold text-slate-400">YOU</div>}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200">{msg.role === "assistant" ? "AI Analyst" : "You"}</span>
                      {msg.isError && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Error</span>}
                      {isStreaming && <span className="text-[10px] animate-pulse text-blue-400">Thinking...</span>}
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed break-words">
                      {isStreaming ? (
                        <div className="flex items-center gap-2 text-slate-500 italic">
                          <Loader2 className="w-3 h-3 animate-spin" /> Synthesizing insights...
                        </div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Footer Input Area */}
      <div className="p-4 bg-slate-950 border-t border-slate-900 absolute bottom-0 inset-x-0 z-10">
        {/* Feature Chips */}
        {extractedCount > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
            <div className="flex items-center gap-2 pr-4">
              <span className={`text-xs font-medium transition-colors ${!isDeepMode ? "text-slate-300" : "text-slate-600"}`}>Standard</span>
              <Switch
                checked={isDeepMode}
                onCheckedChange={setIsDeepMode}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className={`text-xs font-medium transition-colors ${isDeepMode ? "text-blue-400" : "text-slate-600"}`}>Deep Mode</span>
            </div>
            <div className="w-px h-5 bg-slate-800 mx-1 flex-shrink-0" />

            <button
              onClick={() => handleSynthesisChip('summary')}
              className="flex-shrink-0 flex flex-col items-start px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group text-left min-w-[100px]"
            >
              <span className="text-sm font-semibold text-slate-200">Summary</span>
              <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(PhD Level)" : "(Concise)"}</span>
            </button>
            <button
              onClick={() => handleSynthesisChip('table')}
              className="flex-shrink-0 flex flex-col items-start px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group text-left min-w-[100px]"
            >
              <span className="text-sm font-semibold text-slate-200">Comparison</span>
              <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(Detailed)" : "(Table)"}</span>
            </button>
            <button
              onClick={() => handleSynthesisChip('proscons')}
              className="flex-shrink-0 flex flex-col items-start px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group text-left min-w-[100px]"
            >
              <span className="text-sm font-semibold text-slate-200">Analysis</span>
              <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(Analysis)" : "(List)"}</span>
            </button>
            <button
              onClick={() => handleSynthesisChip('insights')}
              className="flex-shrink-0 flex flex-col items-start px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group text-left min-w-[100px]"
            >
              <span className="text-sm font-semibold text-slate-200">{isDeepMode ? "Deep Analysis" : "Key Insights"}</span>
              <span className="text-xs text-slate-500 mt-1">{isDeepMode ? "(Dissertation)" : "(Bullet Points)"}</span>
            </button>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDeepMode ? "Ask a complex research question..." : "Ask a question about the content..."}
            className="w-full pl-4 pr-12 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
          />
          <Button
            onClick={handleChatSubmit}
            disabled={!chatInput.trim() || (!apiKey && !import.meta.env.VITE_GEMINI_API_KEY) || isSynthesizing}
            size="icon"
            className="absolute right-2 top-1.5 h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-800"
          >
            {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SidePanel() {
  return (
    <AuthProvider>
      <SidePanelContent />
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<SidePanel />);
export default SidePanel;
