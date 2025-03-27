"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsResType } from "@/schemaValidations/products.schema";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ButtonFavorite from "@/components/button-favorite/button-favorite";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaFire, FaTrophy } from "react-icons/fa";
import { useCartStore } from "@/state/cart-store";
import { toast } from "sonner";
import { RatingStars } from "@/components/RatingStars/RatingStars";

export default function ProductCard() {
  const [products, setProducts] = useState<ProductsResType[]>([]);
  const { addOrUpdate } = useCartStore();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT_V2}/products/best-selling`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const payload = await res.json();
        if (!res.ok) throw payload;

        setProducts(payload.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (product: ProductsResType) => {
    addOrUpdate({
      products: {
        id: Number(product.id),
        name: product.product_name,
        price: product.price,
        promotion_price: product.promotion_price,
        image: product.avatar_url,
      },
      quantity: 1,
    });

    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
      {products.map((product) => (
        <Card
          key={product.id}
          className="py-4 shadow-lg rounded-lg relative flex flex-col h-full "
        >
          <Badge
            className="absolute top-2 left-2 font-medium z-10"
            variant={"secondary"}
          >
            {product.category.category_name}
          </Badge>
          <CardContent className="flex justify-center relative">
            <Image
              src={product.avatar_url}
              alt={product.product_name}
              width={100}
              height={100}
              className="w-full h-40 object-cover rounded-md"
            />

            <div className="absolute -bottom-5 left-6 w-full">
              <RatingStars rating={product.product_reviews_avg_rating} />
            </div>
          </CardContent>
          <CardHeader>
            <Link
              href={`/san-pham/${product.category.slug}/${product.slug}`}
              key={product.id}
            >
              <CardTitle className="text-lg font-bold line-clamp-2 hover:text-rose-500 overflow-hidden cursor-pointer">
                {product.product_name}
              </CardTitle>
            </Link>
            <div className="flex text-xs gap-2">
              <p>Đã bán được: </p>
              <span className="text-rose-500"> {product.quantity_sold}</span>
            </div>
            <CardDescription>
              <p className="text-md font-bold">
                Giá gốc:{" "}
                <del className="text-gray-500">
                  {formatPrice(product.price)}
                </del>
                <span className="text-rose-500 font-bold">
                  {" "}
                  {formatPrice(product.promotion_price)}
                </span>
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-green-500 text-white hover:bg-green-600 cursor-pointer"
            >
              <ShoppingCartIcon className="size-5" />
              Thêm vào giỏ hàng
            </Button>
          </CardFooter>
          <div className="absolute top-2 right-2">
            <ButtonFavorite
              productId={product.id}
              productName={product.product_name}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
