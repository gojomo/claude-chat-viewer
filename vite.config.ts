import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      // Allow serving files from the inputs directory
      allow: [".", "../inputs"],
    },
  },
  publicDir: "public",
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/")) {
            return "vendor-react";
          }
          // prismjs (core + language components) is deliberately not given a manual
          // chunk: the components use a bare global `Prism`, so the bundler must keep
          // them ordered after the core, which a shared chunk does not preserve.
          if (id.includes("/node_modules/react-syntax-highlighter/")) {
            return "vendor-syntax";
          }
          if (id.includes("/node_modules/jszip/")) {
            return "vendor-zip";
          }
          if (
            id.includes("/node_modules/react-markdown/") ||
            id.includes("/node_modules/file-saver/") ||
            id.includes("/node_modules/mime/")
          ) {
            return "vendor-utils";
          }
        },
      },
    },
  },
} satisfies UserConfig);
