/**
 * Modal for selecting category and action for watchlist
 */

import { StyleSettings } from "../../types";
import { Tags, Actions, Action } from "../../types/targets";
import { createElement } from "../../utils/domUtils";
import { getTagIcon } from "../../utils/iconUtils";

/**
 * Create a modal for selecting category and action
 * @param handle The handle to add to the watchlist
 * @returns Promise that resolves with the selected category and action, or null if cancelled
 */
export function createCategoryModal(
  handle: string,
  styleSettings: StyleSettings,
): Promise<{ tag: Tags; action: Actions } | null> {
  return new Promise((resolve) => {
    // Define theme colors
    const colors = {
      // Background colors
      modalOverlay: "rgba(0, 0, 0, 0.7)",
      modalBgDark: "#1e1e1e",
      modalBgLight: "#ffffff",

      // Text colors
      textDark: "#e0e0e0",
      textLight: "#333333",

      // Button colors (unselected)
      buttonBgDark: "#2d2d2d",
      buttonBgLight: "#f0f0f0",
      buttonTextDark: "#e0e0e0",
      buttonTextLight: "#333333",
      buttonBorderDark: "#404040",
      buttonBorderLight: "#cccccc",

      // Button colors (selected)
      selectedButtonBgDark: "#0d47a1",
      selectedButtonBgLight: "#1976d2",
      selectedButtonText: "#ffffff",

      // Confirm button
      confirmButtonBgDark: "#0d47a1",
      confirmButtonBgLight: "#1976d2",
      confirmButtonText: "#ffffff",
      
      // Disabled button
      disabledButtonBgDark: "#0d47a1",
      disabledButtonBgLight: "#1976d2",
      disabledButtonText: "#ffffff",
    };

    // Create modal container
    const modalContainer = createElement("div", "", "modal-container");
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "0";
    modalContainer.style.left = "0";
    modalContainer.style.width = "100%";
    modalContainer.style.height = "100%";
    modalContainer.style.backgroundColor = colors.modalOverlay;
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "center";
    modalContainer.style.zIndex = "9999";
    modalContainer.style.backdropFilter = "blur(3px)";
    modalContainer.style.fontFamily = 
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

    // Create modal content
    const modalContent = createElement("div", "", "modal-content");
    modalContent.style.backgroundColor =
      styleSettings.theme === "dark" ? colors.modalBgDark : colors.modalBgLight;
    modalContent.style.borderRadius = "12px";
    modalContent.style.padding = "24px";
    modalContent.style.width = "450px";
    modalContent.style.maxWidth = "90%";
    modalContent.style.boxShadow = 
      styleSettings.theme === "dark" 
        ? "0 10px 25px rgba(0, 0, 0, 0.5)" 
        : "0 10px 25px rgba(0, 0, 0, 0.2)";

    // Create modal title
    const modalTitle = createElement(
      "h2",
      `Add ${handle} to watchlist`,
      "modal-title",
    );
    modalTitle.style.marginTop = "0";
    modalTitle.style.color =
      styleSettings.theme === "dark" ? colors.textDark : colors.textLight;

    // Create category section
    const categorySection = createElement("div", "", "category-section");
    categorySection.style.marginBottom = "16px";

    const categoryLabel = createElement(
      "h3",
      "Select Category:",
      "category-label",
    );
    categoryLabel.style.marginBottom = "8px";
    categoryLabel.style.color =
      styleSettings.theme === "dark" ? colors.textDark : colors.textLight;

    const categoryButtons = createElement("div", "", "category-buttons");
    categoryButtons.style.display = "flex";
    categoryButtons.style.flexWrap = "wrap";
    categoryButtons.style.gap = "8px";

    // Create buttons for each tag
    const tagOptions = Object.values(Tags);
    let selectedTag: Tags | null = null;

    tagOptions.forEach((tag) => {
      // Fix the formatting of tag names by replacing all underscores with spaces
      let formattedTag = tag.replace(/_/g, " ");
      formattedTag =
        formattedTag.charAt(0).toUpperCase() +
        formattedTag.slice(1).toLowerCase();

      // Create button container for icon and text
      const buttonContainer = createElement("div", "", "tag-button-container");
      buttonContainer.style.display = "flex";
      buttonContainer.style.flexDirection = "column";
      buttonContainer.style.alignItems = "center";
      buttonContainer.style.justifyContent = "center";
      buttonContainer.style.width = "90px";
      buttonContainer.style.height = "90px";
      buttonContainer.style.margin = "4px";
      buttonContainer.style.padding = "8px";
      buttonContainer.style.border =
        styleSettings.theme === "dark"
          ? `1px solid ${colors.buttonBorderDark}`
          : `1px solid ${colors.buttonBorderLight}`;
      buttonContainer.style.borderRadius = "8px";
      buttonContainer.style.backgroundColor =
        styleSettings.theme === "dark"
          ? colors.buttonBgDark
          : colors.buttonBgLight;
      buttonContainer.style.color =
        styleSettings.theme === "dark"
          ? colors.buttonTextDark
          : colors.buttonTextLight;
      buttonContainer.style.cursor = "pointer";
      buttonContainer.style.transition = "all 0.2s ease";

      // Add icon
      const iconContainer = createElement("div", "", "icon-container");
      iconContainer.style.display = "flex";
      iconContainer.style.justifyContent = "center";
      iconContainer.style.alignItems = "center";
      iconContainer.style.width = "40px";
      iconContainer.style.height = "40px";
      iconContainer.style.marginBottom = "8px";
      
      // Get icon SVG for the tag
      const iconSvg = getTagIcon(tag);
      iconContainer.innerHTML = iconSvg;
      
      // Set icon color based on theme
      const svgElement = iconContainer.querySelector("svg");
      if (svgElement) {
        svgElement.style.fill = 
          styleSettings.theme === "dark" ? colors.buttonTextDark : colors.buttonTextLight;
      }
      
      // Add text label
      const textLabel = createElement("span", formattedTag, "tag-label");
      textLabel.style.fontSize = "12px";
      textLabel.style.textAlign = "center";
      textLabel.style.wordBreak = "break-word";
      
      // Assemble button
      buttonContainer.appendChild(iconContainer);
      buttonContainer.appendChild(textLabel);

      buttonContainer.addEventListener("click", () => {
        // Deselect all buttons
        document.querySelectorAll(".tag-button-container").forEach((btn) => {
          (btn as HTMLElement).style.backgroundColor =
            styleSettings.theme === "dark"
              ? colors.buttonBgDark
              : colors.buttonBgLight;
          (btn as HTMLElement).style.color =
            styleSettings.theme === "dark"
              ? colors.buttonTextDark
              : colors.buttonTextLight;
          
          // Reset icon color
          const svg = (btn as HTMLElement).querySelector("svg");
          if (svg) {
            svg.style.fill = 
              styleSettings.theme === "dark" ? colors.buttonTextDark : colors.buttonTextLight;
          }
        });

        // Select this button
        buttonContainer.style.backgroundColor =
          styleSettings.theme === "dark"
            ? colors.selectedButtonBgDark
            : colors.selectedButtonBgLight;
        buttonContainer.style.color = colors.selectedButtonText;
        
        // Update icon color
        const svg = buttonContainer.querySelector("svg");
        if (svg) {
          svg.style.fill = colors.selectedButtonText;
        }
        
        selectedTag = tag;
        updateConfirmButtonState();
      });

      categoryButtons.appendChild(buttonContainer);
    });

    // Create action section
    const actionSection = createElement("div", "", "action-section");
    actionSection.style.marginBottom = "16px";

    const actionLabel = createElement("h3", "Select Action:", "action-label");
    actionLabel.style.marginBottom = "8px";
    actionLabel.style.color =
      styleSettings.theme === "dark" ? colors.textDark : colors.textLight;

    const actionButtons = createElement("div", "", "action-buttons");
    actionButtons.style.display = "flex";
    actionButtons.style.gap = "8px";

    // Create buttons for each action
    const actionOptions = Object.values(Action);
    let selectedAction: Actions | null = null;

    actionOptions.forEach((action) => {
      // Format action names
      const formattedAction = action.replace(/_/g, " ");
      const capitalizedAction =
        formattedAction.charAt(0).toUpperCase() +
        formattedAction.slice(1).toLowerCase();

      const button = createElement(
        "button",
        capitalizedAction,
        "action-button",
      );
      button.style.padding = "8px 12px";
      button.style.border =
        styleSettings.theme === "dark"
          ? `1px solid ${colors.buttonBorderDark}`
          : `1px solid ${colors.buttonBorderLight}`;
      button.style.borderRadius = "4px";
      button.style.backgroundColor =
        styleSettings.theme === "dark"
          ? colors.buttonBgDark
          : colors.buttonBgLight;
      button.style.color =
        styleSettings.theme === "dark"
          ? colors.buttonTextDark
          : colors.buttonTextLight;
      button.style.cursor = "pointer";

      button.addEventListener("click", () => {
        // Deselect all buttons
        document.querySelectorAll(".action-button").forEach((btn) => {
          (btn as HTMLElement).style.backgroundColor =
            styleSettings.theme === "dark"
              ? colors.buttonBgDark
              : colors.buttonBgLight;
          (btn as HTMLElement).style.color =
            styleSettings.theme === "dark"
              ? colors.buttonTextDark
              : colors.buttonTextLight;
        });

        // Select this button
        button.style.backgroundColor =
          styleSettings.theme === "dark"
            ? colors.selectedButtonBgDark
            : colors.selectedButtonBgLight;
        button.style.color = colors.selectedButtonText;
        selectedAction = action;
        updateConfirmButtonState();
      });

      actionButtons.appendChild(button);
    });

    // Update confirm button state based on selections
    const updateConfirmButtonState = () => {
      if (selectedTag && selectedAction) {
        confirmButton.style.opacity = "1";
        confirmButton.style.cursor = "pointer";
        confirmButton.disabled = false;
      } else {
        confirmButton.style.opacity = "0.5";
        confirmButton.style.cursor = "not-allowed";
        confirmButton.disabled = true;
      }
    };

    // Create buttons section
    const buttonsSection = createElement("div", "", "buttons-section");
    buttonsSection.style.display = "flex";
    buttonsSection.style.justifyContent = "flex-end";
    buttonsSection.style.gap = "12px";
    buttonsSection.style.marginTop = "24px";

    const cancelButton = createElement("button", "Cancel", "cancel-button");
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.border =
      styleSettings.theme === "dark"
        ? `1px solid ${colors.buttonBorderDark}`
        : `1px solid ${colors.buttonBorderLight}`;
    cancelButton.style.borderRadius = "6px";
    cancelButton.style.backgroundColor =
      styleSettings.theme === "dark"
        ? colors.buttonBgDark
        : colors.buttonBgLight;
    cancelButton.style.color =
      styleSettings.theme === "dark"
        ? colors.buttonTextDark
        : colors.buttonTextLight;
    cancelButton.style.cursor = "pointer";
    cancelButton.style.fontWeight = "500";
    cancelButton.style.transition = "all 0.2s ease";

    const confirmButton = createElement("button", "Confirm", "confirm-button");
    confirmButton.style.padding = "10px 20px";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "6px";
    confirmButton.style.backgroundColor =
      styleSettings.theme === "dark"
        ? colors.confirmButtonBgDark
        : colors.confirmButtonBgLight;
    confirmButton.style.color = colors.confirmButtonText;
    confirmButton.style.cursor = "not-allowed";
    confirmButton.style.opacity = "0.5";
    confirmButton.style.fontWeight = "500";
    confirmButton.style.transition = "all 0.2s ease";
    confirmButton.disabled = true;

    // Add event listeners
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modalContainer);
      resolve(null);
    });

    confirmButton.addEventListener("click", () => {
      if (selectedTag && selectedAction) {
        document.body.removeChild(modalContainer);
        resolve({ tag: selectedTag, action: selectedAction });
      }
    });

    // Assemble modal
    categorySection.appendChild(categoryLabel);
    categorySection.appendChild(categoryButtons);

    actionSection.appendChild(actionLabel);
    actionSection.appendChild(actionButtons);

    buttonsSection.appendChild(cancelButton);
    buttonsSection.appendChild(confirmButton);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(categorySection);
    modalContent.appendChild(actionSection);
    modalContent.appendChild(buttonsSection);

    modalContainer.appendChild(modalContent);

    // Add to document
    document.body.appendChild(modalContainer);
  });
}
