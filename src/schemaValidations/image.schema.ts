import z from "zod";

export const ImagesRes = z
  .object({
    product_id: z.string(),
    image_url: z.string(),
    alt_text: z.string(),
    is_primary: z.boolean(),
    status: z.boolean(),
    url: z.string(),
  })
  .strict();

export type ImagesResType = z.TypeOf<typeof ImagesRes>;
