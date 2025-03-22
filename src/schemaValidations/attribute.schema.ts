import z, { boolean, number } from "zod";

export const AttributesRes = z
  .object({
    id: z.string(),
    product_id: z.number(),
    attribute_name: z.string(),
    attribute_value: z.string(),
    status: z.boolean(),
  })
  .strict();

export type AttributesResType = z.TypeOf<typeof AttributesRes>;
