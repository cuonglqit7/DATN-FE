import { AttributesResType } from "@/schemaValidations/attributes.schema";

export const getAttributes = async (): Promise<AttributesResType[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/attributes`);
  const payload = await res.json();

  return payload;
};
