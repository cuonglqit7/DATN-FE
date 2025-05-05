import { AccountResType } from "@/schemaValidations/account.schema";

export const getUser = async (id: string): Promise<AccountResType[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${id}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch product");

  const payload = await res.json();
  return payload;
};
