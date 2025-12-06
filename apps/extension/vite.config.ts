// @ts-nocheck
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "", // Use relative paths for Chrome extension
  plugins: [react(), crx({ manifest }), tailwindcss()],
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
    },
  },
});

