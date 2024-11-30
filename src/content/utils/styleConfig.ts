export type CategoryType =
  | "fake_news"
  | "parody"
  | "satire"
  | "on_watchlist"
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
  contentBlur?: string;
  tweetBlur?: string;
  backdropFilter?: string;
}

// Make a default style config for each value of the value enum
export const DEFAULT_STYLE_CONFIGS: { [key in CategoryType]: StyleConfig } = {
  on_watchlist: {
    label: "Default",
    value: "on_watchlist",
    overlayColor: "none",
    overlayOpacity: 5,
    borderColor: "none",
    borderWidth: 1,
    borderRadius: 3,
    buttonColor: "transparent",
    contentBlur: "0px",
    tweetBlur: "0px",
    backdropFilter: "none",
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
    backdropFilter: "blur(8px)",
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
    backdropFilter: "blur(8px)",
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
    backdropFilter: "blur(8px)",
  },
  conspiracy: {
    label: "Conspiracy",
    value: "conspiracy",
    overlayColor: "#ff008450",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "##0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
    backdropFilter: "blur(8px)",
  },
  spam: {
    label: "Spam",
    value: "spam",
    overlayColor: "#6200ff50",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
    backdropFilter: "blur(8px)",
  },
  bot: {
    label: "Bot",
    value: "bot",
    overlayColor: "#24ea1950",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
    buttonColor: "#0c0c0c00",
    contentBlur: "8px",
    tweetBlur: "8px",
    backdropFilter: "blur(8px)",
  },
};
