/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SYNTHESIS_TIER: 'free' | 'pro' | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
