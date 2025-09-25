"use client";

import Image from "next/image";
import { ArticleItem } from "@/lib/types";
import { Volume2, Square } from "lucide-react";
import { useRef, useState } from "react";
import { formatDateTimeISOToReadable } from "@/lib/date";

export function ArticleCard({ a }: { a: ArticleItem }) {
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    stop();
    const text = `${a.title}. ${a.summary ?? ""}`.trim();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "te-IN"; // Telugu
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => setSpeaking(false);
    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const stop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <article className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition p-4 flex gap-4 items-start">
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold leading-snug">
          <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {a.title}
          </a>
        </h3>
        <div className="mt-1 text-sm text-white/70 flex items-center gap-2">
          <span>{a.sourceName}</span>
          {a.publishedAt ? (
            <time dateTime={a.publishedAt} className="text-white/50">
              {formatDateTimeISOToReadable(a.publishedAt)}
            </time>
          ) : null}
          <span className="mx-2 opacity-40">•</span>
          {!speaking ? (
            <button onClick={speak} className="inline-flex items-center gap-1 text-xs hover:opacity-80">
              <Volume2 className="w-3.5 h-3.5" />
              వినిపించు
            </button>
          ) : (
            <button onClick={stop} className="inline-flex items-center gap-1 text-xs hover:opacity-80">
              <Square className="w-3.5 h-3.5" />
              ఆపు
            </button>
          )}
        </div>
        {a.summary ? (
          <p className="mt-2 text-sm text-white/80 line-clamp-3">{a.summary}</p>
        ) : null}
        <div className="mt-2 flex gap-2 flex-wrap">
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
      <div className="w-28 h-20 relative rounded-lg overflow-hidden bg-white/10 shrink-0">
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
