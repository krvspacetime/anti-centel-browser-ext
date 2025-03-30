import { useState, useEffect } from "react";
import { MockTweet } from "../mock-tweet/MockTweet";
import { CollapsedTweet } from "../collpased-tweet/CollpasedTweet";
import { STYLE_SETTINGS } from "./styleDefaults";
import { HighlightOptions } from "./HighlightOptions";
import { HideOptions } from "./HideOptions";
import { BlurOptions } from "./BlurOptions";
import {
  SegmentedControl,
  Paper,
  Title,
  Transition,
  Divider,
  Button,
} from "@mantine/core";
import segmentedControl from "./segmentedControl.module.css";
import { HideUserDetails } from "../misc/HideUserDetails";
import { ImportExportOptions } from "./ImportExportOptions";
import {
  LuHighlighter,
  LuEye,
  LuEyeOff,
  LuSettings2,
  LuDownloadCloud,
  LuSave,
  LuRotateCcw,
} from "react-icons/lu";

const SAMPLE_IMG = "avatar.jpg";
const SAMPLE_TEXT =
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

export const TweetStyleMenu = () => {
  const [styleSettings, setStyleSettings] = useState(STYLE_SETTINGS);
  const [savedStyleSettings, setSavedStyleSettings] = useState(STYLE_SETTINGS);
  const [targetHandles, setTargetHandles] = useState([]);
  const [importExportStatus, setImportExportStatus] = useState({
    type: "",
    message: "",
  });
  const [animatePreview, setAnimatePreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Segmented control
  const [selectedTab, setSelectedTab] = useState("highlight");
  // Load initial style settings and target handles from storage
  useEffect(() => {
    chrome.storage.sync.get(["styleSettings", "targetHandles"], (data) => {
      if (data.styleSettings) {
        setStyleSettings(data.styleSettings);
        setSavedStyleSettings(data.styleSettings);
      }
      if (data.targetHandles) {
        setTargetHandles(data.targetHandles);
      }
    });
  }, []);

  // Check for unsaved changes whenever styleSettings changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(styleSettings) !== JSON.stringify(savedStyleSettings);
    setHasUnsavedChanges(hasChanges);
  }, [styleSettings, savedStyleSettings]);

  // Animate preview when tab changes
  useEffect(() => {
    setAnimatePreview(false);
    const timer = setTimeout(() => setAnimatePreview(true), 50);
    return () => clearTimeout(timer);
  }, [selectedTab]);

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
    setStyleSettings((prev) => ({
      ...prev,
      hideUserDetails: value,
    }));
  };

  // Apply changes to Chrome storage
  const applyChanges = () => {
    chrome.storage.sync.set({ styleSettings });
    setSavedStyleSettings(styleSettings);
    setHasUnsavedChanges(false);

    setImportExportStatus({
      type: "success",
      message: "Settings saved successfully!",
    });

    // Clear status message after 3 seconds
    setTimeout(() => {
      setImportExportStatus({ type: "", message: "" });
    }, 3000);
  };

  // Reset to last saved settings
  const resetChanges = () => {
    setStyleSettings(savedStyleSettings);
    setHasUnsavedChanges(false);

    setImportExportStatus({
      type: "info",
      message: "Changes discarded.",
    });

    // Clear status message after 3 seconds
    setTimeout(() => {
      setImportExportStatus({ type: "", message: "" });
    }, 3000);
  };

  // Export settings to JSON file
  const handleExportSettings = () => {
    chrome.storage.sync.get(["styleSettings", "targetHandles"], (data) => {
      const exportData = {
        styleSettings: data.styleSettings || styleSettings,
        targetHandles: data.targetHandles || targetHandles,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `twitter-extension-settings-${new Date().toISOString().split("T")[0]}.json`;
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
          setSavedStyleSettings(importedData.styleSettings);
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
          message: `Settings imported successfully! (${importedData.targetHandles?.length || 0} targets)`,
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

  const tabIcons = {
    highlight: <LuHighlighter size={18} />,
    blur: <LuEye size={18} />,
    hide: <LuEyeOff size={18} />,
    misc: <LuSettings2 size={18} />,
    importexport: <LuDownloadCloud size={18} />,
  };

  return (
    <main className="min-h-screen bg-gray-50 p-5 transition-colors duration-300 dark:bg-gray-900">
      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        className="mx-auto max-w-7xl bg-white transition-all duration-300 dark:bg-gray-800"
      >
        <div className="mb-6 flex items-center justify-between">
          <Title
            order={1}
            className="font-bold text-gray-800 dark:text-gray-100"
          >
            Settings
          </Title>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <div className="rounded-md bg-yellow-50 p-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                <p>
                  You have unsaved changes
                </p>
              </div>
            )}
            <Button
              leftSection={<LuRotateCcw size={16} />}
              variant="outline"
              color="gray"
              onClick={resetChanges}
              disabled={!hasUnsavedChanges}
            >
              Reset
            </Button>
            <Button
              leftSection={<LuSave size={16} />}
              onClick={applyChanges}
              disabled={!hasUnsavedChanges}
            >
              Apply Changes
            </Button>
          </div>
        </div>

        <Divider className="mb-6" />

        {importExportStatus.message && (
          <div
            className={`mb-4 rounded-md p-3 ${
              importExportStatus.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                : importExportStatus.type === "error"
                  ? "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                  : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
            }`}
          >
            {importExportStatus.message}
          </div>
        )}

        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:w-2/3 md:flex-row">
            <section className="h-fit">
              <Paper shadow="xs" radius="md" className="sticky top-5">
                <SegmentedControl
                  classNames={segmentedControl}
                  size="md"
                  orientation="vertical"
                  color="blue"
                  value={selectedTab}
                  onChange={setSelectedTab}
                  data={[
                    {
                      label: "Highlight",
                      value: "highlight",
                      icon: tabIcons.highlight,
                    },
                    { label: "Blur", value: "blur", icon: tabIcons.blur },
                    { label: "Hide", value: "hide", icon: tabIcons.hide },
                    { label: "Misc", value: "misc", icon: tabIcons.misc },
                    {
                      label: "Import/Export",
                      value: "importexport",
                      icon: tabIcons.importexport,
                    },
                  ].map((item) => ({
                    ...item,
                    label: (
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    ),
                  }))}
                />
              </Paper>
            </section>

            <section className="sticky top-5 w-full">
              <Paper shadow="xs" radius="md" p="md" className="h-full">
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
                    targetCount={targetHandles.length}
                  />
                )}
              </Paper>
            </section>
          </div>

          <section className="w-full md:w-1/3">
            <Paper shadow="xs" radius="md" p="md" className="h-full">
              <Transition
                mounted={animatePreview}
                transition="fade"
                duration={400}
              >
                {(styles) => (
                  <div style={styles}>
                    {selectedTab === "blur" && (
                      <section>
                        <Title
                          order={3}
                          className="mb-4 text-gray-800 dark:text-gray-100"
                        >
                          Blur Preview
                        </Title>
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
                        <Title
                          order={3}
                          className="mb-4 text-gray-800 dark:text-gray-100"
                        >
                          Highlight Preview
                        </Title>
                        <MockTweet
                          highlightColor={
                            styleSettings.highlight.highlightColor
                          }
                          highlighThickness={
                            styleSettings.highlight.highlighThickness
                          }
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
                        <Title
                          order={3}
                          className="mb-4 text-gray-800 dark:text-gray-100"
                        >
                          Hide Preview
                        </Title>
                        <CollapsedTweet
                          blurTweet={
                            styleSettings.hide.blurHiddenTweetsOnUncollpase
                          }
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
                        <Title
                          order={3}
                          className="mb-4 text-gray-800 dark:text-gray-100"
                        >
                          Settings Backup
                        </Title>
                        <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 text-gray-800 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                          <p className="mb-2">
                            Export your current settings and target list to a
                            JSON file for backup or to transfer to another
                            device.
                          </p>
                          <p className="mb-4">
                            Import settings from a previously exported JSON file
                            to restore your configuration.
                          </p>
                          <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                            <p>
                              You currently have{" "}
                              <strong>{targetHandles.length}</strong> targets in
                              your watchlist.
                            </p>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </Transition>
            </Paper>
          </section>
        </div>
      </Paper>
    </main>
  );
};
