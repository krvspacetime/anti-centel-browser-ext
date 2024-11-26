import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: "public/manifest.json", dest: "." }],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content.tsx"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "content" ? "content.js" : "[name].js";
        },
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
