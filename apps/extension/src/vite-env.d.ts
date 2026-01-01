/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SYNTHESIS_TIER: 'free' | 'pro' | undefined;
    readonly VITE_GEMINI_API_KEY?: string;
    readonly VITE_GOOGLE_API_KEY?: string;
    readonly VITE_GOOGLE_SEARCH_CX?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
