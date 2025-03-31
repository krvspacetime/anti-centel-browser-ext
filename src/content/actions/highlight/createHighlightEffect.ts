import { StyleSettings } from "../../types/settings";

export function createHighlightEffect(
  tweet: HTMLElement,
  styleSettings: StyleSettings,
): void {
  if (!tweet.classList.contains("tweet-highlighted")) {
    tweet.classList.add("tweet-highlighted");

    // Apply inline styles to ensure they persist when scrolling
    const highlightThickness = styleSettings.highlight.highlighThickness;
    const highlightColor = styleSettings.highlight.highlightColor;
    const highlightBorderRadius = styleSettings.highlight.highlightBorderRadius;
    const glowStrength = styleSettings.highlight.glowStrength;

    tweet.style.outline = `${highlightThickness}px solid ${highlightColor}`;
    tweet.style.borderRadius = `${highlightBorderRadius}px`;
    tweet.style.boxShadow = `0 0 ${glowStrength}px ${highlightColor}`;
  }
}
