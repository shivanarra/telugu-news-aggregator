"use client";

import { useEffect, useMemo, useState } from "react";

export function LiveUpdater({
  category,
  sources,
  fetchedAtISO,
  intervalMs = 30000,
}: {
  category?: string;
  sources?: string[];
  fetchedAtISO: string;
  intervalMs?: number;
}) {
  const [hasNew, setHasNew] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sources && sources.length) params.set("sources", sources.join(","));
    return params.toString();
  }, [category, sources]);

  useEffect(() => {
    const timer = setInterval(async () => {
      const res = await fetch(`/api/articles?${query}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { fetchedAt: string };
      if (new Date(data.fetchedAt).getTime() > new Date(fetchedAtISO).getTime()) {
        setHasNew(true);
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [query, fetchedAtISO, intervalMs]);

  const reload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("force", "1");
    window.location.assign(url.toString());
  };

  if (!hasNew) return null;

  return (
    <div className="sticky top-[56px] z-30">
      <div className="mx-auto max-w-5xl px-4">
        <button
          onClick={reload}
          className="w-full text-center text-sm rounded-lg border border-emerald-500/40 bg-emerald-600 text-white px-3 py-2 hover:opacity-95 shadow"
        >
          కొత్త వార్తలు వచ్చాయి — రిఫ్రెష్ చేయండి
        </button>
      </div>
    </div>
  );
}
