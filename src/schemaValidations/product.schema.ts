import { AttributesRes } from "@/schemaValidations/attribute.schema";
import { CategoryRes } from "@/schemaValidations/category.schema";
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
    avatar: z.string(),
    category: CategoryRes,
    attribute: AttributesRes,
    image: z.string(),
  })
  .strict();

export type ProductsResType = z.TypeOf<typeof ProductsRes>;
