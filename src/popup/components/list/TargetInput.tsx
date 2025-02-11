import { Button } from "@mantine/core";

interface TargetInputProps {
  inputVal: string;
  setInputVal: (value: string) => void;
  addToList: () => void;
  list: string[];
}

export const TargetInput = ({
  inputVal,
  setInputVal,
  addToList,
  list,
}: TargetInputProps) => {
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
      <Button
        variant="filled"
        color="var(--color-tertiary)"
        onClick={addToList}
        disabled={inputVal === "" || list.includes(inputVal)}
      >
        Add
      </Button>
      {list.includes(inputVal) && (
        <div className="text-xs text-red-400">Already in list</div>
      )}
    </div>
  );
};
