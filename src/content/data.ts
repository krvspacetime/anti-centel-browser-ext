export const tagIconMapper = (tag: string): string => {
  switch (tag) {
    case "on_watchlist":
      return eyeSvg;
    default:
      return eyeSvg;
  }
};

export const eyeSvg = `<svg viewBox="0 0 24 24" width="16" height="16">
  <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
</svg>`;

export const removeSvg = `<svg viewBox="0 0 24 24" width="16" height="16">
  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>`;

export const DEFAULT_WATCHLIST_MONITOR_TEXT = `${eyeSvg} MONITOR`;
export const BUTTON_HOVER_TEXT_WHEN_IN_WATCHLIST = `${removeSvg} REMOVE`;
export const BUTTON_HOVER_TEXT_WHEN_NOT_IN_WATCHLIST = `${eyeSvg} ADD`;
