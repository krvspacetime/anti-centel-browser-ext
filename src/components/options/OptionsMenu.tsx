import { useState, useCallback } from "react";
import { SegmentedControl } from "@mantine/core";
import { TargetRoot } from "../target-list/TargetRoot";
import { StyleSelect } from "./StyleSelect";
import { DEFAULT_STYLE_CONFIGS } from "./styleConfig";

const OPTIONS = [
  { label: "List", value: "list" },
  { label: "Styles", value: "styles" },
  { label: "Rules", value: "rules" },
];

export function OptionsMenu() {
  const [activeTab, setActiveTab] = useState("styles");
  const [styleConfigs, setStyleConfigs] = useState(DEFAULT_STYLE_CONFIGS);

  const onChangeStyleConfig = useCallback(
    (configName: string, key: string, value: string) => {
      console.log(configName, key, value);
      setStyleConfigs((prev) => ({
        ...prev,
        [configName]: { ...prev[configName], [key]: value },
      }));
    },
    []
  );

  return (
    <div className="w-100vw">
      <SegmentedControl
        value={activeTab}
        onChange={setActiveTab}
        data={OPTIONS}
      />
      {activeTab === "list" && (
        <div className="">
          <TargetRoot />
        </div>
      )}
      {activeTab === "styles" && (
        <div className="flex flex-col gap-4">
          {Object.entries(styleConfigs).map(([key, config]) => (
            <StyleSelect
              key={key}
              styleConfig={config}
              onChangeStyleConfig={onChangeStyleConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
}
