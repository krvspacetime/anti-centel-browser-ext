import { IconAt } from "@tabler/icons-react";

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
    <div>
      <section className="flex items-center w-full justify-center h-[30px]">
        <IconAt
          className="mr-1"
          size={20}
          color="rgb(244 244 245 / var(--tw-bg-opacity))"
          type=""
        />
        <input
          id="handleInput"
          type="search"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="indent-2 outline outline-[1px] h-full"
        />
        <button
          className="px-1 border-black h-full bg-zinc-400 disabled:bg-zinc-600"
          onClick={addToList}
          disabled={inputVal === "" || list.includes(inputVal)}
        >
          Add
        </button>
      </section>
      {list.includes(inputVal) && (
        <div className="text-red-400 text-xs">Already in list</div>
      )}
    </div>
  );
};
