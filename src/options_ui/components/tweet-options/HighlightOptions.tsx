import { ColorInput } from "@mantine/core";
import { StyleSlider } from "./StyleSlider";
import { StyleSettings } from "./styleDefaults";

interface HighlightOptionsProps {
  styleSettings: StyleSettings;
  setStyleSettings: React.Dispatch<React.SetStateAction<StyleSettings>>;
  valueLabelFormat: (value: number) => string;
}

export const HighlightOptions = ({
  styleSettings,
  setStyleSettings,
  valueLabelFormat,
}: HighlightOptionsProps) => {
  return (
    <>
      <div className="flex items-baseline">
        <p className="w-[33%] text-sm">Highlight color</p>
        <ColorInput
          className="my-1"
          h={50}
          w={200}
          defaultValue="rgba(230, 131, 193, 1)"
          format="rgba"
          value={styleSettings.highlight.highlightColor}
          onChange={(value) =>
            setStyleSettings((prev) => ({
              ...prev,
              highlight: { ...prev.highlight, highlightColor: value },
            }))
          }
        />
      </div>
      <StyleSlider
        textOption="Highlight outline thickness"
        valueLabelFormat={valueLabelFormat}
        value={styleSettings.highlight.highlighThickness}
        onChange={(value) =>
          setStyleSettings((prev) => ({
            ...prev,
            highlight: { ...prev.highlight, highlighThickness: value },
          }))
        }
        min={0}
        max={12}
      />
      <StyleSlider
        textOption="Highlight border radius"
        valueLabelFormat={valueLabelFormat}
        value={styleSettings.highlight.highlightBorderRadius}
        onChange={(value) =>
          setStyleSettings((prev) => ({
            ...prev,
            highlight: { ...prev.highlight, highlightBorderRadius: value },
          }))
        }
        min={0}
        max={24}
      />
      <StyleSlider
        textOption="Highlight glow strength"
        valueLabelFormat={valueLabelFormat}
        value={styleSettings.highlight.glowStrength}
        onChange={(value) =>
          setStyleSettings((prev) => ({
            ...prev,
            highlight: { ...prev.highlight, glowStrength: value },
          }))
        }
        min={0}
        max={50}
      />
    </>
  );
};
