type CategoryType = "fake_news" | "parody" | "satire" | "default";

interface TargetHandle {
  handle: string;
  category: CategoryType;
}

interface StyleConfig {
  tweetBlur: string;
  contentBlur: string;
  overlayColor: string;
  buttonColor: string;
}

const styleConfig: Record<CategoryType, StyleConfig> = {
  fake_news: {
    tweetBlur: "8px",
    contentBlur: "2px",
    overlayColor: "rgba(255, 0, 0, 0.3)",
    buttonColor: "red",
  },
  parody: {
    tweetBlur: "5px",
    contentBlur: "1px",
    overlayColor: "rgba(255, 165, 0, 0.3)",
    buttonColor: "orange",
  },
  satire: {
    tweetBlur: "3px",
    contentBlur: "1px",
    overlayColor: "rgba(255, 255, 0, 0.3)",
    buttonColor: "gray",
  },
  default: {
    tweetBlur: "8px",
    contentBlur: "2px",
    overlayColor: "rgba(0, 0, 0, 0.3)",
    buttonColor: "#skyblue",
  },
};

function createCategoryModal(handle: string): Promise<CategoryType | null> {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
    `;

    const title = document.createElement("h3");
    title.textContent = `Select category for @${handle}`;
    title.style.cssText = `
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 16px;
    `;

    const categories: CategoryType[] = [
      "default",
      "fake_news",
      "parody",
      "satire",
    ];
    const buttons = categories.map((category) => {
      const button = document.createElement("button");
      button.textContent =
        category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
      button.style.cssText = `
        width: 100%;
        padding: 8px;
        margin: 4px 0;
        background: #eee;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;

      button.addEventListener("click", () => {
        document.body.removeChild(modal);
        resolve(category);
      });

      return button;
    });

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-top: 16px;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modal);
      resolve(null);
    });

    modalContent.appendChild(title);
    buttons.forEach((button) => modalContent.appendChild(button));
    modalContent.appendChild(cancelButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  });
}

async function handleWatchlistAction(handle: string): Promise<void> {
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
            `${handle} added to target list with category: ${category}`
          );
          chrome.runtime.sendMessage({
            type: "updateHandles",
            data: newHandles,
          });
          highlightParodyAccounts();
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
        highlightParodyAccounts();
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

    if (isInTargetList && !tweet.querySelector(".parody-overlay")) {
      tweet.style.position = "relative";
      tweet.style.pointerEvents = "none";

      const category = targetInfo?.category || "default";
      const style = styleConfig[category];
      tweet.style.filter = `blur(${style.tweetBlur})`;

      const tweetContent = tweet.querySelector('[data-testid="tweetText"]');
      if (tweetContent instanceof HTMLElement) {
        tweetContent.style.filter = `blur(${style.contentBlur})`;
      }

      const overlay = document.createElement("div");
      overlay.className = "parody-overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = style.overlayColor;
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.pointerEvents = "auto";
      overlay.style.zIndex = "10";

      const categoryLabel = document.createElement("div");
      categoryLabel.textContent = category.replace("_", " ").toUpperCase();
      categoryLabel.style.position = "absolute";
      categoryLabel.style.top = "10px";
      categoryLabel.style.left = "10px";
      categoryLabel.style.color = "white";
      categoryLabel.style.fontSize = "12px";
      categoryLabel.style.fontWeight = "bold";
      categoryLabel.style.padding = "4px 8px";
      categoryLabel.style.borderRadius = "4px";
      categoryLabel.style.backgroundColor = "black";
      overlay.appendChild(categoryLabel);

      const button = document.createElement("button");
      button.textContent = "Show Tweet";
      button.style.padding = "8px 16px";
      button.style.backgroundColor = style.buttonColor;
      button.style.color = "white";
      button.style.border = "none";
      button.style.borderRadius = "4px";
      button.style.cursor = "pointer";
      button.style.fontSize = "14px";
      button.style.zIndex = "11";

      overlay.appendChild(button);
      tweet.appendChild(overlay);

      button.addEventListener("click", () => {
        if (tweetContent instanceof HTMLElement) {
          tweetContent.style.filter = "none";
        }
        tweet.style.filter = "none";
        overlay.removeChild(button);
        tweet.style.pointerEvents = "auto";
        tweet.style.position = "static";
        overlay.style.display = "none";
      });
    }
  });
}

function createWatchListButtons(
  tweet: HTMLElement,
  handleElement: Element,
  handle: string | null,
  isInTargetList: boolean
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
  `;

  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.textContent = isInTargetList
    ? "Remove from Watchlist"
    : "Add to Watchlist";
  button.style.cssText = `
    padding: 2px 8px;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    background-color: ${isInTargetList ? "#ff4444" : "#1da1f2"};
    color: white;
    border: none;
    line-height: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    white-space: nowrap;
  `;

  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleWatchlistAction(handle);
  });

  buttonContainer.appendChild(button);

  // Find the correct parent element (username container)
  const usernameContainer = handleElement.closest('[data-testid="User-Name"]');
  if (usernameContainer) {
    usernameContainer.appendChild(buttonContainer);
  }
}

function highlightParodyAccounts(): void {
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = (data.targetHandles || []) as TargetHandle[];
    console.log("Initial targetHandles from storage:", targetHandles);

    const tweetArticles = document.querySelectorAll<HTMLElement>(
      'article[data-testid="tweet"]'
    );

    tweetArticles.forEach((tweet) => {
      const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
      if (handleElement) {
        const handle = handleElement.textContent;
        if (handle) {
          const isInTargetList = targetHandles.some(
            (th) => th.handle === handle
          );
          styleTargetTweets(isInTargetList, tweet);
          createWatchListButtons(tweet, handleElement, handle, isInTargetList);
        }
      }
    });
  });
}

// Initial setup and mutation observer
document.addEventListener("DOMContentLoaded", highlightParodyAccounts);
new MutationObserver(highlightParodyAccounts).observe(document, {
  subtree: true,
  childList: true,
});
