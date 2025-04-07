import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { formatDate } from "@/lib/formatDate";

interface Article {
  id: number;
  title: string;
  thumbnail_url: string;
  created_at: Date;
  short_description: string;
}

interface CardProps {
  article: Article;
}

export function ArticlesProductCard({ article }: CardProps) {
  return (
    <Card className="gap-4">
      <div>
        <Image
          src={article.thumbnail_url}
          alt={article.title}
          width={100}
          height={100}
          className="w-full h-50 object-cover rounded-t-lg"
        />
      </div>
      <CardContent>
        <CardDescription>
          Đăng ngày: {formatDate(article.created_at)}
        </CardDescription>
        <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
        <div className="line-clamp-3">{article.short_description}</div>
      </CardContent>
      <CardFooter className="flex justify-end mt-auto mb-6">
        <Button className="cursor-pointer">Xem thêm</Button>
      </CardFooter>
    </Card>
  );
}
