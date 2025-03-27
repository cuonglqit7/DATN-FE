"use client";
import { Input } from "@/components/ui/input";
import { ProductsResType } from "@/schemaValidations/products.schema";
import { parseAsInteger, useQueryState } from "nuqs";

interface ProductsFilterProps {
  refetchProducts: () => void;
  products: ProductsResType;
}

export default function ProductsFilter({
  refetchProducts,
  products,
}: ProductsFilterProps) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(8)
  );

  const { total, from, to } = products ? products : {};

  const hanldeSearch = (value: string) => {
    setSearch(value);
    setTimeout(() => {
      refetchProducts();
    }, 100);
  };

  const handlePerPage = (value: number) => {
    setPerPage(value);
    setTimeout(() => {
      refetchProducts();
    }, 100);
  };

  return (
    <div className="flex justify-between mb-4">
      <div className="w-70 relative">
        <Input
          className="w-full h-10 ps-12 bg-white"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => hanldeSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 bottom-1/2 w-6 h-6 my-auto text-gray-500 left-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <p>
            Hiển thị {from} - {to} của tổng {total} sản phẩm
          </p>
        </div>
        <select
          value={perPage.toString()}
          onChange={(e) => handlePerPage(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
        >
          <option value="8">8 sản phẩm</option>
          <option value="16">16 sản phẩm</option>
          <option value="24">24 sản phẩm</option>
        </select>
      </div>
    </div>
  );
}
