export type CategoryType =
  | "fake_news"
  | "parody"
  | "satire"
  | "default"
  | "bot"
  | "conspiracy"
  | "spam";

export interface StyleConfig {
  label: string;
  value: CategoryType;
  overlayColor?: string;
  overlayOpacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  buttonColor?: string;
  contentBlur?: number | string;
  tweetBlur?: number | string;
}

// Make a default style config for each value of the value enum
export const DEFAULT_STYLE_CONFIGS: { [key in CategoryType]: StyleConfig } = {
  default: {
    label: "Default",
    value: "default",
    overlayColor: "#729b1f50",
    overlayOpacity: 5,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 3,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
  fake_news: {
    label: "Fake News",
    value: "fake_news",
    overlayColor: "#6714b950",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
  parody: {
    label: "Parody",
    value: "parody",
    overlayColor: "#5d8c6d50",
    overlayOpacity: 0.5,
    borderColor: "#28c11a",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
  satire: {
    label: "Satire",
    value: "satire",
    overlayColor: "#FF000050",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
  conspiracy: {
    label: "Conspiracy",
    value: "conspiracy",
    overlayColor: "#FF0000",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "##0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
  spam: {
    label: "Spam",
    value: "spam",
    overlayColor: "#FF0000",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
  bot: {
    label: "Bot",
    value: "bot",
    overlayColor: "#FF0000",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
  },
};
