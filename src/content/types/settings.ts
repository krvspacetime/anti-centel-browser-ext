/**
 * Style settings types for the extension
 */

export interface StyleSettings {
  theme: "dark" | "light";
  hideUserDetails: boolean;
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

export const DEFAULT_STYLE_SETTINGS: StyleSettings = {
  theme: "light",
  hideUserDetails: false,
  blur: { 
    blurValue: 0 
  },
  highlight: {
    highlightColor: "rgba(255, 255, 255, 0.8)",
    highlighThickness: 1,
    highlightBorderRadius: 16,
    glowStrength: 0,
  },
  hide: {
    hiddenTweetBlurValue: 0,
    blurHiddenTweetsOnUncollpase: false,
    collapsedTweetUsernameColor: "rgba(42, 209, 72, 0.5)",
  },
};
