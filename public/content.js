function highlightParodyAccounts() {
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = data.targetHandles || [];
    console.log("Initial targetHandles from storage:", targetHandles);

    const tweetArticles = document.querySelectorAll(
      'article[data-testid="tweet"]'
    );

    tweetArticles.forEach((tweet) => {
      const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
      if (handleElement) {
        const handle = handleElement.textContent;

        // Check if the handle is in the list (handling both old and new format)
        const isInTargetList = targetHandles.some((th) =>
          typeof th === "object" ? th.handle === handle : th === handle
        );

        styleTargetTweets(isInTargetList, tweet);
        createWatchListButtons(tweet, handleElement, handle, isInTargetList);
      }
    });
  });
}

function styleTargetTweets(isInTargetList, tweet) {
  // Get the handle from the tweet
  const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
  const handle = handleElement ? handleElement.textContent : null;

  // Get category from storage
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = data.targetHandles || [];
    const targetInfo = targetHandles.find((th) =>
      typeof th === "object" ? th.handle === handle : th === handle
    );

    if (isInTargetList && !tweet.querySelector(".parody-overlay")) {
      tweet.style.position = "relative";
      tweet.style.pointerEvents = "none";

      // Apply different blur and overlay styles based on category
      const category = targetInfo?.category || "default";
      const styleConfig = {
        fake_news: {
          tweetBlur: "8px",
          contentBlur: "2px",
          overlayColor: "rgba(255, 0, 0, 0.3)", // Red tint
          buttonColor: "#FF4444",
        },
        parody: {
          tweetBlur: "1px",
          contentBlur: "1px",
          // overlayColor: "rgba(255, 165, 0, 0.3)", // Orange tint
          overlayColor: "none",
          buttonColor: "#FFA500",
        },
        satire: {
          tweetBlur: "1px",
          contentBlur: "1px",
          // overlayColor: "rgba(255, 255, 0, 0.3)", // Yellow tint
          overlayColor: "none",
          buttonColor: "#4da057",
        },
        default: {
          tweetBlur: "5px",
          contentBlur: "2px",
          overlayColor: "rgba(0, 0, 0, 0.3)", // Original black tint
          buttonColor: "#1DA1F2",
        },
      };

      const style = styleConfig[category];
      tweet.style.filter = `blur(${style.tweetBlur})`;

      const tweetContent = tweet.querySelector('[data-testid="tweetText"]');
      if (tweetContent) {
        tweetContent.style.filter = `blur(${style.contentBlur})`;
      }

      // Create an overlay for the tweet
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

      // Create a button to remove blur
      const button = document.createElement("button");
      button.textContent = "Show Tweet";
      button.style.padding = "8px 16px";
      button.style.backgroundColor = style.buttonColor;
      button.style.color = "white";
      button.style.border = "none";
      button.style.borderRadius = "4px";
      button.style.cursor = "pointer";
      button.style.fontSize = "14px";
      button.style.zIndex = "10000";

      // Append button to the overlay and overlay to tweet
      overlay.appendChild(button);
      tweet.appendChild(overlay);

      // Add click event to remove blur and overlay
      button.addEventListener("click", () => {
        tweetContent.style.filter = "none";
        tweet.style.filter = "none";
        overlay.removeChild(button);
        tweet.style.pointerEvents = "auto";
        tweet.style.position = "static";
        overlay.style.display = "none";
      });
    }
  });
}

function createWatchListButtons(tweet, handleElement, handle, isInTargetList) {
  let watchListButton = tweet.querySelector(".add-to-target-button");
  if (!watchListButton) {
    watchListButton = document.createElement("button");
    watchListButton.className = "add-to-target-button";
    watchListButton.style.marginLeft = "8px";
    watchListButton.style.padding = "2px 6px";
    watchListButton.style.fontSize = "12px";
    watchListButton.style.cursor = "pointer";

    // Prevent navigation to profile on button click
    watchListButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleWatchlistAction(handle);
    });

    handleElement.parentElement.appendChild(watchListButton);
  }

  // Update button text and style based on target list status
  watchListButton.disabled = false;
  watchListButton.textContent = isInTargetList
    ? "REMOVE FROM WATCHLIST"
    : "ADD TO WATCHLIST";
  watchListButton.style.backgroundColor = isInTargetList
    ? "green"
    : "whitesmoke";
  watchListButton.style.color = isInTargetList ? "white" : "black";
}

// Function to handle button click to add/remove handles from the list
async function handleWatchlistAction(handle) {
  chrome.storage.sync.get("targetHandles", async (data) => {
    const targetHandles = data.targetHandles || [];

    if (
      !targetHandles.some((th) =>
        typeof th === "object" ? th.handle === handle : th === handle
      )
    ) {
      // Show category selection modal
      const category = await createCategoryModal(handle);

      if (category) {
        // Add new handle with category
        const newHandle = {
          handle: handle,
          category: category,
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
      // Remove handle logic
      const newHandles = targetHandles.filter((th) =>
        typeof th === "object" ? th.handle !== handle : th !== handle
      );

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

function createCategoryModal(handle) {
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
      background: black;
      color: white;
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

    const categories = ["default", "fake_news", "parody", "satire"];
    const buttons = categories.map((category) => {
      const button = document.createElement("button");
      button.textContent =
        category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
      button.style.cssText = `
        width: 100%;
        padding: 8px;
        margin: 4px 0;
        background: black;
        color: white;
        border: 1px solid white;
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

// Initial setup and mutation observer to handle new tweets
document.addEventListener("DOMContentLoaded", highlightParodyAccounts);
new MutationObserver(highlightParodyAccounts).observe(document, {
  subtree: true,
  childList: true,
});
