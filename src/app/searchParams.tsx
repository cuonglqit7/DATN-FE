import {
  createLoader,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  search: parseAsString.withDefault(""),
  perPage: parseAsInteger.withDefault(8),
  page: parseAsInteger.withDefault(1),
  category_id: parseAsArrayOf(parseAsInteger).withDefault([]),
  minPrice: parseAsInteger.withDefault(0),
  maxPrice: parseAsInteger.withDefault(10000000),
  page_ralated: parseAsInteger.withDefault(1),
  page_ralated_product: parseAsInteger.withDefault(1),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
