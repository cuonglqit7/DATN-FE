"use client";
import ButtonFavorite from "@/components/button-favorite/button-favorite";
import { formatPrice } from "@/components/format-price/format-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaFire, FaStar, FaTrophy } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsResType } from "@/schemaValidations/products.schema";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useCartStore } from "@/state/cart-store";
import { RatingStars } from "@/components/RatingStars/RatingStars";

interface ProductsCardProps {
  product: ProductsResType;
}

export default function ProductCardComponent({ product }: ProductsCardProps) {
  const { addOrUpdate } = useCartStore();
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

  const isNewProduct = () => {
    if (!product.created_at) return false;
    const createdDate = new Date(product.created_at);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference <= 7;
  };

  return (
    <Card
      key={product.id}
      className="py-2 px-1 shadow-lg bg-gray-50 rounded-lg gap-2 flex flex-col h-full" // Thêm flex và h-full
    >
      <CardHeader className="flex justify-center px-2 relative">
        <div className="absolute top-0 right-2">
          <ButtonFavorite
            productId={product.id}
            productName={product.product_name}
          />
        </div>
        <Image
          src={product.avatar_url != null ? product.avatar_url : "/logo.png"}
          alt={product.product_name}
          width={100}
          height={100}
          className="w-full h-40 object-cover rounded-md"
        />
        {isNewProduct() && (
          <Badge className="absolute top-0 left-0 bg-green-500 text-white">
            Mới <FaStar />
          </Badge>
        )}
        {product.featured == true && (
          <Badge className="absolute top-0 left-0 bg-yellow-500 text-white">
            Nổi bật <FaTrophy />
          </Badge>
        )}
        {product.best_selling == true && (
          <Badge className="absolute top-0 left-0 bg-red-500 text-white">
            Bán chạy <FaFire />
          </Badge>
        )}
        <div className="absolute bottom-1 left-3 w-full">
          <RatingStars rating={product.product_reviews_avg_rating} />
        </div>
      </CardHeader>

      <CardContent className="px-2 flex-1">
        {" "}
        {/* flex-1 để đẩy footer xuống */}
        <Link
          href={`/san-pham/${product.category.slug}/${product.slug}`}
          key={product.id}
        >
          <CardTitle className="text-md font-bold line-clamp-2 hover:text-rose-500 overflow-hidden cursor-pointer">
            {product.product_name}
          </CardTitle>
        </Link>
        <CardDescription>
          <div>
            <p className="text-xs font-bold">
              Giá gốc:{" "}
              <del className="text-gray-500">{formatPrice(product.price)}</del>
            </p>
          </div>
          <div>
            <span className="text-rose-500 font-bold">
              Giảm còn: {formatPrice(product.promotion_price)}
            </span>
          </div>
        </CardDescription>
      </CardContent>

      <CardFooter className="px-2 mt-auto">
        {" "}
        {/* mt-auto đẩy footer xuống dưới */}
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full bg-green-500 text-white hover:bg-green-600 cursor-pointer"
        >
          <ShoppingCartIcon className="size-5" />
          Thêm vào giỏ hàng
        </Button>
      </CardFooter>
    </Card>
  );
}
