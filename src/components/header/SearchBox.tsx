"use client";
import { formatPrice } from "@/components/format-price/format-price";
import ProductFilters, {
  ProductFilterPayload,
} from "@/components/product-fillter/product-fillter";
import { ProductsResType } from "@/schemaValidations/products.schema";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function SearchBox() {
  const [products, setProducts] = useState<ProductsResType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function fetchProducts(query: string) {
    if (!query) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setShowDropdown(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?q=${query}`
      );
      const payload = await response.json();
      setProducts(payload.data.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get("q") || "";
    fetchProducts(q);
  }, [searchParams]);

  function handleFiltersChange(newFilter: ProductFilterPayload) {
    router.push(`?q=${newFilter.search}`, { scroll: false });
  }

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg ms-10">
      <ProductFilters submit={handleFiltersChange} />

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 left-0 right-0 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <p className="p-4 text-gray-500">Đang tải sản phẩm...</p>
          ) : products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/san-pham/${product.category.slug}/${product.slug}`}
                    className="p-3 border-b last:border-none flex items-center gap-4 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={product.avatar_url}
                      alt={product.product_name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h2 className="text-sm font-medium">
                        {product.product_name}
                      </h2>
                      <p className="text-xs text-rose-500">
                        {formatPrice(product.promotion_price)}{" "}
                        <del className="text-gray-500">
                          {formatPrice(product.price)}
                        </del>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-500">Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      )}
    </div>
  );
}
