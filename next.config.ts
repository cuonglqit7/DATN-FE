import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['admin.teabliss.io.vn'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
