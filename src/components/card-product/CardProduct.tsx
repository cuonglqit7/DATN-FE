"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ProductsResType } from "@/schemaValidations/product.schema";
import ButtonFavorite from "@/components/button-favorite/ButtonFavoriet";

export default function CardProduct() {
  const [products, setProducts] = useState<ProductsResType[]>([]);
  console.log(products);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="py-4 px-2 shadow-lg rounded-lg relative"
        >
          <CardContent className="flex justify-center">
            <Image
              src={product.avatar_url}
              alt={product.product_name}
              width={100}
              height={100}
              className="w-full h-40 object-cover rounded-md"
            />
          </CardContent>
          <CardHeader>
            <Link href={`/san-pham/${product.slug}`} key={product.id}>
              <CardTitle className="text-lg font-bold line-clamp-2 hover:text-rose-500 overflow-hidden h-12 cursor-pointer">
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
          <CardFooter>
            <Button className="w-full bg-green-500 text-white hover:bg-green-600 cursor-pointer">
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
