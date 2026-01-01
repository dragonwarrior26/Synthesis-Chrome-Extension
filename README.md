# Synthesis Intelligent Web Manager

> **Turn Information Chaos into Structured Knowledge.**  
> An enterprise-grade AI Research Assistant that synthesizes the entire web—articles, search results, and videos—into actionable insights.

![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tier: Pro](https://img.shields.io/badge/Tier-Pro%20Enabled-blue)
![AI Models: Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-purple)

---

## 🛑 The Problem: Knowledge Fragmentation

In the modern research workflow, professionals drown in tabs.
- **Disconnected Data**: You read an article, watch a YouTube video, and search Google separately. There is no unified context.
- **Video is a Black Box**: Valuable information is locked inside hours of video content, unsearchable and unskimmable.
- **Manual Synthesis**: Users waste hours copying snippets into docs to build a coherent picture.

## 💡 The Solution: Unified Research Intelligence

**Synthesis** is a Chrome Extension that acts as your **Personal AI Research Analyst**. It doesn't just manage tabs; it *reads, watches, and understands* them for you.

### Key Capabilities

#### 1. 🎥 Universal YouTube Intelligence (Pro Feature)
Unlock the knowledge inside any video.
- **Native Transcripts**: Instantly extracts captions from supported videos.
- **AI Speech-to-Text (STT)**: For videos *without* captions, Synthesis downloads the audio, processes it via a Cloudflare Worker, and uses Gemini to transcribe it with 99% accuracy.
- **Video Chat**: Ask questions directly to the video content ("What were the 3 key takeaways from the lecture?").

#### 2. 🔍 Integrated Deep Search
Stop tab switching.
- **Built-in Google Search**: Research new topics directly within the sidebar.
- **One-Click Context**: Add search results immediately to your context window for synthesis without opening new tabs.

#### 3. 🧠 Deep Synthesis Engine
Go beyond simple summaries.
- **Comparative Analysis**: "create a table comparing the pricing of the 5 SaaS tools I have open."
- **Deep Research Mode**: Toggle "Deep Mode" for PhD-level insights, connecting dots between your YouTube videos and web articles.
- **Vision Capabilities**: Synthesis can "see" your screen to analyze charts, diagrams, and visual data on webpages.

#### 4. 📄 Professional Exports
- **One-Click Reports**: Export your entire research session as a formatted **PDF Report** or **Markdown** file for immediate sharing.

---

## 🏗️ Technical Architecture

Built with a scalable **Hexagonal Monorepo Architecture** designed for performance and maintainability.

### Frontend (Chrome Extension)
- **Core**: React 18, TypeScript, Vite, CRXJS (Manifest V3).
- **UI/UX**: TailwindCSS, Shadcn/UI for a premium, accessible interface.
- **State**: Custom Hooks (`useSynthesis`, `useTabManager`) for reactive data flow.

### Backend (Infrastructure)
- **Audio Proxy**: Cloudflare Worker (Edge Compute) to handle CORS-free audio extraction securely.
- **AI Model**: Google Gemini API (1.5 Flash/Pro) for low-latency, high-context reasoning.

### Data Privacy & Security
- **"Bring Your Own Key" (BYOK)**: Zero data retention on our servers. API keys are stored locally in the user's browser (AES encrypted).
- **Environment Variables**: Pro builds secure keys at compile time, hiding complexity from the end user.

---

## 🚀 Getting Started (Pro Build)

### Prerequisites
- Node.js 18+
- PNPM
- Cloudflare Account (for Audio Proxy)

### Installation
1. **Clone & Setup**:
   ```bash
   pnpm install
   ```

2. **Configure Secrets**:
   Create `apps/extension/.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=...
   VITE_GOOGLE_API_KEY=...
   VITE_GOOGLE_SEARCH_CX=...
   VITE_BACKEND_URL=...
   ```

3. **Deploy Backend**:
   ```bash
   pnpm deploy:backend
   ```

4. **Build & Load**:
   ```bash
   pnpm build:pro
   ```
   Load the `apps/extension/dist` folder in `chrome://extensions`.

---

**Synthesis Intelligent Web Manager** — Research at the speed of thought.
