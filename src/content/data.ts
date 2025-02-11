import {
  articleOffSvg,
  circusSvg,
  eyeBoltSvg,
  eyeOffSvg,
  eyeSvg,
  fan,
  forbid,
  horseShoeSvg,
  robotSvg,
  trashSvg,
  windminllSvg,
} from "../icons/icons";

export const tagIconMapper = (tag: string): string => {
  switch (tag) {
    case "on_watchlist":
      return eyeBoltSvg;
    case "fake_news":
      return articleOffSvg;
    case "spam":
      return trashSvg;
    case "bot":
      return robotSvg;
    case "satire":
      return horseShoeSvg;
    case "conspiracy":
      return windminllSvg;
    case "parody":
      return circusSvg;
    case "fan_page":
      return fan;
    case "sexual":
      return forbid;
    default:
      return eyeBoltSvg;
  }
};

export const DEFAULT_WATCHLIST_MONITOR_TEXT = `${eyeSvg} MONITOR`;
export const BUTTON_HOVER_TEXT_WHEN_IN_WATCHLIST = `${eyeOffSvg} REMOVE`;
export const BUTTON_HOVER_TEXT_WHEN_NOT_IN_WATCHLIST = `${eyeBoltSvg} ADD`;
