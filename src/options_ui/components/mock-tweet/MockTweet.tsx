import { MockTweetAvatar } from "./MockTweetAvatar";
import { MockTweetAvatarHandle } from "./MockTweetHandle";
import { StyleSettings } from "../tweet-options/styleDefaults";

interface MockTweetProps {
  blurValue?: number;
  highlighThickness?: number;
  highlightColor?: string;
  highlightBorderRadius?: number;
  glowStrength?: number;
  tweetText: string;
  tweetImgSrc?: string;
  username?: string;
  userhandle?: string;
  lastStyleValues?: StyleSettings;
  withBlurReset?: boolean;
  resetBlurValue?: () => void;
  onSetLastStyleValues?: () => void;
}

export const MOCK_TWEET_WIDTH = "500px";

export const MockTweet = ({
  blurValue,
  highlighThickness,
  highlightColor,
  highlightBorderRadius,
  glowStrength,
  tweetText,
  tweetImgSrc,
  username,
  userhandle,
  resetBlurValue,
  withBlurReset,
  onSetLastStyleValues,
}: MockTweetProps) => {
  return (
    <div className="relative">
      <div
        className="flex flex-col p-5 pr-9"
        style={{
          width: MOCK_TWEET_WIDTH,
          filter: `blur(${blurValue}px)`,
          outline: `${highlighThickness}px solid ${highlightColor}`,
          borderRadius: `${highlightBorderRadius}px`,
          boxShadow:
            glowStrength && highlighThickness
              ? `0 0 ${glowStrength + highlighThickness}px ${highlightColor}`
              : "",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <MockTweetAvatar />
        <MockTweetAvatarHandle username={username} userhandle={userhandle} />
        <p className="mb-1 ml-7 text-justify text-sm">{tweetText}</p>
        <img
          src={tweetImgSrc}
          width={MOCK_TWEET_WIDTH}
          className="ml-7 aspect-square w-[95%]"
        />
      </div>
      <div className="absolute inset-0 flex size-full items-center justify-center">
        <section
          style={{
            visibility: withBlurReset ? "visible" : "hidden",
          }}
        >
          <button
            className="rounded-xl rounded-r-none bg-gray-800 p-1 px-3 text-white outline-white/30 hover:bg-gray-950"
            onClick={() => {
              resetBlurValue ? resetBlurValue() : null;
              onSetLastStyleValues ? onSetLastStyleValues() : null;
            }}
          >
            Remove
          </button>
          <button className="rounded-xl rounded-l-none bg-gray-800 p-1 px-3 text-white outline outline-[1px] outline-white/30 hover:bg-red-600">
            X
          </button>
        </section>
      </div>
    </div>
  );
};
