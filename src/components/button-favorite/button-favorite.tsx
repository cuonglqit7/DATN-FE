"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFavoriteContext } from "@/contexts/FavoriteProvider";
import { useSession } from "@/contexts/sessionContext";

type FavoriteButtonProps = {
  productId: string;
  productName: string;
};

export default function ButtonFavorite({
  productId,
  productName,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { favoriteQuantity, setFavoriteQuantity } = useFavoriteContext();
  const { sessionToken } = useSession();

  useEffect(() => {
    if (!sessionToken) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/favorites/${productId}/check`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        if (!res.ok) throw new Error("Không thể kiểm tra yêu thích");

        const data = await res.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái yêu thích:", error);
      }
    };

    fetchFavorites();
  }, [productId]);

  const toggleFavorite = async () => {
    if (!sessionToken) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/favorites`,
        {
          method: isFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );

      if (!res.ok) throw new Error("Cập nhật yêu thích thất bại");

      setIsFavorite(!isFavorite);
      setFavoriteQuantity((prev) => (isFavorite ? prev - 1 : prev + 1));
      toast.success(
        `${isFavorite ? "Bỏ yêu thích" : "Đã yêu thích"} ${productName}`
      );
    } catch (error) {
      console.error("Lỗi cập nhật yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <button className="cursor-pointer" onClick={toggleFavorite}>
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
