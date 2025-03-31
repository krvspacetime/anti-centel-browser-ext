/**
 * Utility functions for working with tweets
 */

import {
  TWEET_HANDLE_QUERY_SELECTOR,
  TWEET_ARTICLE_QUERY_SELECTOR,
} from "../constants/selectors";

import {
  createCollapseIndicator,
  createHighlightEffect,
  createBlurEffect,
} from "../actions/index";

import { Tags, TargetHandle } from "../types/targets";

import {
  createCategoryModal,
  createWatchlistButton,
  createWatchlistButtonContainer,
} from "../components/index";

/**
 * Extracts the handle from a tweet, handling both regular tweets and retweets
 * @param tweet The tweet element
 * @returns The handle or null if not found
/**
 * Extracts the handle from a tweet, handling both regular tweets and retweets
 * @param tweet The tweet element
 * @returns The handle or null if not found
 */
export function extractHandleFromTweet(tweet: HTMLElement): string | null {
  // Check if this is a retweet by looking for the retweet indicator
  const isRetweet = tweet.textContent?.includes("reposted") || false;
  console.log(`Is retweet: ${isRetweet}`);

  if (isRetweet) {
    console.log("Extracting correct handle from retweets...");

    // For retweets, we need to find the span that contains the @ symbol
    // This is more reliable than using the index
    const spans = tweet.querySelectorAll("span");
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      // Look for spans that start with @ - these are the actual usernames
      if (span.textContent && span.textContent.startsWith("@")) {
        console.log(`Found retweet handle: ${span.textContent}`);
        return span.textContent;
      }
    }

    // Fallback to the old method if we couldn't find a span with @
    const handleElements = tweet.querySelectorAll(TWEET_HANDLE_QUERY_SELECTOR);
    for (let i = 0; i < handleElements.length; i++) {
      if (
        handleElements[i].textContent &&
        handleElements[i].parentElement?.textContent?.includes("reposted")
      ) {
        const nextSibling = handleElements[i].nextElementSibling;
        if (
          nextSibling &&
          nextSibling.textContent &&
          nextSibling.textContent.startsWith("@")
        ) {
          console.log(
            `Found retweet handle (fallback): ${nextSibling.textContent}`,
          );
          return nextSibling.textContent;
        }
      }
    }

    // If we still can't find it, try a different approach
    const repostElements = tweet.querySelectorAll(
      '[data-testid="socialContext"]',
    );
    if (repostElements.length > 0) {
      const nextHandleElement = tweet.querySelector('a[role="link"] span');
      if (nextHandleElement && nextHandleElement.textContent) {
        console.log(
          `Found retweet handle (last resort): ${nextHandleElement.textContent}`,
        );
        return nextHandleElement.textContent;
      }
    }

    console.log("Could not extract handle from retweet");
    return null;
  } else {
    // For regular tweets, we need to find the span that contains the @ symbol
    // First try to find it using the handle selector and then look for siblings
    const handleElement = tweet.querySelector(TWEET_HANDLE_QUERY_SELECTOR);

    if (handleElement) {
      // Look for a sibling element that contains the @ symbol
      const parentElement = handleElement.closest('[data-testid="User-Name"]');
      if (parentElement) {
        // Find all spans within the parent element
        const spans = parentElement.querySelectorAll("span");
        for (const span of spans) {
          if (span.textContent && span.textContent.startsWith("@")) {
            console.log(`Found regular tweet handle: ${span.textContent}`);
            return span.textContent;
          }
        }
      }

      // If we couldn't find it in siblings, try looking at all spans in the tweet
      const allSpans = tweet.querySelectorAll("span");
      for (const span of allSpans) {
        if (span.textContent && span.textContent.startsWith("@")) {
          console.log(
            `Found regular tweet handle (fallback): ${span.textContent}`,
          );
          return span.textContent;
        }
      }

      // If we still can't find the handle with @, log a warning and return the text content
      // This is a fallback to maintain existing behavior
      if (handleElement.textContent) {
        console.log(
          `Warning: Could not find @ handle, using: ${handleElement.textContent}`,
        );
        return handleElement.textContent;
      }
    }

    console.log("Could not extract handle from regular tweet");
    return null;
  }
}

/**
 * Find all tweets in the document
 * @param selector The selector to use for finding tweets
 * @returns Array of tweet elements
 */
export function findAllTweets(selector: string): HTMLElement[] {
  const tweetElements = document.querySelectorAll(selector);
  return Array.from(tweetElements) as HTMLElement[];
}

/**
 * Find tweets by a specific handle
 * @param handle The handle to search for
 * @param selector The selector to use for finding tweets
 * @returns Array of tweet elements from the specified handle
 */
export function findTweetsByHandle(
  handle: string,
  selector: string,
): HTMLElement[] {
  const allTweets = findAllTweets(selector);
  return allTweets.filter((tweet) => {
    const tweetHandle = extractHandleFromTweet(tweet);
    return tweetHandle && tweetHandle.toLowerCase() === handle.toLowerCase();
  });
}

export function refreshTweetStyles(handle: string): void {
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

export function styleTargetTweets(
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
      const action = targetInfo?.action || "tag";

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
              const collapseIndicator = createCollapseIndicator({
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
          createHighlightEffect(tweet, styleSettings);
        }
      } else if (action === "blur") {
        const tweetArticle = tweet.closest(TWEET_ARTICLE_QUERY_SELECTOR);
        const tweetOverlay = createBlurEffect(handle ?? "", tag, styleSettings);
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

export function highlightTargetAccounts(): void {
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

function createWatchListButtons(
  tweet: HTMLElement,
  handleElement: Element,
  handle: string | null,
  targetHandles: TargetHandle[],
): void {
  if (!handle) return;

  const existingButton = tweet.querySelector(".watchlist-button");
  if (existingButton) return;

  const buttonContainer = createWatchlistButtonContainer();

  const button = createWatchlistButton({
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
