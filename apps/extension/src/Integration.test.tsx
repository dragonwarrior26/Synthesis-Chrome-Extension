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
  const mockSynthesizeTabs = vi.fn();
  const mockSynthesizeTable = vi.fn();
  const mockSaveApiKey = vi.fn();

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

    vi.mocked(useSynthesisHook.useSynthesis).mockReturnValue({
      apiKey: "test-api-key",
      saveApiKey: mockSaveApiKey,
      isSynthesizing: false,
      result: "",
      tableData: null,
      error: null,
      synthesizeTabs: mockSynthesizeTabs,
      synthesizeTable: mockSynthesizeTable,
    });
  });

  it("F-01: Renders Side Panel and lists active tabs", () => {
    render(<SidePanel />);
    expect(screen.getByText("Test Tab")).toBeInTheDocument();
    expect(screen.getByText("1 tabs")).toBeInTheDocument();
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

    // Check if status shows "Extracted"
    expect(screen.getByText("Extracted")).toBeInTheDocument();

    // Click Summary
    const summaryBtn = screen.getByText("Summary");
    expect(summaryBtn).not.toBeDisabled();
    fireEvent.click(summaryBtn);
    expect(mockSynthesizeTabs).toHaveBeenCalled();
  });

  it("U-01: Renders Comparison Table when data is available", () => {
    // Mock table data state
    vi.mocked(useTabManagerHook.useTabManager).mockReturnValue({
      activeTabs: [{ id: 1, title: "Test Tab" } as any],
      extractedData: { 1: { title: "Test Tab" } as any },
      isExtracting: false,
      extractAll: mockExtractAll,
      extractFromTab: mockExtractFromTab,
    });

    vi.mocked(useSynthesisHook.useSynthesis).mockReturnValue({
      apiKey: "test-api-key",
      saveApiKey: mockSaveApiKey,
      isSynthesizing: false,
      result: "",
      tableData: {
        columns: [{ header: "Product", accessorKey: "product" }],
        data: [{ product: "Laptop A" }],
      },
      error: null,
      synthesizeTabs: mockSynthesizeTabs,
      synthesizeTable: mockSynthesizeTable,
    });

    render(<SidePanel />);

    // Switch to Table view
    const compareBtn = screen.getByText("Compare");
    fireEvent.click(compareBtn);

    expect(mockSynthesizeTable).toHaveBeenCalled();

    // Since viewMode is local state, clicking Compare sets it to 'table'.
    // If tableData is present, it should render.
    expect(screen.getByText("Laptop A")).toBeInTheDocument();
  });

  it("U-02: Renders Chat Interface", () => {
    // Mock extracted state so buttons are enabled
    vi.mocked(useTabManagerHook.useTabManager).mockReturnValue({
      activeTabs: [{ id: 1, title: "Test Tab" } as any],
      extractedData: { 1: { title: "Test Tab" } as any },
      isExtracting: false,
      extractAll: mockExtractAll,
      extractFromTab: mockExtractFromTab,
    });

    render(<SidePanel />);

    const chatBtn = screen.getByText("Chat");
    fireEvent.click(chatBtn);

    expect(
      screen.getByPlaceholderText("Ask a question..."),
    ).toBeInTheDocument();
  });
});
