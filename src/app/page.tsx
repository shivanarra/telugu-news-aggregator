import { fetchAggregatedArticles, invalidateCache } from "@/lib/aggregator";
import { Category } from "@/lib/types";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ArticleList } from "@/components/ArticleList";
import { SourceFilter } from "@/components/SourceFilter";
import { SOURCES } from "@/lib/sources";
import { LiveUpdater } from "@/components/LiveUpdater";
import { formatDateTimeISOToReadable } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function Home(props: Promise<{ searchParams?: { [key: string]: string | string[] | undefined } }>) {
  const { searchParams } = await props;
  if (searchParams && searchParams["force"]) {
    invalidateCache();
  }
  const selected = typeof searchParams?.["sources"] === "string"
    ? (searchParams!["sources"] as string).split(",").filter(Boolean)
    : undefined;
  const { articles, fetchedAt } = await fetchAggregatedArticles({
    category: "top" as Category,
    sourceIds: selected,
  });
  return (
    <div className="space-y-4">
      <CategoryTabs />
      <SourceFilter
        sources={SOURCES.map((s) => ({ id: s.id, name: s.name }))}
        initialSelected={selected}
      />
      <LiveUpdater category="top" sources={selected} fetchedAtISO={fetchedAt} />
      <div className="text-xs text-white/60">అప్‌డేట్: {formatDateTimeISOToReadable(fetchedAt)}</div>
      <ArticleList articles={articles} />
    </div>
  );
}
