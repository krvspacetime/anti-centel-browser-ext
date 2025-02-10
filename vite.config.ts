import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        { src: "src/options_ui/options.html", dest: "." },
      ],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        options: resolve(
          __dirname,
          "src/options_ui/components/options/Options.tsx",
        ),
        content: resolve(__dirname, "src/content/content.ts"),
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") return "content.js";
          if (chunkInfo.name === "options") return "options.js";
          if (chunkInfo.name === "background") return "background.js";
          return "[name].js";
        },
        // Add this to prevent code splitting for options page
        manualChunks: (id) => {
          if (id.includes("options")) {
            return "options";
          }
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
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
});
