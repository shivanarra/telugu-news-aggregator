import { NextRequest } from "next/server";
import { fetchAggregatedArticles } from "@/lib/aggregator";
import { Category } from "@/lib/types";

export const revalidate = 0; // always fresh via our own cache

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as Category | null;
  const sources = searchParams.get("sources");
  const sourceIds = sources ? sources.split(",").filter(Boolean) : undefined;

  const data = await fetchAggregatedArticles({
    category: (category as Category) || undefined,
    sourceIds,
  });

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
