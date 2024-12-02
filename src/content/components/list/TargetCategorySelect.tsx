export type CategoryType = "fake_news" | "parody" | "satire" | "on_watchlist";

interface TargetCategorySelectProps {
  categories: string[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export const TargetCategorySelect = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: TargetCategorySelectProps) => {
  const categoryOptions = categories.map((category) => {
    const categoryLabel = category.replace("_", " ").split(" ");
    // Turn every word into uppercase
    const upperCaseCategoryLabel = categoryLabel.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return upperCaseCategoryLabel.join(" ");
  });
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
      className="h-full w-full rounded bg-tertiary px-2 text-white"
    >
      {categoryOptions.map((category) => {
        return <option key={category}>{category}</option>;
      })}
    </select>
  );
};
