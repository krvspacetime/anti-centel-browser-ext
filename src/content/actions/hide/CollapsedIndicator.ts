import { settings } from "../../../icons/icons";
import { StyleSettings, Tags } from "../../types";
import { SettingsDialog } from "./SettingsDialog";
import { getTagIcon } from "../../utils/iconUtils";

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

    // Define theme colors
    const colors = {
      // Background colors
      bgDark: "#15181c",
      bgLight: "#f7f9f9",

      // Text colors
      textDark: "#71767b",
      textLight: "#536471",

      // Accent colors
      accentDark: "#1d9bf0",
      accentLight: "#1d9bf0",

      // Username colors
      usernameDark: styleSettings.hide.collapsedTweetUsernameColor || "#ffffff",
      usernameLight: "#000000",

      // Border colors
      borderDark: "#2f3336",
      borderLight: "#eff3f4",

      // Hover colors
      hoverBgDark: "#1e2732",
      hoverBgLight: "#e6e7e8",
    };

    // Create collapse indicator
    const collapseIndicator = document.createElement("div");
    collapseIndicator.className = "collapse-indicator";
    collapseIndicator.style.cssText = `
      width: 100%;
      color: ${isDarkTheme ? colors.textDark : colors.textLight};
      font-size: 14px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      background-color: ${isDarkTheme ? colors.bgDark : colors.bgLight};
      border-radius: 12px;
      margin: 4px 0;
      border: 1px solid ${isDarkTheme ? colors.borderDark : colors.borderLight};
      transition: background-color 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    `;

    // Add hover effect
    collapseIndicator.addEventListener("mouseenter", () => {
      collapseIndicator.style.backgroundColor = isDarkTheme
        ? colors.hoverBgDark
        : colors.hoverBgLight;
    });

    collapseIndicator.addEventListener("mouseleave", () => {
      collapseIndicator.style.backgroundColor = isDarkTheme
        ? colors.bgDark
        : colors.bgLight;
    });

    // Create text container with styled handle and tag
    const textContainer = document.createElement("div");
    textContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    `;

    const statusText = document.createElement("span");
    statusText.textContent = "Hidden tweet from";
    statusText.style.cssText = `
      font-weight: 400;
    `;

    const handleSpan = document.createElement("span");
    handleSpan.textContent = handle;
    handleSpan.style.cssText = `
      color: ${isDarkTheme ? colors.usernameDark : colors.usernameLight};
      font-weight: 700;
      margin: 0 4px;
    `;

    // Create tag container with icon
    const tagContainer = document.createElement("div");
    tagContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: ${isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
      padding: 2px 8px;
      border-radius: 16px;
      margin-left: 4px;
    `;

    // Get the SVG icon for the tag
    const iconSvg = getTagIcon(tag);
    const iconContainer = document.createElement("div");
    iconContainer.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
    `;
    iconContainer.innerHTML = iconSvg;

    // Set icon color
    const svgElement = iconContainer.querySelector("svg");
    if (svgElement) {
      svgElement.style.fill = isDarkTheme
        ? colors.usernameDark
        : colors.usernameLight;
      svgElement.style.width = "14px";
      svgElement.style.height = "14px";
    }

    // Format tag text
    let formattedTag = tag.replace(/_/g, " ");
    formattedTag =
      formattedTag.charAt(0).toUpperCase() +
      formattedTag.slice(1).toLowerCase();

    const tagText = document.createElement("span");
    tagText.textContent = formattedTag;
    tagText.style.cssText = `
      color: ${isDarkTheme ? colors.usernameDark : colors.usernameLight};
      font-weight: 600;
      font-size: 12px;
    `;

    tagContainer.appendChild(iconContainer);
    tagContainer.appendChild(tagText);

    // Create options button with improved styling
    const optionsButton = document.createElement("button");
    optionsButton.innerHTML = settings;
    optionsButton.style.cssText = `
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    `;
    optionsButton.style.color = isDarkTheme
      ? colors.usernameDark
      : colors.usernameLight;

    // Add hover effect to settings button
    optionsButton.addEventListener("mouseenter", () => {
      optionsButton.style.backgroundColor = isDarkTheme
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)";
    });

    optionsButton.addEventListener("mouseleave", () => {
      optionsButton.style.backgroundColor = "transparent";
    });

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
          statusText.textContent = "Showing tweet from";
        } else {
          // Collapsing: Set to 0
          tweet.style.height = "0px";

          // Update the text
          statusText.textContent = "Hidden tweet from";
        }

        // Toggle the collapsed state
        tweet.dataset.collapsed = isCurrentlyCollapsed ? "false" : "true";

        // Wait for animation to complete before allowing another click
        setTimeout(() => {
          animationInProgress = false;
        }, 350); // Slightly longer than the animation to ensure it completes
      }
    });

    // Assemble the components
    textContainer.appendChild(statusText);
    textContainer.appendChild(handleSpan);
    textContainer.appendChild(tagContainer);

    // Append elements
    collapseIndicator.appendChild(textContainer);
    collapseIndicator.appendChild(optionsButton);
    collapseIndicator.appendChild(dialog);

    return collapseIndicator;
  }
};
