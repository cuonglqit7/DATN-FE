"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import validator from "validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/sessionContext";
import { useRouter } from "next/navigation";
import { TCartItem, useCartStore } from "@/state/cart-store";
import { toast } from "sonner";

const checkoutFormSchema = z.object({
  recipient_name: z
    .string()
    .min(2, { message: "Ít nhất 2 ký tự." })
    .max(50, { message: "Tối đa 50 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }).optional(),
  recipient_phone: z
    .string()
    .length(10, { message: "Số điện thoại phải đúng 10 chữ số." })
    .refine((phone) => validator.isMobilePhone(phone, "vi-VN"), {
      message: "Số điện thoại không hợp lệ.",
    }),
  shipping_address: z
    .string()
    .min(10, { message: "Tối thiểu 10 ký tự." })
    .max(500, { message: "Tối đa 500 ký tự." }),
  payment_method: z
    .enum(["Bank_transfer", "Momo", "cod"], {
      message: "Phương thức thanh toán không hợp lệ.",
    })
    .default("cod"),
  user_note: z
    .string()
    .max(200, { message: "Không quá 200 ký tự." })
    .optional(),
});

export default function DialogCheckout(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: TCartItem[];
}) {
  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipient_name: "",
      email: "",
      recipient_phone: "",
      shipping_address: "",
      payment_method: "cod",
      user_note: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { sessionToken } = useSession();
  const { reset, deleteCartItem } = useCartStore();
  const router = useRouter();

  // Hàm tạo mã đơn hàng
  const generateOrderCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let orderCode = "";
    for (let i = 0; i < 11; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      orderCode += characters[randomIndex];
    }
    return orderCode;
  };

  // Hàm tạo mã không trùng với giới hạn số lần thử
  const generateUniqueOrderCode = async (maxAttempts = 5) => {
    let attempts = 0;
    let code;
    let isDuplicate = true;

    while (isDuplicate && attempts < maxAttempts) {
      code = generateOrderCode();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders/check/${code}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không thể kiểm tra mã đơn hàng");
        const result = await res.json();
        isDuplicate = result.isHave;
        attempts++;
      } catch (error: any) {
        throw new Error("Lỗi khi kiểm tra mã đơn hàng: " + error.message);
      }
    }

    if (isDuplicate) throw new Error("Không thể tạo mã đơn hàng không trùng");
    return code;
  };

  const onSubmit = async (values: z.infer<typeof checkoutFormSchema>) => {
    if (isSubmitted) return; // Ngăn submit nhiều lần
    setIsSubmitted(true);
    setLoading(true);

    try {
      if (!sessionToken) {
        setTimeout(() => router.push("/login?redirect=cart"), 1500);
        throw new Error("Vui lòng đăng nhập để đặt hàng.");
      }

      if (props.selectedItems.length === 0) {
        throw new Error("Giỏ hàng trống. Vui lòng chọn sản phẩm.");
      }

      const amount = props.selectedItems.reduce(
        (sum, item) =>
          sum +
          (item.products.promotion_price ?? item.products.price) *
            item.quantity,
        0
      );

      const uniqueCode = await generateUniqueOrderCode();

      const orderData = {
        ...values,
        code: uniqueCode,
        amount,
        items: props.selectedItems.map((item) => ({
          id: String(item.products.id),
          quantity: item.quantity,
        })),
      };

      if (values.payment_method === "Momo") {
        const momoRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/momo/payment/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(orderData),
          }
        );

        const momoPayload = await momoRes.json();

        if (!momoRes.ok) {
          throw new Error(momoPayload.error || "Tạo thanh toán Momo thất bại");
        }

        router.push(momoPayload.payUrl);
        props.selectedItems.map((item) => deleteCartItem(item.products.id));
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const payload = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        }
        if (res.status === 422 || res.status === 400) {
          throw new Error(
            JSON.stringify(payload.errors) || "Dữ liệu không hợp lệ"
          );
        }
        throw new Error(payload.error || "Không thể tạo đơn hàng");
      }

      const orderCode = payload.data.code;

      props.selectedItems.map((item) => deleteCartItem(item.products.id));
      props.onOpenChange(false);
      form.reset();
      toast.success("Đặt hàng thành công.");

      if (values.payment_method === "Bank_transfer") {
        router.push(`/tai-khoan/don-hang`);
      } else {
        router.push(
          `/cart/order-success?orderCode=${encodeURIComponent(orderCode)}`
        );
      }
    } catch (error: any) {
      console.error("Lỗi đặt hàng:", error);
      toast.error("Đặt hàng thất bại: " + error.message);
    } finally {
      setLoading(false);
      setIsSubmitted(false); // Mở khóa sau khi hoàn tất
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Thông tin đơn hàng</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="recipient_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người nhận</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Người nhận"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email nhận thông tin đơn hàng"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Số điện thoại (10 số)"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ giao hàng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Địa chỉ giao hàng"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương thức thanh toán</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border p-2 rounded w-full"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={loading}
                    >
                      <option value="Bank_transfer">Chuyển khoản</option>
                      <option value="Momo">Momo</option>
                      <option value="cod">Thanh toán khi nhận hàng</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ghi chú"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button type="submit" disabled={loading || isSubmitted}>
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => props.onOpenChange(false)}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
