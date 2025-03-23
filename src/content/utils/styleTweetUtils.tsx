import { tagIconMapper } from "../data";
import { StyleSettings } from "../types";

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
    background: ${isDarkTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"};
    pointer-events: auto;
    backdrop-filter: blur(${blurValue}px);
    outline: 1px solid ${isDarkTheme ? "gold" : "#1da1f2"};
    pointer-events: none;
    z-index: 2
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
  showIcon.setAttribute("width", "24");
  showIcon.setAttribute("height", "24");
  showIcon.setAttribute("fill", isDarkTheme ? "white" : "black");

  // Create the path for the eye icon
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm6.3-6.73L15.46 5.35c-.78-.78-2.05-.78-2.83 0l-1.83 1.83c-.39.39-.39 1.02 0 1.41l1.59 1.59c.39.39 1.02.39 1.41 0l4.54-4.54c.39-.39.39-1.02 0-1.41l-1.24-1.24c-.39-.39-1.02-.39-1.41 0zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z",
  );
  showIcon.appendChild(path);

  // Create the text label
  const text = document.createElement("span");
  text.textContent = "Show";
  text.style.cssText = `
    margin-left: 8px;
    font-size: 14px;
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
    gap: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background: ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    outline: ${isDarkTheme ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
    color: ${isDarkTheme ? "white" : "black"};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.2s ease;
    font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  `;

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
  hideIcon.setAttribute("width", "24");
  hideIcon.setAttribute("height", "24");
  hideIcon.setAttribute("fill", isDarkTheme ? "white" : "black");

  // Create the path for the eye-slash icon
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm6.3 6.73L15.46 5.35c-.78-.78-2.05-.78-2.83 0l-1.83 1.83c-.39.39-.39 1.02 0 1.41l1.59 1.59c.39.39 1.02.39 1.41 0l4.54-4.54c.39-.39.39-1.02 0-1.41l-1.24-1.24c-.39-.39-1.02-.39-1.41 0zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9z",
  );
  hideIcon.appendChild(path);

  // Create the text label
  const text = document.createElement("span");
  text.textContent = "Hide";
  text.style.cssText = `
    margin-left: 8px;
    font-size: 14px;
    color: ${isDarkTheme ? "white" : "black"};
  `;

  // Add both elements to the button
  hideTweetButton.appendChild(hideIcon);
  hideTweetButton.appendChild(text);

  hideTweetButton.style.cssText = `
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background: ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    outline: ${isDarkTheme ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"};
    color: ${isDarkTheme ? "white" : "black"};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.2s ease;
    font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  `;

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
    top: 1%;
    right: 1%;
    background: transparent;
    color: ${isDarkTheme ? "white" : "black"};
    padding: 4px 8px;
    border-radius: 4px;
    text-align: center;
    font-size: 11px;
    pointer-events: auto;
    z-index: 3;
  `;

  const tweetBadge = document.createElement("div");
  tweetBadge.innerHTML = tagIconMapper(tag);
  tweetBadge.className = "tweet-badge";

  // Create tooltip element
  const tooltip = document.createElement("div");
  const categoryLabel = tag.replace("_", " ").split(" ");
  const upperCaseCategoryLabel = categoryLabel.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  tooltip.textContent = `${handle} - ${upperCaseCategoryLabel.join(" ")}`; // Set tooltip text to the tag
  tooltip.className = "tag-overlay-tooltip"; // Add a class for styling
  tooltip.style.alignItems = "center";
  tooltip.style.justifyContent = "center";
  tooltip.style.cssText = `
    visibility: visible;
    font-size: 0.4 rem;
    background-color: ${isDarkTheme ? "black" : "#1da1f2"};
    color: ${isDarkTheme ? "white" : "white"};
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    z-index: 3;
    margin-right: 10px;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s linear;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
  `;

  badgeContainer.appendChild(tweetBadge);
  badgeContainer.appendChild(tooltip); // Append tooltip to the badge

  tweetBadge.addEventListener("mouseover", () => {
    console.log("tooltip in");
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1"; // Show tooltip
  });

  tweetBadge.addEventListener("mouseout", () => {
    console.log("tooltip out");
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0"; // Hide tooltip
  });

  return badgeContainer;
};

const createButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: row;
    flex-direction: column;
    gap: 2px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background: transparent;
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
    overlay.style.backdropFilter = `blur(0px)`;
    showButton.style.display = "none";
    hideButton.style.display = "block";
    badge.style.display = "none";
  }, styleSettings);

  const hideButton = createHideTweetButton(() => {
    overlay.style.backdropFilter = `blur(${styleSettings.blur.blurValue}px)`; // Use blur value from styleSettings
    showButton.style.display = "block";
    hideButton.style.display = "none";
    badge.style.display = "block";
  }, styleSettings);

  overlay.appendChild(buttonContainer);
  buttonContainer.appendChild(showButton);
  buttonContainer.appendChild(hideButton);
  buttonContainer.appendChild(badge);
  return overlay;
};
