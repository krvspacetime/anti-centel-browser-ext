import { TargetAdder } from "./TargetAdder";
import { TargetItem } from "./TargetRoot";
import { TargetSelect } from "./TargetSelect";

interface TargetAdderViewProps {
  targetItem: TargetItem;
  onAddToTargetList: (target: TargetItem) => Promise<void>;
  onChangeTargetItem: (itemName: string, itemValue: unknown) => void;
}

export const TargetAdderView = ({
  targetItem,
  onAddToTargetList,
  onChangeTargetItem,
}: TargetAdderViewProps) => {
  return (
    <div className="flex w-full flex-col">
      <TargetAdder
        label={"Handle"}
        targetName={"handle"}
        onChangeTargetItem={onChangeTargetItem}
      />
      <TargetAdder
        label={"Username"}
        targetName={"username"}
        onChangeTargetItem={onChangeTargetItem}
      />
      <TargetSelect
        options={["Twitter", "TikTok", "Instagram"]}
        label="Category"
        defaultValue="Twitter"
        targetName="category"
        onChange={onChangeTargetItem}
      />
      <TargetSelect
        options={["Filter", "Block"]}
        label="Filter"
        defaultValue="Filter"
        targetName="filter_style"
        onChange={onChangeTargetItem}
      />
      <TargetAdder
        label={"Description"}
        targetName={"description"}
        inputType="text"
        onChangeTargetItem={onChangeTargetItem}
      />
      <button
        onClick={() => onAddToTargetList(targetItem)}
        className="m-auto rounded-md bg-zinc-700 px-5 py-2 text-white outline-white hover:bg-zinc-600"
      >
        Add
      </button>
    </div>
  );
};
