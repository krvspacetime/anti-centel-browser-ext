import { updateWatchlistButtonState } from "./components/watchlist/updateWatchlistButtonState";
import { TargetHandle } from "./types/targets";
import { TWEET_ARTICLE_QUERY_SELECTOR } from "./constants/selectors";
import { highlightTargetAccounts, detectAndSetTheme } from "./utils/index";
import { init } from "./features/init/init";

// Initial setup and mutation observer
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  highlightTargetAccounts();
  detectAndSetTheme();
});

// Observer for tweet changes
new MutationObserver(highlightTargetAccounts).observe(document, {
  subtree: true,
  childList: true,
});

// Add storage change listener
chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetHandles) {
    const targetHandles = changes.targetHandles.newValue || [];
    console.log(targetHandles);
    // Update all watchlist buttons
    document
      .querySelectorAll<HTMLElement>(".watchlist-button")
      .forEach((button) => {
        const handle = button.dataset.handle;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th: TargetHandle) => th.handle === handle,
          );
          updateWatchlistButtonState(button, isInTargetList, targetHandles);
        }
      });
  }

  if (changes.styleSettings) {
    console.log("Style settings changed:", changes.styleSettings.newValue);
    // Re-apply styles with the new theme
    document
      .querySelectorAll<HTMLElement>(TWEET_ARTICLE_QUERY_SELECTOR)
      .forEach((tweet) => {
        tweet.dataset.processed = "false"; // Reset processed state
      });

    // Re-apply styles with the new theme
    highlightTargetAccounts();
  }
});

// Run theme detection immediately
detectAndSetTheme();
init();
