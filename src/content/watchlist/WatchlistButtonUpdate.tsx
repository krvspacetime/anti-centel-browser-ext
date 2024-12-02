import { TargetHandle } from "../types";

const tagIconMapper = (tag: string) => {
  switch (tag) {
    case "on_watchlist":
      return "👁️";
    case "fake_news":
      return "🔍";
    case "spam":
      return "🙈";
    case "parody":
      return "🤡";
    case "satire":
      return "🤣";
    case "bot":
      return "🤖";
    case "conspiracy":
      return "🔗";
    default:
      return "👁️";
  }
};

export function updateButtonState(
  button: HTMLElement,
  isInTargetList: boolean,
  targetHandles?: TargetHandle[],
): void {
  const handle = button.dataset.handle;
  const targetInfo = targetHandles?.find((th) => th.handle === handle);
  const tag = targetInfo?.tag || "on_watchlist";
  const tagLabel = tag.split("_").join(" ");
  const tagUpper = tagLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Remove existing event listeners
  const oldMouseEnter = button.onmouseenter;
  const oldMouseLeave = button.onmouseleave;
  if (oldMouseEnter) button.removeEventListener("mouseenter", oldMouseEnter);
  if (oldMouseLeave) button.removeEventListener("mouseleave", oldMouseLeave);

  button.dataset.originalText = isInTargetList
    ? tagIconMapper(tag) + " " + tagUpper
    : "👁️ MONITOR";
  button.textContent = button.dataset.originalText;

  // Set up hover states
  if (isInTargetList) {
    button.addEventListener("mouseenter", () => {
      button.textContent = "❌ REMOVE";
      button.style.backgroundColor = "#ff4444";
      button.style.color = "white";
    });

    button.addEventListener("mouseleave", () => {
      button.textContent = button.dataset.originalText ?? "";
      button.style.backgroundColor = "transparent";
      button.style.color = "white";
    });
  }

  button.style.cssText = `
      padding: 2px 8px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      background-color: transparent;
      color: white;
      border: none;
      line-height: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      outline: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
      ${!isInTargetList ? ":hover { background-color: #1da1f2; }" : ""}
    `;
}
