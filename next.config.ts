import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      // Phase 67 BND-05 unlock + new lock state — 8 entries.
      //
      // The Phase 63.1 D-04 chunk-id stability lock was deliberately broken in
      // Phase 67 to add the SF barrel entry below and dead-code-eliminate
      // zero-consumer barrel exports (SFScrollArea, SFNavigationMenu*). Per BND-04 stale-chunk
      // guard discipline (D-10), full audit ran against fresh `rm -rf .next/cache
      // .next && ANALYZE=true pnpm build`. New stable chunk-ID baseline + per-vector
      // delta measurements (-71.3 KB gzip on homepage) + AES-04 ≤0.5% per page (D-08)
      // documented in .planning/codebase/v1.9-bundle-reshape.md (Phase 67 Plan 01 close).
      //
      // Post-Phase-67 stable chunk IDs (homepage /page manifest, see v1.9-bundle-reshape.md
      // §2a + §2b): preserved 8964 (gsap-core), 584bde89 (gsap-entry), 2979 (next runtime),
      // 5791061e (next/react-dom), 3228 (gsap-plugins). New: 289 (tailwind-merge+clsx),
      // 9067 (webpack runtime helpers), 6309 (lenis), 5837 (component-registry).
      // Dissolved (Vector 1 DCE + barrel-rewrite): 7525 (TooltipProvider chain, 26.0 KB
      // gz), 4335 (Radix select+scroll-area, 31.1 KB gz), 8843, 9046, 7369, 4458, 2307.
      //
      // Phase 67 ratifies new stable chunk IDs; further additions to this list
      // are REJECTED until a future phase explicitly authorizes another break
      // of the chunk-id lock (analogous to Phase 67's BND-05 unlock). Adding any
      // entry non-additively reshuffles webpack's splitChunks boundaries, which
      // dissolves the post-Phase-67 stable chunk IDs.
      "@/components/sf",
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
