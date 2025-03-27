import { unstable_cache } from "next/cache";

interface GetProductsParams {
  page_ralated_product?: number;
  product_id?: string;
}

export const getArticleRelate = unstable_cache(
  async (params: GetProductsParams) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/articles/product/${params.product_id}?page=${params.page_ralated_product}`
    );
    const payload = await res.json();

    return payload;
  },
  ["articlesProduct"],
  { tags: ["articlesProduct"] }
);
