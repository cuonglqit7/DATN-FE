import { AttributesRes } from "@/schemaValidations/attributes.schema";
import { CategoriesRes } from "@/schemaValidations/categories.schema";
import { ImagesRes } from "@/schemaValidations/image.schema";
import z from "zod";

export const productReviews = z.object({
  id: z.string(),
  product_id: z.string(),
  user_id: z.string(),
  comment: z.string(),
  rating: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type ProductReviewResType = z.TypeOf<typeof productReviews>;

export const ProductDetailRes = z
  .object({
    id: z.string(),
    product_name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number(),
    promotion_price: z.number(),
    quantity_in_stock: z.number(),
    quantity_sold: z.number(),
    best_selling: z.boolean(),
    featured: z.boolean(),
    status: z.boolean(),
    created_at: z.date(),
    updated_at: z.date(),
    category_id: z.number(),
    avatar_url: z.string(),
    avatar: z.string(),
    images: ImagesRes,
    category: CategoriesRes,
    attributes: AttributesRes,
    product_reviews: productReviews,
    product_reviews_avg_rating: z.number(),
  })
  .strict();

export type ProductDetailResType = z.TypeOf<typeof ProductDetailRes>;
