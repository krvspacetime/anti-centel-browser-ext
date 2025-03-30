import { useEffect, useState } from "react";
import { Button, TextInput, Badge, ActionIcon, Tooltip } from "@mantine/core";
import { TargetInput } from "./TargetInput";
import { TargetCategorySelect } from "./TargetCategorySelect";
import { DEFAULT_STYLE_CONFIGS } from "../../../options_ui/components/options/styleConfig";
import { TargetHandle } from "../../../content/types";
import { toProperCase } from "../../../content/utils/utils";
import { POPUP_HEIGHT } from "../layout/AppLayout";
import { Actions, Tags } from "../../types/targets";
import { TargetActionSelect } from "./TargetActionSelect";
import { LuAtSign, LuTrash2 } from "react-icons/lu";
import { getTagIcon } from "../icons/iconUtils";

// Component for rendering a single target row
const TargetRow = ({
  item,
  index,
  onRemove,
}: {
  item: TargetHandle;
  index: number;
  onRemove: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => void;
}) => {
  // Get the SVG icon for the tag
  const tagIconSvg = getTagIcon(item.tag as Tags);

  return (
    <tr
      key={index}
      className="border-b border-gray-700 text-xs hover:bg-gray-800/30"
    >
      <td className="py-2 pl-3 text-left">{item.handle}</td>
      <td className="py-2 text-left capitalize">{item.action}</td>
      <td className="py-2 text-center">
        <Badge
          className="flex items-center gap-1"
          color={getCategoryColor(item.tag as Tags)}
          variant="filled"
          size="sm"
          radius="sm"
          leftSection={
            <div
              className="flex h-4 w-4 items-center justify-center"
              dangerouslySetInnerHTML={{ __html: tagIconSvg }}
            />
          }
        >
          {toProperCase(item.tag as Tags)}
        </Badge>
      </td>
      <td className="py-2 pr-3 text-center">
        <Tooltip label="Remove">
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={(e) => onRemove(e, index)}
            size="sm"
          >
            <LuTrash2 size={16} />
          </ActionIcon>
        </Tooltip>
      </td>
    </tr>
  );
};

// Helper function to get category color
const getCategoryColor = (category: Tags): string => {
  switch (category) {
    case Tags.FAKE_NEWS:
      return "red";
    case Tags.PARODY:
      return "blue";
    case Tags.BOT:
      return "yellow";
    case Tags.SPAM:
      return "orange";
    case Tags.CONSPIRACY:
      return "grape";
    case Tags.FAN_PAGE:
      return "pink";
    case Tags.SEXUAL:
      return "violet";
    case Tags.OFFICIAL:
      return "green";
    case Tags.AD:
      return "cyan";
    default:
      return "gray";
  }
};

// Helper function to check if a handle is already in the list
const isHandleInList = (userHandle: string, list: string[]): boolean => {
  const normalizedHandle = userHandle.replace(/^@/, "").toLowerCase();
  return (
    list.map((handle) => handle.toLowerCase()).includes(normalizedHandle) ||
    list.map((handle) => handle.toLowerCase()).includes(`@${normalizedHandle}`)
  );
};

export const TargetList = () => {
  const [userhandle, setUserHandle] = useState("");
  const [targetHandles, setTargetHandles] = useState<TargetHandle[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Tags>(
    Tags.ON_WATCHLIST,
  );
  const [action, setAction] = useState("tag");

  // Handle action change
  const onActionChange = (action: string) => {
    setAction(action);
  };

  // Remove a target from the list
  const removeFromList = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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

  // Handle messages from other parts of the extension
  const handleMessage = (message: { type: string; data: TargetHandle[] }) => {
    if (message.type === "updateHandles") {
      setTargetHandles(message.data);
    }
  };

  // Add a new target to the list
  const addToList = () => {
    setTargetHandles((prev) => {
      if (
        !prev.some(
          (item) => item.handle.toLowerCase() === userhandle.toLowerCase(),
        ) &&
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

  // Open settings page
  const handleSettingsClick = () => {
    chrome.runtime.openOptionsPage();
  };

  // Initialize data and set up listeners
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

  // Filter and map target handles to rows
  const filteredTargets = targetHandles.filter((item) =>
    item.handle.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  // Check if current handle is already in the list
  const isCurrentHandleInList = isHandleInList(
    userhandle,
    targetHandles.map((th) => th.handle),
  );

  return (
    <div
      className="flex w-full flex-col justify-between"
      style={{
        height: POPUP_HEIGHT,
        backgroundColor: "var(--color-secondary)",
      }}
    >
      {/* Input section */}
      <section
        style={{
          backgroundColor: "var(--color-secondary)",
        }}
      >
        <div className="mb-2 flex w-full flex-col items-center justify-center gap-2 p-6">
          {/* Category selection */}
          <div className="h-[35px] w-full">
            <TargetCategorySelect
              categories={Object.keys(DEFAULT_STYLE_CONFIGS)}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
              }}
            />
          </div>

          {/* Handle input */}
          <div className="h-[35px] w-full">
            <TargetInput
              inputVal={userhandle}
              setInputVal={(value) => setUserHandle(value)}
            />
          </div>

          {/* Action selection */}
          <div className="h-[35px] w-full">
            <TargetActionSelect
              action={action}
              onActionChange={onActionChange}
            />
          </div>

          {/* Add button */}
          <div className="mt-1 flex w-full flex-col items-center">
            <Button
              variant="filled"
              color="var(--color-tertiary)"
              onClick={addToList}
              disabled={isCurrentHandleInList || userhandle.trim() === ""}
              fullWidth
            >
              Add to List
            </Button>

            {isCurrentHandleInList && (
              <div className="mt-1 text-xs text-red-400">
                This handle is already in the list
              </div>
            )}
          </div>

          {/* Search filter */}
          <div className="mt-2 w-full">
            <TextInput
              leftSection={<LuAtSign size={16} />}
              placeholder="Filter list"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              size="xs"
            />
          </div>
        </div>

        {/* Target list table */}
        <div className="max-h-[220px] overflow-y-auto rounded border border-gray-700 text-white">
          {filteredTargets.length > 0 ? (
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="border-b border-gray-700 font-medium">
                  <th className="py-2 pl-3 text-left">User</th>
                  <th className="py-2 text-left">Action</th>
                  <th className="py-2 text-center">Tag</th>
                  <th className="py-2 pr-3 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((item, idx) => (
                  <TargetRow
                    key={idx}
                    item={item}
                    index={idx}
                    onRemove={removeFromList}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-[100px] items-center justify-center text-gray-400">
              {searchFilter ? "No matches found" : "No targets added yet"}
            </div>
          )}
        </div>
      </section>

      {/* Settings button section */}
      <section
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundColor: "var(--color-secondary)",
        }}
      >
        <Button
          onClick={handleSettingsClick}
          size="sm"
          color="#ffffff"
          style={{ width: "200px", margin: "0.5rem 0rem" }}
          variant="outline"
        >
          SETTINGS
        </Button>
      </section>
    </div>
  );
};
