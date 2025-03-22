import z, { boolean, number } from "zod";

export const CategoryRes = z
  .object({
    id: z.string(),
    category_name: z.string(),
    slug: z.string(),
    image_url: z.string(),
    position: z.number(),
    description: z.string(),
    parent_id: z.number(),
    status: z.boolean(),
  })
  .strict();

export type CategoryResType = z.TypeOf<typeof CategoryRes>;
