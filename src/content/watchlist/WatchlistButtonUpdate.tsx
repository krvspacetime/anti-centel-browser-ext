import { TargetHandle } from "../types";
import { tagIconMapper, DEFAULT_WATCHLIST_MONITOR_TEXT } from "../data";

import { eyeOffSvg } from "../../icons/icons";
export function updateButtonState(
  button: HTMLElement,
  isInTargetList: boolean,
  targetHandles?: TargetHandle[],
): void {
  const handle = button.dataset.handle;
  const targetInfo = targetHandles?.find((th) => th.handle === handle);
  const tag = targetInfo?.tag ?? "on_watchlist";
  const tagLabel = tag.split("_").join(" ");
  const tagUpper = tagLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Remove existing event listeners first
  const oldMouseEnter = button.onmouseenter;
  const oldMouseLeave = button.onmouseleave;
  if (oldMouseEnter) button.removeEventListener("mouseenter", oldMouseEnter);
  if (oldMouseLeave) button.removeEventListener("mouseleave", oldMouseLeave);

  button.dataset.originalText = isInTargetList
    ? tagIconMapper(tag) + " " + tagUpper
    : DEFAULT_WATCHLIST_MONITOR_TEXT;
  button.innerHTML =
    button.dataset.originalText ?? DEFAULT_WATCHLIST_MONITOR_TEXT;

  // Set up hover states
  if (isInTargetList) {
    // Set initial state directly
    button.innerHTML = `${tagIconMapper(tag)} ${tagUpper}`;

    const handleMouseEnter = () => {
      button.innerHTML = eyeOffSvg + " REMOVE";
      button.style.backgroundColor = "#ffffff";
      button.style.color = "black";
    };

    const handleMouseLeave = () => {
      button.innerHTML = `${tagIconMapper(tag)} ${tagUpper}`;
      button.style.backgroundColor = "transparent";
      button.style.color = "white";
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    button.onmouseenter = handleMouseEnter;
    button.onmouseleave = handleMouseLeave;
  } else {
    button.onmouseenter = null;
    button.onmouseleave = null;
    button.innerHTML = DEFAULT_WATCHLIST_MONITOR_TEXT;
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
