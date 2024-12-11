import { tagIconMapper } from "../data";

function createTweetOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "tweet-overlay";
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: "none";
    pointer-events: auto;
    backdrop-filter: blur(8px);
    outline: 1px solid gold;
    pointer-events: none;
    z-index: 2
  `;

  return overlay;
}

const createShowTweetButton = (onClick: () => void) => {
  const showTweetButton = document.createElement("button");
  showTweetButton.className = "show-tweet-button";
  showTweetButton.textContent = "Show Tweet";
  showTweetButton.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background: rgba(255,255,255,0.1);
    outline: rgba(255,255,255,0.3)
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    pointer-events: auto;
  `;

  showTweetButton.addEventListener("click", onClick);

  return showTweetButton;
};

const createHideTweetButton = (onClick: () => void) => {
  const hideTweetButton = document.createElement("button");
  hideTweetButton.className = "hide-tweet-button";
  hideTweetButton.textContent = "Hide Tweet";
  hideTweetButton.style.cssText = `
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    background: rgba(255,255,255,0.1);
    outline: rgba(255,255,255,0.3)
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    pointer-events: auto;
  `;

  hideTweetButton.addEventListener("click", onClick);

  return hideTweetButton;
};

const createTweetBadge = (handle: string, tag: string) => {
  const badgeContainer = document.createElement("div");
  badgeContainer.style.cssText = `
    position: absolute;
    top: 1%;
    right: 1%;
    background: transparent;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    text-align: center;
    font-size: 15px;
    font-family: "Inter", sans-serif;
    pointer-events: auto;
    z-index: 3;
  `;

  const tweetBadge = document.createElement("div");
  tweetBadge.innerHTML = tagIconMapper(tag);
  tweetBadge.className = "tweet-badge";

  // Create tooltip element
  const tooltip = document.createElement("div");
  const categoryLabel = tag.replace("_", " ").split(" ");
  const upperCaseCategoryLabel = categoryLabel.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  tooltip.textContent = `${handle} - ${upperCaseCategoryLabel.join(" ")}`; // Set tooltip text to the tag
  tooltip.className = "tag-overlay-tooltip"; // Add a class for styling
  tooltip.style.alignItems = "center";
  tooltip.style.justifyContent = "center";
  tooltip.style.cssText = `
    visibility: visible;
    font-size: 0.9 rem;
    background-color: black;
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    z-index: 3;
    margin-right: 10px;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s linear;
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
  `;

  badgeContainer.appendChild(tweetBadge);
  badgeContainer.appendChild(tooltip); // Append tooltip to the badge

  tweetBadge.addEventListener("mouseover", () => {
    console.log("tooltip in");
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1"; // Show tooltip
  });

  tweetBadge.addEventListener("mouseout", () => {
    console.log("tooltip out");
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0"; // Hide tooltip
  });

  return badgeContainer;
};

const createButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: row;
    flex-direction: column;
    gap: 2px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background: transparent;
  `;
  return buttonContainer;
};

// export const createRemoveButton = (onClick: (e: MouseEvent) => void) => {
//   const removeButton = document.createElement("button");
//   removeButton.textContent = "X";
//   removeButton.style.cssText = `
//     display: none;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//   `;

//   removeButton.addEventListener("click", onClick);

//   return removeButton;
// };

export const OverlayWithRemoveButton = (handle: string, category: string) => {
  const overlay = createTweetOverlay();
  const buttonContainer = createButtonContainer();
  const badge = createTweetBadge(handle, category);

  const showButton = createShowTweetButton(() => {
    // Define the action for hideTweetButton click
    overlay.style.backdropFilter = "blur(0px)";
    showButton.style.display = "none";
    hideButton.style.display = "block";
    badge.style.display = "none";
  });

  // Create the remove button with an updated onClick function
  const hideButton = createHideTweetButton(() => {
    overlay.style.backdropFilter = "blur(8px)"; // Example action to hide the overlay
    showButton.style.display = "block";
    hideButton.style.display = "none";
    badge.style.display = "block";
  });

  overlay.appendChild(buttonContainer);
  buttonContainer.appendChild(showButton);
  buttonContainer.appendChild(hideButton);
  buttonContainer.appendChild(badge);
  return overlay;
};
