import { metadata } from "@/app/layout";
import ProductCard from "@/components/card-product/ProductCard";
import ProductCart from "@/components/card-product/ProductCard";
import { CarouselPlugin } from "@/components/carousel/carousel";
import { CarouselSize } from "@/components/carousel/CarouselSize";
import Image from "next/image";

export default async function Home() {
  metadata.title = "Tea BLiss - Trang chủ";
  return (
    <div className="mt-25">
      <section className="w-full">
        <CarouselPlugin />
      </section>
      <section className="mt-10">
        <div className="grid grid-cols-3 max-w-screen-xl m-auto gap-4">
          <div className="bg-white rounded flex items-center gap-2 p-5">
            <div>
              <Image
                src="/images/mienphi-vanchuyen-1.png"
                alt="mienphi-vanchuyen-1"
                width={200}
                height={200}
              />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold">Vận chuyển miễn phí</h4>
              <p className="font-medium mt-2">
                Miễn phí vận chuyển toàn quốc cho các đơn hàng trên 300K
              </p>
            </div>
          </div>
          <div>
            <div className="bg-white rounded flex items-center gap-2 p-5">
              <div>
                <Image
                  src="/images/Certificate.png"
                  alt="Certificate"
                  width={200}
                  height={200}
                />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold">Cam kết chất lượng</h4>
                <p className="font-medium mt-2">
                  Hoàn 100% tiền nếu khách hàng không hài lòng về sản phẩm
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded flex items-center gap-2 p-5">
              <div>
                <Image
                  src="/images/icon-01.png"
                  alt="icon-01"
                  width={200}
                  height={200}
                />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold">
                  Quan điểm kinh doanh
                </h4>
                <p className="font-medium mt-2">
                  Khách hàng là người quyết định sự phát triển của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-20">
        <div className="max-w-screen-xl m-auto gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-center">
              Thế giới trà đạo – Nâng tầm trải nghiệm thưởng trà
            </h1>
            <p className="text-center mt-5">
              Hàng trăm sản phẩm ấm trà tử sa, trà cụ… chất lượng. Mua sắm ngay
              !
            </p>
          </div>
          <div className="w-full">
            <CarouselSize />
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="max-w-screen-xl m-auto gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-center">
              Những sản phẩm bán chạy nhất trong tuần
            </h1>
            <p className="text-center mt-5">
              Đây là những sản phẩm được nhiều khách hàng lựa chọn nhất
            </p>
          </div>
          <div className="mt-5 space-x-2">
            <ProductCard />
          </div>
        </div>
      </section>
    </div>
  );
}
