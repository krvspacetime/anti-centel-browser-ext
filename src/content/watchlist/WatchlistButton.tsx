import { TargetHandle } from "../types";
import { updateButtonState } from "./WatchlistButtonUpdate";

export function WatchlistButton({
  handle,
  onClick,
  targetHandles,
}: {
  handle: string;
  onClick: () => void;
  targetHandles: TargetHandle[];
}): HTMLElement {
  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.dataset.handle = handle;

  const isInTargetList = targetHandles.some((th) => th.handle === handle);

  // Initialize the button with the correct state
  updateButtonState(button, isInTargetList, targetHandles);

  button.addEventListener("click", onClick);
  return button;
}

export function WatchlistButtonContainer(): HTMLElement {
  const container = document.createElement("div");
  container.className = "watchlist-button-container";
  container.style.cssText = `
    margin-left: 4px;
    display: flex;
    align-items: center;
  `;
  return container;
}
