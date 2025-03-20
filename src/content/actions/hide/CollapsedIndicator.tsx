import { settings } from "../../../icons/icons";
import { tagIconMapper } from "../../data";
import { StyleSettings, Tags } from "../../types";
import { SettingsDialog } from "./SettingsDialog";

interface CollapsedIndicatorProps {
  action: "hide" | "blur";
  tweet: HTMLElement;
  handle: string;
  tag: Tags;
  styleSettings: StyleSettings;
}

export const CollapsedIndicator = ({
  tweet,
  handle,
  action,
  tag,
  styleSettings,
}: CollapsedIndicatorProps) => {
  if (action === "hide") {
    // Determine if we're in dark or light theme
    const isDarkTheme = styleSettings.theme === "dark";
    const textColor = isDarkTheme ? "#71767b" : "#536471";
    const usernameColor = isDarkTheme
      ? styleSettings.hide.collapsedTweetUsernameColor
      : "#000000";

    // Create collapse indicator
    const collapseIndicator = document.createElement("div");
    collapseIndicator.className = "collapse-indicator";
    collapseIndicator.style.cssText = `
        width: 100%;
        color: ${textColor};
        padding-left: 4px;
        padding-top: 1px;
        padding-bottom: 1px;
        font-size: 13px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background-color: ${isDarkTheme ? "transparent" : "rgb(215 222 222)"};
      `;

    // Create text container with styled handle and tag
    const textContainer = document.createElement("span");

    const handleSpan = document.createElement("span");
    handleSpan.textContent = handle;
    handleSpan.style.cssText = `
        color: ${usernameColor};
        font-weight: 600;
    `;

    const tagSpan = document.createElement("span");
    tagSpan.textContent = tag;
    tagSpan.innerHTML = `${tag} ${tagIconMapper(tag)} `;
    tagSpan.style.cssText = `
        color: ${isDarkTheme ? styleSettings.hide.collapsedTweetUsernameColor : "#000000"};
        font-weight: 500;
        font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 13px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        gap: 2px;
    `;

    textContainer.appendChild(document.createTextNode("Hidden tweet from "));
    textContainer.appendChild(handleSpan);
    textContainer.appendChild(document.createTextNode(" - "));
    textContainer.appendChild(tagSpan);

    // Create options button
    const optionsButton = document.createElement("button");
    optionsButton.innerHTML = settings;
    optionsButton.style.cssText = `
        background: transparent;
        border: none;
        cursor: pointer;
        margin-right: 4px;
    `;
    optionsButton.style.color = isDarkTheme ? "white" : "black";

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
