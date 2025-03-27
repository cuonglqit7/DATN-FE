"use client";
import { Share } from "@/components/share/Share";
import { ImagesResType } from "@/schemaValidations/image.schema";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageGallery({
  images = [],
}: {
  images?: ImagesResType[];
}) {
  // Khởi tạo hình chính
  const [mainImage, setMainImage] = useState<ImagesResType | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  // Hàm cuộn danh sách ảnh
  const scrollThumbnails = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 100; // Điều chỉnh tốc độ cuộn
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-3 relative">
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden relative">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={mainImage.alt_text || "Main product"}
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 animate-fadeIn"
            loading="lazy"
            onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
          />
        ) : (
          <span className="text-gray-500">Không có hình ảnh</span>
        )}
      </div>

      <div className="relative w-full">
        <button
          onClick={() => scrollThumbnails("left")}
          className="absolute h-full hover:bg-gray-50 transition -left-5 top-1/2 transform -translate-y-1/2  p-2 z-10 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-5 py-1"
          style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.alt_text || `Product image ${index + 1}`}
              className={`w-30 h-30 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                mainImage?.url === image.url
                  ? "border-blue-500 scale-105 shadow-md"
                  : "border-transparent hover:border-gray-400"
              }`}
              onClick={() => setMainImage(image)}
              loading="lazy"
            />
          ))}
        </div>
        <button
          onClick={() => scrollThumbnails("right")}
          className="absolute h-full hover:bg-gray-50 transition -right-5 top-1/2 transform -translate-y-1/2  p-2  z-10 cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
