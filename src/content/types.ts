import { CategoryType } from "./utils/styleConfig";

export interface TargetHandle {
  handle: string;
  tag: CategoryType;
  action: Actions;
}

export type Actions = "monitor" | "hide" | "blur" | "highlight";
export enum Tags {
  ON_WATCHLIST = "on_watchlist",
  FAKE_NEWS = "fake_news",
  SPAM = "spam",
  PARODY = "parody",
  SATIRE = "satire",
  BOT = "bot",
  CONSPIRACY = "conspiracy",
}
