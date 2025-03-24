/**
 * Main entry point for the content script
 */

import { loadStyleSettings } from './services/storageService';
import { initTheme } from './services/themeService';
import { initObservers } from './services/observerService';
import { addGlobalStyles } from './utils/domUtils';
import { highlightTargetAccounts } from './features/tweets/highlightTweets';
import { initUserDetailsFeatures } from './features/userDetails';

/**
 * Initialize the extension
 */
async function init(): Promise<void> {
  console.log("Initializing Anti-Centel extension...");
  
  try {
    // Load style settings
    const styleSettings = await loadStyleSettings();
    console.log("Loaded style settings:", styleSettings);
    
    // Add global styles
    addGlobalStyles(styleSettings);
    
    // Initialize theme detection and management
    initTheme();
    
    // Initialize user details features
    initUserDetailsFeatures(styleSettings);
    
    // Initialize observers for DOM changes
    initObservers(styleSettings);
    
    // Highlight target accounts
    highlightTargetAccounts(styleSettings);
    
    console.log("Anti-Centel extension initialized successfully");
  } catch (error) {
    console.error("Error initializing Anti-Centel extension:", error);
  }
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  init();
});

// Also initialize immediately in case the DOM is already loaded
init();
