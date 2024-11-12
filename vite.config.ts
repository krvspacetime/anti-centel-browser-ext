import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
        main: "./index.html", // Main popup entry
        content: "./public/content.js", // Content script entry
      },
      output: {
        entryFileNames: "output.js", // Output named files for easier reference
      },
    },
  },
});
