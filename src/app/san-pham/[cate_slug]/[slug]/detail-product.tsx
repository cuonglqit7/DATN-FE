import ProductDescription from "@/app/san-pham/[cate_slug]/[slug]/product-description";
import ProductImageGallery from "@/app/san-pham/[cate_slug]/[slug]/product-image-gallary";
import ProductActions from "@/app/san-pham/[cate_slug]/[slug]/ProductActions";
import { TabsProductDetail } from "@/app/san-pham/[cate_slug]/[slug]/TabsProductDetail";
import ProductCardComponent from "@/components/card-product/ProductCardComponent";
import { formatPrice } from "@/components/format-price/format-price";
import { RatingStars } from "@/components/RatingStars/RatingStars";
import { Share } from "@/components/share/Share";
import { Badge } from "@/components/ui/badge";
import { formatRating } from "@/lib/formatRating";
import { FaFire, FaStar, FaTrophy } from "react-icons/fa";
import { PaginationProductDetail } from "@/app/san-pham/[cate_slug]/[slug]/PaginationProductDetail";
import { getProductCate } from "@/server/product-related-cate";
import { revalidateTag } from "next/cache";
import { getArticleRelate } from "@/server/articles";
import { PaginationProductDetailArticle } from "@/app/san-pham/[cate_slug]/[slug]/PaginationProductDetailArticle";
import { ArticlesProductCard } from "@/components/articlesCard/ArticlesProductCard";

interface DetaiProductProps {
  product: any;
  page_ralated: number;
  page_ralated_product: number;
}

export default async function DetailProduct({
  product,
  page_ralated,
  page_ralated_product,
}: DetaiProductProps) {
  const category_id = product.category_id;

  const productsRelated: any = await getProductCate({
    page_ralated,
    category_id,
  });

  const productsRe = productsRelated.data.data;
  const product_id = product.id;

  const articleRelate: any = await getArticleRelate({
    product_id,
    page_ralated_product,
  });

  const articleRe = articleRelate.data.data;

  async function refetchProducts() {
    "use server";
    revalidateTag("productCates");
  }

  async function refetchArticlesProduct() {
    "use server";
    revalidateTag("articlesProduct");
  }

  const isNewProduct = () => {
    if (!product.created_at) return false;
    const createdDate = new Date(product.created_at);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference <= 7;
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 bg-white shadow-lg rounded-xl border p-6 mt-2">
        <ProductImageGallery
          images={Array.isArray(product?.images) ? product.images : []}
        />
        <div>
          <div className="p-6 bg-white shadow-lg rounded-xl border relative">
            <div className="absolute top-2 right-2 z-10">
              <Share />
            </div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-800">
                {isNewProduct() && (
                  <Badge className="absolute top-0 left-0 b</h1>g-green-500 text-white">
                    Mới <FaStar />
                  </Badge>
                )}
                {product.featured == true && (
                  <Badge className="absolute top-0 left-0 bg-yellow-500 text-white">
                    Nổi bật <FaTrophy />
                  </Badge>
                )}
                {product.best_selling == true && (
                  <Badge className="absolute top-0 left-0 bg-red-500 text-white">
                    Bán chạy <FaFire />
                  </Badge>
                )}
                {product?.product_name}
              </h1>
              <div className=" flex gap-2 items-center">
                <p className="text-lg border-b-1 border-black">
                  {formatRating(product.product_reviews_avg_rating)}{" "}
                </p>
                <RatingStars rating={product.product_reviews_avg_rating} />
                <p className="text-gray-400">
                  <span className="text-black">
                    {product.product_reviews.length}
                  </span>{" "}
                  đánh giá
                </p>
              </div>
              <p className="text-3xl font-stretch-90% text-red-600 mt-2 mb-2">
                {product?.promotion_price &&
                product.promotion_price < product.price ? (
                  <>
                    <span className="text-red-600 mr-2">
                      {formatPrice(product.promotion_price)}
                    </span>
                    <span className="text-xl text-gray-500 line-through ">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : product?.price ? (
                  formatPrice(product.price)
                ) : (
                  "Liên hệ"
                )}
              </p>
              <ProductDescription description={product?.description} />
              <ProductActions product={product} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <TabsProductDetail product={product} />
      </div>
      <div className="mt-6">
        <div className="flex">
          <h2 className="w-2/5 text-2xl font-bold p-2">Sản phẩm liên quan</h2>
          <PaginationProductDetail
            refetchProducts={refetchProducts}
            totalPages={productsRelated.data.last_page}
          />
        </div>
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 overflow-x-hidden">
          {productsRe ? (
            productsRe.map((product: any, index: number) => (
              <ProductCardComponent product={product} key={index} />
            ))
          ) : (
            <div>Chưa có sản phẩm liên quan.</div>
          )}
        </div>
      </div>
      {articleRe.length != 0 && (
        <>
          <div className="mt-6">
            <div className="flex">
              <h2 className="w-2/5 text-2xl font-bold p-2">
                Bài viết về sản phẩm
              </h2>
              <PaginationProductDetailArticle
                refetchProducts={refetchArticlesProduct}
                totalPages={productsRelated.data.last_page}
              />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 overflow-x-hidden">
              {articleRe.map((article: any, index: number) => (
                <div key={index}>
                  <ArticlesProductCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
