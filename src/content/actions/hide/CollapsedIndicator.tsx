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

    // Add a data attribute to track the collapsed state
    tweet.dataset.collapsed = "true";
    
    // Store the original height for future reference
    const originalHeight = tweet.scrollHeight;
    
    // Set initial state
    tweet.style.height = "0px";
    
    // Keep track of any ongoing animations
    let animationInProgress = false;
    
    // Update the click handler to modify text properly
    collapseIndicator.addEventListener("click", (e) => {
      if (e.target !== optionsButton && !animationInProgress) {
        // Set flag to prevent multiple clicks during animation
        animationInProgress = true;
        
        // Get current state
        const isCurrentlyCollapsed = tweet.dataset.collapsed === "true";
        
        // Add transition for smooth animation
        tweet.style.transition = "height 0.3s ease";
        
        // Set the height based on collapsed state
        if (isCurrentlyCollapsed) {
          // Expanding: Set to the stored original height
          tweet.style.height = `${originalHeight}px`;
          
          // Update the text
          textContainer.textContent = ""; // Clear existing content
          textContainer.appendChild(document.createTextNode("Showing tweet from "));
          textContainer.appendChild(handleSpan.cloneNode(true));
          textContainer.appendChild(document.createTextNode(" - "));
          textContainer.appendChild(tagSpan.cloneNode(true));
        } else {
          // Collapsing: Set to 0
          tweet.style.height = "0px";
          
          // Update the text
          textContainer.textContent = ""; // Clear existing content
          textContainer.appendChild(document.createTextNode("Hidden tweet from "));
          textContainer.appendChild(handleSpan.cloneNode(true));
          textContainer.appendChild(document.createTextNode(" - "));
          textContainer.appendChild(tagSpan.cloneNode(true));
        }
        
        // Toggle the collapsed state
        tweet.dataset.collapsed = isCurrentlyCollapsed ? "false" : "true";
        
        // Wait for animation to complete before allowing another click
        setTimeout(() => {
          animationInProgress = false;
        }, 350); // Slightly longer than the animation to ensure it completes
      }
    });

    // Append elements
    collapseIndicator.appendChild(textContainer);
    collapseIndicator.appendChild(optionsButton);
    collapseIndicator.appendChild(dialog);

    return collapseIndicator;
  }
};
