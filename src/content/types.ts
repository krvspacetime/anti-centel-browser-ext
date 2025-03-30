// For content.ts

export interface TargetHandle {
  handle: string;
  tag: Tags;
  action: Actions;
}

export type Actions = "tag" | "hide" | "blur" | "highlight";
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

export interface StyleSettings {
  theme: "dark" | "light";
  blur: {
    blurValue: number;
  };
  highlight: {
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
