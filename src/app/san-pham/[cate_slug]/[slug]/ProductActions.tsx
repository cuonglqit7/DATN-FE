"use client";

import { useState } from "react";
import AddToCart from "@/app/san-pham/[cate_slug]/[slug]/AddToCart";
import { ProductDetailResType } from "@/schemaValidations/detailproduct.schema";

interface ProductActionsProps {
  initialQuantity?: number;
  product: ProductDetailResType;
}

export default function ProductActions({
  initialQuantity = 1,
  product,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const newQuantity = isNaN(value) || value < 1 ? 1 : value;
    setQuantity(newQuantity);
  };

  return (
    <div className="space-y-3 mt-5">
      <div className="flex items-center space-x-2">
        <span className="text-gray-700">Số lượng:</span>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleChange}
          className="w-16 h-10 text-center border rounded-md"
        />
      </div>
      <div className="flex gap-3">
        <AddToCart quantity={quantity} product={product} />
        <button
          className="flex-1 py-2 px-4 rounded-lg transition 
          bg-gray-500 text-white 
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-500"
          disabled
        >
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
}
