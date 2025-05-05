import ButtonAddToCart from "@/components/addToCart/ButtonAddToCart";
import { formatPrice } from "@/components/format-price/format-price";
import ButtonRemoveProductFavorites from "@/components/removeProductFavorites/ButtonRemoveProductFavorites";
import { Button } from "@/components/ui/button";
import {
  getProductFavorites,
  removeProductFavorite,
} from "@/server/productFavorites";
import { getProductById } from "@/server/products";
import Image from "next/image";
interface ProductFavorites {
  product_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  product: {
    id: string;
    slug: string;
    product_name: string;
    price: number;
    promotion_price: number;
  };
}

export default async function page() {
  const payloadProductFavorites = await getProductFavorites();

  if (!payloadProductFavorites) {
    return (
      <>
        <div className="bg-white shadow-md rounded-md p-6">
          <div>Vui lòng đăng nhập!</div>
        </div>
      </>
    );
  }
  const productFavorites = payloadProductFavorites.data as ProductFavorites[];

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Sản phẩm yêu thích
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <ul>
          {productFavorites.length != 0 ? (
            <>
              {productFavorites.map(
                async (productFavorite: any, index: number) => {
                  const product = (await getProductById(
                    productFavorite.product.slug
                  )) as any;

                  console.log(product);

                  return (
                    <li key={index} className="mb-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex gap-4">
                          <div>
                            <Image
                              src={product.images[0].url}
                              alt={product.product_name}
                              width={100}
                              height={100}
                              className="object-cover w-auto h-auto rounded-lg"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {product.product_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              <del> {product.price}</del>
                            </p>

                            <p className="text-md text-rose-600 mt-2">
                              Giảm còn {formatPrice(product.promotion_price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between mt-4">
                          <ButtonRemoveProductFavorites id={product.id} />
                          <ButtonAddToCart product={product} />
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
            </>
          ) : (
            <>
              <p>Bạn chưa thích sản phẩm nào.</p>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
