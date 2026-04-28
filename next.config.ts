import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      // Phase 61 BND-02 final state — 7 entries.
      // Phase 63.1 Plan 01 Task 1: further additions REJECTED.
      // Testing showed that adding ANY new entry (even date-fns, which is already in
      // Next.js 15's default-optimized list per 61-RESEARCH §1) non-additively reshuffles
      // webpack's splitChunks boundaries across the entire shared chunk graph — dissolving
      // the post-Phase-61 stable chunk IDs (4335/e9a6067a/74c6194b/7525) into new
      // numbered chunks with no stable prefixes. D-04 lock preserved by leaving this
      // list unchanged. Bundle reduction for Plan 01 is attained via Task 2
      // (next/dynamic route-level split) instead.
      "lucide-react",
      "radix-ui",
      "input-otp",
      "cmdk",
      "vaul",
      "sonner",
      "react-day-picker",
    ],
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
