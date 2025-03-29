/**
 * Types related to target handles and actions
 */

export interface TargetHandle {
  handle: string;
  tag: Tags;
  action: Actions;
}

export type Actions = "monitor" | "hide" | "blur" | "highlight";

export enum Action {
  MONITOR = "monitor",
  HIDE = "hide",
  BLUR = "blur",
  HIGHLIGHT = "highlight",
}

export enum Tags {
  ON_WATCHLIST = "on_watchlist",
  FAKE_NEWS = "fake_news",
  SPAM = "spam",
  PARODY = "parody",
  BOT = "bot",
  CONSPIRACY = "conspiracy",
  FAN_PAGE = "fan_page",
  SEXUAL = "sexual",
  OFFICIAL = "official",
  AD = "ad",
  OTHER = "other",
}
