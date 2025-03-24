/**
 * Feature for hiding user details based on settings
 */

import { StyleSettings } from '../../types/settings';
import { USER_CELL_SELECTOR, USER_AVATAR_SELECTOR } from '../../constants/selectors';

/**
 * Hide user details based on style settings
 * @param styleSettings The current style settings
 */
export function hideUserDetails(styleSettings: StyleSettings): void {
  // Only proceed if the hideUserDetails setting is enabled
  if (!styleSettings.hideUserDetails) {
    return;
  }

  console.log("Hiding user details...");

  // Find all user cells and avatars
  const userCells = document.querySelectorAll(USER_CELL_SELECTOR);
  const userAvatars = document.querySelectorAll(USER_AVATAR_SELECTOR);

  // Hide user cells
  userCells.forEach((userCell) => {
    const element = userCell as HTMLElement;
    element.style.display = "none";
  });

  // Hide user avatars
  userAvatars.forEach((userAvatar) => {
    const element = userAvatar as HTMLElement;
    element.style.display = "none";
  });
}

/**
 * Set up a MutationObserver to hide user details when new elements are added
 * @param styleSettings The current style settings
 * @returns The created MutationObserver
 */
export function setupUserDetailsObserver(styleSettings: StyleSettings): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    let shouldHideUserDetails = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            // Check for user details elements
            if (
              element.querySelector &&
              (element.querySelector(USER_CELL_SELECTOR) ||
                element.querySelector(USER_AVATAR_SELECTOR))
            ) {
              shouldHideUserDetails = true;
            }
          }
        });
      }
    });

    if (shouldHideUserDetails && styleSettings.hideUserDetails) {
      hideUserDetails(styleSettings);
    }
  });

  return observer;
}
