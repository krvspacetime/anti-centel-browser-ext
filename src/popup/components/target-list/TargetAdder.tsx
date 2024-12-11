interface TargetAdderProps {
  label: string;
  inputType?: string;
  targetName: string;
  onChangeTargetItem: (itemName: string, itemValue: unknown) => void;
}
export const TargetAdder = ({
  label,
  inputType = "search",
  targetName,
  onChangeTargetItem,
}: TargetAdderProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    // Reset height to avoid accumulation
    textarea.style.height = "auto";
    // Adjust height based on content
    textarea.style.height = `${textarea.scrollHeight}px`;

    onChangeTargetItem(targetName || label.toLowerCase(), e.target.value);
  };

  return (
    <section className="my-2 flex w-full justify-between">
      <p className="w-[40%]">{label}</p>
      <div className="w-[60%]">
        {inputType === "text" ? (
          <textarea
            className="w-full resize-none overflow-hidden border-[1px] border-white/10 indent-2 outline-none"
            onInput={handleInput}
            rows={1} // Start with one row
          />
        ) : (
          <input
            type={inputType}
            className="min-h-[30px] w-full border-[1px] border-white/10 indent-2 outline-none"
            onChange={(e) =>
              onChangeTargetItem(
                targetName || label.toLowerCase(),
                e.target.value,
              )
            }
          />
        )}
      </div>
    </section>
  );
};
