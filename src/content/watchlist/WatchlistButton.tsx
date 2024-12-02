// Then in your WatchlistButton function, you can add the icon:
export function WatchlistButton({
  handle,
  onClick,
}: {
  handle: string;
  onClick: () => void;
}): HTMLElement {
  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.dataset.handle = handle;
  button.textContent = "MONITOR 👁️";

  // Add a text node for the button text
  // button.appendChild(document.createTextNode("MONITOR"));

  button.addEventListener("click", onClick);
  return button;
}

export function WatchlistButtonContainer(): HTMLElement {
  const container = document.createElement("div");
  container.className = "watchlist-button-container";
  container.style.cssText = `
    margin-left: 4px;
  `;
  return container;
}
