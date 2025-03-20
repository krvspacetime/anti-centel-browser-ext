const DEFAULT_BLUR_VALUE = 0;
const DEFAULT_HIGHLIGHT_OUTLINE_THICKNESS = 1;
const DEFAULT_HIGHLIGHT_BORDER_RADIUS = 16;
const DEFAULT_GLOW_STRENGTH = 0;
const HIDDEN_TWEET_BLUR_VALUE = 0;
const DEFAULT_HIGHLIGHT_COLOR = "rgba(255, 255, 255, 0.8)";
const DEFAULT_COLLAPSED_TWEET_USERNAME_COLOR = "rgba(42, 209, 72, 0.5)";

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

export const STYLE_SETTINGS: StyleSettings = {
  theme: "light",
  blur: { blurValue: DEFAULT_BLUR_VALUE },
  highlight: {
    highlightColor: DEFAULT_HIGHLIGHT_COLOR,
    highlighThickness: DEFAULT_HIGHLIGHT_OUTLINE_THICKNESS,
    highlightBorderRadius: DEFAULT_HIGHLIGHT_BORDER_RADIUS,
    glowStrength: DEFAULT_GLOW_STRENGTH,
  },
  hide: {
    hiddenTweetBlurValue: HIDDEN_TWEET_BLUR_VALUE,
    blurHiddenTweetsOnUncollpase: false,
    collapsedTweetUsernameColor: DEFAULT_COLLAPSED_TWEET_USERNAME_COLOR,
  },
};
