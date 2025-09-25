import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "తెలుగు వార్తలు | Telugu News Aggregator",
  description:
    "A fast, beautiful Telugu news aggregator with categories, source filters, and bookmarks.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense>
          <TopBar />
        </Suspense>
        <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
