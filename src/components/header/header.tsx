"use client";
import Cart from "@/components/header/Cart";
import Favorite from "@/components/header/Favorite";
import { AccountResType } from "@/schemaValidations/account.schema";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<AccountResType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${
    searchParams ? "?" + searchParams.toString() : ""
  }`;
  return (
    <div>
      <header className="bg-white shadow-md p-2 fixed top-0 right-0 left-0 z-30">
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-2">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image
                src="/logo.png"
                alt="Website Logo"
                width={40}
                height={40}
                className="rounded-full"
                priority
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-rose-500">
                Tea Bliss
              </span>
            </Link>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <Link
                href="tel:5541251234"
                className="text-sm  text-rose-500 dark:text-white hover:text-rose-500 hover:underline"
              >
                HOTLINE (+84) 925 111 159
              </Link>
              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <span className="text-sm font-medium">
                      {user.data.name}
                    </span>
                    <Image
                      src={
                        user.data.avatar?.startsWith("http")
                          ? user.data.avatar
                          : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${user.data.avatar}`
                      }
                      alt="Hình đại diện"
                      width={32}
                      height={32}
                      className="rounded-full object-cover w-8 h-8 cursor-pointer"
                    />
                  </button>
                ) : (
                  <Link
                    href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                    className="text-sm text-blue-600 hover:text-rose-500 hover:underline"
                  >
                    Đăng nhập
                  </Link>
                )}

                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-40">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Thông tin tài khoản
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        <nav className="bg-gray-50 dark:bg-gray-700">
          <div className="max-w-screen-xl py-1 mx-auto">
            <div className="flex items-center justify-between">
              <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse uppercase">
                <li>
                  <Link
                    href="/"
                    className="text-gray-900 dark:text-white hover:text-rose-500 hover:underline"
                    aria-current="page"
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/san-pham"
                    className="text-gray-900 dark:text-white hover:text-rose-500 hover:underline"
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bai-viet"
                    className="text-gray-900 dark:text-white hover:text-rose-500 hover:underline"
                  >
                    Bài viết
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gioi-thieu"
                    className="text-gray-900 dark:text-white hover:text-rose-500 hover:underline"
                  >
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lien-he"
                    className="text-gray-900 dark:text-white hover:text-rose-500 hover:underline"
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
              <ul className="flex gap-2 items-center">
                <li>
                  <Link href="/yeu-thich">
                    <Favorite />
                  </Link>
                </li>
                <li>
                  <Link href="/cart">
                    <Cart />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
