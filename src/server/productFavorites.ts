import { cookies } from "next/headers";

export async function getProductFavorites() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken");

  if (!token?.value) {
    return;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/favorites`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
  });

  const payload = await res.json();
  return payload;
}

export async function removeProductFavorite(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      product_id: id,
    }),
  });

  const payload = await res.json();
}
