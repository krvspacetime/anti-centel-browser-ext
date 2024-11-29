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
    overlayColor: "#FF0000",
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
};
