"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");

  console.log("Order Code:", orderCode); // Debugging

  const handleContinueShopping = () => {
    router.push("/");
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-40 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mt-5">
            Đặt hàng thành công!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn{" "}
            <span className="font-semibold">
              {orderCode || "đang được xử lý"}
            </span>{" "}
            đã được ghi nhận và sẽ sớm được xử lý.
          </p>
          <div className="flex gap-2">
            <Link href={"/san-pham"}>
              <Button className="w-1/2 bg-green-500 hover:bg-green-600 text-white mb-5 cursor-pointer">
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href={"/tai-khoan/don-hang"}>
              <Button className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white mb-5 cursor-pointer">
                Xem đơn hàng
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
