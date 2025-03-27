"use client";
import Cart from "@/components/header/cart";
import Favorite from "@/components/header/favorite";
import { NavigationMenuDemo } from "@/components/header/Navbar";
import SearchBox from "@/components/header/SearchBox";
import { useSession } from "@/contexts/sessionContext";
import { AccountResType } from "@/schemaValidations/account.schema";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export default function Header() {
  const [user, setUser] = useState<AccountResType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${
    searchParams ? "?" + searchParams.toString() : ""
  }`;
  const { sessionToken } = useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });

      const payload = await res.json();

      if (!res.ok) {
        throw payload;
      }

      toast.success("Đăng xuất thành công");
      setShowDropdown(false);
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!sessionToken) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        const payload = await res.json();

        if (!res.ok) {
          throw payload;
        }

        setUser(payload);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [sessionToken]);

  return (
    <header className="bg-white shadow-md p-2 fixed top-0 right-0 left-0 z-20">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-1">
          <div className="flex items-center gap-4">
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
            <SearchBox />
          </div>
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
                  <span className="text-sm font-medium">{user.data.name}</span>
                  <Image
                    src={
                      user.data.avatar
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
                    onClick={() => setShowDropdown(!showDropdown)}
                    href="/tai-khoan"
                    className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                  >
                    Thông tin tài khoản
                  </Link>
                  <Link
                    onClick={() => setShowDropdown(!showDropdown)}
                    href={"/tai-khoan/don-hang"}
                    className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                  >
                    Xem đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <nav className=" dark:bg-gray-700">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between">
            <NavigationMenuDemo />
            <ul className="flex gap-2 items-center">
              <li>
                <Link href="/tai-khoan/san-pham-yeu-thich">
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
  );
}
