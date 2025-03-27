"use server";

import { ProductsResType } from "@/schemaValidations/products.schema";
import { unstable_cache } from "next/cache";

interface GetProductsParams {
  search?: string;
  perPage?: number;
  page?: number;
  category_id?: number[];
  minPrice?: number;
  maxPrice?: number;
}

// export async function getProducts({
//   search,
//   perPage = 8,
// }: GetProductsParams): Promise<ProductsResType[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?q=${search}&offset=0&limit=${perPage}`
//   );
//   const payload = await res.json();

//   return payload.data.data;
// }

export const getProducts = unstable_cache(
  async (params: GetProductsParams): Promise<ProductsResType[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?q=${params.search}&category_id=${params.category_id}&min_price=${params.minPrice}&max_price=${params.maxPrice}&page=${params.page}&limit=${params.perPage}`
    );
    const payload = await res.json();
    console.log(payload);

    return payload.data;
  },
  ["products"],
  { tags: ["products"] }
);

export async function getProductById(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${slug}`
  );

  const payload = await res.json();
  return payload;
}
