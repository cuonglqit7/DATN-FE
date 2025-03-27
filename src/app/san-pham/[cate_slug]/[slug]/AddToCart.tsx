"use client";

import { ProductDetailResType } from "@/schemaValidations/detailproduct.schema";
import { useCartStore } from "@/state/cart-store";
import { toast } from "sonner";

interface AddToCartProps {
  quantity: number;
  product: ProductDetailResType;
}

export default function AddToCart({ quantity, product }: AddToCartProps) {
  const { addOrUpdate } = useCartStore();

  const handleAddToCart = (product: ProductDetailResType) => {
    addOrUpdate({
      products: {
        id: Number(product.id),
        name: product.product_name,
        price: product.price,
        promotion_price: product.promotion_price,
        image: product.images[0].url,
      },
      quantity: quantity,
    });

    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <button
      onClick={() => handleAddToCart(product)}
      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition cursor-pointer"
    >
      Thêm vào giỏ
    </button>
  );
}
