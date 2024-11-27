chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.targetHandles) {
    updateBadge();
  }
});

function updateBadge() {
  chrome.storage.sync.get("targetHandles", (data) => {
    const targetHandles = data.targetHandles || [];
    const length = targetHandles.length.toString();

    chrome.action.setBadgeText({ text: length });
    chrome.action.setBadgeBackgroundColor({ color: "#132e35" }); // Red background
    chrome.action.setBadgeTextColor({ color: "#ededed" });
  });
}
