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
    <div className="size-full">
      <section className="flex items-center w-full h-full justify-center">
        <input
          id="handleInput"
          type="search"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="indent-2 h-full rounded-r-none rounded-l-md bg-gray-700 text-white"
        />
        <button
          className="px-2 h-full bg-sky-600/50 disabled:bg-gray-600/50 rounded rounded-l-none text-white"
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
