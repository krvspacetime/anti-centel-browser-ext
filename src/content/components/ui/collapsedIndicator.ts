/**
 * Collapsed indicator component for hidden tweets
 */

import { Tags } from '../../types/targets';
import { StyleSettings } from '../../types/settings';
import { createElement } from '../../utils/domUtils';

/**
 * Create a collapsed indicator element for hidden tweets
 * @param handle The handle of the tweet author
 * @param tag The tag associated with the handle
 * @param styleSettings The current style settings
 * @returns The created collapsed indicator element
 */
export function CollapsedIndicator(
  handle: string,
  tag: Tags,
  styleSettings: StyleSettings
): HTMLElement {
  // Create container
  const container = createElement('div', '', 'collapse-indicator');
  
  // Set styles based on theme
  const isDarkTheme = styleSettings.theme === 'dark';
  container.style.backgroundColor = isDarkTheme ? 'transparent' : 'rgb(215 222 222)';
  container.style.color = isDarkTheme ? '#FFFFFF' : '#000000';
  
  // Create username element with custom color
  const usernameElement = createElement('span', handle, '');
  usernameElement.style.color = styleSettings.hide.collapsedTweetUsernameColor;
  usernameElement.style.fontWeight = 'bold';
  
  // Create tag element
  const tagElement = createElement('span', ` [${tag}]`, '');
  
  // Create text node for the message
  const textNode = document.createTextNode(' Tweet hidden. Click to show.');
  
  // Append elements to container
  container.appendChild(usernameElement);
  container.appendChild(tagElement);
  container.appendChild(textNode);
  
  // Add click handler to toggle visibility
  container.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Get the parent tweet element
    const tweet = container.closest('article[role="article"]') as HTMLElement;
    if (!tweet) return;
    
    // Toggle the height
    if (tweet.style.height === '0px' || tweet.style.height === '') {
      tweet.style.height = 'auto';
      
      // Apply blur if enabled
      if (styleSettings.hide.blurHiddenTweetsOnUncollpase) {
        const overlay = document.createElement('div');
        overlay.className = 'tweet-overlay';
        overlay.style.backdropFilter = `blur(${styleSettings.hide.hiddenTweetBlurValue}px)`;
        tweet.appendChild(overlay);
      }
    } else {
      tweet.style.height = '0px';
      
      // Remove any overlay
      const overlay = tweet.querySelector('.tweet-overlay');
      if (overlay) {
        overlay.remove();
      }
    }
  });
  
  return container;
}
