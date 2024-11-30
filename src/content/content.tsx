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
  WatchlistButton,
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
  const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
  const handle = handleElement ? handleElement.textContent : null;

  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const targetInfo = targetHandles.find((th) => th.handle === handle);

    if (isInTargetList && !tweet.querySelector(".tweet-overlay")) {
      tweet.style.position = "relative";
      tweet.style.pointerEvents = "none";

      const tag = targetInfo?.tag || "on_watchlist";
      const style = DEFAULT_STYLE_CONFIGS[tag];

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
        tweet.style.pointerEvents = "auto";
        tweet.style.position = "static";

        overlay.style.display = "none";
        showTweetButton.style.display = "none";
        hideTweetButton.style.display = "block";
        tweetBadge.style.display = "none";
      });

      const hideTweetButton = createHideTweetButton(() => {
        if (tweetContent instanceof HTMLElement) {
          tweetContent.style.filter = `blur(${style.contentBlur})`;
        }
        tweet.style.pointerEvents = "none";
        tweet.style.position = "relative";

        overlay.style.display = "block";
        hideTweetButton.style.display = "none";
        showTweetButton.style.display = "block";
        tweetBadge.style.display = "block";
      });

      const tweetBadge = createTweetBadge(targetInfo?.handle || "", tag);

      // Initial state
      hideTweetButton.style.display = "none";

      tweet.appendChild(overlay);
      if (style.overlayColor !== "none") {
        tweet.appendChild(showTweetButton);
        tweet.appendChild(hideTweetButton);
        tweet.appendChild(tweetBadge);
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
  button.textContent = isInTargetList ? categoryUpper : "MONITOR";
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
