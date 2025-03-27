import z, { boolean, number } from "zod";

export const CategoriesRes = z
  .object({
    id: z.string(),
    category_name: z.string(),
    slug: z.string(),
    image_url: z.string(),
    position: z.number(),
    description: z.string(),
    parent_id: z.number().nullable(),
    status: z.boolean(),
  })
  .strict();

export type CategoriesResType = z.TypeOf<typeof CategoriesRes>;
