import { useEffect, useState } from "react";
import { TargetInput } from "./TargetInput";
import { TargetCategorySelect } from "./TargetCategorySelect";
import { Accordion, Button } from "@mantine/core";
import { DEFAULT_STYLE_CONFIGS } from "../options/styleConfig";

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
    index: number,
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

  const list = targetHandles.map((item, idx) => (
    <div className="my-1 flex w-full gap-2 overflow-x-hidden px-2">
      <p className="w-[45%] text-xs">{item.handle}</p>
      <div className="w-[45%]">
        <p
          className={`${categoryColors(
            item.category,
          )} w-fit rounded px-2 text-xs`}
        >
          {item.category.charAt(0).toUpperCase() +
            item.category.slice(1).replace("_", " ")}
        </p>
      </div>
      <div
        className="w-[10%] flex-none cursor-pointer text-end text-xs"
        onClick={(e) => removeFromList(e, idx)}
      >
        X
      </div>
    </div>
  ));
  return (
    <div
      className="flex w-full flex-col justify-between"
      style={{
        height: "400px",
        backgroundColor: "var(--color-secondary)",
      }}
    >
      <section>
        <div className="mb-2 flex w-full flex-col items-center justify-center gap-1 p-8">
          <div className="h-[35px] w-full">
            <TargetCategorySelect
              categories={Object.keys(DEFAULT_STYLE_CONFIGS)}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => setSelectedCategory(category)}
            />
          </div>
          <div className="h-[35px] w-full">
            <TargetInput
              inputVal={inputVal}
              setInputVal={(value) => setInputVal(value)}
              addToList={addToList}
              list={targetHandles.map((th) => th.handle)}
            />
          </div>
        </div>
        <div className="text-white">
          <section className="mt-3 flex w-full flex-col items-center justify-center">
            <Accordion className="w-full" defaultValue={"list"}>
              <Accordion.Item value="list" className="w-full">
                <Accordion.Control>Show/Hide List</Accordion.Control>
                <Accordion.Panel className="max-h-[200px] overflow-y-auto">
                  {list}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </section>
        </div>
      </section>
      <section className="my-2 flex justify-center">
        <Button
          size="xs"
          color="var(--color-tertiary)"
          style={{
            width: "200px",
          }}
        >
          SETTINGS
        </Button>
      </section>
    </div>
  );
};
