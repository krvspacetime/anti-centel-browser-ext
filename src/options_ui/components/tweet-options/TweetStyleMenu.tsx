import { useState, useEffect } from "react";
import { MockTweet } from "../mock-tweet/MockTweet";
import { CollapsedTweet } from "../collpased-tweet/CollpasedTweet";
import { STYLE_SETTINGS, StyleSettings } from "./styleDefaults";
import { HighlightOptions } from "./HighlightOptions";
import { HideOptions } from "./HideOptions";
import { BlurOptions } from "./BlurOptions";
import { SegmentedControl } from "@mantine/core";
import segmentedControl from "./segmentedControl.module.css";
const SAMPLE_IMG = "avatar.jpg";
const SAMPLE_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

export const TweetStyleMenu = () => {
  const [styleSettings, setStyleSettings] = useState(STYLE_SETTINGS);

  // Load initial style settings from storage
  useEffect(() => {
    chrome.storage.sync.get("styleSettings", (data) => {
      if (data.styleSettings) {
        setStyleSettings(data.styleSettings);
      }
    });
  }, []);

  // Save style settings to storage whenever they change
  useEffect(() => {
    chrome.storage.sync.set({ styleSettings });
  }, [styleSettings]);

  //@ts-ignore
  const [lastStyleValues, setLastStyleValues] = useState<
    StyleSettings | undefined
  >(undefined);
  const [checked, setChecked] = useState(false);

  const valueLabelFormat = (value: number) => {
    const units = "px";
    return `${value} ${units}`;
  };
  const resetBlurValue = () => {
    setStyleSettings((prev) => ({ ...prev, blurValue: 0 }));
  };
  const resetHiddenTweetBlurValue = () => {
    setStyleSettings((prev) => ({ ...prev, hiddenTweetBlurValue: 0 }));
  };

  const onSetChecked = () => {
    setChecked((prev) => !prev);
  };

  const onChangeBlurValue = (value: number) => {
    setStyleSettings((prev) => ({
      ...prev,
      blur: { ...prev.blur, blurValue: value },
    }));
  };
  const onChangeHiddenTweetBlurValue = (value: number) => {
    setStyleSettings((prev) => ({
      ...prev,
      hide: { ...prev.hide, hiddenTweetBlurValue: value },
    }));
  };

  const onChangeCollapsedTweetUsernameColor = (value: string) => {
    setStyleSettings((prev) => ({
      ...prev,
      hide: { ...prev.hide, collapsedTweetUsernameColor: value },
    }));
  };

  // Segmented control
  const [selectedTab, setSelectedTab] = useState("highlight");
  return (
    <main className="p-5">
      <h1 className="p-3 text-3xl">Style Configuration</h1>
      <div className="flex w-full justify-between gap-5 p-5">
        <div className="flex gap-5">
          <section className="h-fit">
            <SegmentedControl
              classNames={segmentedControl}
              size="lg"
              orientation="vertical"
              color="gray"
              value={selectedTab}
              onChange={setSelectedTab}
              data={[
                { label: "Highlight", value: "highlight" },
                { label: "Blur", value: "blur" },
                { label: "Hide", value: "hide" },
              ]}
            />
          </section>
          <section className="sticky top-5 h-full">
            {selectedTab === "blur" && (
              <BlurOptions
                onChangeBlurValue={onChangeBlurValue}
                valueLabelFormat={valueLabelFormat}
                styleSettings={styleSettings}
              />
            )}
            {selectedTab === "highlight" && (
              <HighlightOptions
                styleSettings={styleSettings}
                setStyleSettings={setStyleSettings}
                valueLabelFormat={valueLabelFormat}
              />
            )}
            {selectedTab === "hide" && (
              <HideOptions
                valueLabelFormat={valueLabelFormat}
                styleSettings={styleSettings}
                checked={checked}
                onSetChecked={onSetChecked}
                onChangeHiddenTweetBlurValue={onChangeHiddenTweetBlurValue}
                onChangeCollapsedTweetUsernameColor={
                  onChangeCollapsedTweetUsernameColor
                }
              />
            )}
          </section>
        </div>
        <section className="flex flex-col gap-2">
          {selectedTab === "blur" && (
            <section>
              <p className="text-2xl font-bold">Blur Preview</p>
              <MockTweet
                withBlurReset
                blurValue={styleSettings.blur.blurValue}
                tweetText={SAMPLE_TEXT}
                tweetImgSrc={SAMPLE_IMG}
                resetBlurValue={resetBlurValue}
                highlighThickness={1}
                highlightColor="rgba(255,255,255,0.30)"
              />
            </section>
          )}
          {selectedTab === "highlight" && (
            <section>
              <p className="text-2xl font-bold">Highlight Preview</p>
              <MockTweet
                highlightColor={styleSettings.highlight.highlightColor}
                highlighThickness={styleSettings.highlight.highlighThickness}
                highlightBorderRadius={
                  styleSettings.highlight.highlightBorderRadius
                }
                glowStrength={styleSettings.highlight.glowStrength}
                tweetText={SAMPLE_TEXT}
                tweetImgSrc={SAMPLE_IMG}
              />
            </section>
          )}
          {selectedTab === "hide" && (
            <section>
              <p className="text-2xl font-bold">Hide Preview</p>
              <CollapsedTweet
                blurTweet={checked}
                collapsedTweetBlurValue={
                  styleSettings.hide.hiddenTweetBlurValue
                }
                resetBlurValue={resetHiddenTweetBlurValue}
                collapsedTweetColor={
                  styleSettings.hide.collapsedTweetUsernameColor
                }
              />
            </section>
          )}
        </section>
      </div>
    </main>
  );
};
