export type CategoryType = "fake_news" | "parody" | "satire" | "default";

export interface TargetHandle {
  handle: string;
  category: CategoryType;
}

interface TargetCategorySelectProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export const TargetCategorySelect = ({
  selectedCategory,
  onCategoryChange,
}: TargetCategorySelectProps) => {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
      className="bg-gray-700 text-white rounded px-2"
    >
      <option value="default">Default</option>
      <option value="fake_news">Fake News</option>
      <option value="parody">Parody</option>
      <option value="satire">Satire</option>
    </select>
  );
};
