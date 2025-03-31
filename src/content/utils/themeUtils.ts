import { TWEET_ARTICLE_QUERY_SELECTOR } from "../constants/selectors";
import { highlightTargetAccounts } from "../utils/index";

/**
 * Initializes the theme detection and observer
 */

/**
 * Detects the current theme from the HTML tag and sets it in storage
 */
/**
 * Detects the current theme from the HTML tag and sets it in storage
 */
export const detectAndSetTheme = (): void => {
  // Initial theme detection
  console.log("Detecting theme...");
  const currentTheme = getCurrentTheme();
  updateThemeInStorage(currentTheme);

  // Set up observer for theme changes
  const htmlElement = document.documentElement;
  const themeObserver = new MutationObserver((mutations) => {
    console.log("MutationObserver triggered", mutations);
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style" &&
        mutation.target === htmlElement
      ) {
        console.log("Style attribute changed");
        const newTheme = getCurrentTheme();
        updateThemeInStorage(newTheme);
      }
    });
  });

  // Start observing the HTML element for style attribute changes
  themeObserver.observe(htmlElement, {
    attributes: true,
    attributeFilter: ["style"],
  });
  console.log("Theme observer set up");
};

/**
 * Gets the current theme from the HTML element's color-scheme attribute
 */
function getCurrentTheme(): "dark" | "light" {
  console.log("Getting current theme...");
  const htmlElement = document.documentElement;
  const styleAttribute = htmlElement.getAttribute("style") || "";
  console.log("Style attribute:", styleAttribute);

  // Check if the color-scheme is specified in the style attribute
  if (styleAttribute.includes("color-scheme: dark")) {
    console.log("dark");
    return "dark";
  } else if (styleAttribute.includes("color-scheme: light")) {
    console.log("light");
    return "light";
  }

  // Default to dark if not specified
  console.log("No color-scheme found, defaulting to dark");
  return "dark";
}

/**
 * Updates the theme in storage and refreshes styles if needed
 */
function updateThemeInStorage(theme: "dark" | "light"): void {
  chrome.storage.sync.get("styleSettings", (data) => {
    let styleSettings = data.styleSettings || {};
    console.log("Current styleSettings:", styleSettings);

    // Initialize styleSettings with default values if it's empty
    if (!styleSettings.theme) {
      styleSettings = {
        theme: theme,
        hideUserDetails: true,
        blur: {
          blurValue: 5,
        },
        highlight: {
          highlightColor: "#1DA1F2",
          highlightThickness: 2,
          highlightBorderRadius: 4,
          glowStrength: 5,
        },
        hide: {
          hiddenTweetBlurValue: 5,
          blurHiddenTweetsOnUncollpase: true,
          collapsedTweetUsernameColor: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      };
      console.log("Initialized default styleSettings:", styleSettings);
    } else {
      // Only update if the theme has changed
      if (styleSettings.theme !== theme) {
        console.log(`Theme changed to: ${theme}`);

        // Update the theme in storage
        styleSettings.theme = theme;

        // Adjust icon and text colors based on theme
        if (theme === "dark") {
          // Dark theme settings
          styleSettings.highlight.highlightColor =
            styleSettings.highlight.highlightColor || "#1DA1F2";
          styleSettings.hide.collapsedTweetUsernameColor =
            styleSettings.hide.collapsedTweetUsernameColor || "#FFFFFF";
        } else {
          // Light theme settings
          styleSettings.highlight.highlightColor =
            styleSettings.highlight.highlightColor || "#1DA1F2";
          styleSettings.hide.collapsedTweetUsernameColor =
            styleSettings.hide.collapsedTweetUsernameColor || "#000000";
        }
      }

      // Ensure hideUserDetails exists (might be missing in older saved settings)
      if (styleSettings.hideUserDetails === undefined) {
        styleSettings.hideUserDetails = false; // Default value from styleDefaults.ts
        console.log("Added missing hideUserDetails property:", styleSettings);
      }
    }

    // Save the updated styleSettings back to storage
    chrome.storage.sync.set({ styleSettings }, () => {
      console.log("Updated styleSettings in storage:", styleSettings);
      // Refresh all styled elements to apply the new theme
      document
        .querySelectorAll<HTMLElement>(TWEET_ARTICLE_QUERY_SELECTOR)
        .forEach((tweet) => {
          tweet.dataset.processed = "false"; // Reset processed state
        });

      // Re-apply styles with the new theme
      highlightTargetAccounts();
    });
  });
}
