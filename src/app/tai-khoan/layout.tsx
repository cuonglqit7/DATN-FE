"use client";
import { BreadcrumbWithAccount } from "@/components/breadcrumb/BreadcrumbWithAccount";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const getActiveState = () => {
    if (pathname === "/tai-khoan") return "info";
    if (pathname === "/tai-khoan/don-hang") return "orders";
    if (pathname === "/tai-khoan/san-pham-yeu-thich") return "favorites";
    return "info";
  };

  const isActive = getActiveState();

  return (
    <div className="mt-30 max-w-screen-xl m-auto">
      <BreadcrumbWithAccount isPage={isActive} />
      <div className="flex mt-4">
        <aside className="w-64 bg-white shadow-md h-[calc(90vh-80px)] rounded-md sticky top-30">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Thông tin tài khoản
            </h2>
            <nav className="mt-6">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/tai-khoan"
                    className={`flex items-center ${
                      isActive === "info"
                        ? "text-rose-500 hover:text-rose-600"
                        : ""
                    }hover:text-rose-600 cursor-pointer`}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Thông tin tài khoản
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tai-khoan/don-hang"
                    className={`flex ${
                      isActive === "orders"
                        ? "text-rose-500 hover:text-rose-600"
                        : ""
                    }hover:text-rose-600 cursor-pointer`}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Đơn hàng của bạn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tai-khoan/san-pham-yeu-thich"
                    className={`flex items-center ${
                      isActive === "favorites"
                        ? "text-rose-500 hover:text-rose-600"
                        : ""
                    }hover:text-rose-600 cursor-pointer`}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Sản phẩm yêu thích
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <main className="flex-1 ps-6">{children}</main>
      </div>
    </div>
  );
}
