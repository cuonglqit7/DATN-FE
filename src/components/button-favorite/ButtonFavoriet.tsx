import { useState, useEffect } from "react";
import { toast } from "sonner";

type FavoriteButtonProps = {
  productId: string;
  productName: string;
};

export default function ButtonFavorite({
  productId,
  productName,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button className="cursor-pointer">
      <svg
        className={`w-6 h-6 transition-all ${
          isFavorite ? "text-yellow-400" : "text-gray-400"
        } hover:text-yellow-500`}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
        />
      </svg>
    </button>
  );
}
