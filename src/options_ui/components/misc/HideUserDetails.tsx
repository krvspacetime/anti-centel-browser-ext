import { Checkbox, Divider } from "@mantine/core";
import { useState } from "react";
import { StyleSettings } from "../tweet-options/styleDefaults";

interface HideUserDetailsProps {
  styleSettings: StyleSettings;
  onChangeHideUserDetails: (value: boolean) => void;
}

export const HideUserDetails = ({
  styleSettings,
  onChangeHideUserDetails,
}: HideUserDetailsProps) => {
  const [checked, setChecked] = useState(styleSettings.hideUserDetails);
  return (
    <div className="flex w-[500px] flex-col gap-2">
      <p>Privacy</p>
      <Divider />
      <div className="flex items-center gap-2">
        <p>Hide user details</p>
        <Checkbox
          checked={checked}
          onChange={(event) => {
            setChecked(event.currentTarget.checked);
            onChangeHideUserDetails(event.currentTarget.checked);
          }}
        />
      </div>
    </div>
  );
};
