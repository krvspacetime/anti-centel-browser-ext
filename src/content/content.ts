import { CollapsedIndicator } from "./actions/hide/CollapsedIndicator";
import {
  Modal,
  ModalButtons,
  ModalCancelButton,
  ModalContent,
  ModalTitle,
} from "./modal/Modal";

import {
  WatchlistButton,
  WatchlistButtonContainer,
} from "./watchlist/WatchlistButton";

import { updateButtonState } from "./watchlist/WatchlistButtonUpdate";

import { Tags, TargetHandle } from "./types";
import { OverlayWithRemoveButton } from "./utils/StyleTweetUtils";

const TWEET_ARTICLE_QUERY_SELECTOR = 'article[data-testid="tweet"]';
const TWEET_HANDLE_QUERY_SELECTOR = 'a[role="link"] span';
// const TWEET_CONTENT_QUERY_SELECTOR = '[data-testid="tweetText"]';
// Update the createCategoryModal function to include action selection
function createCategoryModal(
  handle: string,
): Promise<{ tag: Tags; action: TargetHandle["action"] } | null> {
  return new Promise((resolve) => {
    const modal = Modal();
    const modalContent = ModalContent();
    const title = ModalTitle(`Configure monitoring for ${handle}`);

    // const tags = Object.keys(DEFAULT_STYLE_CONFIGS);
    const tags = Object.values(Tags);
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
          tag: tag as Tags,
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
    .querySelectorAll<HTMLElement>(TWEET_ARTICLE_QUERY_SELECTOR)
    .forEach((tweet) => {
      const tweetHandle = tweet.querySelectorAll(TWEET_HANDLE_QUERY_SELECTOR)[3]
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
        // console.log(`${handle} removed from target list.`);
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
  // const tweetContent = tweet.querySelector(TWEET_CONTENT_QUERY_SELECTOR);
  const handleElement = tweet.querySelectorAll(TWEET_HANDLE_QUERY_SELECTOR)[3];
  const handle = handleElement ? handleElement.textContent : null;

  if (tweet.dataset.processed === "true") return;
  tweet.dataset.processed = "true";

  chrome.storage.sync.get(["targetHandles", "styleSettings"], (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    const styleSettings = data.styleSettings;
    console.log("Style Settings:", styleSettings);
    const targetInfo = targetHandles.find((th) => th.handle === handle);
    const tweetArticle = tweet.closest('article[data-testid="tweet"]');
    if (isInTargetList) {
      const tag = targetInfo?.tag || "on_watchlist";
      const action = targetInfo?.action || "monitor";

      if (action === "hide") {
        tweet.style.height = "0px";
        tweet.style.overflow = "hidden";
        tweet.style.transition = "height 0.3s ease";
        tweet.style.outline = `${styleSettings.highlight.highlightThickness}px solid ${styleSettings.highlight.highlightColor}`;
        tweet.style.backdropFilter = styleSettings.hide
          .blurHiddenTweetsOnUncollpase
          ? `blur(${styleSettings.blur.blurValue}px)`
          : "blur(0px)";

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
              tag: tag as Tags,
              styleSettings,
            });
            tweetArticle.parentElement.insertBefore(
              collapseIndicator as Node,
              tweetArticle,
            );
          }
        }
      } else if (action === "blur") {
        const tweetOverlay = OverlayWithRemoveButton(
          handle ?? "",
          tag,
          styleSettings,
        );
        tweetArticle?.appendChild(tweetOverlay);
      } else if (action === "highlight") {
        const highlighThickness = styleSettings.highlight.highlightThickness;
        const highlightColor = styleSettings.highlight.highlightColor;
        const highlightBorderRadius =
          styleSettings.highlight.highlightBorderRadius;
        const glowStrength = styleSettings.highlight.glowStrength;
        tweet.style.cssText = `
        outline: ${highlighThickness}px solid ${highlightColor};
        border-radius: ${highlightBorderRadius}px;
        box-shadow: 0 0 ${glowStrength}px ${highlightColor};
        `;
      }
    }
  });
}

function createWatchListButtons(
  tweet: HTMLElement,
  handleElement: Element,
  handle: string | null,
  targetHandles: TargetHandle[],
): void {
  if (!handle) return;

  const existingButton = tweet.querySelector(".watchlist-button");
  if (existingButton) return;

  const buttonContainer = WatchlistButtonContainer();

  const button = WatchlistButton({
    handle,
    onClick: () => handleWatchlistAction(handle),
    targetHandles,
  });

  buttonContainer.appendChild(button);

  const usernameContainer = handleElement.closest('[data-testid="User-Name"]');
  if (usernameContainer) {
    usernameContainer.appendChild(buttonContainer);
  }
}

function highlightTargetAccounts(): void {
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];

    const tweetArticles = document.querySelectorAll<HTMLElement>(
      TWEET_ARTICLE_QUERY_SELECTOR,
    );

    tweetArticles.forEach((tweet) => {
      const handleElement = tweet.querySelectorAll(
        TWEET_HANDLE_QUERY_SELECTOR,
      )[3];
      if (handleElement) {
        const handle = handleElement.textContent;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th) => th.handle === handle,
          );
          styleTargetTweets(isInTargetList, tweet);
          createWatchListButtons(tweet, handleElement, handle, targetHandles);
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
