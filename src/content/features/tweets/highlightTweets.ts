/**
 * Feature for highlighting target tweets
 */

import { StyleSettings } from "../../types/settings";
import { TWEET_ARTICLE_QUERY_SELECTOR } from "../../constants/selectors";
import { extractHandleFromTweet } from "../../utils/tweetUtils";
import { loadTargetHandles } from "../../services/storageService";
import { styleTweet } from "./styleTweets";

/**
 * Highlight tweets from target accounts
 * @param styleSettings The current style settings
 */
export async function highlightTargetAccounts(
  styleSettings: StyleSettings,
): Promise<void> {
  console.log("Highlighting target accounts...");

  // Get target handles from storage
  const targetHandles = await loadTargetHandles();

  if (!targetHandles || targetHandles.length === 0) {
    console.log("No target handles found");
    return;
  }

  console.log(`Found ${targetHandles.length} target handles`);

  // Find all tweets
  const tweets = document.querySelectorAll(TWEET_ARTICLE_QUERY_SELECTOR);

  // Process each tweet
  tweets.forEach((tweetElement) => {
    const tweet = tweetElement as HTMLElement;
    const handle = extractHandleFromTweet(tweet);

    if (handle) {
      // Check if the handle is in our target list
      const targetHandle = targetHandles.find(
        (target) => target.handle.toLowerCase() === handle.toLowerCase(),
      );

      if (targetHandle) {
        // Apply styling based on the action
        styleTweet(true, tweet, handle, targetHandle, styleSettings);
      } else {
        // Not a target, ensure no styling is applied
        styleTweet(false, tweet, handle, null, styleSettings);
      }
    }
  });
}

/**
 * Refresh the styling for tweets from a specific handle
 * @param handle The handle to refresh styling for
 */
export async function refreshTweetStyles(handle: string): Promise<void> {
  console.log(`Refreshing tweet styles for ${handle}`);

  // Get target handles from storage
  const targetHandles = await loadTargetHandles();

  // Find the target handle
  const targetHandle = targetHandles.find(
    (target) => target.handle.toLowerCase() === handle.toLowerCase(),
  );

  // Get style settings
  const styleSettings = await new Promise<StyleSettings>((resolve) => {
    chrome.storage.sync.get("styleSettings", (data) => {
      resolve(data.styleSettings || {});
    });
  });

  // Find all tweets
  const tweets = document.querySelectorAll(TWEET_ARTICLE_QUERY_SELECTOR);

  // Process each tweet
  tweets.forEach((tweetElement) => {
    const tweet = tweetElement as HTMLElement;
    const tweetHandle = extractHandleFromTweet(tweet);

    if (tweetHandle && tweetHandle.toLowerCase() === handle.toLowerCase()) {
      // Apply styling based on whether it's a target
      styleTweet(
        !!targetHandle,
        tweet,
        tweetHandle,
        targetHandle || null,
        styleSettings,
      );
    }
  });
}
