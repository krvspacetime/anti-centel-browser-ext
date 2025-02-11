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
      background: #33333357;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(10px);
      pointer-events: auto;
      z-index: 10000;
      overflow-y: auto;
  `;

  return modal;
};

export const ModalContent = () => {
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
      width: 50%;
      height: 90%;
      background: #33333357;
      color: white;
      padding: 20px;
      margin: 30px 0px;
      border-radius: 8px;
      min-width: 300px;
      outline: 0.5px solid rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow-y: auto;
    `;

  return modalContent;
};

export const ModalTitle = (title: string) => {
  const modalTitle = document.createElement("h4");
  modalTitle.textContent = title;
  modalTitle.style.cssText = `
      font-size: 20px;
      font-weight: 600;
      margin-top: 100px;
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
      width: 220px;
      height: 40px;
      padding: 8px;
      margin: 4px 0;
      background: #333;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      border: 0.5px solid rgba(255,255,255,0.1)
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
      width: 220px;
      height: 40px;
      padding: 8px;
      margin-top: 16px;
      background: #333;
      border: 0.5px solid rgba(255,255,255,0.1)
      color: red;
      border-radius: 4px;
      cursor: pointer;
    `;

  cancelButton.addEventListener("click", onClick);
  return cancelButton;
};
