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

  const categoryColors = (category: CategoryType) => {
    switch (category) {
      case "fake_news":
        return "bg-red-500";
      case "parody":
        return "bg-blue-500";
      case "satire":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <div className="w-full h-full ">
      <div
        className="flex gap-1 justify-between mb-2"
        style={{
          height: "35px",
        }}
      >
        <div className="w-[70%]">
          <TargetInput
            inputVal={inputVal}
            setInputVal={(value) => setInputVal(value)}
            addToList={addToList}
            list={targetHandles.map((th) => th.handle)}
          />
        </div>
        <div className="w-[30%]">
          <TargetCategorySelect
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => setSelectedCategory(category)}
          />
        </div>
      </div>
      <div className="text-white">
        {targetHandles.length === 0 ? (
          <p>No targets added yet</p>
        ) : (
          <section className="w-full flex justify-center flex-col items-center mt-3">
            <p className="text-lg font-bold text-white">TARGET LIST</p>
            {targetHandles.map((item, idx) => (
              <div className="flex gap-2  w-full px-2 overflow-x-hidden my-1">
                <div className="w-[45%]">@{item.handle}</div>
                <div className="w-[45%]">
                  <p
                    className={`${categoryColors(item.category)} rounded w-fit`}
                  >
                    {item.category.charAt(0).toUpperCase() +
                      item.category.slice(1).replace("_", " ")}
                  </p>
                </div>
                <div
                  className="cursor-pointer flex-none w-[10%] text-end"
                  onClick={(e) => removeFromList(e, idx)}
                >
                  X
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
