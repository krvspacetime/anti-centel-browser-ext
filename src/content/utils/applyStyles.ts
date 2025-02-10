import { StyleSettings } from "../../options_ui/components/tweet-options/styleDefaults";

export function applyTweetStyles(
  tweet: HTMLElement,
  styleSettings: StyleSettings,
) {
  if (!styleSettings) return;

  // Apply highlight styles
  if (styleSettings.highlight.highlightColor) {
    tweet.style.outline = `${styleSettings.highlight.highlighThickness}px solid ${styleSettings.highlight.highlightColor}`;
    tweet.style.borderRadius = `${styleSettings.highlight.highlightBorderRadius}px`;
    if (styleSettings.highlight.glowStrength > 0) {
      tweet.style.boxShadow = `0 0 ${styleSettings.highlight.glowStrength}px ${styleSettings.highlight.highlightColor}`;
    }
  }

  // Apply blur styles
  if (styleSettings.blur.blurValue > 0) {
    tweet.style.filter = `blur(${styleSettings.blur.blurValue}px)`;
  }

  // Apply hidden tweet styles
  const tweetArticle = tweet.closest('article[data-testid="tweet"]');
  if (tweetArticle) {
    if (styleSettings.hide.hiddenTweetBlurValue > 0) {
      tweet.style.filter = `blur(${styleSettings.hide.hiddenTweetBlurValue}px)`;
    }

    // Apply username color for collapsed tweets
    const usernameElement = tweetArticle.querySelector(
      'a[role="link"] span',
    ) as HTMLElement;
    if (usernameElement && styleSettings.hide.collapsedTweetUsernameColor) {
      usernameElement.style.color =
        styleSettings.hide.collapsedTweetUsernameColor;
    }
  }
}

// Function to get style settings from storage
export function getStyleSettings(): Promise<StyleSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get("styleSettings", (data) => {
      resolve(data.styleSettings);
    });
  });
}

// Listen for style setting changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.styleSettings) {
    const newStyleSettings = changes.styleSettings.newValue;
    // Apply new styles to all tweets on the page
    document
      .querySelectorAll<HTMLElement>('article[data-testid="tweet"]')
      .forEach((tweet) => {
        applyTweetStyles(tweet, newStyleSettings);
      });
  }
});
