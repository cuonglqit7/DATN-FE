"use client";

import ForgotPasswordForm from "@/app/(auth)/forgot-password/ForgotPasswordForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="mt-40 max-w-[400px] m-auto py-4 px-8 bg-white rounded-md shadow-md">
      <h1 className="text-center text-3xl mt-4 font-semibold">
        Xác thực email
      </h1>
      <ForgotPasswordForm />
      <div className="mt-2">
        <Link
          href={"/login"}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
