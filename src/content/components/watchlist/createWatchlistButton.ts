import { TargetHandle } from "../../types/targets";
import { updateWatchlistButtonState } from "./updateWatchlistButtonState";

export function createWatchlistButton({
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
  updateWatchlistButtonState(button, isInTargetList, targetHandles);

  button.addEventListener("click", onClick);
  return button;
}

export function createWatchlistButtonContainer(): HTMLElement {
  const container = document.createElement("div");
  container.className = "watchlist-button-container";
  container.style.cssText = `
    margin-left: 4px;
    display: flex;
    align-items: center;
  `;
  return container;
}
