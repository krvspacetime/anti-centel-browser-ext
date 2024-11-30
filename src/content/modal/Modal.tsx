export const Modal = () => {
  const modal = document.createElement("div");
  modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100vh;
      width: 100vw;
      background: rgba(7, 23, 54, 0.57)
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(10px);
      pointer-events: auto;
      z-index: 10000;
  `;

  return modal;
};

export const ModalContent = () => {
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
      width: 100%;
      height: 100%;
      background: rgba(7, 23, 54, 0.57);
      color: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      outline: 1px solid white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `;

  return modalContent;
};

export const ModalTitle = (title: string) => {
  const modalTitle = document.createElement("h4");
  modalTitle.textContent = title;
  modalTitle.style.cssText = `
      font-size: 20px;
      font-weight: 600;
      font-family: "Inter", sans-serif;
    `;
  return modalTitle;
};

export const ModalButtons = (
  categories: string[],
  onClick: (category: string) => void,
) => {
  return categories.map((category) => {
    const button = document.createElement("button");
    button.style.cssText = `
      width: 400px;
      height: 40px;
      padding: 8px;
      margin: 4px 0;
      background: rgba(92, 209, 198, 0.68);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
    `;
    const categorySplit = category.split("_").join(" ");
    const categoryUpper =
      categorySplit.slice(0, 1).toUpperCase() + categorySplit.slice(1);
    button.textContent = categoryUpper;
    button.addEventListener("click", () => onClick(category));
    return button;
  });
};

interface ModalCancelButtonProps {
  label?: string;
  onClick: () => void;
}

export const ModalCancelButton = ({
  label = "Cancel",
  onClick,
}: ModalCancelButtonProps) => {
  const cancelButton = document.createElement("button");
  cancelButton.textContent = label;
  cancelButton.style.cssText = `
      width: 400px;
      height: 40px;
      padding: 8px;
      margin-top: 16px;
      background: rgba(215, 32, 46, 0.68);
      outline: 2px solid red;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

  cancelButton.addEventListener("click", onClick);
  return cancelButton;
};
