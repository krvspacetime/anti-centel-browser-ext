/**
 * Watchlist button components
 */

import { handleWatchlistAction } from './watchlistActions';
import { createElement } from '../../utils/domUtils';

/**
 * Create watchlist buttons for a tweet
 * @param tweet The tweet element
 * @param handleElement The element containing the handle
 * @param handle The handle text
 */
export function createWatchlistButtons(
  tweet: HTMLElement,
  handleElement: Element,
  handle: string | null
): void {
  // Skip if no handle
  if (!handle) {
    return;
  }

  // Check if buttons already exist
  const existingButtons = tweet.querySelector('.watchlist-button-container');
  if (existingButtons) {
    return;
  }

  // Create container
  const buttonContainer = createElement('div', '', 'watchlist-button-container');
  
  // Create watchlist button
  const watchlistButton = createElement('button', 'Watchlist', 'watchlist-button');
  watchlistButton.addEventListener('click', (e) => {
    e.stopPropagation();
    handleWatchlistAction(handle);
  });
  
  // Add button to container
  buttonContainer.appendChild(watchlistButton);
  
  // Insert after the handle element
  handleElement.parentNode?.insertBefore(buttonContainer, handleElement.nextSibling);
}

/**
 * Update the state of watchlist buttons
 * @param handle The handle to update buttons for
 * @param isInWatchlist Whether the handle is in the watchlist
 */
export function updateButtonState(handle: string, isInWatchlist: boolean): void {
  // Find all tweets with this handle
  const tweets = document.querySelectorAll('article[role="article"]');
  
  tweets.forEach((tweetElement) => {
    const tweet = tweetElement as HTMLElement;
    const spans = tweet.querySelectorAll('span');
    
    for (const span of spans) {
      if (span.textContent === handle) {
        // Find the button container
        const buttonContainer = tweet.querySelector('.watchlist-button-container');
        if (buttonContainer) {
          // Update button text
          const button = buttonContainer.querySelector('.watchlist-button');
          if (button) {
            button.textContent = isInWatchlist ? 'Remove' : 'Watchlist';
          }
        }
      }
    }
  });
}
