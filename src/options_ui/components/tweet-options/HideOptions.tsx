import { Switch, useMantineTheme, rem, ColorInput } from "@mantine/core";
import { StyleSlider } from "./StyleSlider";
import { MdDeblur, MdBlurOff } from "react-icons/md";
import { StyleSettings } from "./styleDefaults";

interface HideOptionsProps {
  styleSettings: StyleSettings;
  checked: boolean;
  onSetChecked: () => void;
  valueLabelFormat: (value: number) => string;
  onChangeHiddenTweetBlurValue: (value: number) => void;
  onChangeCollapsedTweetUsernameColor: (value: string) => void;
}

export const HideOptions = ({
  valueLabelFormat,
  styleSettings,
  checked,
  onSetChecked,
  onChangeHiddenTweetBlurValue,
  onChangeCollapsedTweetUsernameColor,
}: HideOptionsProps) => {
  const theme = useMantineTheme();

  const sunIcon = (
    <MdDeblur
      style={{ width: rem(16), height: rem(16) }}
      color={theme.colors.green[6]}
    />
  );

  const moonIcon = (
    <MdBlurOff
      style={{ width: rem(16), height: rem(16) }}
      color={theme.colors.red[6]}
    />
  );
  return (
    <div className="flex flex-col gap-1 text-sm">
      <section className="flex items-baseline">
        <p className="w-[32%]">Username color</p>
        <ColorInput
          className="my-1"
          h={50}
          w={200}
          defaultValue={styleSettings.hide.collapsedTweetUsernameColor}
          format="rgba"
          value={styleSettings.hide.collapsedTweetUsernameColor}
          onChange={(value) => onChangeCollapsedTweetUsernameColor(value)}
        />
      </section>
      <div className="flex">
        <p className="w-[32%]">Blur on open</p>
        <Switch
          size="md"
          color="dark.4"
          onLabel={sunIcon}
          offLabel={moonIcon}
          checked={checked}
          onChange={() => onSetChecked()}
        />
      </div>
      <StyleSlider
        textOption="Blur hidden tweets"
        valueLabelFormat={valueLabelFormat}
        value={styleSettings.hide.hiddenTweetBlurValue}
        onChange={(value) => onChangeHiddenTweetBlurValue(value)}
        min={0}
        max={24}
        disabled={!checked}
      />
    </div>
  );
};
