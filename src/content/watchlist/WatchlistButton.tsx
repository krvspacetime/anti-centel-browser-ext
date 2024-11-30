interface WatchlistButtonProps {
  handle: string;
  onClick: () => void;
}

export const WatchlistButton = ({ handle, onClick }: WatchlistButtonProps) => {
  const button = document.createElement("button");
  button.className = "watchlist-button";
  button.dataset.handle = handle;

  button.addEventListener("click", onClick);
  return button;
};

export const WatchlistButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
      classname: watchlist-button-container;
      display: inline-flex;
      align-items: center;
      margin-left: 8px;
      position: relative;
      top: -2px;
      z-index: 1000;
  `;

  return buttonContainer;
};
