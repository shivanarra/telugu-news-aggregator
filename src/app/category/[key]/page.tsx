import { ArticleList } from "@/components/ArticleList";
import { CategoryTabs } from "@/components/CategoryTabs";
import { fetchAggregatedArticles, invalidateCache } from "@/lib/aggregator";
import { Category } from "@/lib/types";
import { notFound } from "next/navigation";
import { SourceFilter } from "@/components/SourceFilter";
import { SOURCES } from "@/lib/sources";
import { LiveUpdater } from "@/components/LiveUpdater";
import { formatDateTimeISOToReadable } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function CategoryPage(props: Promise<{
  params: { key: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}>) {
  const { params, searchParams } = await props;
  const { key } = params;
  const allowed: Category[] = [
    "top",
    "politics",
    "cinema",
    "sports",
    "business",
    "tech",
    "state",
    "national",
    "international",
  ];
  if (!allowed.includes(key as Category)) {
    notFound();
  }
  if (searchParams && searchParams["force"]) {
    invalidateCache();
  }
  const selected = typeof searchParams?.["sources"] === "string"
    ? (searchParams!["sources"] as string).split(",").filter(Boolean)
    : undefined;
  const { articles, fetchedAt } = await fetchAggregatedArticles({
    category: key as Category,
    sourceIds: selected,
  });
  return (
    <div className="space-y-4">
      <CategoryTabs />
      <SourceFilter
        sources={SOURCES.map((s) => ({ id: s.id, name: s.name }))}
        initialSelected={selected}
      />
      <LiveUpdater category={key} sources={selected} fetchedAtISO={fetchedAt} />
      <div className="text-xs text-white/60">అప్‌డేట్: {formatDateTimeISOToReadable(fetchedAt)}</div>
      <ArticleList articles={articles} />
    </div>
  );
}
