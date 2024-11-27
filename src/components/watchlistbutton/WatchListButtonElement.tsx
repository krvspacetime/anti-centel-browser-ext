import { createRoot } from "react-dom/client";
import { WatchlistButton } from "./WatchListButton";
import { handleWatchlistAction } from "../../content";

class WatchlistButtonElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const isInTargetList = this.getAttribute("is-in-target-list") === "true";
    const handle = this.getAttribute("handle");

    // Create a container for React
    const container = document.createElement("div");
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(container);

      // Inject Tailwind styles
      const styleSheet = document.createElement("style");
      styleSheet.textContent = this.getTailwindStyles();
      this.shadowRoot.appendChild(styleSheet);

      // Mount React component
      const root = createRoot(container);
      root.render(
        <WatchlistButton
          isInTargetList={isInTargetList}
          onButtonClick={() => {
            if (handle) {
              handleWatchlistAction(handle);
            }
          }}
        />
      );
    }
  }

  // This is a simplified version of the Tailwind classes we need
  private getTailwindStyles() {
    return `
      .inline-flex { display: inline-flex; }
      .items-center { align-items: center; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .ml-2 { margin-left: 0.5rem; }
      .-mt-0.5 { margin-top: -0.125rem; }
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .text-white { color: white; }
      .rounded-full { border-radius: 9999px; }
      .bg-red-500 { background-color: #ef4444; }
      .bg-blue-500 { background-color: #3b82f6; }
      .hover\\:bg-red-600:hover { background-color: #dc2626; }
      .hover\\:bg-blue-600:hover { background-color: #2563eb; }
      .font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
      .whitespace-nowrap { white-space: nowrap; }
      .cursor-pointer { cursor: pointer; }
    `;
  }
}

customElements.define("watchlist-button", WatchlistButtonElement);
