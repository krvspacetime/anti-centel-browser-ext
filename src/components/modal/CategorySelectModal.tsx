import { CategoryType } from "../list/TargetCategorySelect";

interface CategorySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: CategoryType) => void;
  handle: string;
}

export const CategorySelectModal = ({
  isOpen,
  onClose,
  onConfirm,
  handle,
}: CategorySelectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">
          Select category for @{handle}
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onConfirm("default")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Default
          </button>
          <button
            onClick={() => onConfirm("fake_news")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Fake News
          </button>
          <button
            onClick={() => onConfirm("parody")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Parody
          </button>
          <button
            onClick={() => onConfirm("satire")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Satire
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
