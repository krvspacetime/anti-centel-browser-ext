interface TargetInputProps {
  inputVal: string;
  setInputVal: (value: string) => void;
}

export const TargetInput = ({ inputVal, setInputVal }: TargetInputProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <input
        id="handleInput"
        placeholder="@username"
        type="search"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        className="w-full rounded-md bg-tertiary indent-2 text-white placeholder:text-white/50"
        style={{
          height: "35px",
        }}
      />
    </div>
  );
};
