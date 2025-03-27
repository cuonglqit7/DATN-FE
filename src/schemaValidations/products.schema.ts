import { AttributesRes } from "@/schemaValidations/attributes.schema";
import { CategoriesRes } from "@/schemaValidations/categories.schema";
import { ImagesRes } from "@/schemaValidations/image.schema";
import z from "zod";

export const ProductsRes = z
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
    avatar: ImagesRes,
    category: CategoriesRes,
    attribute: AttributesRes,
    product_reviews_avg_rating: z.number(),
    last_page: z.number(),
    from: z.number(),
    to: z.number(),
    total: z.number(),
    image: z.string(),
  })
  .strict();

export type ProductsResType = z.TypeOf<typeof ProductsRes>;
