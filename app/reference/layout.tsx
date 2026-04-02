import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference — SIGNALFRAME//UX",
  description: "Full API documentation — props, hooks, tokens, and the programmable surface.",
};

export default function ReferenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
