import { useEffect, useState } from "react";
import { Accordion, Button } from "@mantine/core";
import { TargetInput } from "./TargetInput";
import { TargetCategorySelect } from "./TargetCategorySelect";
import { DEFAULT_STYLE_CONFIGS } from "../../../options_ui/components/options/styleConfig";
import { TargetHandle } from "../../../content/types";
import { toProperCase } from "../../../content/utils/utils";
import { POPUP_HEIGHT } from "../layout/AppLayout";
import { Tags } from "../types";

export const TargetList = () => {
  const [inputVal, setInputVal] = useState("");
  const [targetHandles, setTargetHandles] = useState<TargetHandle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Tags>(
    Tags.ON_WATCHLIST,
  );

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
          tag: selectedCategory,
          action: "monitor",
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

  const categoryColors = (category: Tags) => {
    switch (category) {
      case Tags.FAKE_NEWS:
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
      <p className="w-[45%] text-center text-xs">{item.action}</p>
      <div className="w-[45%]">
        <p
          className={`${categoryColors(
            item.tag as Tags,
          )} w-fit rounded px-2 text-center text-xs`}
        >
          {toProperCase(item.tag as Tags)}
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
        height: POPUP_HEIGHT,
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
                  <div className="my-1 flex w-full gap-2 overflow-x-hidden px-2 text-sm font-bold">
                    <p className="w-[45%]">User</p>
                    <p className="w-[45%] indent-8">Action</p>
                    <div className="w-[45%] indent-6">
                      <p>Tag</p>
                    </div>
                    <div className="flex-none">Remove</div>
                  </div>
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
