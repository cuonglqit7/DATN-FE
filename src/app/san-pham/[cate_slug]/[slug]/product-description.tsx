"use client";
import { useState } from "react";

export default function ProductDescription({
  description,
}: {
  description?: string;
}) {
  const [showMore, setShowMore] = useState(false);

  if (!description) {
    return <p className="text-gray-600 mt-2">Không có thông tin.</p>;
  }

  const sentences = description.split(".").filter((item) => item.trim() !== "");
  const visibleSentences = showMore ? sentences : sentences.slice(0, 3);

  return (
    <div className="relative bg-gray-100 p-4 rounded-lg">
      {sentences.length > 3 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="absolute bottom-2 right-2  px-3 py-1 text-blue-500 text-sm cursor-pointer"
        >
          {showMore ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
      <ul className="text-gray-600 list-disc pl-5">
        {visibleSentences.map((sentence, index) => (
          <li key={index}>{sentence.trim()}.</li>
        ))}
      </ul>
    </div>
  );
}
