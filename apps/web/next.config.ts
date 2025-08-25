import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://app.posthog.com; frame-ancestors 'none';",
  },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Referrer-Policy", value: "no-referrer" },
];

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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    const creatorUrl = process.env.CREATOR_APP_URL;
    if (creatorUrl) {
      return [
        {
          source: "/creator/:path*",
          destination: `${creatorUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
