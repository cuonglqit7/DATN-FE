"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/contexts/sessionContext";

const formSchema = z.object({
  email: z.string().email({ message: "Tài khoản đăng nhập bằng email" }),
});

type LoginData = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { setSessionToken } = useSession();

  // 1. Define your form.
  const form = useForm<LoginData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: LoginData) {
    setIsPending(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(values),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Có lỗi xảy ra!");

      console.log(result.payload);

      setIsPending(false);

      toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate={true}
        className="space-y-4 mt-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Nhập email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isPending}
          style={{ cursor: "pointer" }}
        >
          {isPending ? "Chờ xử lý..." : "Xác thực"}
        </Button>
      </form>
    </Form>
  );
}
