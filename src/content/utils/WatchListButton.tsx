import { handleWatchlistAction } from "../content";

export function updateButtonState(
  button: HTMLElement,
  isInTargetList: boolean
): void {
  button.textContent = isInTargetList ? "REMOVE" : "ADD";
  button.style.cssText = `
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      background-color: ${isInTargetList ? "red" : "transparent"};
      color: white;
      border: none;
      line-height: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      outline: 1px solid rgba(255, 255, 255, 0.3);
      &:hover {
        background-color: ${isInTargetList ? "#ff4444" : "#1da1f2"};
      }
    `;
}

export function createWatchListButtons(
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
      z-index: 1000;
    `;

  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.dataset.handle = handle;
  updateButtonState(button, isInTargetList);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleWatchlistAction(handle);
  });

  buttonContainer.appendChild(button);

  const usernameContainer = handleElement.closest('[data-testid="User-Name"]');
  if (usernameContainer) {
    usernameContainer.appendChild(buttonContainer);
  }
}
