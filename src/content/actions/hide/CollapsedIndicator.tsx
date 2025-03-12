import { settings } from "../../../icons/icons";
import { StyleSettings, Tags } from "../../types";
import { SettingsDialog } from "./SettingsDialog";

interface CollapsedIndicatorProps {
  action: "hide" | "blur";
  tweet: HTMLElement;
  handle: string;
  tag: Tags;
  styleSettings: StyleSettings;
}

const tagColor = (tag: Tags) => {
  // Log the incoming tag and enum value to debug
  console.log("Tag:", tag);
  console.log("Enum:", Tags.ON_WATCHLIST);

  switch (tag) {
    case Tags.ON_WATCHLIST:
      return "red";
    case Tags.FAKE_NEWS:
      return "yellow";
    case Tags.SPAM:
      return "red";
    case Tags.BOT:
      return "blue";
    case Tags.CONSPIRACY:
      return "orange";
    case Tags.SEXUAL:
      return "purple";
    case Tags.PARODY:
      return "green";
    case Tags.FAN_PAGE:
      return "scarlet";
    default:
      return "blue";
  }
};

export const CollapsedIndicator = ({
  tweet,
  handle,
  action,
  tag,
  styleSettings,
}: CollapsedIndicatorProps) => {
  if (action === "hide") {
    // Create collapse indicator
    const collapseIndicator = document.createElement("div");
    collapseIndicator.className = "collapse-indicator";
    collapseIndicator.style.cssText = `
        width: 100%;
        padding: 8px;
        color: #71767b;
        font-size: 13px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      `;

    // Create text container with styled handle and tag
    const textContainer = document.createElement("span");

    const handleSpan = document.createElement("span");
    handleSpan.textContent = handle;
    handleSpan.style.cssText = `
        color: ${styleSettings.hide.collapsedTweetUsernameColor};
        font-weight: 600;
    `;

    const tagSpan = document.createElement("span");
    tagSpan.textContent = tag;
    const color = tagColor(tag);
    tagSpan.style.cssText = `
        color: white;
        font-weight: 500;
        font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 13px;
        background-color: ${color};
        padding: 2px 4px;
        border-radius: 4px;
    `;

    textContainer.appendChild(document.createTextNode("Hidden tweet from "));
    textContainer.appendChild(handleSpan);
    textContainer.appendChild(document.createTextNode(" - "));
    textContainer.appendChild(tagSpan);

    // Create options button
    const optionsButton = document.createElement("button");
    optionsButton.innerHTML = settings;
    optionsButton.style.cssText = `
        background: none;
        border: none;
        color: #71767b;
        cursor: pointer;
        padding: 0 8px;
    `;

    const dialog = SettingsDialog(handle, tag);

    // Modify options button click handler
    optionsButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent collapse indicator click
      dialog.showModal();
    });

    // Modify dialog click handlers
    dialog.addEventListener("click", (e) => {
      e.stopPropagation(); // Add this to prevent bubbling
      if (e.target === dialog) {
        e.preventDefault(); // Prevent default dialog behavior
        dialog.close();
      }
    });

    // Update the click handler to modify text properly
    collapseIndicator.addEventListener("click", (e) => {
      if (e.target !== optionsButton) {
        const currentHeight = tweet.style.height;
        if (currentHeight === "0px") {
          tweet.style.height = `${tweet.scrollHeight}px`;
          textContainer.textContent = ""; // Clear existing content
          textContainer.appendChild(
            document.createTextNode("Showing tweet from "),
          );
          textContainer.appendChild(handleSpan.cloneNode(true));
          textContainer.appendChild(document.createTextNode(" - "));
          textContainer.appendChild(tagSpan.cloneNode(true));
        } else {
          tweet.style.height = "0px";
          textContainer.textContent = ""; // Clear existing content
          textContainer.appendChild(
            document.createTextNode("Hidden tweet from "),
          );
          textContainer.appendChild(handleSpan.cloneNode(true));
          textContainer.appendChild(document.createTextNode(" - "));
          textContainer.appendChild(tagSpan.cloneNode(true));
        }
      }
    });

    // Append elements
    collapseIndicator.appendChild(textContainer);
    collapseIndicator.appendChild(optionsButton);
    collapseIndicator.appendChild(dialog);

    return collapseIndicator;
  }
};
