import { useEffect, useState } from "react";
import { TargetInput } from "./TargetInput";
import { IconBrandX, IconX } from "@tabler/icons-react";
import { targetHandlesAtom } from "../../atoms/targetAtom";
import { useAtom } from "jotai";

export const TargetList = () => {
  const [inputVal, setInputVal] = useState("");
  // const shouldTruncate = item.length > 35;
  const [isExpanded, setIsExpanded] = useState(false);
  const [targetHandles, setTargetHandles] = useAtom(targetHandlesAtom);
  const listEl = targetHandles.map((item, idx) => (
    <div className="flex text-white">
      <div className="flex gap-2 justify-between w-full px-2 overflow-x-hidden">
        <div className="flex items-center gap-2 max-w-[200px] flex-grow flex-shrink">
          <div className="flex-none">
            <IconBrandX />
          </div>
          <div className="">
            {item.length > 35 && !isExpanded ? item.slice(0, 35) + "..." : item}
            {item.length > 35 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 ml-1"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
          </div>
        </div>
        <div
          className="cursor-pointer flex-none"
          onClick={(e) => removeFromList(e, idx)}
        >
          <IconX />
        </div>
      </div>
    </div>
  ));

  const removeFromList = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    setTargetHandles((prev) => prev.filter((_, i) => i !== index));
  };
  const addToList = () => {
    setTargetHandles((prev) => {
      if (!prev.includes(inputVal) && inputVal !== "") {
        setInputVal("");
        chrome.storage.sync.set({ targetHandles: targetHandles });
        return [...prev, inputVal]; // Return the new state value
      }
      return prev; // Return the original state value if inputVal is already in the list
    });
  };
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.set({ targetHandles });
      chrome.runtime.sendMessage({
        type: "updateHandles",
        data: targetHandles,
      });
    } else {
      console.warn(
        "chrome.runtime not available. This should only run in a Chrome extension environment."
      );
    }
  }, [targetHandles]);

  return (
    <div className="w-full">
      <div className="">
        <TargetInput
          inputVal={inputVal}
          setInputVal={(value) => setInputVal(value)}
          addToList={addToList}
          list={targetHandles}
        />
        <section className="w-full flex justify-center flex-col items-center mt-3">
          <div className="text-lg font-bold text-white">TARGET LIST</div>
          <div className="h-[320px] w-full overflow-y-auto self-center">
            {listEl}
          </div>
        </section>
      </div>
    </div>
  );
};
