import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src:
            mode === "production"
              ? "public/manifest.prod.json"
              : "public/manifest.dev.json",
          dest: ".",
          rename: "manifest.json",
        },
        {
          src: "build/popup.css",
          dest: ".",
        },
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        content: resolve(__dirname, "src/content/content.tsx"),
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") return "content.js";
          if (chunkInfo.name === "background") return "background.js";
          return "[name].js";
        },
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
      host: "localhost",
    },
    watch: {
      usePolling: true,
    },
    open: "/popup.html",
  },
}));
