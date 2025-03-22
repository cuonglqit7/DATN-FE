import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/account", "/settings", "/orders", "/checkout"];
const authPaths = ["/login", "register"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;

  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      pathname + (searchParams.toString() ? "?" + searchParams.toString() : "")
    );
    return NextResponse.redirect(loginUrl);
  }

  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
