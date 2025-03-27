"use client";

import { useSession } from "@/contexts/sessionContext";
import { removeProductFavorite } from "@/server/productFavorites";

interface RemoveProductFavoriteProps {
  id: string;
}

export default function ButtonRemoveProductFavorites({
  id,
}: RemoveProductFavoriteProps) {
  const { sessionToken } = useSession();

  const handleRemoveProductFavorite = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/favorites`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          product_id: id,
        }),
      }
    );

    if (res.ok) {
      window.location.reload();
    }
  };
  return (
    <button
      onClick={() => handleRemoveProductFavorite(id)}
      className="text-sm text-gray-600 hover:text-red-600 cursor-pointer"
    >
      Xóa khỏi danh sách
    </button>
  );
}
