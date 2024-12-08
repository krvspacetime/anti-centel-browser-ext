import { settings } from "../../../icons/icons";
import { SettingsDialog } from "./SettingsDialog";

interface CollapsedIndicatorProps {
  action: "hide" | "blur";
  tweet: HTMLElement;
  handle: string;
  tag: string;
}

export const CollapsedIndicator = ({
  tweet,
  handle,
  action,
  tag,
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

    // Create text container
    const textContainer = document.createElement("span");
    textContainer.textContent = `Hidden tweet from ${handle} - ${tag}`;

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

    // Add click handlers
    collapseIndicator.addEventListener("click", (e) => {
      if (e.target !== optionsButton) {
        const currentHeight = tweet.style.height;
        if (currentHeight === "0px") {
          tweet.style.height = `${tweet.scrollHeight}px`;
          textContainer.textContent = `Showing tweet from ${handle} - ${tag}`;
        } else {
          tweet.style.height = "0px";
          textContainer.textContent = `Hidden tweet from ${handle} - ${tag}`;
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
