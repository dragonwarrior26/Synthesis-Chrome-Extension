import { useState, useEffect } from "react";
import {
  type ExtractedContent,
  type ExtractContentMessage,
} from "@synthesis/core";

export type TabStatus = "idle" | "extracting" | "success" | "error";

export interface TabData {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  status: TabStatus;
}

export function useTabManager() {
  const [activeTabs, setActiveTabs] = useState<TabData[]>([]);
  const [extractedData, setExtractedData] = useState<
    Record<number, ExtractedContent>
  >({});
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    fetchTabs();
    const handleTabUpdate = () => fetchTabs();
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onRemoved.addListener(handleTabUpdate);
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      chrome.tabs.onRemoved.removeListener(handleTabUpdate);
    };
  }, []);

  const fetchTabs = async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const validTabs = tabs
      .filter((tab) => tab.id && tab.url && !tab.url.startsWith("chrome://"))
      .map((tab) => ({
        id: tab.id!,
        title: tab.title || "Untitled",
        url: tab.url!,
        favIconUrl: tab.favIconUrl,
        status: "idle" as TabStatus,
      }));

    // Preserve status for existing tabs
    setActiveTabs((prev) => {
      const prevStatusMap = new Map(prev.map((t) => [t.id, t.status]));
      return validTabs.map((tab) => ({
        ...tab,
        status: prevStatusMap.get(tab.id) || "idle",
      }));
    });
  };

  const updateTabStatus = (tabId: number, status: TabStatus) => {
    setActiveTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, status } : tab)),
    );
  };

  const extractFromTab = async (tabId: number) => {
    updateTabStatus(tabId, "extracting");
    try {
      const message: ExtractContentMessage = { type: "EXTRACT_CONTENT" };
      // Add timeout to detect disconnected content scripts
      const response = (await Promise.race([
        chrome.tabs.sendMessage(tabId, message),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000),
        ),
      ])) as any;

      if (response && response.type === "CONTENT_EXTRACTED") {
        setExtractedData((prev) => ({ ...prev, [tabId]: response.payload }));
        updateTabStatus(tabId, "success");
      } else {
        updateTabStatus(tabId, "error");
      }
    } catch (error) {
      console.error(`Error extracting from tab ${tabId}:`, error);
      updateTabStatus(tabId, "error");
    }
  };

  const extractAll = async () => {
    setIsExtracting(true);
    await Promise.all(activeTabs.map((tab) => extractFromTab(tab.id)));
    setIsExtracting(false);
  };

  return {
    activeTabs,
    extractedData,
    isExtracting,
    extractFromTab,
    extractAll,
  };
}
