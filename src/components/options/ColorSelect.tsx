interface ColorSelectProps {
  label: string;
  value: string;
  defaultColor?: string;
  onChangeColor: (newColor: string) => void;
}

export const ColorSelect = ({
  label,
  value,
  defaultColor,
  onChangeColor,
}: ColorSelectProps) => {
  return (
    <div className="flex items-center gap-2">
      <p style={{ width: "120px" }}>{label}</p>
      <input
        className="border-white/50 border-[1px] rounded-md"
        type="color"
        value={value}
        defaultValue={defaultColor}
        onChange={(e) => onChangeColor(e.target.value)}
      />
    </div>
  );
};
