import { StyleSettings, Tags } from "../types";
import { getTagIcon } from "./iconUtils";

function createTweetOverlay(blurValue: number, styleSettings: StyleSettings) {
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

const createShowTweetButton = (
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

const createHideTweetButton = (
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

const createTweetBadge = (
  handle: string,
  tag: string,
  styleSettings: StyleSettings,
) => {
  const isDarkTheme = styleSettings.theme === "dark";
  const badgeContainer = document.createElement("div");
  badgeContainer.style.cssText = `
    position: absolute;
    top: 8px;
    left: 8px;
    background: ${isDarkTheme ? "rgba(30,30,30,0.8)" : "rgba(240,240,240,0.8)"};
    color: ${isDarkTheme ? "white" : "black"};
    padding: 4px 8px;
    border-radius: 16px;
    text-align: center;
    font-size: 12px;
    pointer-events: auto;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"};
    backdrop-filter: blur(4px);
    font-weight: 500;
    box-shadow: 0 2px 4px ${isDarkTheme ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"};
    opacity: 0.8;
    transition: opacity 0.2s ease;
  `;

  // Get the SVG icon for the tag
  const iconSvg = getTagIcon(tag as Tags);

  // Create icon container
  const iconContainer = document.createElement("div");
  iconContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
  `;
  iconContainer.innerHTML = iconSvg;

  // Set icon color
  const svgElement = iconContainer.querySelector("svg");
  if (svgElement) {
    svgElement.style.fill = isDarkTheme ? "white" : "black";
    svgElement.style.width = "14px";
    svgElement.style.height = "14px";
  }

  // Format tag text
  const categoryLabel = tag.replace(/_/g, " ").split(" ");
  const upperCaseCategoryLabel = categoryLabel
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const tagText = document.createElement("span");
  tagText.textContent = upperCaseCategoryLabel;

  badgeContainer.appendChild(iconContainer);
  badgeContainer.appendChild(tagText);

  // Create tooltip element
  const tooltip = document.createElement("div");
  tooltip.textContent = `${handle} - ${upperCaseCategoryLabel}`;
  tooltip.className = "tag-overlay-tooltip";
  tooltip.style.cssText = `
    visibility: hidden;
    font-size: 12px;
    background-color: ${isDarkTheme ? "rgba(20,20,20,0.95)" : "rgba(250,250,250,0.95)"};
    color: ${isDarkTheme ? "white" : "black"};
    text-align: center;
    border-radius: 6px;
    padding: 6px 10px;
    z-index: 5;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s ease;
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 8px;
    white-space: nowrap;
    box-shadow: 0 2px 10px ${isDarkTheme ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"};
    border: 1px solid ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
    pointer-events: none;
  `;

  badgeContainer.appendChild(tooltip);

  badgeContainer.addEventListener("mouseenter", () => {
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
    badgeContainer.style.opacity = "1";
  });

  badgeContainer.addEventListener("mouseleave", () => {
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
    badgeContainer.style.opacity = "0.8";
  });

  return badgeContainer;
};

const createButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: transparent;
    z-index: 3;
  `;
  return buttonContainer;
};

export const OverlayWithRemoveButton = (
  handle: string,
  category: string,
  styleSettings: StyleSettings,
) => {
  const overlay = createTweetOverlay(
    styleSettings.blur.blurValue,
    styleSettings,
  );
  const buttonContainer = createButtonContainer();
  const badge = createTweetBadge(handle, category, styleSettings);

  const showButton = createShowTweetButton(() => {
    // Reduce blur instead of removing it completely for a smoother experience
    overlay.style.backdropFilter = `blur(0px)`;
    overlay.style.background = "transparent";
    overlay.style.border = "none";

    showButton.style.display = "none";
    hideButton.style.display = "flex";
    badge.style.display = "none";

    // Add a subtle animation
    overlay.animate(
      [
        { backdropFilter: `blur(${styleSettings.blur.blurValue}px)` },
        { backdropFilter: "blur(0px)" },
      ],
      {
        duration: 300,
        easing: "ease-out",
      },
    );
  }, styleSettings);

  const hideButton = createHideTweetButton(() => {
    overlay.style.backdropFilter = `blur(${styleSettings.blur.blurValue}px)`;
    overlay.style.background =
      styleSettings.theme === "dark"
        ? "rgba(0,0,0,0.05)"
        : "rgba(255,255,255,0.05)";
    overlay.style.border =
      styleSettings.theme === "dark"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.1)";

    showButton.style.display = "flex";
    hideButton.style.display = "none";
    badge.style.display = "flex";

    // Add a subtle animation
    overlay.animate(
      [
        { backdropFilter: "blur(0px)" },
        { backdropFilter: `blur(${styleSettings.blur.blurValue}px)` },
      ],
      {
        duration: 300,
        easing: "ease-in",
      },
    );
  }, styleSettings);

  // Add hover effect to the entire overlay
  overlay.addEventListener("mouseenter", () => {
    showButton.style.opacity = "1";
    badge.style.opacity = "1";
  });

  overlay.addEventListener("mouseleave", () => {
    showButton.style.opacity = "0.8";
    badge.style.opacity = "0.8";
  });

  buttonContainer.appendChild(showButton);
  buttonContainer.appendChild(hideButton);
  buttonContainer.appendChild(badge);
  overlay.appendChild(buttonContainer);

  return overlay;
};
