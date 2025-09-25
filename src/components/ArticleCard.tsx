"use client";

import Image from "next/image";
import { ArticleItem } from "@/lib/types";
import { useRef } from "react";
import { formatDateTimeISOToReadable } from "@/lib/date";

export function ArticleCard({ a }: { a: ArticleItem }) {
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

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
        {a.summary ? (
          <p className="mt-3 text-sm text-white/80 line-clamp-3">{a.summary}</p>
        ) : null}
        <div className="mt-3 flex gap-2 flex-wrap">
          {a.categories.map((c) => (
            <span
              key={c}
              className="text-xs rounded-full px-2 py-0.5 bg-white/10 border border-white/10"
            >
              {c}
            </span>
          ))}
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
