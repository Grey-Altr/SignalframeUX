import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "lib/entry-core.ts",
    animation: "lib/entry-animation.ts",
    webgl: "lib/entry-webgl.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "next",
    "next/navigation",
    "gsap",
    "@gsap/react",
    "three",
    "@types/three",
    "tailwindcss",
    // Radix UI primitives — consumers install these via their own shadcn setup
    "radix-ui",
    "@radix-ui/react-accordion",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-label",
    "@radix-ui/react-navigation-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slider",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-toggle",
    "@radix-ui/react-toggle-group",
    "@radix-ui/react-tooltip",
    // Other runtime deps that consumers provide
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "cmdk",
    "sonner",
    "vaul",
    "lucide-react",
    "input-otp",
    "lenis",
    "date-fns",
    "react-day-picker",
    "server-only",
  ],
  tsconfig: "tsconfig.build.json",
  outDir: "dist",
  // Use the automatic JSX runtime so compiled output imports from
  // 'react/jsx-runtime' instead of referencing the classic React global.
  // This prevents "React is not defined" errors in consumers using
  // Next.js / the automatic JSX transform (React 17+).
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
