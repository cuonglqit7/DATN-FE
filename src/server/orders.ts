import { cookies } from "next/headers";

export async function getOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  if (!token) {
    return;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await res.json();
  return payload;
}
