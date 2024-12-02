import { CollapsedIndicator } from "./actions/hide/CollapsedIndicator";
import {
  Modal,
  ModalButtons,
  ModalCancelButton,
  ModalContent,
  ModalTitle,
} from "./modal/Modal";

import { DEFAULT_STYLE_CONFIGS, CategoryType } from "./utils/styleConfig";

import {
  WatchlistButton,
  WatchlistButtonContainer,
} from "./watchlist/WatchlistButton";

import { updateButtonState } from "./watchlist/WatchlistButtonUpdate";

import { TargetHandle } from "./types";

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

function refreshTweetStyles(handle: string): void {
  document
    .querySelectorAll<HTMLElement>('article[data-testid="tweet"]')
    .forEach((tweet) => {
      const tweetHandle = tweet.querySelectorAll('a[role="link"] span')[3]
        ?.textContent;
      if (tweetHandle === handle) {
        tweet.dataset.processed = "false"; // Reset processed state
        styleTargetTweets(true, tweet);
      }
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
          refreshTweetStyles(handle);
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
  // const tweetContent = tweet.querySelector('[data-testid="tweetText"]');
  const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
  const handle = handleElement ? handleElement.textContent : null;

  if (tweet.dataset.processed === "true") return;
  tweet.dataset.processed = "true";

  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const targetInfo = targetHandles.find((th) => th.handle === handle);

    if (isInTargetList) {
      const tag = targetInfo?.tag || "on_watchlist";
      const action = targetInfo?.action || "monitor";

      if (action === "hide") {
        // const tweetHeight = tweet.offsetHeight;
        tweet.style.height = "0px";
        tweet.style.overflow = "hidden";
        tweet.style.transition = "height 0.3s ease";

        const tweetArticle = tweet.closest('article[data-testid="tweet"]');
        if (tweetArticle && tweetArticle.parentElement) {
          const existingIndicator = tweetArticle.parentElement.querySelector(
            ".collapse-indicator",
          );
          if (!existingIndicator) {
            const collapseIndicator = CollapsedIndicator({
              tweet,
              handle: handle || "",
              action,
              tag,
            });
            tweetArticle.parentElement.insertBefore(
              collapseIndicator as Node,
              tweetArticle,
            );
          }
        }
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
