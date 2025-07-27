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
    const creatorUrl = process.env.CREATOR_APP_URL || "http://localhost:3001";
    return [
      {
        source: "/creator/:path*",
        destination: `${creatorUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
