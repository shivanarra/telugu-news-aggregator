"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Newspaper, Bookmark, Settings, RefreshCcw } from "lucide-react";

export function TopBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refresh = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("force", "1");
    if (typeof window !== "undefined") {
      window.location.assign(`${pathname}?${params.toString()}`);
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Newspaper className="w-6 h-6" />
          <span className="text-lg font-semibold">తెలుగు వార్తలు</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <button onClick={refresh} className="inline-flex items-center gap-1 hover:opacity-80">
            <RefreshCcw className="w-4 h-4" />
            <span>రిఫ్రెష్</span>
          </button>
          <Link href="/bookmarks" className="inline-flex items-center gap-1 hover:opacity-80">
            <Bookmark className="w-4 h-4" />
            <span>బుక్మార్క్స్</span>
          </Link>
          <Link href="/settings" className="inline-flex items-center gap-1 hover:opacity-80">
            <Settings className="w-4 h-4" />
            <span>సెట్టింగ్స్</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
