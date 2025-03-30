import { Select } from "@mantine/core";
import actionStyles from "./action-select.module.css";

const ACTIONS = ["tag", "hide", "blur", "highlight"];

interface TargetActionSelectProps {
  action: string;
  onActionChange: (action: string) => void;
}

export const TargetActionSelect = ({
  action,
  onActionChange,
}: TargetActionSelectProps) => {
  return (
    <Select
      classNames={actionStyles}
      data={ACTIONS}
      value={action}
      onChange={(value) => onActionChange(value ?? "tag")}
    />
  );
};
