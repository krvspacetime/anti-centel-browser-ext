/**
 * Service for handling theme detection and updates
 */

import { loadStyleSettings, saveStyleSettings } from './storageService';
import { DARK_THEME_SELECTOR, LIGHT_THEME_SELECTOR } from '../constants/selectors';

/**
 * Initialize theme detection and set up observers
 */
export function initTheme(): void {
  detectAndSetTheme();
  
  // Set up observer for theme changes
  const observer = new MutationObserver(() => {
    detectAndSetTheme();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style']
  });
}

/**
 * Detect the current theme and update storage if needed
 */
export async function detectAndSetTheme(): Promise<void> {
  const theme = getCurrentTheme();
  await updateThemeInStorage(theme);
}

/**
 * Get the current theme from the HTML element's color-scheme attribute
 * @returns The current theme ("dark" or "light")
 */
export function getCurrentTheme(): "dark" | "light" {
  const htmlElement = document.documentElement;
  const styleAttribute = htmlElement.getAttribute("style") || "";
  
  if (styleAttribute.includes(DARK_THEME_SELECTOR)) {
    console.log("dark");
    return "dark";
  } else if (styleAttribute.includes(LIGHT_THEME_SELECTOR)) {
    console.log("light");
    return "light";
  }

  // Default to dark if not specified
  console.log("No color-scheme found, defaulting to dark");
  return "dark";
}

/**
 * Update the theme in storage and refresh styles if needed
 * @param theme The theme to set ("dark" or "light")
 */
async function updateThemeInStorage(theme: "dark" | "light"): Promise<void> {
  const styleSettings = await loadStyleSettings();
  
  // Only update if the theme has changed
  if (styleSettings.theme !== theme) {
    console.log(`Theme changed to: ${theme}`);

    // Update the theme in storage
    styleSettings.theme = theme;

    // Adjust icon and text colors based on theme
    if (theme === "dark") {
      // Dark theme adjustments
      if (styleSettings.highlight && styleSettings.highlight.highlightColor === "#1DA1F2") {
        styleSettings.highlight.highlightColor = "#FFFFFF";
      }
      
      if (styleSettings.hide && styleSettings.hide.collapsedTweetUsernameColor) {
        styleSettings.hide.collapsedTweetUsernameColor = "#FFFFFF";
      }
    } else {
      // Light theme adjustments
      if (styleSettings.highlight && styleSettings.highlight.highlightColor === "#FFFFFF") {
        styleSettings.highlight.highlightColor = "#1DA1F2";
      }
      
      if (styleSettings.hide && styleSettings.hide.collapsedTweetUsernameColor) {
        styleSettings.hide.collapsedTweetUsernameColor = "#000000";
      }
    }
    
    // Save the updated settings
    await saveStyleSettings(styleSettings);
  } else {
    console.log(`Theme unchanged: ${theme}`);
  }
}
