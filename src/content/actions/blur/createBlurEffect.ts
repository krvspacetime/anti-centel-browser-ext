import { StyleSettings } from "../../types/settings";
import { createShowTweetButton } from "./createShowTweetButton";
import { createHideTweetButton } from "./createHideTweetButton";
import { createTweetOverlay } from "./createTweetOverlay";
import { createTweetBadge } from "./createTweetBadge";
import { createButtonContainer } from "./createButtonContainer";

export const createBlurEffect = (
  handle: string,
  category: string,
  styleSettings: StyleSettings,
) => {
  const overlay = createTweetOverlay(
    styleSettings.blur.blurValue,
    styleSettings,
  );
  const buttonContainer = createButtonContainer();
  const badge = createTweetBadge(handle, category, styleSettings);

  const showButton = createShowTweetButton(() => {
    // Reduce blur instead of removing it completely for a smoother experience
    overlay.style.backdropFilter = `blur(0px)`;
    overlay.style.background = "transparent";
    overlay.style.border = "none";

    showButton.style.display = "none";
    hideButton.style.display = "flex";
    badge.style.display = "none";

    // Add a subtle animation
    overlay.animate(
      [
        { backdropFilter: `blur(${styleSettings.blur.blurValue}px)` },
        { backdropFilter: "blur(0px)" },
      ],
      {
        duration: 300,
        easing: "ease-out",
      },
    );
  }, styleSettings);

  const hideButton = createHideTweetButton(() => {
    overlay.style.backdropFilter = `blur(${styleSettings.blur.blurValue}px)`;
    overlay.style.background =
      styleSettings.theme === "dark"
        ? "rgba(0,0,0,0.05)"
        : "rgba(255,255,255,0.05)";
    overlay.style.border =
      styleSettings.theme === "dark"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.1)";

    showButton.style.display = "flex";
    hideButton.style.display = "none";
    badge.style.display = "flex";

    // Add a subtle animation
    overlay.animate(
      [
        { backdropFilter: "blur(0px)" },
        { backdropFilter: `blur(${styleSettings.blur.blurValue}px)` },
      ],
      {
        duration: 300,
        easing: "ease-in",
      },
    );
  }, styleSettings);

  // Add hover effect to the entire overlay
  overlay.addEventListener("mouseenter", () => {
    showButton.style.opacity = "1";
    badge.style.opacity = "1";
  });

  overlay.addEventListener("mouseleave", () => {
    showButton.style.opacity = "0.8";
    badge.style.opacity = "0.8";
  });

  buttonContainer.appendChild(showButton);
  buttonContainer.appendChild(hideButton);
  buttonContainer.appendChild(badge);
  overlay.appendChild(buttonContainer);

  return overlay;
};
