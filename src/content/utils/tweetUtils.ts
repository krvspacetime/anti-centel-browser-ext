/**
 * Utility functions for working with tweets
 */

import { TWEET_HANDLE_QUERY_SELECTOR } from "../constants/selectors";

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
          console.log(`Found regular tweet handle (fallback): ${span.textContent}`);
          return span.textContent;
        }
      }
      
      // If we still can't find the handle with @, log a warning and return the text content
      // This is a fallback to maintain existing behavior
      if (handleElement.textContent) {
        console.log(`Warning: Could not find @ handle, using: ${handleElement.textContent}`);
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
