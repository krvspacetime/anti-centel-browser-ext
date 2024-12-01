import {
  Modal,
  ModalButtons,
  ModalCancelButton,
  ModalContent,
  ModalTitle,
} from "./modal/Modal";
import {
  createHideTweetButton,
  createShowTweetButton,
  createTweetBadge,
  createTweetOverlay,
} from "./utils/StyleTweetUtils";

import { DEFAULT_STYLE_CONFIGS, CategoryType } from "./utils/styleConfig";
import {
  // WatchlistButton,
  WatchlistButtonContainer,
} from "./watchlist/WatchlistButton";

export interface TargetHandle {
  handle: string;
  tag: CategoryType;
  action?: "monitor" | "hide" | "blur" | "highlight";
}

// Update the createCategoryModal function to include action selection
function createCategoryModal(
  handle: string,
): Promise<{ tag: CategoryType; action: TargetHandle["action"] } | null> {
  return new Promise((resolve) => {
    const modal = Modal();
    const modalContent = ModalContent();
    const title = ModalTitle(`Configure monitoring for ${handle}`);

    const tags = Object.keys(DEFAULT_STYLE_CONFIGS);
    const actions: TargetHandle["action"][] = [
      "monitor",
      "hide",
      "blur",
      "highlight",
    ];

    // First select the action
    const actionButtons = ModalButtons(actions as string[], (action) => {
      // Then select the tag
      const tagButtons = ModalButtons(tags, (tag) => {
        resolve({
          tag: tag as CategoryType,
          action: action as TargetHandle["action"],
        });
        document.body.removeChild(modal);
      });

      modalContent.innerHTML = ""; // Clear previous buttons
      modalContent.appendChild(title);
      tagButtons.forEach((button) => modalContent.appendChild(button));
      modalContent.appendChild(cancelButton);
    });

    const cancelButton = ModalCancelButton({
      label: "Cancel",
      onClick: () => {
        resolve(null);
        document.body.removeChild(modal);
      },
    });

    modal.appendChild(modalContent);
    modalContent.appendChild(title);
    actionButtons.forEach((button) => modalContent.appendChild(button));
    modalContent.appendChild(cancelButton);
    document.body.appendChild(modal);
  });
}

export async function handleWatchlistAction(handle: string): Promise<void> {
  chrome.storage.sync.get("targetHandles", async (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];

    if (!targetHandles.some((th) => th.handle === handle)) {
      const targetInfo = await createCategoryModal(handle);

      if (targetInfo) {
        const newHandle: TargetHandle = {
          handle,
          tag: targetInfo.tag,
          action: targetInfo.action,
        };

        const newHandles = [...targetHandles, newHandle];
        chrome.storage.sync.set({ targetHandles: newHandles }, () => {
          console.log(
            `${handle} added to target list with category: ${targetInfo.tag} and action: ${targetInfo.action}`,
          );
          chrome.runtime.sendMessage({
            type: "updateHandles",
            data: newHandles,
          });
          highlightTargetAccounts();
        });
      }
    } else {
      const newHandles = targetHandles.filter((th) => th.handle !== handle);

      chrome.storage.sync.set({ targetHandles: newHandles }, () => {
        console.log(`${handle} removed from target list.`);
        chrome.runtime.sendMessage({
          type: "updateHandles",
          data: newHandles,
        });
        highlightTargetAccounts();
      });
    }
  });
}

function styleTargetTweets(isInTargetList: boolean, tweet: HTMLElement): void {
  const tweetContent = tweet.querySelector('[data-testid="tweetText"]');

  const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
  const handle = handleElement ? handleElement.textContent : null;

  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const targetInfo = targetHandles.find((th) => th.handle === handle);

    if (isInTargetList && !tweet.querySelector(".tweet-overlay")) {
      tweet.style.position = "relative";
      tweet.style.pointerEvents = "none";

      const tag = targetInfo?.tag || "on_watchlist";
      const action = targetInfo?.action || "monitor";
      const style = DEFAULT_STYLE_CONFIGS[tag];

      // if (tweetContent instanceof HTMLElement) {
      //   tweetContent.style.filter = `blur(${style.contentBlur})`;
      // }

      // Actual styles to apply to the tweet
      const overlay = createTweetOverlay(style);
      const showTweetButton = createShowTweetButton(style, () => {
        if (tweetContent instanceof HTMLElement) {
          tweetContent.style.filter = "none";
        }
        tweet.style.filter = "none";
        tweet.style.pointerEvents = "auto";
        tweet.style.position = "static";

        overlay.style.display = "none";
        showTweetButton.style.display = "none";
        hideTweetButton.style.display = "block";
        tweetBadge.style.display = "none";
      });

      const hideTweetButton = createHideTweetButton(() => {
        // if (tweetContent instanceof HTMLElement) {
        //   tweetContent.style.filter = `blur(${style.contentBlur})`;
        // }
        tweet.style.pointerEvents = "none";
        tweet.style.position = "relative";

        overlay.style.display = "block";
        hideTweetButton.style.display = "none";
        showTweetButton.style.display = "block";
        tweetBadge.style.display = "block";
      });

      const tweetBadge = createTweetBadge(targetInfo?.handle || "", tag);

      // If the action is hide or blur, apply the styles
      if (action === "hide" || action === "blur") {
        if (action === "hide") {
          // Instead of removing, collapse the tweet
          const tweetHeight = tweet.offsetHeight;
          tweet.style.height = "0px";
          tweet.style.overflow = "hidden";
          tweet.style.transition = "height 0.3s ease";

          // Create collapse indicator
          const collapseIndicator = document.createElement("div");
          collapseIndicator.className = "collapse-indicator"; // Add class for debugging
          collapseIndicator.style.cssText = `
            padding: 8px;
            color: #71767b;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
          `;
          collapseIndicator.textContent = `Hidden tweet from ${handle}`;

          // Add expand/collapse functionality
          let isExpanded = false;
          collapseIndicator.addEventListener("click", () => {
            isExpanded = !isExpanded;
            tweet.style.height = isExpanded ? `${tweetHeight}px` : "0px";
            collapseIndicator.textContent = isExpanded
              ? `Collapse tweet from ${handle}`
              : `Hidden tweet from ${handle}`;
          });

          // Find the tweet's article container and insert before it
          const tweetArticle = tweet.closest('article[data-testid="tweet"]');
          if (tweetArticle && tweetArticle.parentElement) {
            tweetArticle.parentElement.insertBefore(
              collapseIndicator,
              tweetArticle,
            );
          } else {
            console.error("Tweet article or parent element not found");
          }
        }

        tweet.appendChild(overlay);
        // if (style.overlayColor !== "none") {
        //   tweet.appendChild(showTweetButton);
        //   tweet.appendChild(hideTweetButton);
        //   tweet.appendChild(tweetBadge);
        // }
      }
    }
  });
}

function createWatchListButtons(
  tweet: HTMLElement,
  handleElement: Element,
  handle: string | null,
  isInTargetList: boolean,
): void {
  if (!handle) return;

  const existingButton = tweet.querySelector(".watchlist-button");
  if (existingButton) return;

  const buttonContainer = WatchlistButtonContainer();

  const button = WatchlistButton({
    handle,
    onClick: () => handleWatchlistAction(handle),
  });
  updateButtonState(button, isInTargetList);

  buttonContainer.appendChild(button);

  const usernameContainer = handleElement.closest('[data-testid="User-Name"]');
  if (usernameContainer) {
    usernameContainer.appendChild(buttonContainer);
  }
}

function updateButtonState(
  button: HTMLElement,
  isInTargetList: boolean,
  targetHandles?: TargetHandle[],
): void {
  const handle = button.dataset.handle;
  const targetInfo = targetHandles?.find((th) => th.handle === handle);
  const category = targetInfo?.tag || "on_watchlist";
  const categoryLabel = category.split("_").join(" ");
  const categoryUpper = categoryLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  button.textContent = isInTargetList ? `👁️ ${categoryUpper}` : "👁️ MONITOR";
  button.style.cssText = `
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    background-color: transparent;
    color: white;
    border: none;
    line-height: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 1px solid rgba(255, 255, 255, 0.3);
    :hover {
      background-color: ${isInTargetList ? "#ff4444" : "#1da1f2"};
    }
  `;
}

function highlightTargetAccounts(): void {
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    console.log("Initial targetHandles from storage:", targetHandles);

    const tweetArticles = document.querySelectorAll<HTMLElement>(
      'article[data-testid="tweet"]',
    );

    tweetArticles.forEach((tweet) => {
      const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
      if (handleElement) {
        const handle = handleElement.textContent;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th) => th.handle === handle,
          );
          styleTargetTweets(isInTargetList, tweet);
          createWatchListButtons(tweet, handleElement, handle, isInTargetList);
        }
      }
    });
  });
}

// Initial setup and mutation observer
document.addEventListener("DOMContentLoaded", highlightTargetAccounts);
new MutationObserver(highlightTargetAccounts).observe(document, {
  subtree: true,
  childList: true,
});

// Add storage change listener
chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetHandles) {
    const targetHandles = changes.targetHandles.newValue || [];

    // Update all watchlist buttons
    document
      .querySelectorAll<HTMLElement>(".watchlist-button")
      .forEach((button) => {
        const handle = button.dataset.handle;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th: TargetHandle) => th.handle === handle,
          );
          updateButtonState(button, isInTargetList, targetHandles);
        }
      });
  }
});

// Add this SVG helper near the top of the file
const EyeIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 576 512");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.style.marginRight = "4px";
  svg.innerHTML = `<path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>`;
  return svg;
};

// Then in your WatchlistButton function, you can add the icon:
function WatchlistButton({
  handle,
  onClick,
}: {
  handle: string;
  onClick: () => void;
}): HTMLElement {
  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.dataset.handle = handle;

  // Add the eye icon
  button.appendChild(EyeIcon());

  // Add a text node for the button text
  button.appendChild(document.createTextNode("MONITOR"));

  button.addEventListener("click", onClick);
  return button;
}
