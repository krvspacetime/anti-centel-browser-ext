import { StyleSettings } from "./styleDefaults";
import { StyleSlider } from "./StyleSlider";

interface BlurOptionsProps {
  styleSettings: StyleSettings;
  onChangeBlurValue: (value: number) => void;
  valueLabelFormat: (value: number) => string;
}

export const BlurOptions = ({
  valueLabelFormat,
  onChangeBlurValue,
  styleSettings,
}: BlurOptionsProps) => {
  return (
    <>
      <StyleSlider
        textOption="Backdrop blur"
        valueLabelFormat={valueLabelFormat}
        value={styleSettings.blur.blurValue}
        onChange={(value) => onChangeBlurValue(value)}
        min={0}
        max={24}
      />
    </>
  );
};
