import { ProductsResType } from "@/schemaValidations/products.schema";
import { unstable_cache } from "next/cache";

interface GetProductsParams {
  page_ralated?: number;
  category_id: string;
}

// export const getProductCate = async (
//   params: GetProductsParams,
//   category_id: string
// ): Promise<ProductsResType[]> => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?limit=5&page=${params.page}&category_id=${category_id}`,
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );

//   if (!res.ok) throw new Error("Failed to fetch product");

//   const payload = await res.json();
//   return payload;
// };

export const getProductCate = unstable_cache(
  async (params: GetProductsParams): Promise<ProductsResType[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?page=${params.page_ralated}&limit=5&category_id=${params.category_id}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch product");

    const payload = await res.json();
    return payload;
  },
  ["productCates"],
  { tags: ["productCates"] }
);
