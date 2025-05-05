import { metadata } from "@/app/layout";
import { loadSearchParams } from "@/app/searchParams";
import { BreadcrumbWithProductPage } from "@/components/breadcrumb/BreadcrumbWithProductPage";
import ProductCardComponent from "@/components/card-product/ProductCardComponent";
import { PaginationDemo } from "@/components/pagination/Pagination";
import NavFilterProduct from "@/components/product-fillter/NavFilterProduct";
import ProductsFilter from "@/components/product-fillter/ProductsFilter";
import { ProductsResType } from "@/schemaValidations/products.schema";
import { getAttributes } from "@/server/attributes";
import { getCategories } from "@/server/categories";
import { getProducts } from "@/server/products";
import { revalidateTag } from "next/cache";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: PageProps) {
  metadata.title = "Tea BLiss - Sản phẩm";

  const { search, perPage, page, category_id, minPrice, maxPrice } =
    await loadSearchParams(searchParams);

  const products: any = await getProducts({
    search,
    perPage,
    page,
    category_id,
    minPrice,
    maxPrice,
  });

  const categories: any = await getCategories();
  const attributes: any = await getAttributes();

  const data: ProductsResType[] = products ? products.data : [];
  const totalPage = products ? products.last_page : 0;

  async function refetchProducts() {
    "use server";
    revalidateTag("products");
  }

  return (
    <main className="mt-30 flex flex-col gap-4 justify-center max-w-screen-xl m-auto">
      <BreadcrumbWithProductPage />
      <div className="flex flex-row gap-4">
        <div className="min-w-2/8 grid-rows-1">
          <NavFilterProduct
            refetchProducts={refetchProducts}
            categoriesList={categories.data}
          />
        </div>

        <div className="min-w-6/8">
          <ProductsFilter
            refetchProducts={refetchProducts}
            products={products}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products != null ? (
              <>
                {data.map((product) => (
                  <ProductCardComponent key={product.id} product={product} />
                ))}
              </>
            ) : (
              <>
                <div>Không tìm thấy sản phẩm.</div>
              </>
            )}
          </div>
          <PaginationDemo
            refetchProducts={refetchProducts}
            totalPages={totalPage}
          />
        </div>
      </div>
    </main>
  );
}
