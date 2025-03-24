/**
 * Service for managing MutationObservers
 */

import { StyleSettings } from '../types/settings';
import { TWEET_ARTICLE_QUERY_SELECTOR } from '../constants/selectors';
import { highlightTargetAccounts } from '../features/tweets/highlightTweets';
import { hideUserDetails } from '../features/userDetails/hideUserDetails';

/**
 * Initialize and set up all MutationObservers
 * @param styleSettings The current style settings
 */
export function initObservers(styleSettings: StyleSettings): void {
  // Main observer for tweets and user details
  const mainObserver = new MutationObserver((mutations) => {
    let shouldHighlight = false;
    let shouldHideUserDetails = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check for new tweets
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

    // Apply features based on detected changes
    if (shouldHighlight) {
      highlightTargetAccounts(styleSettings);
    }
    
    if (shouldHideUserDetails && styleSettings.hideUserDetails) {
      hideUserDetails(styleSettings);
    }
  });

  // Start observing the document
  mainObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
  // Theme observer for detecting theme changes
  const themeObserver = new MutationObserver(() => {
    // This will be handled by the themeService
  });
  
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style']
  });
}
