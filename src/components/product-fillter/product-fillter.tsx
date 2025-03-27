"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { debounce } from "lodash";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  search: z.string(),
});

type ProductFilter = z.infer<typeof formSchema>;

export interface ProductFilterPayload {
  search: string;
}

export interface ProductFilterProps {
  submit?: (values: ProductFilterPayload) => void;
}

export default function ProductFilters({ submit }: ProductFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<ProductFilter>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: searchParams.get("q") || "",
    },
  });

  // Cập nhật giá trị form khi URL thay đổi
  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";
    form.setValue("search", searchQuery);
  }, [searchParams]);

  // Khi submit form
  async function onSubmit(values: ProductFilter) {
    console.log("form", values);
    await submit?.(values);
  }

  const debounceSearch = debounce(form.handleSubmit(onSubmit), 350);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-12 pr-4 w-100 bg-gray-200"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounceSearch();
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
