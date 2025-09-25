import type { NextConfig } from "next";

// next-pwa configuration for PWA support
// Using require for compatibility with next-pwa commonjs export
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "telugu.oneindia.com" },
      { protocol: "https", hostname: "www.sakshi.com" },
      { protocol: "https", hostname: "www.eenadu.net" },
      { protocol: "https", hostname: "www.andhrajyothy.com" },
    ],
  },
};

export default withPWA(nextConfig);
