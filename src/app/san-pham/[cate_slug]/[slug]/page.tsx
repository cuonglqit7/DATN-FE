import { metadata } from "@/app/layout";
import DetailProduct from "@/app/san-pham/[cate_slug]/[slug]/detail-product";
import { loadSearchParams } from "@/app/searchParams";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb/BreadcrumbWithCustomSeparator";
import { getProduct } from "@/server/product-detail";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; cate_slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug, cate_slug } = await params;
  const resolvedSearchParams = await searchParams;
  const product: any = await getProduct(slug);
  if (!product) throw new Error("Không tìm thấy sản phẩm");
  metadata.title = "Tea Bliss - " + product.product_name;

  const { page_ralated = 1, page_ralated_product = 1 } = await loadSearchParams(
    resolvedSearchParams
  );

  return (
    <div className="mt-30">
      <div className="mx-auto max-w-screen-xl">
        <BreadcrumbWithCustomSeparator slug={slug} cate_slug={cate_slug} />
        <DetailProduct
          page_ralated_product={page_ralated_product}
          page_ralated={page_ralated}
          product={product}
        />
      </div>
    </div>
  );
}
