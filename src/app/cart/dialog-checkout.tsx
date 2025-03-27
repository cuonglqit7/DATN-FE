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
  recipient_name: z.string().min(2, { message: "Ít nhất 2 kí tự." }),
  recipient_phone: z
    .string()
    .refine((phone) => validator.isMobilePhone(phone, "vi-VN"), {
      message: "Số điện thoại không hợp lệ.",
    }),
  shipping_address: z.string().min(10, { message: "Tối thiểu là 10 kí tự." }),
  payment_method: z.enum(["Bank_transfer", "Momo", "cod"]).default("cod"),
  user_note: z
    .string()
    .max(200, { message: "Không quá 200 kí tự." })
    .optional(),
});

export default function DialogCheckout(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: TCartItem[]; // Use TCartItem from store
}) {
  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipient_name: "",
      recipient_phone: "",
      shipping_address: "",
      payment_method: "cod",
      user_note: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const { sessionToken } = useSession();
  const { reset } = useCartStore(); // Use reset from store
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    try {
      setLoading(true);
      if (!sessionToken) {
        setTimeout(() => {
          router.push("/login?redirect=cart");
        }, 1500);
        throw new Error("Vui lòng đăng nhập để đặt hàng.");
      }

      const total_price = props.selectedItems.reduce(
        (sum, item) =>
          sum +
          (item.products.promotion_price || item.products.price) *
            item.quantity,
        0
      );

      const orderData = {
        ...values,
        total_price,
        items: props.selectedItems.map((item) => ({
          product_id: item.products.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          method: "POST",
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
        throw new Error(payload.error || "Failed to create order");
      }
      const orderCode = payload.data.code;

      if (payload.payment_method != "cod") {
        router.push(`/orders/${encodeURIComponent(orderCode)}`);
      }

      reset();

      props.onOpenChange(false);
      form.reset();
      toast.success("Đặt hàng thành công.");
      router.push(
        `/cart/order-success?orderCode=${encodeURIComponent(orderCode)}`
      );
    } catch (error: any) {
      console.log("Error creating order:", error);
      toast.error("Đặt hàng thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  }

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
                    <Input placeholder="Người nhận" {...field} />
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
                    <Input placeholder="Số điện thoại" {...field} />
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
                    <Input placeholder="Địa chỉ giao hàng" {...field} />
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
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Input placeholder="Ghi chú (tùy chọn)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
              <Button
                className="cursor-pointer"
                type="button"
                variant={"outline"}
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
