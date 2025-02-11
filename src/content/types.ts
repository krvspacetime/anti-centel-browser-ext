// For content.ts

export interface TargetHandle {
  handle: string;
  tag: Tags;
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
  FAN_PAGE = "fan_page",
  SEXUAL = "sexual",
  TRUSTED = "trusted",
  OFFICIAL = "official",
  OTHER = "other",
  JUNK = "junk",
  WEIRDO = "weirdo",
  JACKASS = "jackass",
}

export interface StyleSettings {
  blur: {
    blurValue: number;
  };
  higlight: {
    highlightColor: string;
    highlighThickness: number;
    highlightBorderRadius: number;
    glowStrength: number;
  };
  hide: {
    hiddenTweetBlurValue: number;
    blurHiddenTweetsOnUncollpase: boolean;
    collapsedTweetUsernameColor: string;
  };
}
