import { CategoriesResType } from "@/schemaValidations/categories.schema";

export const getCategories = async (): Promise<CategoriesResType[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/categories`);
  const payload = await res.json();

  return payload;
};
