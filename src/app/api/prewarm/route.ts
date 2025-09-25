import { NextResponse } from "next/server";
import { fetchAggregatedArticles, invalidateCache } from "@/lib/aggregator";

export const dynamic = "force-dynamic";

export async function GET() {
  // Force refresh by invalidating cache, then warm it
  invalidateCache();
  const { articles, fetchedAt } = await fetchAggregatedArticles();
  return NextResponse.json({
    ok: true,
    fetchedAt,
    count: articles.length,
    sources: Array.from(new Set(articles.map((a) => a.sourceId))).length,
  });
}
