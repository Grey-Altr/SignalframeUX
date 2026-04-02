import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token Explorer — SIGNALFRAME//UX",
  description: "Visualize and customize OKLCH color scales, spacing, typography, and motion tokens.",
};

export default function TokensLayout({ children }: { children: React.ReactNode }) {
  return children;
}
