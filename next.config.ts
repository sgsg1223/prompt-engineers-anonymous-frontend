import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://internal.hellman.oxygen.dfds.cloud";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      {
        source: "/pea-railmanagement-api/:path*",
        destination: `${BACKEND_URL}/pea-railmanagement-api/:path*`,
      },
    ];
  },
};

export default nextConfig;
