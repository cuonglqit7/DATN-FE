import z, { boolean, number } from "zod";

export const FavoriteRes = z.object({
  message: z.string(),
  isFavorite: z.boolean(),
});

export type FavoriteResType = z.TypeOf<typeof FavoriteRes>;
