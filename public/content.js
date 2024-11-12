function highlightParodyAccounts() {
  // Retrieve the target handles from chrome.storage
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = data.targetHandles || [];
    console.log("Initial targetHandles from storage:", targetHandles);

    // Select all tweets with data-testid="tweet"
    const tweetArticles = document.querySelectorAll(
      'article[data-testid="tweet"]'
    );

    tweetArticles.forEach((tweet) => {
      const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
      if (handleElement) {
        const handle = handleElement.textContent;

        // Check if the handle is already in the list
        const isInTargetList = targetHandles.includes(handle);

        // Style the tweet if the handle is in targetHandles
        styleTargetTweets(isInTargetList, tweet);

        // Add or update the button next to the handle
        createWatchListButtons(tweet, handleElement, handle, isInTargetList);
      }
    });
  });
}

function styleTargetTweets(isInTargetList, tweet) {
  if (isInTargetList && !tweet.querySelector(".parody-overlay")) {
    tweet.style.position = "relative";
    tweet.style.filter = "blur(8px)";
    tweet.style.pointerEvents = "none";

    const tweetContent = tweet.querySelector('[data-testid="tweetText"]');
    if (tweetContent) {
      tweetContent.style.filter = "blur(2px)";
    }

    // Create an overlay for the tweet
    const overlay = document.createElement("div");
    overlay.className = "parody-overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.pointerEvents = "auto";
    overlay.style.zIndex = "10";

    // Create a button to remove blur
    const button = document.createElement("button");
    button.textContent = "Show Tweet";
    button.style.padding = "8px 16px";
    button.style.backgroundColor = "#1DA1F2";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.zIndex = "11";

    // Append button to the overlay and overlay to tweet
    overlay.appendChild(button);
    tweet.appendChild(overlay);

    // Add click event to remove blur and overlay
    button.addEventListener("click", () => {
      tweetContent.style.filter = "none"; // Remove blur from content
      tweet.style.filter = "none"; // Remove blur from tweet
      overlay.removeChild(button); // Remove the overlay
    });
  }
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
      handleButtonClick(handle);
    });

    handleElement.parentElement.appendChild(watchListButton);
  }

  // Update button text and style based on target list status
  watchListButton.textContent = isInTargetList
    ? "ON WATCHLIST"
    : "ADD TO WATCHLIST";
  watchListButton.disabled = isInTargetList;
  watchListButton.style.backgroundColor = isInTargetList
    ? "green"
    : "whitesmoke";
  watchListButton.style.color = isInTargetList ? "white" : "black";
}

// Function to handle button click to add/remove handles from the list
function handleButtonClick(handle) {
  // eslint-disable-next-line no-undef
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = data.targetHandles || [];

    // Check if handle is already in the list
    if (!targetHandles.includes(handle)) {
      // Add the handle and update storage
      targetHandles.push(handle);
      // eslint-disable-next-line no-undef
      chrome.storage.sync.set({ targetHandles }, () => {
        console.log(`${handle} added to target list.`);
        // Notify the React app to update
        // eslint-disable-next-line no-undef
        chrome.runtime.sendMessage({
          type: "updateHandles",
          data: targetHandles,
        });
        // Refresh the UI to show the updated button states
        highlightParodyAccounts();
      });
    }
  });
}

// Initial setup and mutation observer to handle new tweets
document.addEventListener("DOMContentLoaded", highlightParodyAccounts);
new MutationObserver(highlightParodyAccounts).observe(document, {
  subtree: true,
  childList: true,
});
