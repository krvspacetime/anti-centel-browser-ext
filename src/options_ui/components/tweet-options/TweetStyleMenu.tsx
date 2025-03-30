import { useState, useEffect } from "react";
import { MockTweet } from "../mock-tweet/MockTweet";
import { CollapsedTweet } from "../collpased-tweet/CollpasedTweet";
import { STYLE_SETTINGS } from "./styleDefaults";
import { HighlightOptions } from "./HighlightOptions";
import { HideOptions } from "./HideOptions";
import { BlurOptions } from "./BlurOptions";
import { SegmentedControl } from "@mantine/core";
import segmentedControl from "./segmentedControl.module.css";
import { HideUserDetails } from "../misc/HideUserDetails";
import { ImportExportOptions } from "./ImportExportOptions";

const SAMPLE_IMG = "avatar.jpg";
const SAMPLE_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

export const TweetStyleMenu = () => {
  const [styleSettings, setStyleSettings] = useState(STYLE_SETTINGS);
  const [targetHandles, setTargetHandles] = useState([]);
  const [importExportStatus, setImportExportStatus] = useState({
    type: "",
    message: "",
  });

  // Load initial style settings and target handles from storage
  useEffect(() => {
    chrome.storage.sync.get(["styleSettings", "targetHandles"], (data) => {
      if (data.styleSettings) {
        setStyleSettings(data.styleSettings);
      }
      if (data.targetHandles) {
        setTargetHandles(data.targetHandles);
      }
    });
  }, []);

  // Save style settings to storage whenever they change
  useEffect(() => {
    chrome.storage.sync.set({ styleSettings });
  }, [styleSettings]);

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

  const onSetChecked = (value: boolean) => {
    setStyleSettings((prev) => ({
      ...prev,
      hide: { ...prev.hide, blurHiddenTweetsOnUncollpase: value },
    }));
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

  const onChangeHideUserDetails = (value: boolean) => {
    console.log("Changing hideUserDetails to", value);
    setStyleSettings((prev) => ({
      ...prev,
      hideUserDetails: value,
    }));
  };

  // Export settings to JSON file
  const handleExportSettings = () => {
    chrome.storage.sync.get(["styleSettings", "targetHandles"], (data) => {
      const exportData = {
        styleSettings: data.styleSettings || styleSettings,
        targetHandles: data.targetHandles || targetHandles,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "twitter-extension-settings.json";
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setImportExportStatus({
        type: "success",
        message: "Settings exported successfully!",
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setImportExportStatus({ type: "", message: "" });
      }, 3000);
    });
  };

  // Import settings from JSON file
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (importedData.styleSettings) {
          setStyleSettings(importedData.styleSettings);
          chrome.storage.sync.set({
            styleSettings: importedData.styleSettings,
          });
        }

        if (importedData.targetHandles) {
          setTargetHandles(importedData.targetHandles);
          chrome.storage.sync.set({
            targetHandles: importedData.targetHandles,
          });

          // Notify content script about updated handles
          chrome.runtime.sendMessage({
            type: "updateHandles",
            data: importedData.targetHandles,
          });
        }

        setImportExportStatus({
          type: "success",
          message: "Settings imported successfully!",
        });
      } catch (error) {
        console.error("Error importing settings:", error);
        setImportExportStatus({
          type: "error",
          message: "Error importing settings. Please check the file format.",
        });
      }

      // Clear status message after 3 seconds
      setTimeout(() => {
        setImportExportStatus({ type: "", message: "" });
      }, 3000);

      // Reset the file input
      event.target.value = "";
    };

    reader.readAsText(file);
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
                { label: "Misc", value: "misc" },
                { label: "Import/Export", value: "importexport" },
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
                onSetChecked={(value: boolean) => onSetChecked(value)}
                onChangeHiddenTweetBlurValue={onChangeHiddenTweetBlurValue}
                onChangeCollapsedTweetUsernameColor={
                  onChangeCollapsedTweetUsernameColor
                }
              />
            )}
            {selectedTab === "misc" && (
              <div>
                <HideUserDetails
                  styleSettings={styleSettings}
                  onChangeHideUserDetails={onChangeHideUserDetails}
                />
              </div>
            )}
            {selectedTab === "importexport" && (
              <ImportExportOptions
                onExport={handleExportSettings}
                onImport={handleImportSettings}
                status={importExportStatus}
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
                blurTweet={styleSettings.hide.blurHiddenTweetsOnUncollpase}
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
          {selectedTab === "importexport" && (
            <section>
              <p className="text-2xl font-bold">Settings Backup</p>
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800 p-4 text-white">
                <p className="mb-2">
                  Export your current settings and target list to a JSON file
                  for backup or to transfer to another device.
                </p>
                <p className="mb-4">
                  Import settings from a previously exported JSON file to
                  restore your configuration.
                </p>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
};
