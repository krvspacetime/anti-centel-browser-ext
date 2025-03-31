import { StyleSettings } from "../../types/settings";
import { Tags } from "../../types/targets";
import { getTagIcon } from "../../utils/iconUtils";

export const createTweetBadge = (
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
