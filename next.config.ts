import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tenanttrust.appistansoft.com",
        pathname: "/**",   // ✅ allow all images from this domain
      },
      {
        protocol: "http",
        hostname: "tenanttrust.appistansoft.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },

  trailingSlash: true,
};

export default nextConfig;