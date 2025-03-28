import {
  WatchlistButton,
  WatchlistButtonContainer,
} from "./watchlist/WatchlistButton";

import { updateButtonState } from "./watchlist/WatchlistButtonUpdate";

import { Tags, TargetHandle } from "./types";
import { CollapsedIndicator } from "./actions/hide/CollapsedIndicator";
import { OverlayWithRemoveButton } from "./utils/styleTweetUtils";
import { extractHandleFromTweet } from "./utils/tweetUtils";
import { createCategoryModal } from "./components/modals/createCategoryModal";

const TWEET_ARTICLE_QUERY_SELECTOR = 'article[role="article"]';
const TWEET_HANDLE_QUERY_SELECTOR = 'a[role="link"] span';

function refreshTweetStyles(handle: string): void {
  document
    .querySelectorAll<HTMLElement>(TWEET_ARTICLE_QUERY_SELECTOR)
    .forEach((tweet) => {
      const tweetHandle = extractHandleFromTweet(tweet);
      if (tweetHandle === handle) {
        tweet.dataset.processed = "false"; // Reset processed state
        styleTargetTweets(true, tweet, handle);
      }
    });
}

export async function handleWatchlistAction(handle: string): Promise<void> {
  chrome.storage.sync.get(["targetHandles", "styleSettings"], async (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const styleSettings = data.styleSettings;

    if (!targetHandles.some((th) => th.handle === handle)) {
      const targetInfo = await createCategoryModal(handle, styleSettings);

      if (targetInfo) {
        const newHandle: TargetHandle = {
          handle,
          tag: targetInfo.tag,
          action: targetInfo.action,
        };

        const newHandles = [...targetHandles, newHandle];
        chrome.storage.sync.set({ targetHandles: newHandles }, () => {
          chrome.runtime.sendMessage({
            type: "updateHandles",
            data: newHandles,
          });
          refreshTweetStyles(handle);
        });
      }
    } else {
      const newHandles = targetHandles.filter((th) => th.handle !== handle);

      chrome.storage.sync.set({ targetHandles: newHandles }, () => {
        // console.log(`${handle} removed from target list.`);
        chrome.runtime.sendMessage({
          type: "updateHandles",
          data: newHandles,
        });
        highlightTargetAccounts();
      });
    }
  });
}

function styleTargetTweets(
  isInTargetList: boolean,
  tweet: HTMLElement,
  handle?: string | null,
): void {
  // Check for a data attribute that indicates this tweet has already been processed
  // with the same styling state to avoid reapplying styles unnecessarily
  const currentState = tweet.dataset.stylingState;
  if (currentState === `${isInTargetList}-${handle}`) {
    return;
  }

  // Mark this tweet as processed with the current styling state
  tweet.dataset.processed = "true";
  tweet.dataset.stylingState = `${isInTargetList}-${handle}`;

  // If handle wasn't provided, try to extract it
  if (!handle) {
    handle = extractHandleFromTweet(tweet);
  }

  chrome.storage.sync.get(["targetHandles", "styleSettings"], (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const styleSettings = data.styleSettings;
    console.log("Style Settings:", styleSettings);
    const targetInfo = targetHandles.find((th) => th.handle === handle);

    // Determine if we're in dark or light theme
    // const isDarkTheme = styleSettings.theme === "dark";s

    if (isInTargetList) {
      const tag = targetInfo?.tag || "on_watchlist";
      const action = targetInfo?.action || "monitor";

      if (action === "hide") {
        // Use a more permanent approach to hiding that won't be affected by Twitter's DOM recycling
        if (!tweet.classList.contains("tweet-hidden")) {
          // First collapse the tweet immediately
          tweet.classList.add("tweet-hidden");
          tweet.style.height = "0px";
          tweet.style.overflow = "hidden";

          // Create blur overlay
          const blurOverlay = document.createElement("div");
          blurOverlay.classList.add("tweet-blur-overlay");

          // Remove any existing overlay first
          const existingOverlay = tweet.querySelector(".tweet-blur-overlay");
          existingOverlay?.remove();

          // Position the overlay relatively to the tweet article
          tweet.style.position = "relative";
          tweet.appendChild(blurOverlay);

          // Add the collapsed indicator
          const tweetArticle = tweet.closest(TWEET_ARTICLE_QUERY_SELECTOR);
          if (tweetArticle && tweetArticle.parentElement) {
            const existingIndicator = tweetArticle.parentElement.querySelector(
              ".collapse-indicator",
            );
            if (!existingIndicator) {
              const collapseIndicator = CollapsedIndicator({
                tweet,
                handle: handle || "",
                action: "hide",
                tag: tag as Tags,
                styleSettings,
              });
              tweetArticle.parentElement.insertBefore(
                collapseIndicator as Node,
                tweetArticle,
              );
            }
          }
        }
      } else if (action === "highlight") {
        if (!tweet.classList.contains("tweet-highlighted")) {
          tweet.classList.add("tweet-highlighted");
          // Also apply inline styles to ensure they persist when scrolling
          const highlightThickness = styleSettings.highlight.highlightThickness;
          const highlightColor = styleSettings.highlight.highlightColor;
          const highlightBorderRadius =
            styleSettings.highlight.highlightBorderRadius;
          const glowStrength = styleSettings.highlight.glowStrength;

          tweet.style.outline = `${highlightThickness}px solid ${highlightColor}`;
          tweet.style.borderRadius = `${highlightBorderRadius}px`;
          tweet.style.boxShadow = `0 0 ${glowStrength}px ${highlightColor}`;
        }
      } else if (action === "blur") {
        const tweetArticle = tweet.closest(TWEET_ARTICLE_QUERY_SELECTOR);
        const tweetOverlay = OverlayWithRemoveButton(
          handle ?? "",
          tag,
          styleSettings,
        );
        tweetArticle?.appendChild(tweetOverlay);
      }

      if (styleSettings.showOverlay) {
        if (!tweet.querySelector(".tweet-overlay")) {
          const overlayContainer = document.createElement("div");
          overlayContainer.classList.add("tweet-overlay");

          const overlayText = document.createTextNode(
            tag === "fake_news"
              ? "FAKE NEWS"
              : tag === "parody"
                ? "PARODY"
                : "ON WATCHLIST",
          );
          overlayContainer.appendChild(overlayText);

          // Add the overlay to the tweet
          if (tweet) {
            tweet.style.position = "relative";
            tweet.appendChild(overlayContainer);
          }
        }
      }
    }
  });
}

function createWatchListButtons(
  tweet: HTMLElement,
  handleElement: Element,
  handle: string | null,
  targetHandles: TargetHandle[],
): void {
  if (!handle) return;

  const existingButton = tweet.querySelector(".watchlist-button");
  if (existingButton) return;

  const buttonContainer = WatchlistButtonContainer();

  const button = WatchlistButton({
    handle,
    onClick: () => handleWatchlistAction(handle),
    targetHandles,
  });

  buttonContainer.appendChild(button);

  const usernameContainer = handleElement.closest('[data-testid="User-Name"]');
  if (usernameContainer) {
    usernameContainer.appendChild(buttonContainer);
  }
}

function highlightTargetAccounts(): void {
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];

    const tweetArticles = document.querySelectorAll<HTMLElement>(
      TWEET_ARTICLE_QUERY_SELECTOR,
    );

    tweetArticles.forEach((tweet) => {
      const handle = extractHandleFromTweet(tweet);
      if (handle) {
        console.log(`Handle ${handle}`);
        const isInTargetList = targetHandles.some((th) => th.handle === handle);
        styleTargetTweets(isInTargetList, tweet, handle);

        // Find the handle element for creating watchlist buttons
        const handleElement = tweet.querySelectorAll(
          TWEET_HANDLE_QUERY_SELECTOR,
        )[3];
        if (handleElement) {
          createWatchListButtons(tweet, handleElement, handle, targetHandles);
        }
      }
    });
  });
}

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
          updateButtonState(button, isInTargetList, targetHandles);
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

// Add a style tag to handle tweet visibility persistence with styleSettings
function addGlobalStyles(styleSettings: any) {
  const styleTag = document.createElement("style");

  // Determine if we're in dark or light theme
  const isDarkTheme = styleSettings.theme === "dark";

  styleTag.textContent = `
    .tweet-hidden {
      height: 0px;
      overflow: hidden;
      position: relative;
      transition: height 0.3s ease;
      display: flex; /* Ensure it's not display:none which would prevent transitions */
    }
    .tweet-highlighted {
      position: relative;
      outline: ${styleSettings.highlight.highlightThickness}px solid ${styleSettings.highlight.highlightColor} !important;
      border-radius: ${styleSettings.highlight.highlightBorderRadius}px !important;
      box-shadow: 0 0 ${styleSettings.highlight.glowStrength}px ${styleSettings.highlight.highlightColor} !important;
    }
    .tweet-blur-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: ${isDarkTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} !important;
      backdrop-filter: ${
        styleSettings.hide.blurHiddenTweetsOnUncollpase
          ? `blur(${styleSettings.hide.hiddenTweetBlurValue}px)`
          : "none"
      } !important;
      pointer-events: none !important;
      z-index: 10 !important;
    }
    .tweet-overlay {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      background-color: ${
        isDarkTheme
          ? styleSettings.overlayBackgroundColorDark
          : styleSettings.overlayBackgroundColorLight
      } !important;
      color: ${
        isDarkTheme
          ? styleSettings.overlayTextColorDark
          : styleSettings.overlayTextColorLight
      } !important;
      padding: 5px 10px !important;
      border-radius: 0 0 0 5px !important;
      z-index: 1000 !important;
      font-size: 12px !important;
      font-weight: bold !important;
    }
  `;
  document.head.appendChild(styleTag);
}

// Initialize the extension
function init() {
  console.log("Anti-Centel extension initialized");

  // Get styleSettings first, then initialize everything else
  chrome.storage.sync.get("styleSettings", (data) => {
    let styleSettings = data.styleSettings || {};

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

    // Add global styles with styleSettings
    addGlobalStyles(styleSettings);

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
