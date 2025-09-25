"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_CATEGORIES } from "@/lib/sources";

export function CategoryTabs() {
  const pathname = usePathname();
  const active = (c: string) =>
    pathname === "/" && c === "top"
      ? true
      : pathname === `/category/${c}`;

  return (
    <div className="w-full overflow-x-auto flex gap-2 py-2">
      {DEFAULT_CATEGORIES.map((c) => {
        const href = c === "top" ? "/" : `/category/${c}`;
        return (
          <Link
            key={c}
            href={href}
            className={`px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
              active(c)
                ? "bg-white text-black border-white"
                : "bg-transparent border-white/20 hover:bg-white/10"
            }`}
          >
            {label(c)}
          </Link>
        );
      })}
    </div>
  );
}

function label(key: string) {
  switch (key) {
    case "top":
      return "టాప్";
    case "politics":
      return "రాజకీయాలు";
    case "cinema":
      return "సినిమా";
    case "sports":
      return "క్రీడలు";
    case "business":
      return "వ్యాపారం";
    case "tech":
      return "టెక్";
    case "state":
      return "రాష్ట్రం";
    case "national":
      return "జాతీయ";
    case "international":
      return "అంతర్జాతీయ";
    default:
      return key;
  }
}
