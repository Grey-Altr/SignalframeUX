import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { APIExplorer } from "@/components/blocks/api-explorer";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "API Reference — SIGNALFRAME//UX",
  description: "Full API documentation — props, hooks, tokens, and the programmable surface.",
};

export default function APIPage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <APIExplorer />
      </main>
      <Footer />
    </>
  );
}

