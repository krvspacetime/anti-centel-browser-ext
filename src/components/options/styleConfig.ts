export interface StyleConfig {
  label: string;
  value:
    | "fake_news"
    | "satire"
    | "parody"
    | "conspiracy"
    | "rumor"
    | "junk"
    | "other"
    | "default";
  overlayColor?: string;
  overlayOpacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

// Make a default style config for each value of the value enum
export const DEFAULT_STYLE_CONFIGS: { [key: string]: StyleConfig } = {
  fake_news: {
    label: "Fake News",
    value: "fake_news",
    overlayColor: "#6714b9",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
  },
  parody: {
    label: "Parody",
    value: "parody",
    overlayColor: "#19ce55",
    overlayOpacity: 0.5,
    borderColor: "#28c11a",
    borderWidth: 2,
    borderRadius: 5,
  },
  default: {
    label: "Default",
    value: "default",
    overlayColor: "#000000",
    overlayOpacity: 5,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 3,
  },
  satire: {
    label: "Satire",
    value: "satire",
    overlayColor: "#FF0000",
    overlayOpacity: 0.5,
    borderColor: "#FF0000",
    borderWidth: 2,
    borderRadius: 5,
  },
};
