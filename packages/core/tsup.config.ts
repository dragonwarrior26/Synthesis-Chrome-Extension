import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    clean: true,
    // Don't bundle dependencies - let the consuming bundler handle them
    noExternal: [],
    // Mark all dependencies as external
    external: [
        '@mozilla/readability',
        '@google/generative-ai',
        'jsdom',
    ],
})
