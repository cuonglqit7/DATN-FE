import { ProductDetailResType } from "@/schemaValidations/detailproduct.schema";

export const getProduct = async (
  slug: string
): Promise<ProductDetailResType[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${slug}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch product");

  const payload = await res.json();
  return payload;
};

export async function getProductById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/byid/${id}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch product");

  const payload = await res.json();
  return payload;
}
