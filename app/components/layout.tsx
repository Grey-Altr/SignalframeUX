import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components — SIGNALFRAME//UX",
  description: "Browse 340+ Signal and Frame components with live previews, filtering, and code examples.",
};

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
