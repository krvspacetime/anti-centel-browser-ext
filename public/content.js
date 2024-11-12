function highlightParodyAccounts() {
  // Retrieve the target handles from chrome.storage
  chrome.storage.sync.get("targetHandles", (data) => {
    // const targetHandles = ["@elonmusk", "@FIBA", "@FabrizioRomano", "@IGN"];
    const targetHandles = data.targetHandles || [];
    // const targetHandles = data.targetHandles || [
    //   "@elonmusk",
    //   "@FIBA",
    //   "@FabrizioRomano",
    //   "@IGN",
    //   "@eurogamer",
    //   "@premierleague",
    // ];
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "updateHandles") {
        const targetHandles = message.data;
        console.log("Updated targetHandles from React:", targetHandles);
        // You can also trigger any updates on the page using this new data
      }
    });
    console.log("Initial targetHandles from storage:", targetHandles);
    const tweetArticles = document.querySelectorAll(
      'article[data-testid="tweet"]'
    );
    // Listen for updates to targetHandles from React

    tweetArticles.forEach((tweet) => {
      const handleElement = tweet.querySelectorAll('a[role="link"] span')[3];
      if (handleElement) {
        const handle = handleElement.textContent;
        if (targetHandles.includes(handle)) {
          tweet.style.outline = "1px solid lightblue";
        }
      }
    });
  });
}

// Run the function to highlight parody accounts on initial load and when new tweets load
document.addEventListener("DOMContentLoaded", highlightParodyAccounts);
new MutationObserver(highlightParodyAccounts).observe(document, {
  subtree: true,
  childList: true,
});
