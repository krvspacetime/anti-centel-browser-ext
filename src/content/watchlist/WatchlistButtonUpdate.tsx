import { TargetHandle, StyleSettings, Tags } from "../types";
import { tagIconMapper, DEFAULT_WATCHLIST_MONITOR_TEXT } from "../data";
import { getTagIcon } from "../utils/iconUtils";
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

  // Define theme colors
  const colors = {
    // Text colors
    textDark: "#e0e0e0",
    textLight: "#333333",

    // Button colors (unselected)
    buttonBgDark: "#2d2d2d",
    buttonBgLight: "#f0f0f0",
    buttonTextDark: "#e0e0e0",
    buttonTextLight: "#333333",
    buttonBorderDark: "#404040",
    buttonBorderLight: "#cccccc",

    // Button colors (selected/hover)
    selectedButtonBgDark: "#0d47a1",
    selectedButtonBgLight: "#1976d2",
    selectedButtonText: "#ffffff",

    // Tooltip colors
    tooltipBgDark: "#2d2d2d",
    tooltipBgLight: "#ffffff",
    tooltipTextDark: "#e0e0e0",
    tooltipTextLight: "#333333",
  };

  // Set initial transparent background immediately
  button.style.cssText = `
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    line-height: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    font-weight: 500;
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
    button.style.color = isDarkTheme ? colors.textDark : colors.textLight;

    // Set up hover states
    if (isInTargetList) {
      const span = document.createElement("span");

      // Get the SVG icon for the tag
      const iconSvg = getTagIcon(tag as Tags);

      span.style.cssText = `
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
      `;

      // Create icon container
      const iconContainer = document.createElement("div");
      iconContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
      `;
      iconContainer.innerHTML = iconSvg;

      // Set icon color
      const svgElement = iconContainer.querySelector("svg");
      if (svgElement) {
        svgElement.style.fill = isDarkTheme
          ? colors.textDark
          : colors.textLight;
        svgElement.style.width = "16px";
        svgElement.style.height = "16px";
      }

      // Create text element
      const textElement = document.createElement("span");
      textElement.textContent = tagUpper;

      // Clear existing children and append the new elements
      button.innerHTML = ""; // Clear existing content
      span.appendChild(iconContainer);
      span.appendChild(textElement);
      button.appendChild(span);

      const handleMouseEnter = () => {
        // Create remove icon and text
        button.innerHTML = "";

        const removeSpan = document.createElement("span");
        removeSpan.style.cssText = `
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        `;

        const removeIconContainer = document.createElement("div");
        removeIconContainer.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        `;
        removeIconContainer.innerHTML = eyeOffSvg;

        // Set icon color
        const removeSvg = removeIconContainer.querySelector("svg");
        if (removeSvg) {
          removeSvg.style.fill = colors.selectedButtonText;
          removeSvg.style.width = "16px";
          removeSvg.style.height = "16px";
        }

        const removeText = document.createElement("span");
        removeText.textContent = "Remove";

        removeSpan.appendChild(removeIconContainer);
        removeSpan.appendChild(removeText);
        button.appendChild(removeSpan);

        button.style.backgroundColor = isDarkTheme
          ? colors.selectedButtonBgDark
          : colors.selectedButtonBgLight;
        button.style.color = colors.selectedButtonText;
      };

      const handleMouseLeave = () => {
        button.innerHTML = "";

        const span = document.createElement("span");
        span.style.cssText = `
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        `;

        const iconContainer = document.createElement("div");
        iconContainer.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        `;
        iconContainer.innerHTML = iconSvg;

        // Set icon color
        const svgElement = iconContainer.querySelector("svg");
        if (svgElement) {
          svgElement.style.fill = isDarkTheme
            ? colors.textDark
            : colors.textLight;
          svgElement.style.width = "16px";
          svgElement.style.height = "16px";
        }

        const textElement = document.createElement("span");
        textElement.textContent = tagUpper;

        span.appendChild(iconContainer);
        span.appendChild(textElement);
        button.appendChild(span);

        button.style.backgroundColor = "transparent";
        button.style.color = isDarkTheme ? colors.textDark : colors.textLight;
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      button.onmouseenter = handleMouseEnter;
      button.onmouseleave = handleMouseLeave;
    } else {
      // Create add button with icon
      const addSpan = document.createElement("span");
      addSpan.style.cssText = `
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
      `;

      const addIconContainer = document.createElement("div");
      addIconContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
      `;

      // Use a plus icon SVG
      addIconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;

      // Set icon color
      const addSvg = addIconContainer.querySelector("svg");
      if (addSvg) {
        addSvg.style.fill = isDarkTheme ? colors.textDark : colors.textLight;
      }

      const addText = document.createElement("span");
      addText.textContent = "Add";

      // Clear existing content
      button.innerHTML = "";

      addSpan.appendChild(addIconContainer);
      addSpan.appendChild(addText);
      button.appendChild(addSpan);

      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = isDarkTheme
          ? colors.buttonBgDark
          : colors.buttonBgLight;

        // Update icon color on hover
        const svg = button.querySelector("svg");
        if (svg) {
          svg.style.fill = isDarkTheme
            ? colors.selectedButtonBgLight
            : colors.selectedButtonBgDark;
        }

        // Update text color on hover
        const textSpan = button.querySelector("span > span") as HTMLElement;
        if (textSpan) {
          textSpan.style.color = isDarkTheme
            ? colors.selectedButtonBgLight
            : colors.selectedButtonBgDark;
        }
      });

      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "transparent";

        // Reset icon color
        const svg = button.querySelector("svg");
        if (svg) {
          svg.style.fill = isDarkTheme ? colors.textDark : colors.textLight;
        }

        // Reset text color
        const textSpan = button.querySelector("span > span") as HTMLElement;
        if (textSpan) {
          textSpan.style.color = isDarkTheme
            ? colors.textDark
            : colors.textLight;
        }
      });
    }
  });
};
