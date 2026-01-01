// @ts-nocheck
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import replace from "@rollup/plugin-replace";
import manifest from "./manifest.json";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Use relative paths for Chrome extension
  plugins: [
    // MV3 Compliance: Strip CDN URLs from pdfjs-dist library
    replace({
      preventAssignment: true,
      values: {
        // Replace the pdfjs-dist CDN fallback with empty string (worker will be set by our code)
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/': '""/*stripped-cdn*/',
      },
    }),
    react(),
    crx({ manifest }),
    tailwindcss(),
  ],
  // @ts-expect-error vitest/config uses different Vite version than main app
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@synthesis/core": path.resolve(__dirname, "../../packages/core/src/index.ts"),
    },
  },
});
