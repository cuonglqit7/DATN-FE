"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { CategoriesResType } from "@/schemaValidations/categories.schema";
import Image from "next/image";

export function CarouselSize() {
  const [categories, setCategories] = useState<CategoriesResType[]>([]); // Đặt default là mảng rỗng

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/categories`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(async (res) => {
          const payload = await res.json();

          const data = {
            status: res.status,
            payload,
          };

          if (!res.ok) {
            throw data;
          }

          return data;
        });
        setCategories(res.payload.data); // Kiểm tra data trước khi set state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  return (
    <Carousel opts={{ align: "start" }} className="w-full m-auto mt-10">
      <CarouselContent>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/9">
              <div className="p-1">
                <Link href={"/san-pham/" + category.slug}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-2">
                      <Image
                        src={category.image_url}
                        alt={category.category_name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <div className="text-center font-bold">
                {category.category_name}
              </div>
            </CarouselItem>
          ))
        ) : (
          <p className="text-center w-full py-4">Không có danh mục nào.</p>
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
