/**
 * Modal for selecting category and action for watchlist
 */

import { Tags, Actions } from "../../types/targets";
import { createElement } from "../../utils/domUtils";

/**
 * Create a modal for selecting category and action
 * @param handle The handle to add to the watchlist
 * @returns Promise that resolves with the selected category and action, or null if cancelled
 */
export function createCategoryModal(
  handle: string,
): Promise<{ tag: Tags; action: Actions } | null> {
  return new Promise((resolve) => {
    // Create modal container
    const modalContainer = createElement("div", "", "modal-container");
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "0";
    modalContainer.style.left = "0";
    modalContainer.style.width = "100%";
    modalContainer.style.height = "100%";
    modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "center";
    modalContainer.style.zIndex = "9999";

    // Create modal content
    const modalContent = createElement("div", "", "modal-content");
    modalContent.style.backgroundColor = "#ffffff";
    modalContent.style.borderRadius = "8px";
    modalContent.style.padding = "16px";
    modalContent.style.width = "400px";
    modalContent.style.maxWidth = "90%";

    // Create modal title
    const modalTitle = createElement(
      "h2",
      `Add ${handle} to watchlist`,
      "modal-title",
    );
    modalTitle.style.marginTop = "0";
    modalTitle.style.color = "#000000";

    // Create category section
    const categorySection = createElement("div", "", "category-section");
    categorySection.style.marginBottom = "16px";

    const categoryLabel = createElement(
      "h3",
      "Select Category:",
      "category-label",
    );
    categoryLabel.style.marginBottom = "8px";
    categoryLabel.style.color = "#000000";

    const categoryButtons = createElement("div", "", "category-buttons");
    categoryButtons.style.display = "flex";
    categoryButtons.style.flexWrap = "wrap";
    categoryButtons.style.gap = "8px";

    // Create buttons for each tag
    const tagOptions = [
      Tags.ON_WATCHLIST,
      Tags.FAKE_NEWS,
      Tags.PARODY,
      Tags.BOT,
      Tags.SPAM,
      Tags.CONSPIRACY,
      Tags.FAN_PAGE,
      Tags.SEXUAL,
      Tags.OFFICIAL,
      Tags.AD,
      Tags.OTHER,
    ];

    let selectedTag: Tags | null = null;

    tagOptions.forEach((tag) => {
      const button = createElement("button", tag, "tag-button");
      button.style.padding = "8px 12px";
      button.style.border = "1px solid #cccccc";
      button.style.borderRadius = "4px";
      button.style.backgroundColor = "#f0f0f0";
      button.style.cursor = "pointer";

      button.addEventListener("click", () => {
        // Deselect all buttons
        document.querySelectorAll(".tag-button").forEach((btn) => {
          (btn as HTMLElement).style.backgroundColor = "#f0f0f0";
          (btn as HTMLElement).style.color = "#000000";
        });

        // Select this button
        button.style.backgroundColor = "#1DA1F2";
        button.style.color = "#ffffff";
        selectedTag = tag;
      });

      categoryButtons.appendChild(button);
    });

    // Create action section
    const actionSection = createElement("div", "", "action-section");
    actionSection.style.marginBottom = "16px";

    const actionLabel = createElement("h3", "Select Action:", "action-label");
    actionLabel.style.marginBottom = "8px";
    actionLabel.style.color = "#000000";

    const actionButtons = createElement("div", "", "action-buttons");
    actionButtons.style.display = "flex";
    actionButtons.style.gap = "8px";

    // Create buttons for each action
    const actionOptions: Actions[] = ["tag", "hide", "blur", "highlight"];
    let selectedAction: Actions | null = null;

    actionOptions.forEach((action) => {
      const button = createElement("button", action, "action-button");
      button.style.padding = "8px 12px";
      button.style.border = "1px solid #cccccc";
      button.style.borderRadius = "4px";
      button.style.backgroundColor = "#f0f0f0";
      button.style.cursor = "pointer";

      button.addEventListener("click", () => {
        // Deselect all buttons
        document.querySelectorAll(".action-button").forEach((btn) => {
          (btn as HTMLElement).style.backgroundColor = "#f0f0f0";
          (btn as HTMLElement).style.color = "#000000";
        });

        // Select this button
        button.style.backgroundColor = "#1DA1F2";
        button.style.color = "#ffffff";
        selectedAction = action;
      });

      actionButtons.appendChild(button);
    });

    // Create buttons section
    const buttonsSection = createElement("div", "", "buttons-section");
    buttonsSection.style.display = "flex";
    buttonsSection.style.justifyContent = "flex-end";
    buttonsSection.style.gap = "8px";

    const cancelButton = createElement("button", "Cancel", "cancel-button");
    cancelButton.style.padding = "8px 16px";
    cancelButton.style.border = "1px solid #cccccc";
    cancelButton.style.borderRadius = "4px";
    cancelButton.style.backgroundColor = "#f0f0f0";
    cancelButton.style.cursor = "pointer";

    const confirmButton = createElement("button", "Confirm", "confirm-button");
    confirmButton.style.padding = "8px 16px";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "4px";
    confirmButton.style.backgroundColor = "#1DA1F2";
    confirmButton.style.color = "#ffffff";
    confirmButton.style.cursor = "pointer";

    // Add event listeners
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modalContainer);
      resolve(null);
    });

    confirmButton.addEventListener("click", () => {
      if (selectedTag && selectedAction) {
        document.body.removeChild(modalContainer);
        resolve({ tag: selectedTag, action: selectedAction });
      } else {
        alert("Please select both a category and an action");
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
