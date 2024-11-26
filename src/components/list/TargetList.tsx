import { useEffect, useState } from "react";
import { TargetInput } from "./TargetInput";
import { TargetCategorySelect } from "./TargetCategorySelect";

type CategoryType = "fake_news" | "parody" | "satire" | "default";

interface TargetHandle {
  handle: string;
  category: CategoryType;
}

export const TargetList = () => {
  const [inputVal, setInputVal] = useState("");
  const [targetHandles, setTargetHandles] = useState<TargetHandle[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("default");

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

  const handleMessage = (message: { type: string; data: TargetHandle[] }) => {
    if (message.type === "updateHandles") {
      setTargetHandles(message.data);
    }
  };

  const addToList = () => {
    setTargetHandles((prev) => {
      if (!prev.some((item) => item.handle === inputVal) && inputVal !== "") {
        const newHandle: TargetHandle = {
          handle: inputVal,
          category: selectedCategory,
        };
        const updatedHandles = [...prev, newHandle];
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
  return (
    <div className="w-full h-full bg-gray-800">
      {" "}
      {/* Added bg color for visibility */}
      <h1 className="text-white text-xl mb-4">Target List</h1>
      <div className="flex gap-2 mb-2">
        <TargetInput
          inputVal={inputVal}
          setInputVal={(value) => setInputVal(value)}
          addToList={addToList}
          list={targetHandles.map((th) => th.handle)}
        />
        <TargetCategorySelect
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => setSelectedCategory(category)}
        />
      </div>
      <div className="text-white">
        {targetHandles.length === 0 ? (
          <p>No targets added yet</p>
        ) : (
          <section className="w-full flex justify-center flex-col items-center mt-3">
            <div className="text-lg font-bold text-white">TARGET LIST</div>
            <div className="h-[320px] w-full overflow-y-auto self-center">
              {targetHandles.map((item, idx) => (
                <div key={idx} className="flex text-white">
                  <div className="flex gap-2 justify-between w-full px-2 overflow-x-hidden">
                    <div>{item.handle}</div>
                    <div>{item.category}</div>
                    <div
                      className="cursor-pointer flex-none"
                      onClick={(e) => removeFromList(e, idx)}
                    >
                      X
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
