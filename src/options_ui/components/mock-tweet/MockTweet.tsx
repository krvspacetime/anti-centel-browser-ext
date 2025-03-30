import { MockTweetAvatar } from "./MockTweetAvatar";
import { MockTweetAvatarHandle } from "./MockTweetHandle";
import { StyleSettings } from "../tweet-options/styleDefaults";
import {
  LuMessageCircle,
  LuRepeat2,
  LuHeart,
  LuBarChart2,
  LuShare,
} from "react-icons/lu";

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

// Reduced width to fit better in the preview panel
export const MOCK_TWEET_WIDTH = "380";

export const MockTweet = ({
  blurValue,
  highlighThickness,
  highlightColor,
  highlightBorderRadius,
  glowStrength,
  tweetText,
  tweetImgSrc,
  username = "John Doe",
  userhandle = "@johndoe",
  resetBlurValue,
  withBlurReset,
  onSetLastStyleValues,
}: MockTweetProps) => {
  return (
    <div className="relative">
      <div
        className="flex flex-col rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
        style={{
          width: `${MOCK_TWEET_WIDTH}px`,
          filter: `blur(${blurValue}px)`,
          outline: `${highlighThickness}px solid ${highlightColor}`,
          borderRadius: `${highlightBorderRadius}px`,
          boxShadow:
            glowStrength && highlighThickness
              ? `0 0 ${glowStrength + highlighThickness}px ${highlightColor}`
              : "",
          transition: "all 0.3s ease",
        }}
      >
        <div className="flex items-start gap-3">
          <MockTweetAvatar />
          <div className="flex-1 overflow-hidden">
            <MockTweetAvatarHandle
              username={username}
              userhandle={userhandle}
            />
            <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
              {tweetText}
            </p>

            {tweetImgSrc && (
              <div className="mb-3 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                <img
                  src={tweetImgSrc}
                  alt="Tweet image"
                  className="h-auto w-full object-cover"
                  // style={{ maxWidth: `${parseInt(MOCK_TWEET_WIDTH) - 60}px` }}
                />
              </div>
            )}

            {/* Tweet actions */}
            <div className="mt-2 flex justify-between text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1 text-xs hover:text-blue-500">
                <LuMessageCircle size={14} />
                <span>24</span>
              </div>
              <div className="flex items-center gap-1 text-xs hover:text-green-500">
                <LuRepeat2 size={14} />
                <span>12</span>
              </div>
              <div className="flex items-center gap-1 text-xs hover:text-red-500">
                <LuHeart size={14} />
                <span>348</span>
              </div>
              <div className="flex items-center gap-1 text-xs hover:text-blue-500">
                <LuBarChart2 size={14} />
                <span>2.4K</span>
              </div>
              <div className="flex items-center text-xs hover:text-blue-500">
                <LuShare size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset buttons */}
      {withBlurReset && (
        <div className="absolute inset-0 flex size-full items-center justify-center">
          <div className="flex flex-col gap-2">
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
              onClick={() => {
                resetBlurValue?.();
                onSetLastStyleValues?.();
              }}
            >
              Show Tweet
            </button>
            <button className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-800">
              Keep Hidden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
