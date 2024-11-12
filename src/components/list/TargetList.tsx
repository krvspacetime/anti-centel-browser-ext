import { useEffect, useState } from "react";
import { TargetInput } from "./TargetInput";
import { IconBrandX, IconX } from "@tabler/icons-react";
import { targetHandlesAtom } from "../../atoms/targetAtom";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

export const TargetList = () => {
  const [inputVal, setInputVal] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [targetHandles, setTargetHandles] = useAtom(targetHandlesAtom);

  // Define the message handler function separately
  const handleMessage = (message: {
    type: string;
    data:
      | string[]
      | typeof RESET
      | ((prev: string[]) => string[] | typeof RESET);
  }) => {
    if (message.type === "updateHandles") {
      setTargetHandles(message.data);
    }
  };

  useEffect(() => {
    // Fetch the latest targetHandles from storage on mount
    chrome.storage.sync.get("targetHandles", (data) => {
      setTargetHandles(data.targetHandles || []);
    });

    // Listen for changes to targetHandles from the content script
    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const removeFromList = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    const updatedHandles = targetHandles.filter((_, i) => i !== index);
    setTargetHandles(updatedHandles);

    // Update storage and notify content script
    chrome.storage.sync.set({ targetHandles: updatedHandles }, () => {
      chrome.runtime.sendMessage({
        type: "updateHandles",
        data: updatedHandles,
      });
    });
  };

  const addToList = () => {
    setTargetHandles((prev) => {
      if (!prev.includes(inputVal) && inputVal !== "") {
        const updatedHandles = [...prev, inputVal];
        setInputVal("");

        // Update storage and notify content script
        chrome.storage.sync.set({ targetHandles: updatedHandles }, () => {
          chrome.runtime.sendMessage({
            type: "updateHandles",
            data: updatedHandles,
          });
        });

        return updatedHandles;
      }
      return prev;
    });
  };

  return (
    <div className="w-full">
      <TargetInput
        inputVal={inputVal}
        setInputVal={(value) => setInputVal(value)}
        addToList={addToList}
        list={targetHandles}
      />
      <section className="w-full flex justify-center flex-col items-center mt-3">
        <div className="text-lg font-bold text-white">TARGET LIST</div>
        <div className="h-[320px] w-full overflow-y-auto self-center">
          {targetHandles.map((item, idx) => (
            <div key={idx} className="flex text-white">
              <div className="flex gap-2 justify-between w-full px-2 overflow-x-hidden">
                <div className="flex items-center gap-2 max-w-[200px] flex-grow flex-shrink">
                  <IconBrandX />
                  <span>
                    {item.length > 35 && !isExpanded
                      ? item.slice(0, 35) + "..."
                      : item}
                    {item.length > 35 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-500 ml-1"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </span>
                </div>
                <div
                  className="cursor-pointer flex-none"
                  onClick={(e) => removeFromList(e, idx)}
                >
                  <IconX />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
