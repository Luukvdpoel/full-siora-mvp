import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  // Allow Next.js to transpile internal packages written in TypeScript.
  transpilePackages: ["shared-ui", "shared-utils"],
  async rewrites() {
    if (process.env.CREATOR_APP_URL) {
      return [
        {
          source: "/creator/:path*",
          destination: `${process.env.CREATOR_APP_URL}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
