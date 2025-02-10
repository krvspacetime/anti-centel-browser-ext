import { Slider, SliderProps } from "@mantine/core";

interface StyleSliderProps extends SliderProps {
  textOption: string;
  valueLabelFormat: (value: number) => string;
}

export const StyleSlider = ({
  textOption,
  valueLabelFormat,
  value,
  ...props
}: StyleSliderProps) => {
  return (
    <div className="flex w-full items-center gap-2">
      <p className="w-[35%] text-sm">{textOption}</p>
      <Slider
        {...props}
        w={500}
        color="white"
        labelTransitionProps={{
          transition: "skew-down",
          duration: 150,
          timingFunction: "linear",
        }}
        label={valueLabelFormat}
        value={value}
      />
    </div>
  );
};
