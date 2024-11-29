// vite.config.ts
import { defineConfig } from "file:///C:/Users/senze/Documents/code/chrome-ext/react-vite/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/senze/Documents/code/chrome-ext/react-vite/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { viteStaticCopy } from "file:///C:/Users/senze/Documents/code/chrome-ext/react-vite/node_modules/vite-plugin-static-copy/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\senze\\Documents\\code\\chrome-ext\\react-vite";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        { src: "public/options.html", dest: "." }
      ]
    })
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        popup: resolve(__vite_injected_original_dirname, "index.html"),
        options: resolve(__vite_injected_original_dirname, "src/components/options/Options.tsx"),
        content: resolve(__vite_injected_original_dirname, "src/content.tsx"),
        background: resolve(__vite_injected_original_dirname, "src/background.ts")
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
        assetFileNames: "[name].[ext]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzZW56ZVxcXFxEb2N1bWVudHNcXFxcY29kZVxcXFxjaHJvbWUtZXh0XFxcXHJlYWN0LXZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHNlbnplXFxcXERvY3VtZW50c1xcXFxjb2RlXFxcXGNocm9tZS1leHRcXFxccmVhY3Qtdml0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvc2VuemUvRG9jdW1lbnRzL2NvZGUvY2hyb21lLWV4dC9yZWFjdC12aXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgdGFyZ2V0czogW1xuICAgICAgICB7IHNyYzogXCJwdWJsaWMvbWFuaWZlc3QuanNvblwiLCBkZXN0OiBcIi5cIiB9LFxuICAgICAgICB7IHNyYzogXCJwdWJsaWMvb3B0aW9ucy5odG1sXCIsIGRlc3Q6IFwiLlwiIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCJidWlsZFwiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIHBvcHVwOiByZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICBvcHRpb25zOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29tcG9uZW50cy9vcHRpb25zL09wdGlvbnMudHN4XCIpLFxuICAgICAgICBjb250ZW50OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29udGVudC50c3hcIiksXG4gICAgICAgIGJhY2tncm91bmQ6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9iYWNrZ3JvdW5kLnRzXCIpLFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xuICAgICAgICAgIGlmIChjaHVua0luZm8ubmFtZSA9PT0gXCJjb250ZW50XCIpIHJldHVybiBcImNvbnRlbnQuanNcIjtcbiAgICAgICAgICBpZiAoY2h1bmtJbmZvLm5hbWUgPT09IFwib3B0aW9uc1wiKSByZXR1cm4gXCJvcHRpb25zLmpzXCI7XG4gICAgICAgICAgaWYgKGNodW5rSW5mby5uYW1lID09PSBcImJhY2tncm91bmRcIikgcmV0dXJuIFwiYmFja2dyb3VuZC5qc1wiO1xuICAgICAgICAgIHJldHVybiBcIltuYW1lXS5qc1wiO1xuICAgICAgICB9LFxuICAgICAgICAvLyBBZGQgdGhpcyB0byBwcmV2ZW50IGNvZGUgc3BsaXR0aW5nIGZvciBvcHRpb25zIHBhZ2VcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJvcHRpb25zXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJvcHRpb25zXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJbbmFtZV0uanNcIixcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiW25hbWVdLltleHRdXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVYsU0FBUyxvQkFBb0I7QUFDdFgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUCxFQUFFLEtBQUssd0JBQXdCLE1BQU0sSUFBSTtBQUFBLFFBQ3pDLEVBQUUsS0FBSyx1QkFBdUIsTUFBTSxJQUFJO0FBQUEsTUFDMUM7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3RDLFNBQVMsUUFBUSxrQ0FBVyxvQ0FBb0M7QUFBQSxRQUNoRSxTQUFTLFFBQVEsa0NBQVcsaUJBQWlCO0FBQUEsUUFDN0MsWUFBWSxRQUFRLGtDQUFXLG1CQUFtQjtBQUFBLE1BQ3BEO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGNBQUksVUFBVSxTQUFTLFVBQVcsUUFBTztBQUN6QyxjQUFJLFVBQVUsU0FBUyxVQUFXLFFBQU87QUFDekMsY0FBSSxVQUFVLFNBQVMsYUFBYyxRQUFPO0FBQzVDLGlCQUFPO0FBQUEsUUFDVDtBQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsT0FBTztBQUNwQixjQUFJLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDMUIsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
