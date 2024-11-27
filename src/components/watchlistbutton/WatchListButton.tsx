import React from "react";

interface WatchlistButtonProps {
  isInTargetList: boolean;
  onButtonClick: () => void;
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  isInTargetList,
  onButtonClick,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onButtonClick();
      }}
      className={`
        inline-flex items-center px-2 py-1 ml-2 -mt-0.5
        text-xs text-white rounded-full
        ${
          isInTargetList
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }
        font-sans whitespace-nowrap cursor-pointer
      `}
    >
      {isInTargetList ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
};
