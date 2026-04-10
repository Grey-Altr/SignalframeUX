import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
    useCache: true,
  },
  async redirects() {
    return [
      { source: "/components", destination: "/inventory", permanent: true },
      { source: "/components/:path*", destination: "/inventory/:path*", permanent: true },
      { source: "/tokens", destination: "/system", permanent: true },
      { source: "/tokens/:path*", destination: "/system/:path*", permanent: true },
      { source: "/start", destination: "/init", permanent: true },
      { source: "/start/:path*", destination: "/init/:path*", permanent: true },
    ];
  },
};

export default analyzer(nextConfig);
