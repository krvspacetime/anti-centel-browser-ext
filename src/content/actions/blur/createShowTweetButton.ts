import { StyleSettings } from "../../types";

export const createShowTweetButton = (
  onClick: () => void,
  styleSettings: StyleSettings,
) => {
  const isDarkTheme = styleSettings.theme === "dark";
  const showTweetButton = document.createElement("button");
  showTweetButton.className = "show-tweet-button";

  // Create the SVG element
  const showIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  showIcon.setAttribute("viewBox", "0 0 24 24");
  showIcon.setAttribute("width", "16");
  showIcon.setAttribute("height", "16");
  showIcon.setAttribute("fill", "none");
  showIcon.setAttribute("stroke", isDarkTheme ? "white" : "black");
  showIcon.setAttribute("stroke-width", "2");
  showIcon.setAttribute("stroke-linecap", "round");
  showIcon.setAttribute("stroke-linejoin", "round");

  // Create the path for the eye icon
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  path.setAttribute("d", "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "3");
  showIcon.appendChild(path);
  showIcon.appendChild(circle);

  // Create the text label
  const text = document.createElement("span");
  text.textContent = "Show";
  text.style.cssText = `
      margin-left: 4px;
      font-size: 12px;
      color: ${isDarkTheme ? "white" : "black"};
    `;

  // Add both elements to the button
  showTweetButton.appendChild(showIcon);
  showTweetButton.appendChild(text);

  showTweetButton.style.cssText = `
      position: absolute;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      top: 8px;
      right: 24px;
      padding: 4px 8px;
      background: ${isDarkTheme ? "rgba(30,30,30,0.8)" : "rgba(240,240,240,0.8)"};
      border: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"};
      color: ${isDarkTheme ? "white" : "black"};
      border-radius: 16px;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      backdrop-filter: blur(4px);
      font-weight: 500;
      box-shadow: 0 2px 4px ${isDarkTheme ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"};
      opacity: 0.8;
      z-index: 4;
    `;

  showTweetButton.addEventListener("mouseenter", () => {
    showTweetButton.style.opacity = "1";
    showTweetButton.style.background = isDarkTheme
      ? "rgba(40,40,40,0.9)"
      : "rgba(250,250,250,0.9)";
  });

  showTweetButton.addEventListener("mouseleave", () => {
    showTweetButton.style.opacity = "0.8";
    showTweetButton.style.background = isDarkTheme
      ? "rgba(30,30,30,0.8)"
      : "rgba(240,240,240,0.8)";
  });

  showTweetButton.addEventListener("click", onClick);

  return showTweetButton;
};
