"use client";

import Image from "next/image";
import { ArticleItem } from "@/lib/types";
import { formatDateTimeISOToReadable } from "@/lib/date";

export function ArticleCard({ a }: { a: ArticleItem }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.06] transition p-5 flex gap-5 items-start">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold leading-snug">
          <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {a.title}
          </a>
        </h3>
        <div className="mt-2 text-sm text-white/70 flex items-center gap-2">
          <span>{a.sourceName}</span>
          {a.publishedAt ? (
            <time dateTime={a.publishedAt} className="text-white/50">
              {formatDateTimeISOToReadable(a.publishedAt)}
            </time>
          ) : null}
        </div>
      </div>
      <div className="w-32 h-24 relative rounded-lg overflow-hidden bg-white/10 shrink-0">
        <Image
          src={a.image || "/logos/placeholder.svg"}
          alt={a.title}
          fill
          className="object-cover"
        />
      </div>
    </article>
  );
}
