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
  password: z.string().min(1, { message: "Mật khẩu không được bỏ trống" }),
  remember: z.boolean(),
});

type LoginData = z.infer<typeof formSchema>;

export default function LoginForm() {
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
      password: "",
      remember: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginData) {
    try {
      setIsPending(true);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/login`,
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
      toast.success("Đăng nhập thành công!");
      setSessionToken(result.payload.access_token);
      setIsPending(false);
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
          name="remember"
          render={({ field }) => (
            <FormItem className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="p-2 w-4 h-4 cursor-pointer"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">
                  Ghi nhớ đăng nhập
                </FormLabel>
              </div>

              <div className="text-sm hover:text-blue-600 cursor-pointer">
                <Link href={"/forgot-password"}>Quên mật khẩu?</Link>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isPending}
          style={{ cursor: "pointer" }}
        >
          {isPending ? "Chờ xử lý..." : "Đăng nhập"}
        </Button>
      </form>
      <div className="flex gap-1 text-sm mt-3">
        <p>Bạn chưa có tài khoản?</p>
        <Link
          href={"/register"}
          className="hover:text-blue-600 hover:underline font-medium"
        >
          Đăng ký ngay
        </Link>
      </div>
    </Form>
  );
}
