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

interface TargetHandle {
  handle: string;
  category: CategoryType;
}

function createCategoryModal(handle: string): Promise<CategoryType | null> {
  return new Promise((resolve) => {
    const modal = Modal();
    const modalContent = ModalContent();
    const title = ModalTitle(`Select category for ${handle}`);
    const categories = Object.keys(DEFAULT_STYLE_CONFIGS);
    const buttons = ModalButtons(categories, (category) => {
      resolve(category as CategoryType);
      document.body.removeChild(modal);
    });
    const cancelButton = ModalCancelButton({
      label: "Cancel",
      onClick: () => {
        resolve(null);
        document.body.removeChild(modal);
      },
    });

    document.body.appendChild(modal);
    modal.appendChild(modalContent);
    modalContent.appendChild(title);
    buttons.forEach((button) => modalContent.appendChild(button));
    modalContent.appendChild(cancelButton);
  });
}

export async function handleWatchlistAction(handle: string): Promise<void> {
  chrome.storage.sync.get("targetHandles", async (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];

    if (!targetHandles.some((th) => th.handle === handle)) {
      const category = await createCategoryModal(handle);

      if (category) {
        const newHandle: TargetHandle = {
          handle,
          category,
        };

        const newHandles = [...targetHandles, newHandle];
        chrome.storage.sync.set({ targetHandles: newHandles }, () => {
          console.log(
            `${handle} added to target list with category: ${category}`,
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
  const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
  const handle = handleElement ? handleElement.textContent : null;

  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const targetInfo = targetHandles.find((th) => th.handle === handle);

    if (isInTargetList && !tweet.querySelector(".tweet-overlay")) {
      tweet.style.position = "relative";
      tweet.style.pointerEvents = "none";

      const category = targetInfo?.category || "default";
      const style = DEFAULT_STYLE_CONFIGS[category];
      // tweet.style.filter = `blur(${style.tweetBlur})`;

      const tweetContent = tweet.querySelector('[data-testid="tweetText"]');
      if (tweetContent instanceof HTMLElement) {
        tweetContent.style.filter = `blur(${style.contentBlur})`;
      }
      const overlay = createTweetOverlay(style);
      const showTweetButton = createShowTweetButton(style, () => {
        if (tweetContent instanceof HTMLElement) {
          tweetContent.style.filter = "none";
        }
        tweet.style.filter = "none";
        // tweet.removeChild(showTweetButton);
        showTweetButton.style.display = "none";
        tweet.style.pointerEvents = "auto";
        tweet.style.position = "static";
        overlay.style.display = "none";
        tweetBadge.style.display = "none";
      });
      const hideTweetButton = createHideTweetButton(() => {
        overlay.style.display = "block";
        showTweetButton.style.display = "block";
        tweetBadge.style.display = "block";
      });

      const tweetBadge = createTweetBadge(targetInfo?.handle || "", category);

      tweet.appendChild(showTweetButton);
      tweet.appendChild(hideTweetButton);
      tweet.appendChild(overlay);
      tweet.appendChild(tweetBadge);
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

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    position: relative;
    top: -2px;
    z-index: 1000;
  `;

  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.dataset.handle = handle;
  updateButtonState(button, isInTargetList);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleWatchlistAction(handle);
  });

  buttonContainer.appendChild(button);

  const usernameContainer = handleElement.closest('[data-testid="User-Name"]');
  if (usernameContainer) {
    usernameContainer.appendChild(buttonContainer);
  }
}

function updateButtonState(button: HTMLElement, isInTargetList: boolean): void {
  button.textContent = isInTargetList ? "REMOVE" : "ADD";
  button.style.cssText = `
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    background-color: ${isInTargetList ? "red" : "transparent"};
    color: white;
    border: none;
    line-height: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 1px solid rgba(255, 255, 255, 0.3);
    &:hover {
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
          updateButtonState(button, isInTargetList);
        }
      });
  }
});
