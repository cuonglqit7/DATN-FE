import { useState } from "react";
import { Star } from "lucide-react"; // Hoặc dùng bất kỳ icon nào khác bạn muốn

interface RatingStarsInputProps {
  value: number;
  onChange: (newRating: number) => void;
}

export function RatingStarsInput({ value, onChange }: RatingStarsInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          className={`cursor-pointer transition-colors ${
            (hovered || value) >= star
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}
