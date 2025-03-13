import { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { TargetInput } from "./TargetInput";
import { TargetCategorySelect } from "./TargetCategorySelect";
import { DEFAULT_STYLE_CONFIGS } from "../../../options_ui/components/options/styleConfig";
import { TargetHandle } from "../../../content/types";
import { toProperCase } from "../../../content/utils/utils";
import { POPUP_HEIGHT } from "../layout/AppLayout";
import { Actions, Tags } from "../types";
import { TargetActionSelect } from "./TargetActionSelect";
import { LuAtSign } from "react-icons/lu";

export const TargetList = () => {
  const [userhandle, setUserHandle] = useState("");
  const [targetHandles, setTargetHandles] = useState<TargetHandle[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Tags>(
    Tags.ON_WATCHLIST,
  );
  const [action, setAction] = useState("monitor");
  const onActionChange = (action: string) => {
    setAction(action);
  };

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
      if (
        !prev.some((item) => item.handle === userhandle) &&
        userhandle.trim() !== ""
      ) {
        const newHandle: TargetHandle = {
          handle:
            userhandle.trim()[0] !== "@"
              ? "@" + userhandle.trim()
              : userhandle.trim(),
          tag: selectedCategory,
          action: action as Actions,
        };
        const updatedHandles = [...prev, newHandle];
        setUserHandle("");

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

  const handleSettingsClick = () => {
    chrome.runtime.openOptionsPage();
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
      case Tags.PARODY:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const isUserHandleInList = (userHandle: string, list: string[]) => {
    const normalizedHandle = userHandle.replace(/^@/, "").toLowerCase(); // Remove "@" if present and convert to lower case
    return (
      list.map((handle) => handle.toLowerCase()).includes(normalizedHandle) ||
      list
        .map((handle) => handle.toLowerCase())
        .includes(`@${normalizedHandle}`)
    );
  };

  const list = targetHandles
    .filter((item) =>
      item.handle.toLowerCase().includes(searchFilter.toLowerCase()),
    )
    .map((item, idx) => (
      <tr key={idx} className="text-center text-xs">
        <td className="text-left">{item.handle}</td>
        <td className="text-left">{item.action}</td>
        <td className="text-center">
          <p
            className={`${categoryColors(
              item.tag as Tags,
            )} w-fit rounded px-2 text-center text-xs`}
          >
            {toProperCase(item.tag as Tags)}
          </p>
        </td>
        <td>
          <div onClick={(e) => removeFromList(e, idx)}>X</div>
        </td>
      </tr>
    ));
  return (
    <div
      className="flex w-full flex-col justify-between"
      style={{
        height: POPUP_HEIGHT,
        backgroundColor: "var(--color-secondary)",
      }}
    >
      <section
        style={{
          backgroundColor: "var(--color-secondary)",
        }}
      >
        <div className="mb-2 flex w-full flex-col items-center justify-center gap-1 p-8">
          <div className="h-[35px] w-full">
            <TargetCategorySelect
              categories={Object.keys(DEFAULT_STYLE_CONFIGS)}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
              }}
            />
          </div>
          <div className="h-[35px] w-full">
            <TargetInput
              inputVal={userhandle}
              setInputVal={(value) => setUserHandle(value)}
            />
          </div>
          <div className="h-[35px] w-full">
            <TargetActionSelect
              action={action}
              onActionChange={onActionChange}
            />
          </div>
          <div>
            <Button
              variant="filled"
              color="var(--color-tertiary)"
              onClick={addToList}
              disabled={
                isUserHandleInList(
                  userhandle,
                  targetHandles.map((th) => th.handle),
                ) || userhandle.trim() === ""
              }
            >
              Add
            </Button>
            {isUserHandleInList(
              userhandle,
              targetHandles.map((th) => th.handle),
            ) ? (
              <div className="text-xs text-red-400">
                Userhandle is already in the list.
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full px-6">
            <TextInput
              leftSection={<LuAtSign />}
              placeholder="Filter list"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto text-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-bold">
                <th className="w-[50%] text-left">User</th>
                <th className="w-fit text-left">Action</th>
                <th className="w-fit text-left">Tag</th>
                <th className="w-fit text-left">Remove</th>
              </tr>
            </thead>
            <tbody>{list}</tbody>
          </table>
        </div>
      </section>
      <section
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundColor: "var(--color-secondary)",
        }}
      >
        <Button
          onClick={handleSettingsClick}
          size="xs"
          color="var(--color-tertiary)"
          style={{ width: "200px", margin: "0.5rem 0rem" }}
        >
          SETTINGS
        </Button>
      </section>
    </div>
  );
};
