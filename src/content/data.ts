import {
  circusSvg,
  goAlertSvg,
  eyeOffSvg,
  eyeSvg,
  tbRating18PlusSvg,
  ciTrashSvg,
  piBaseballCapSvg,
  officialSvg,
  fakeNewsSvg,
  riRobot3LineSvg,
  liaFanSolidSvg,
  riAdvertisementLineSvg,
} from "../icons/icons";

export const tagIconMapper = (tag: string): string => {
  switch (tag) {
    case "on_watchlist":
      return goAlertSvg;
    case "fake_news":
      return fakeNewsSvg;
    case "spam":
      return ciTrashSvg;
    case "bot":
      return riRobot3LineSvg;
    case "conspiracy":
      return piBaseballCapSvg;
    case "parody":
      return circusSvg;
    case "fan_page":
      return liaFanSolidSvg;
    case "sexual":
      return tbRating18PlusSvg;
    case "official":
      return officialSvg;
    case "ad":
      return riAdvertisementLineSvg;
    default:
      return goAlertSvg;
  }
};

export const DEFAULT_WATCHLIST_MONITOR_TEXT = `${eyeSvg}`;
export const BUTTON_HOVER_TEXT_WHEN_IN_WATCHLIST = `${eyeOffSvg} REMOVE`;
// export const BUTTON_HOVER_TEXT_WHEN_NOT_IN_WATCHLIST = `${goAlertSvg} ADD`;
