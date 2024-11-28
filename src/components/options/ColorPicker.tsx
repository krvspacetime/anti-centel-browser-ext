import { ComponentPropsWithoutRef } from "react";

interface ColorPickerProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  defaultColor: string;
  keyToSet: string;
}

export const ColorPicker = ({
  label,
  defaultColor = "#FF4444",
  keyToSet,
  ...props
}: ColorPickerProps) => {
  return (
    <>
      <p
        style={{
          width: "200px",
        }}
      >
        {label}
      </p>
      <input
        {...props}
        type="color"
        defaultValue={defaultColor}
        onChange={(e) => {
          chrome.storage.sync.set({ [keyToSet]: e.target.value });
        }}
      />
    </>
  );
};
