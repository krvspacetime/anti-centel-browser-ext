/**
 * Overlay components for tweets
 */

import { Tags } from "../../types/targets";
import { StyleSettings } from "../../types/settings";
import { createElement } from "../../utils/domUtils";
import { removeFromWatchlist } from "../../features/watchlist/watchlistActions";

/**
 * Create a tweet overlay for blur effect
 * @param blurValue The blur value to apply
 * @returns The created overlay element
 */
export function createTweetOverlay(blurValue: number): HTMLElement {
  const overlay = createElement("div", "", "tweet-overlay");

  // Apply blur effect
  overlay.style.backdropFilter = `blur(${blurValue}px)`;

  return overlay;
}

/**
 * Create an overlay with a remove button
 * @param handle The handle associated with the tweet
 * @param tag The tag associated with the handle
 * @param styleSettings The current style settings
 * @returns The created overlay with remove button
 */
export function OverlayWithRemoveButton(
  handle: string,
  tag: Tags,
  styleSettings: StyleSettings,
): HTMLElement {
  // Create container
  const container = createElement("div", "", "overlay-with-remove-button");
  container.style.position = "absolute";
  container.style.top = "4px";
  container.style.right = "4px";
  container.style.zIndex = "3";

  // Create remove button
  const removeButton = createElement(
    "button",
    "Remove from Watchlist",
    "remove-watchlist-button",
  );

  // Style button based on theme
  const isDarkTheme = styleSettings.theme === "dark";
  removeButton.style.backgroundColor = isDarkTheme ? "#333333" : "#f0f0f0";
  removeButton.style.color = isDarkTheme ? "#FFFFFF" : "#000000";
  removeButton.style.border =
    "1px solid " + (isDarkTheme ? "#555555" : "#cccccc");
  removeButton.style.borderRadius = "4px";
  removeButton.style.padding = "4px 8px";
  removeButton.style.fontSize = "12px";
  removeButton.style.cursor = "pointer";

  // Add click handler
  removeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    removeFromWatchlist(handle);
  });

  // Add tag indicator
  const tagIndicator = createElement("span", `[${tag}]`, "tag-indicator");
  tagIndicator.style.marginRight = "8px";
  tagIndicator.style.fontSize = "12px";
  tagIndicator.style.color = isDarkTheme ? "#FFFFFF" : "#000000";

  // Append elements to container
  container.appendChild(tagIndicator);
  container.appendChild(removeButton);

  return container;
}
