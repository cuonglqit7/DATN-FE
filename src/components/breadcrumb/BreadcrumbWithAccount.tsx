import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbWithAccount({ ...props }) {
  const { isPage = "info" } = props;
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tai-khoan">Tài khoản</BreadcrumbLink>
          </BreadcrumbItem>
          {isPage && (
            <>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isPage == "info" ? "Thông tin tài khoản" : ""}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {isPage == "orders" && (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isPage == "orders" ? "Đơn hàng" : ""}{" "}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {isPage == "favorites" && (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isPage == "favorites" ? "Sản phẩm yêu thích" : ""}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
