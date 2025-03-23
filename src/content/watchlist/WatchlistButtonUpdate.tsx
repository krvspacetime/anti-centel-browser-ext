import { TargetHandle, StyleSettings } from "../types";
import { tagIconMapper, DEFAULT_WATCHLIST_MONITOR_TEXT } from "../data";

import { eyeOffSvg } from "../../icons/icons";

export const updateButtonState = (
  button: HTMLElement,
  isInTargetList: boolean,
  targetHandles?: TargetHandle[],
) => {
  const handle = button.dataset.handle;
  const targetInfo = targetHandles?.find((th) => th.handle === handle);
  const tag = targetInfo?.tag ?? "on_watchlist";
  const tagLabel = tag.split("_").join(" ");
  const tagUpper = tagLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Set initial transparent background immediately
  button.style.cssText = `
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    line-height: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
  `;

  // Remove existing event listeners first
  const oldMouseEnter = button.onmouseenter;
  const oldMouseLeave = button.onmouseleave;
  if (oldMouseEnter) button.removeEventListener("mouseenter", oldMouseEnter);
  if (oldMouseLeave) button.removeEventListener("mouseleave", oldMouseLeave);

  button.dataset.originalText = isInTargetList
    ? `${tagUpper} ${tagIconMapper(tag)}`
    : DEFAULT_WATCHLIST_MONITOR_TEXT;
  button.innerHTML =
    button.dataset.originalText ?? DEFAULT_WATCHLIST_MONITOR_TEXT;

  // Get current theme from storage
  chrome.storage.sync.get("styleSettings", (data) => {
    const styleSettings = (data.styleSettings as StyleSettings) || {
      theme: "dark",
    };
    const isDarkTheme = styleSettings.theme === "dark";

    // Update text color based on theme
    button.style.color = isDarkTheme ? "white" : "black";

    // Set up hover states
    if (isInTargetList) {
      const span = document.createElement("span");
      span.innerHTML = `${tagUpper} ${tagIconMapper(tag)}`;
      span.style.cssText = `
        display: flex;
        align-items: center;
        gap: 2px;
        font-weight: bold;
      `;

      // Clear existing children and append the new span
      button.innerHTML = ""; // Clear existing content
      button.appendChild(span);

      const handleMouseEnter = () => {
        button.innerHTML = eyeOffSvg + " Remove";
        button.style.backgroundColor = isDarkTheme ? "#ffffff" : "#1da1f2";
        button.style.color = isDarkTheme ? "black" : "white";
        button.style.fontWeight = "bold";
      };

      const handleMouseLeave = () => {
        button.innerHTML = `${tagUpper} ${tagIconMapper(tag)}`;
        button.style.backgroundColor = "transparent";
        button.style.color = isDarkTheme ? "white" : "black";
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      button.onmouseenter = handleMouseEnter;
      button.onmouseleave = handleMouseLeave;
    } else {
      const tooltip = document.createElement("div");
      tooltip.innerText = "Add user";

      button.onmouseenter = null;
      button.onmouseleave = null;
      button.innerHTML = DEFAULT_WATCHLIST_MONITOR_TEXT;
      
      tooltip.style.cssText = `
        position: absolute;
        right: -55px;
        bottom: -10px;
        visibility: hidden;
        background-color: ${isDarkTheme ? "white" : "#1da1f2"};
        color: ${isDarkTheme ? "black" : "white"};
        z-index: 1000;
        padding: 1px 3px;
        border-radius: 2px;
      `;
      button.appendChild(tooltip);

      button.addEventListener("mouseenter", () => {
        tooltip.style.visibility = "visible";
        button.style.backgroundColor = isDarkTheme ? "#1da1f2" : "#e8f5fd";
        button.style.color = isDarkTheme ? "white" : "#1da1f2";
      });

      button.addEventListener("mouseleave", () => {
        tooltip.style.visibility = "hidden";
        button.style.backgroundColor = "transparent";
        button.style.color = isDarkTheme ? "white" : "black";
      });
    }
  });
};
