import {
  Modal,
  ModalButtons,
  ModalCancelButton,
  ModalContent,
  ModalTitle,
} from "./modal/Modal";

import {
  WatchlistButton,
  WatchlistButtonContainer,
} from "./watchlist/WatchlistButton";

import { updateButtonState } from "./watchlist/WatchlistButtonUpdate";

import { Tags, TargetHandle } from "./types";
import { CollapsedIndicator } from "./actions/hide/CollapsedIndicator";
import { OverlayWithRemoveButton } from "./utils/styleTweetUtils";

const TWEET_ARTICLE_QUERY_SELECTOR = 'article[data-testid="tweet"]';
const TWEET_HANDLE_QUERY_SELECTOR = 'a[role="link"] span';

function createCategoryModal(
  handle: string,
): Promise<{ tag: Tags; action: TargetHandle["action"] } | null> {
  return new Promise((resolve) => {
    const modal = Modal();
    const modalContent = ModalContent();
    const title = ModalTitle(`Monitor ${handle}`);

    // const tags = Object.keys(DEFAULT_STYLE_CONFIGS);
    const tags = Object.values(Tags);
    const actions: TargetHandle["action"][] = [
      "monitor",
      "hide",
      "blur",
      "highlight",
    ];

    // First select the action
    const actionButtons = ModalButtons(actions as string[], (action) => {
      // Then select the tag
      const tagButtons = ModalButtons(tags, (tag) => {
        resolve({
          tag: tag as Tags,
          action: action as TargetHandle["action"],
        });
        document.body.removeChild(modal);
      });

      modalContent.innerHTML = ""; // Clear previous buttons
      modalContent.appendChild(title);
      tagButtons.forEach((button) => modalContent.appendChild(button));
      modalContent.appendChild(cancelButton);
    });

    const cancelButton = ModalCancelButton({
      label: "Cancel",
      onClick: () => {
        resolve(null);
        document.body.removeChild(modal);
      },
    });

    modal.appendChild(modalContent);
    modalContent.appendChild(title);
    actionButtons.forEach((button) => modalContent.appendChild(button));
    modalContent.appendChild(cancelButton);
    document.body.appendChild(modal);
  });
}

function refreshTweetStyles(handle: string): void {
  document
    .querySelectorAll<HTMLElement>(TWEET_ARTICLE_QUERY_SELECTOR)
    .forEach((tweet) => {
      const tweetHandle = tweet.querySelectorAll(TWEET_HANDLE_QUERY_SELECTOR)[3]
        ?.textContent;
      if (tweetHandle === handle) {
        tweet.dataset.processed = "false"; // Reset processed state
        styleTargetTweets(true, tweet);
      }
    });
}

export async function handleWatchlistAction(handle: string): Promise<void> {
  chrome.storage.sync.get("targetHandles", async (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];

    if (!targetHandles.some((th) => th.handle === handle)) {
      const targetInfo = await createCategoryModal(handle);

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

function styleTargetTweets(isInTargetList: boolean, tweet: HTMLElement): void {
  // const tweetContent = tweet.querySelector(TWEET_CONTENT_QUERY_SELECTOR);
  const handleElement = tweet.querySelectorAll(TWEET_HANDLE_QUERY_SELECTOR)[3];
  const handle = handleElement ? handleElement.textContent : null;

  if (tweet.dataset.processed === "true") return;
  tweet.dataset.processed = "true";

  chrome.storage.sync.get(["targetHandles", "styleSettings"], (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const styleSettings = data.styleSettings;
    console.log("Style Settings:", styleSettings);
    const targetInfo = targetHandles.find((th) => th.handle === handle);
    const tweetArticle = tweet.closest('article[data-testid="tweet"]');

    // Determine if we're in dark or light theme
    const isDarkTheme = styleSettings.theme === "dark";

    if (isInTargetList) {
      const tag = targetInfo?.tag || "on_watchlist";
      const action = targetInfo?.action || "monitor";

      if (action === "hide") {
        tweet.style.height = "0px";
        tweet.style.overflow = "hidden";
        tweet.style.transition = "height 0.3s ease";
        tweet.style.outline = `${styleSettings.highlight.highlightThickness}px solid ${styleSettings.highlight.highlightColor}`;
        // Create blur overlay
        const blurOverlay = document.createElement("div");
        blurOverlay.classList.add("tweet-blur-overlay");
        blurOverlay.style.cssText = `
             position: absolute;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             background: ${isDarkTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"};
             backdrop-filter: ${
               styleSettings.hide.blurHiddenTweetsOnUncollpase
                 ? `blur(${styleSettings.hide.hiddenTweetBlurValue}px)`
                 : "none"
             };
             pointer-events: none;
             z-index: 10;
           `;

        if (tweet) {
          // Remove any existing overlay first
          const existingOverlay = tweet.querySelector(".tweet-blur-overlay");
          existingOverlay?.remove();

          // Position the overlay relatively to the tweet article
          tweet.style.position = "relative";
          tweet.appendChild(blurOverlay);
        }

        const tweetArticle = tweet.closest(TWEET_ARTICLE_QUERY_SELECTOR);
        if (tweetArticle && tweetArticle.parentElement) {
          const existingIndicator = tweetArticle.parentElement.querySelector(
            ".collapse-indicator",
          );
          if (!existingIndicator) {
            const collapseIndicator = CollapsedIndicator({
              tweet,
              handle: handle || "",
              action,
              tag: tag as Tags,
              styleSettings,
            });
            tweetArticle.parentElement.insertBefore(
              collapseIndicator as Node,
              tweetArticle,
            );
          }
        }
      } else if (action === "blur") {
        const tweetOverlay = OverlayWithRemoveButton(
          handle ?? "",
          tag,
          styleSettings,
        );
        tweetArticle?.appendChild(tweetOverlay);
      } else if (action === "highlight") {
        const highlighThickness = styleSettings.highlight.highlightThickness;
        const highlightColor = styleSettings.highlight.highlightColor;
        const highlightBorderRadius =
          styleSettings.highlight.highlightBorderRadius;
        const glowStrength = styleSettings.highlight.glowStrength;

        // Adjust highlight color for better visibility based on theme
        const effectiveHighlightColor = isDarkTheme
          ? highlightColor
          : highlightColor;

        tweet.style.cssText = `
        outline: ${highlighThickness}px solid ${effectiveHighlightColor};
        border-radius: ${highlightBorderRadius}px;
        box-shadow: 0 0 ${glowStrength}px ${effectiveHighlightColor};
        `;
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
      const handleElement = tweet.querySelectorAll(
        TWEET_HANDLE_QUERY_SELECTOR,
      )[3];
      if (handleElement) {
        const handle = handleElement.textContent;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th) => th.handle === handle,
          );
          styleTargetTweets(isInTargetList, tweet);
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
  themeObserver.observe(htmlElement, { attributes: true, attributeFilter: ["style"] });
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
          styleSettings.highlight.highlightColor = styleSettings.highlight.highlightColor || "#1DA1F2";
          styleSettings.hide.collapsedTweetUsernameColor = styleSettings.hide.collapsedTweetUsernameColor || "#FFFFFF";
        } else {
          // Light theme settings
          styleSettings.highlight.highlightColor = styleSettings.highlight.highlightColor || "#1DA1F2";
          styleSettings.hide.collapsedTweetUsernameColor = styleSettings.hide.collapsedTweetUsernameColor || "#000000";
        }
      } else {
        console.log(`Theme unchanged: ${theme}`);
        return; // No need to update storage if theme hasn't changed
      }
    }
    
    // Save updated settings to storage
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
