/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
    // setupFiles: ['./vitest.setup.ts'],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
