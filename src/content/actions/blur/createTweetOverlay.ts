import { StyleSettings } from "../../types/settings";

export function createTweetOverlay(
  blurValue: number,
  styleSettings: StyleSettings,
) {
  const isDarkTheme = styleSettings.theme === "dark";
  const overlay = document.createElement("div");
  overlay.className = "tweet-overlay";
  overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${isDarkTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"};
      pointer-events: auto;
      backdrop-filter: blur(${blurValue}px);
      border: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
      border-radius: 12px;
      pointer-events: none;
      z-index: 2;
      transition: backdrop-filter 0.3s ease, background 0.3s ease;
    `;
  return overlay;
}
