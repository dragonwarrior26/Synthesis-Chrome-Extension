import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SidePanel from "./sidepanel";
import * as useTabManagerHook from "@/hooks/useTabManager";
import * as useSynthesisHook from "@/hooks/useSynthesis";

// Mock @synthesis/core to avoid JSDOM/Readability issues during test
vi.mock("@synthesis/core", () => ({
  GeminiService: vi.fn(),
  ContentExtractor: vi.fn(),
}));

// Mock the hooks
vi.mock("@/hooks/useTabManager");
vi.mock("@/hooks/useSynthesis");

describe("Smoke Test: Synthesis Extension UI Flow", () => {
  const mockExtractAll = vi.fn();
  const mockExtractFromTab = vi.fn();
  const mockPerformSynthesis = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock state
    vi.mocked(useTabManagerHook.useTabManager).mockReturnValue({
      activeTabs: [
        {
          id: 1,
          title: "Test Tab",
          favIconUrl: "icon.png",
          url: "http://test.com",
        } as any,
      ],
      extractedData: {},
      isExtracting: false,
      extractAll: mockExtractAll,
      extractFromTab: mockExtractFromTab,
    });

    vi.mocked(useSynthesisHook.useSynthesis as any).mockReturnValue({
      apiKey: "test-api-key",
      saveApiKey: vi.fn(),
      isSynthesizing: false,
      error: null,
      performSynthesis: mockPerformSynthesis,
    });
  });

  it("F-01: Renders Side Panel with Research Assistant title", () => {
    render(<SidePanel />);
    expect(screen.getByText("Research Assistant")).toBeInTheDocument();
  });

  it("E-02: Triggers extraction when button is clicked", () => {
    render(<SidePanel />);
    const extractBtn = screen.getByText(/Extract Content/i);
    fireEvent.click(extractBtn);
    expect(mockExtractAll).toHaveBeenCalled();
  });

  it("I-02: Enables Summarize button when content is extracted", () => {
    // Mock extracted state
    vi.mocked(useTabManagerHook.useTabManager).mockReturnValue({
      activeTabs: [
        {
          id: 1,
          title: "Test Tab",
          favIconUrl: "icon.png",
          url: "http://test.com",
        } as any,
      ],
      extractedData: {
        1: {
          title: "Test Tab",
          content: "Content",
          textContent: "Content",
          length: 100,
        } as any,
      },
      isExtracting: false,
      extractAll: mockExtractAll,
      extractFromTab: mockExtractFromTab,
    });

    render(<SidePanel />);

    // Click Summarize button
    const summarizeBtn = screen.getByText("Summarize");
    expect(summarizeBtn).not.toBeDisabled();
    fireEvent.click(summarizeBtn);
    expect(mockPerformSynthesis).toHaveBeenCalled();
  });

  it("U-01: All synthesis buttons are present", () => {
    // Needs extracted data to show buttons
    vi.mocked(useTabManagerHook.useTabManager).mockReturnValue({
      activeTabs: [{ id: 1, title: "Test Tab" } as any],
      extractedData: { 1: { title: "Test Tab" } as any },
      isExtracting: false,
      extractAll: mockExtractAll,
      extractFromTab: mockExtractFromTab,
    });

    render(<SidePanel />);

    // Check all buttons exist
    expect(screen.getByText("Summarize")).toBeInTheDocument();
    expect(screen.getByText("Compare")).toBeInTheDocument();
    expect(screen.getByText("Pros/Cons")).toBeInTheDocument();
    expect(screen.getByText("Insights")).toBeInTheDocument();
  });

  it("U-02: Chat input placeholder states", () => {
    render(<SidePanel />);
    // Default state (no extraction)
    expect(screen.getByPlaceholderText("Extract content to start...")).toBeInTheDocument();
  });
});
