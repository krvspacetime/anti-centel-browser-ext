/**
 * User details feature index
 */

import { StyleSettings } from '../../types/settings';
import { hideUserDetails, setupUserDetailsObserver } from './hideUserDetails';

/**
 * Initialize the user details features
 * @param styleSettings The current style settings
 * @returns The observer for user details
 */
export function initUserDetailsFeatures(styleSettings: StyleSettings): MutationObserver {
  // Apply initial hiding if enabled
  if (styleSettings.hideUserDetails) {
    hideUserDetails(styleSettings);
  }
  
  // Set up observer for future elements
  const observer = setupUserDetailsObserver(styleSettings);
  
  return observer;
}
