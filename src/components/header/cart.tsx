"use client";

import { useCartStore } from "@/state/cart-store";

export default function Cart() {
  const { totalQuantity } = useCartStore();
  return (
    <button className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-rose-500 rounded-lg hover:bg-rose-100 focus:ring-4 focus:outline-none focus:ring-rose-300 cursor-pointer">
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
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
          d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
        />
      </svg>
      Giỏ hàng
      {totalQuantity > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-rose-500 rounded-full">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
