import { updateWatchlistButtonState } from "./components/watchlist/updateWatchlistButtonState";

import { TargetHandle } from "./types/targets";
import { TWEET_ARTICLE_QUERY_SELECTOR } from "./constants/selectors";
import { highlightTargetAccounts, styleTargetTweets } from "./utils/tweetUtils";

// Initial setup and mutation observer
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  highlightTargetAccounts();
  detectAndSetTheme();
});

// Observer for tweet changes
new MutationObserver(highlightTargetAccounts).observe(document, {
  subtree: true,
  childList: true,
});

// Add storage change listener
chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetHandles) {
    const targetHandles = changes.targetHandles.newValue || [];
    console.log(targetHandles);
    // Update all watchlist buttons
    document
      .querySelectorAll<HTMLElement>(".watchlist-button")
      .forEach((button) => {
        const handle = button.dataset.handle;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th: TargetHandle) => th.handle === handle,
          );
          updateWatchlistButtonState(button, isInTargetList, targetHandles);
        }
      });
  }

  if (changes.styleSettings) {
    console.log("Style settings changed:", changes.styleSettings.newValue);
    // Re-apply styles with the new theme
    document
      .querySelectorAll<HTMLElement>(TWEET_ARTICLE_QUERY_SELECTOR)
      .forEach((tweet) => {
        tweet.dataset.processed = "false"; // Reset processed state
      });

    // Re-apply styles with the new theme
    highlightTargetAccounts();
  }
});

// Run theme detection immediately
detectAndSetTheme();

/**
 * Detects the current theme from the HTML tag and sets it in storage
 */
function detectAndSetTheme(): void {
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
}

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

// Hide user details
function hideUserDetails() {
  console.log("Trying to hide user details ...");

  // First try to remove it directly
  const userDetailContainer = document.querySelector(
    "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > header > div > div > div > div.css-175oi2r.r-184id4b",
  ) as HTMLElement;
  const whatsHappeningImg = document.querySelector(
    "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-kemksi.r-1kqtdi0.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div.css-175oi2r.r-kemksi.r-184en5c > div > div.css-175oi2r.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-175oi2r.r-18kxxzh.r-1wron08.r-onrtq4.r-ttdzmv > div",
  ) as HTMLElement;

  if (userDetailContainer && whatsHappeningImg) {
    console.log("User details found.");
    userDetailContainer.style.display = "none";
    whatsHappeningImg.style.display = "none";
    console.log("User details removed.");
    return;
  }

  if (userDetailContainer === null && whatsHappeningImg === null) {
    console.log("User details not found.");
  }

  // If not found, set up observer
  const observer = new MutationObserver(() => {
    const container = document.querySelector(
      "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > header > div > div > div > div.css-175oi2r.r-184id4b",
    ) as HTMLElement;
    const whatsHappeningImg = document.querySelector(
      "#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-14lw9ot.r-jxzhtn.r-1ua6aaf.r-th6na.r-1phboty.r-16y2uox.r-184en5c.r-1abdc3e.r-1lg4w6u.r-f8sm7e.r-13qz1uu.r-1ye8kvj > div > div.css-175oi2r.r-14lw9ot.r-184en5c > div > div.css-175oi2r.r-1h8ys4a > div:nth-child(1) > div > div > div > div.css-175oi2r.r-18kxxzh.r-1wron08.r-onrtq4.r-ttdzmv > div",
    ) as HTMLElement;

    if (container && whatsHappeningImg) {
      container.style.display = "none";
      whatsHappeningImg.style.display = "none";
      console.log("User details removed.");
      observer.disconnect();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}

// Initialize the extension
function init() {
  console.log("Anti-Centel extension initialized");

  // Get styleSettings first, then initialize everything else
  chrome.storage.sync.get("styleSettings", (data) => {
    const styleSettings = data.styleSettings || {};

    // Ensure hideUserDetails exists with a default value if it's missing
    if (styleSettings.hideUserDetails === undefined) {
      styleSettings.hideUserDetails = false; // Default from styleDefaults.ts

      // Save the updated settings back to storage
      chrome.storage.sync.set({ styleSettings }, () => {
        console.log(
          "Added missing hideUserDetails to styleSettings:",
          styleSettings,
        );
      });
    }

    // Continue with other initialization
    detectAndSetTheme();
    highlightTargetAccounts();

    // Call hideUserDetails if enabled
    if (styleSettings.hideUserDetails) {
      hideUserDetails();
    }

    // Set up a MutationObserver to detect new tweets and user details
    const observer = new MutationObserver((mutations) => {
      let shouldHighlight = false;
      let shouldHideUserDetails = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (
                element.querySelector &&
                element.querySelector(TWEET_ARTICLE_QUERY_SELECTOR)
              ) {
                shouldHighlight = true;
              }
              // Check for user details elements
              if (
                element.querySelector &&
                (element.querySelector('[data-testid="UserCell"]') ||
                  element.querySelector('[data-testid="UserAvatar"]'))
              ) {
                shouldHideUserDetails = true;
              }
            }
          });
        }
      });

      if (shouldHighlight) {
        highlightTargetAccounts();
      }

      // Only call hideUserDetails if it's enabled in settings
      if (shouldHideUserDetails && styleSettings.hideUserDetails) {
        hideUserDetails();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial call to hide user details if enabled
    if (styleSettings.hideUserDetails) {
      hideUserDetails();
    }

    // Set up an intersection observer to ensure styles are maintained when tweets come into view
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tweet = entry.target as HTMLElement;
          // Only reapply styles if the tweet has been processed before
          if (tweet.dataset.stylingState) {
            const [isInTargetList, handle] =
              tweet.dataset.stylingState.split("-");
            // Ensure classes are still applied
            if (isInTargetList === "true") {
              if (
                tweet.classList.contains("tweet-hidden") ||
                tweet.classList.contains("tweet-highlighted")
              ) {
                // Classes are still there, but we need to ensure inline styles are also applied
                // Reapply styles to ensure they persist
                tweet.dataset.processed = "false";
                styleTargetTweets(true, tweet, handle);
              } else {
                // Classes were removed, reapply by resetting processed state
                tweet.dataset.processed = "false";
                styleTargetTweets(true, tweet, handle);
              }
            }
          }
        }
      });
    });

    // Observe all tweet articles
    document.querySelectorAll(TWEET_ARTICLE_QUERY_SELECTOR).forEach((tweet) => {
      intersectionObserver.observe(tweet);
    });
  });
}

init();
