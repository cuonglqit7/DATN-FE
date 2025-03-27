"use client";

import { useState, useEffect } from "react";
import { useFavoriteContext } from "@/contexts/FavoriteProvider";
import { useSession } from "@/contexts/sessionContext";

export default function Favorite() {
  const { favoriteQuantity, setFavoriteQuantity } = useFavoriteContext();
  const { sessionToken } = useSession();

  useEffect(() => {
    if (!sessionToken) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/favorites`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Lỗi khi lấy danh sách yêu thích");

        const data = await res.json();

        setFavoriteQuantity(data.data?.length); // Giả sử API trả về danh sách sản phẩm yêu thích
      } catch (error) {
        console.error("Lỗi lấy số lượng yêu thích:", error);
      }
    };

    fetchFavorites();
  }, [setFavoriteQuantity]);

  return (
    <div>
      <button
        type="button"
        className="relative inline-flex items-center px-2 py-1 text-sm font-medium text-gray-900 bg-white rounded-lg border border-rose-500 hover:bg-rose-100 focus:ring-4 focus:outline-none focus:ring-rose-300"
        style={{ cursor: "pointer" }}
      >
        <svg
          className="w-6 h-6 text-gray-900"
          aria-hidden="true"
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
        Yêu thích
        <span className="sr-only">Notifications</span>
        {favoriteQuantity > 0 && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-rose-500 border-2 border-white rounded-full -top-2 -end-2">
            {favoriteQuantity}
          </div>
        )}
      </button>
    </div>
  );
}
