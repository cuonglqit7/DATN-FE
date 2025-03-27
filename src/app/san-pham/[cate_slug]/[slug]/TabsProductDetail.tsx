"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetailResType } from "@/schemaValidations/detailproduct.schema";
import { useEffect, useState } from "react";
import { getProduct } from "@/server/user";
import { formatDate } from "@/lib/formatDate";
import { RatingStars } from "@/components/RatingStars/RatingStars";
import { formatRating } from "@/lib/formatRating";
interface TabsDetailProductProps {
  product: ProductDetailResType;
}

export function TabsProductDetail({ product }: any) {
  const attributes = product.attributes;
  const product_reviews = product.product_reviews;

  const sortedReviews = [...product.product_reviews].sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <Tabs defaultValue="description" className=" m-auto">
      <TabsList className="grid w-full grid-cols-3 border">
        <TabsTrigger value="description" className="cursor-pointer">
          Giới thiệu sản phẩm
        </TabsTrigger>
        <TabsTrigger value="info" className="cursor-pointer">
          Thông tin sản phẩm
        </TabsTrigger>
        <TabsTrigger value="reviews" className="cursor-pointer">
          Đánh giá
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="w-full">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Mô tả</CardTitle>
          </CardHeader>
          <CardContent>{product.description ?? "Chưa có mô tả"}</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="info">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {attributes.map((attribute: any, index: number) => (
                <li key={index}>
                  {attribute.attribute_name}: {attribute.attribute_value}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reviews">
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Đánh giá của người dùng</CardTitle>
            <CardDescription>
              Các danh giá của người dùng đã mua {product.product_name} từ Tea
              Bliss.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <div className="text-center text-4xl text-yellow-500">
                {formatRating(product.product_reviews_avg_rating)} trên 5
                <div className="flex justify-center">
                  <RatingStars rating={product.product_reviews_avg_rating} />
                </div>
              </div>
              <div></div>
            </div>
            <hr className="my-4" />
            <div>
              <ul>
                {sortedReviews.map(async (review: any, index: number) => {
                  const res: any = await getProduct(review.user_id);

                  const user = res.data;

                  return (
                    <li
                      key={index}
                      className="p-2 mt-4 border shadow rounded-md"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={`${user.avatar}`} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="font-bold text-md">{user.name}</div>
                            <p className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </p>
                          </div>
                        </div>
                        <RatingStars rating={review.rating} />
                      </div>
                      <div className="mt-2">{review.comment}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
