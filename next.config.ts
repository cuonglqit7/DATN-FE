import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000", // Cổng Laravel (thường là 8000)
        pathname: "/storage/**", // Đường dẫn ảnh từ Laravel
        search: "",
      },
    ],
  },
};

export default nextConfig;
