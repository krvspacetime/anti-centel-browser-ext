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
        if (isInTargetList) {
          tweet.style.outline = "1px solid lightblue";
        }

        // Add or update the button next to the handle
        let button = tweet.querySelector(".add-to-target-button");
        if (!button) {
          button = document.createElement("button");
          button.className = "add-to-target-button";
          button.style.marginLeft = "8px";
          button.style.padding = "2px 6px";
          button.style.fontSize = "12px";
          button.style.cursor = "pointer";

          // Prevent navigation to profile on button click
          button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleButtonClick(handle);
          });

          handleElement.parentElement.appendChild(button);
        }

        // Update button text and style based on target list status
        button.textContent = isInTargetList
          ? "ON WATCHLIST"
          : "ADD TO WATCHLIST";
        button.disabled = isInTargetList;
        button.style.backgroundColor = isInTargetList ? "green" : "whitesmoke";
        button.style.color = isInTargetList ? "white" : "black";
      }
    });
  });
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
