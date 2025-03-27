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
const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(256, { message: "Tên quá dài, tối đa 256 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
    password_confirmation: z
      .string()
      .min(8, { message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự" })
      .max(100, { message: "Xác nhận mật khẩu không được vượt quá 100 ký tự" }),
  })
  .strict()
  .superRefine(({ password_confirmation, password }, ctx) => {
    if (password_confirmation !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["password_confirmation"],
      });
    }
  });
type RegisterData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { setSessionToken } = useSession();
  // 1. Define your form.
  const form = useForm<RegisterData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterData) {
    try {
      setIsPending(true);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/register`,
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
          method: "POST",
        }
      ).then(async (res) => {
        const payload = await res.json();

        const data = {
          status: res.status,
          payload,
        };

        if (!res.ok) {
          throw data;
        }

        return data;
      });
      setIsPending(false);
      setSessionToken(result.payload.access_token);
      const resultFromServer = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const payload = await res.json();

        const data = {
          status: res.status,
          payload,
        };

        if (!res.ok) {
          throw data;
        }

        return data;
      });

      // Đăng nhập thành công
      toast.success("Đăng ký thành công!");
      router.push(redirect || "/");
    } catch (error: any) {
      setIsPending(false);

      const errors = error.payload.errors as {
        field: string;
        message: string;
      }[];

      const status = error.status as number;

      if (status === 422) {
        errors.forEach((error) => {
          form.setError(error.field as "email" | "password", {
            type: "server",
            message: error.message,
          });
        });
      } else {
        toast.error(error.payload.message);
      }
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email Field */}
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

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập mật khẩu..."
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Xác nhận lại mật khẩu..."
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Đăng ký Link */}
        <div className="flex gap-1 text-sm">
          <p>Bạn đã có tài khoản?</p>
          <Link
            href={"/login"}
            className="hover:text-blue-600 hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isPending}
          style={{ cursor: "pointer" }}
        >
          {isPending ? "Chờ xử lý..." : "Đăng ký"}
        </Button>
      </form>
    </Form>
  );
}
