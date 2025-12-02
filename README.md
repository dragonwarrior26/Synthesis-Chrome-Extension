# Synthesis - Intelligent Tab Manager

> Transform tab chaos into structured knowledge. An AI-powered Chrome Extension that synthesizes open tabs into comparison tables and summaries.

## 🎯 The Problem

Modern web browsing suffers from **"Tab Overload"**. Users open dozens of tabs while researching (buying a laptop, planning a trip, writing a paper), leading to:
- **Context Loss**: Forgetting why a tab was opened
- **Manual Synthesis**: Copy-pasting data into spreadsheets
- **Decision Paralysis**: Too many options, no structure

## 💡 The Solution

**Synthesis** is not just a tab manager—it's a **Research Assistant** powered by **Gemini 2.5 Flash**. It:

1. **Auto-Detects Intent**: Analyzes your tabs and identifies clusters (e.g., "Gaming Laptops")
2. **Generates Comparison Tables**: Extracts structured data (Price, RAM, GPU) from product pages automatically
3. **Creates Topic Summaries**: Combines insights from multiple articles into cohesive narratives
4. **Offers Contextual Chat**: Ask questions about your tabs: *"Which laptop has the best battery life?"*

## 🏗️ Architecture (FAANG-Level)

This project follows **Hexagonal Architecture** principles with a **Monorepo** structure:

```
synthesis/
├── apps/
│   └── extension/          # Chrome Extension (Manifest V3)
├── packages/
│   ├── core/               # Business Logic (Synthesis, Extraction)
│   └── ui/                 # Shared Design System (Shadcn/UI)
```

### Tech Stack
- **Framework**: React + TypeScript (Strict Mode)
- **Build**: Vite + CRXJS + Turborepo
- **UI**: Shadcn/UI + TailwindCSS v4
- **AI**: Google Gemini 2.5 Flash
- **Quality**: Husky + Lint-staged + ESLint + Prettier

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Run dev server (with HMR)
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint
```

## 📦 Project Status

**Current Sprint**: Sprint 1 ✅ Complete  
**Next Sprint**: Sprint 2 (Content Extraction) 🚧 In Progress

### Roadmap
- ✅ **Sprint 1**: Foundation (Monorepo, Chrome Extension, Shadcn/UI)
- 🚧 **Sprint 2**: Content Extraction (Readability.js, Tab Management)
- ⏳ **Sprint 3**: Intelligence (Gemini 2.5 Flash Integration)
- ⏳ **Sprint 4**: User Interface (Comparison Tables, Chat)

## 📄 License

MIT

---

**Built with AI-Assisted Development** 🤖
