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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 mt-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <CardTitle className="text-2xl font-bold text-center text-green-600">
            Đặt hàng thành công!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 px-6 pb-8">
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng.
            {orderCode && (
              <>
                <br />
                Mã đơn hàng của bạn là:{" "}
                <span className="font-semibold text-gray-800">{orderCode}</span>
              </>
            )}
            {!orderCode && (
              <> Đơn hàng của bạn đang được xử lý và sẽ sớm được xác nhận.</>
            )}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/san-pham" passHref>
              <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href="/tai-khoan/don-hang" passHref>
              <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white cursor-pointer">
                Xem đơn hàng
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
