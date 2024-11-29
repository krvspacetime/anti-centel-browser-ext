export function createTweetOverlay(style: any) {
  const overlay = document.createElement("div");
  overlay.className = "tweet-overlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = style.overlayColor;
  overlay.style.pointerEvents = "auto";
  overlay.style.backdropFilter = "blur(10px)";
  overlay.style.zIndex = "10";

  return overlay;
}

export const createShowTweetButton = (style: any, onClick: () => void) => {
  const showTweetButton = document.createElement("button");
  showTweetButton.style.position = "absolute";
  showTweetButton.style.top = "50%";
  showTweetButton.style.left = "50%";
  showTweetButton.style.transform = "translate(-50%, -50%)";
  showTweetButton.textContent = "Show Tweet";
  showTweetButton.style.padding = "8px 16px";
  showTweetButton.style.backgroundColor = style.buttonColor;
  showTweetButton.style.color = "white";
  showTweetButton.style.border = "none";
  showTweetButton.style.borderRadius = "4px";
  showTweetButton.style.cursor = "pointer";
  showTweetButton.style.fontSize = "14px";
  showTweetButton.style.pointerEvents = "auto";
  showTweetButton.style.zIndex = "10000";

  showTweetButton.addEventListener("click", onClick);

  return showTweetButton;
};

export const createHideTweetButton = (onClick: () => void) => {
  const hideTweetButton = document.createElement("button");
  hideTweetButton.textContent = "Hide Tweet";
  hideTweetButton.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;

  hideTweetButton.addEventListener("click", onClick);

  return hideTweetButton;
};

export const createTweetBadge = (handle: string, category: string) => {
  const tweetBadge = document.createElement("div");
  tweetBadge.textContent = `${handle} - ${category}`;
  tweetBadge.className = "tweet-badge";
  tweetBadge.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    outline: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    text-align: center;
    font-size: 15px;
    z-index: 1000;
  `;

  return tweetBadge;
};
