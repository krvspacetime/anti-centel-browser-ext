import {
  detectAndSetTheme,
  highlightTargetAccounts,
  styleTargetTweets,
} from "../../utils";
import { hideUserDetails } from "../hide-user-details/hideUserDetails";
import { TWEET_ARTICLE_QUERY_SELECTOR } from "../../constants/selectors";

// Initialize the extension
export function init() {
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
