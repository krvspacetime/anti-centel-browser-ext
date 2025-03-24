/**
 * Feature for styling tweets based on target actions
 */

import { StyleSettings } from "../../types/settings";
import { TargetHandle } from "../../types/targets";
import { createWatchlistButtons } from "../watchlist";
import {
  createTweetOverlay,
  CollapsedIndicator,
  OverlayWithRemoveButton,
} from "../../components/ui";

/**
 * Style a tweet based on the target handle action
 * @param isInTargetList Whether the tweet is from a target account
 * @param tweet The tweet element to style
 * @param handle The handle of the tweet author
 * @param targetHandle The target handle information (if in target list)
 * @param styleSettings The current style settings
 */
export function styleTweet(
  isInTargetList: boolean,
  tweet: HTMLElement,
  handle: string | null,
  targetHandle: TargetHandle | null,
  styleSettings: StyleSettings,
): void {
  // Skip if no handle
  if (!handle) {
    return;
  }

  // Remove any existing styling
  removeExistingStyles(tweet);

  // If not in target list, we're done
  if (!isInTargetList || !targetHandle) {
    return;
  }

  // Apply styling based on the action
  switch (targetHandle.action) {
    case "blur":
      applyBlurStyle(tweet, targetHandle, styleSettings);
      break;
    case "highlight":
      applyHighlightStyle(tweet, styleSettings);
      break;
    case "hide":
      applyHideStyle(tweet, targetHandle, styleSettings);
      break;
    case "monitor":
      // No visual styling for monitor, just add the buttons
      break;
  }

  // Add watchlist buttons to all target tweets
  const handleElement = findHandleElement(tweet, handle);
  if (handleElement) {
    createWatchlistButtons(tweet, handleElement, handle);
  }
}

/**
 * Remove existing styles from a tweet
 * @param tweet The tweet element
 */
function removeExistingStyles(tweet: HTMLElement): void {
  // Remove overlay
  const existingOverlay = tweet.querySelector(".tweet-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Remove collapsed indicator
  const existingCollapsedIndicator = tweet.querySelector(".collapse-indicator");
  if (existingCollapsedIndicator) {
    existingCollapsedIndicator.remove();
  }

  // Remove watchlist buttons
  const existingButtonContainer = tweet.querySelector(
    ".watchlist-button-container",
  );
  if (existingButtonContainer) {
    existingButtonContainer.remove();
  }

  // Remove any inline styles
  tweet.style.outline = "";
  tweet.style.borderRadius = "";
  tweet.style.position = "";
  tweet.style.height = "";
  tweet.style.overflow = "";
  tweet.style.transition = "";
  tweet.classList.remove("tweet-hidden");
}

/**
 * Apply blur styling to a tweet
 * @param tweet The tweet element
 * @param targetHandle The target handle information
 * @param styleSettings The current style settings
 */
function applyBlurStyle(
  tweet: HTMLElement,
  targetHandle: TargetHandle,
  styleSettings: StyleSettings,
): void {
  // Set position for overlay
  tweet.style.position = "relative";

  // Create and append overlay
  const overlay = createTweetOverlay(styleSettings.blur.blurValue);
  tweet.appendChild(overlay);

  // Add remove button
  const removeButton = OverlayWithRemoveButton(
    targetHandle.handle,
    targetHandle.tag,
    styleSettings,
  );
  tweet.appendChild(removeButton);
}

/**
 * Apply highlight styling to a tweet
 * @param tweet The tweet element
 * @param styleSettings The current style settings
 */
function applyHighlightStyle(
  tweet: HTMLElement,
  styleSettings: StyleSettings,
): void {
  // Apply outline
  tweet.style.outline = `${styleSettings.highlight.highlighThickness}px solid ${styleSettings.highlight.highlightColor}`;
  tweet.style.borderRadius = `${styleSettings.highlight.highlightBorderRadius}px`;

  // Apply box-shadow for glow effect if enabled
  if (styleSettings.highlight.glowStrength > 0) {
    tweet.style.boxShadow = `0 0 ${styleSettings.highlight.glowStrength}px ${styleSettings.highlight.highlightColor}`;
  }
}

/**
 * Apply hide styling to a tweet
 * @param tweet The tweet element
 * @param targetHandle The target handle information
 * @param styleSettings The current style settings
 */
function applyHideStyle(
  tweet: HTMLElement,
  targetHandle: TargetHandle,
  styleSettings: StyleSettings,
): void {
  // Add collapsed indicator
  const collapseIndicator = CollapsedIndicator(
    targetHandle.handle,
    targetHandle.tag,
    styleSettings,
  );

  // Insert before the tweet content
  tweet.insertBefore(collapseIndicator, tweet.firstChild);

  // Add class for CSS styling
  tweet.classList.add("tweet-hidden");

  // Set initial height to 0
  tweet.style.height = "0px";
  tweet.style.overflow = "hidden";
}

/**
 * Find the handle element within a tweet
 * @param tweet The tweet element
 * @param handle The handle to find
 * @returns The handle element or null if not found
 */
function findHandleElement(tweet: HTMLElement, handle: string): Element | null {
  const spans = tweet.querySelectorAll("span");
  for (const span of spans) {
    if (span.textContent === handle) {
      return span;
    }
  }
  return null;
}
