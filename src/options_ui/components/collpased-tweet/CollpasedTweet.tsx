import { MOCK_TWEET_WIDTH, MockTweet } from "../mock-tweet/MockTweet";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";
import { Tooltip } from "@mantine/core";

interface CollapsedTweetProps {
  blurTweet: boolean;
  collapsedTweetBlurValue: number;
  collapsedTweetColor: string;
  resetBlurValue: () => void;
}

const SAMPLE_IMG = "img1.jpg";
const SAMPLE_TEXT =
  "Click the chevron icon to toggle the hidden tweet to show/unshow. You can set the the tweet to be blurred on show.";

export const CollapsedTweet = ({
  blurTweet,
  collapsedTweetBlurValue,
  resetBlurValue,
  collapsedTweetColor,
}: CollapsedTweetProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="w-full">
      <div
        className="flex w-full items-center justify-between rounded-md bg-zinc-800 px-1"
        style={{
          height: "30px",
          outline: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div
          style={{
            width: `calc(${MOCK_TWEET_WIDTH} - 50px)` || `MOCK_TWEET_WIDTH`,
          }}
        >
          Hidden tweet from{" "}
          <span style={{ fontWeight: "bold", color: collapsedTweetColor }}>
            @username
          </span>
        </div>
        <div className="flex gap-2">
          <Tooltip label="Click to show tweet">
            <HiChevronDown
              size={20}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </Tooltip>
          <Tooltip label="Hide settings dialog">
            <MdOutlineSettings size={20} />
          </Tooltip>
        </div>
      </div>
      {isCollapsed && (
        <MockTweet
          resetBlurValue={() => resetBlurValue()}
          blurValue={blurTweet ? collapsedTweetBlurValue : 0}
          highlighThickness={0.1}
          highlightColor="rgba(255,255,255,0.3)"
          glowStrength={0}
          highlightBorderRadius={0}
          tweetText={SAMPLE_TEXT}
          tweetImgSrc={SAMPLE_IMG}
          username="Hidden Tweet"
          userhandle="hiddentweet"
          withBlurReset
        />
      )}
    </div>
  );
};
