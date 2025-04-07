import z from "zod";

export const ImagesRes = z.object({
  status: z.boolean(),
  product_id: z.string(),
  image_url: z.string(),
  alt_text: z.string(),
  is_primary: z.boolean(),
  url: z.string(),
});

export type ImagesResType = z.TypeOf<typeof ImagesRes>;
