import { StyleSettings } from "../../types";

export const createHideTweetButton = (
  onClick: () => void,
  styleSettings: StyleSettings,
) => {
  const isDarkTheme = styleSettings.theme === "dark";
  const hideTweetButton = document.createElement("button");
  hideTweetButton.className = "hide-tweet-button";

  // Create the SVG element
  const hideIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  hideIcon.setAttribute("viewBox", "0 0 24 24");
  hideIcon.setAttribute("width", "16");
  hideIcon.setAttribute("height", "16");
  hideIcon.setAttribute("fill", "none");
  hideIcon.setAttribute("stroke", isDarkTheme ? "white" : "black");
  hideIcon.setAttribute("stroke-width", "2");
  hideIcon.setAttribute("stroke-linecap", "round");
  hideIcon.setAttribute("stroke-linejoin", "round");

  // Create the path for the eye-slash icon
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
  );
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", "1");
  line.setAttribute("y1", "1");
  line.setAttribute("x2", "23");
  line.setAttribute("y2", "23");

  hideIcon.appendChild(path);
  hideIcon.appendChild(line);

  // Create the text label
  const text = document.createElement("span");
  text.textContent = "Hide";
  text.style.cssText = `
      margin-left: 4px;
      font-size: 12px;
      color: ${isDarkTheme ? "white" : "black"};
    `;

  // Add both elements to the button
  hideTweetButton.appendChild(hideIcon);
  hideTweetButton.appendChild(text);

  hideTweetButton.style.cssText = `
      position: absolute;
      display: none;
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

  hideTweetButton.addEventListener("mouseenter", () => {
    hideTweetButton.style.opacity = "1";
    hideTweetButton.style.background = isDarkTheme
      ? "rgba(40,40,40,0.9)"
      : "rgba(250,250,250,0.9)";
  });

  hideTweetButton.addEventListener("mouseleave", () => {
    hideTweetButton.style.opacity = "0.8";
    hideTweetButton.style.background = isDarkTheme
      ? "rgba(30,30,30,0.8)"
      : "rgba(240,240,240,0.8)";
  });

  hideTweetButton.addEventListener("click", onClick);

  return hideTweetButton;
};
