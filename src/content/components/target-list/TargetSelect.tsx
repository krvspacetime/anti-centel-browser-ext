interface TargetSelectProps {
  label: string;
  targetName?: string;
  defaultValue: string;
  options: string[];
  onChange: (key: string, value: string) => void;
}

export const TargetSelect = ({
  label,
  targetName,
  defaultValue,
  options,
  onChange,
}: TargetSelectProps) => {
  return (
    <div className="my-1 flex w-full justify-between">
      <p className="w-[40%]">{label}</p>
      <select
        defaultValue={defaultValue}
        className="min-h-[30px] w-[60%] border-[1px] border-white/10 px-2"
        onChange={(e) =>
          onChange(targetName || label.toLowerCase(), e.target.value)
        }
      >
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};
