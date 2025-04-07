"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/state/cart-store";
import { toast } from "sonner";

interface Product {
  id: string | number;
  product_name: string;
  price: number;
  promotion_price: number;
  images: { url: string }[];
}

interface ButtonAddToCartProps {
  product: Product;
}

export default function ButtonAddToCart({ product }: ButtonAddToCartProps) {
  const { addOrUpdate } = useCartStore();

  const handleAddToCart = () => {
    addOrUpdate({
      products: {
        id: Number(product.id),
        name: product.product_name,
        price: product.price,
        promotion_price: product.promotion_price,
        image: product.images[0].url,
      },
      quantity: 1,
    });

    toast.success("Đã thêm vào giỏ hàng!");
  };
  return (
    <Button
      onClick={handleAddToCart}
      variant={"secondary"}
      className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
    >
      Thêm vào giỏ
    </Button>
  );
}
