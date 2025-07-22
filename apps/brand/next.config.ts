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
  // Allow Next.js to transpile internal packages written in TypeScript.
  transpilePackages: ["shared-ui", "shared-utils"],
  async rewrites() {
    return [
      {
        source: "/creator/:path*",
        destination: `http://localhost:3001/:path*`,
      },
    ];
  },
};

export default nextConfig;
