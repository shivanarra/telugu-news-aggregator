import Parser from "rss-parser";
import { formatISO } from "date-fns";
import { stableHash } from "./hash";
import { ArticleItem, Category } from "./types";
import { SOURCES } from "./sources";

type Enclosure = { url?: string } | undefined;
type AnyItem = Parser.Item & {
  enclosure?: Enclosure;
  [key: string]: unknown;
};

const parser: Parser<unknown, AnyItem> = new Parser<unknown, AnyItem>({
  timeout: 10000,
  headers: {
    "User-Agent": "TeluguNewsAggregator/1.0 (+https://example.com)",
  },
  customFields: {
    item: ["media:content", "media:thumbnail", "content:encoded"],
  },
});

// Basic in-memory cache for demo purposes
let cache: { articles: ArticleItem[]; fetchedAt: string } | null = null;
let lastFetch = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
// Per-feed timeout to keep SSR fast
const FEED_TIMEOUT_MS = 3000; // 3 seconds per feed

type FeedOutput = { items?: AnyItem[] };

async function parseWithTimeout(url: string, timeoutMs: number): Promise<FeedOutput> {
  return (await Promise.race([
    parser.parseURL(url),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), timeoutMs)),
  ])) as unknown as FeedOutput;
}

function normalizeFeedUrl(u: string): string {
  try {
    const url = new URL(u);
    // Rebuild query string to ensure proper encoding
    const rebuilt = new URL(url.origin + url.pathname);
    const entries = Array.from(url.searchParams.entries());
    for (const [k, v] of entries) rebuilt.searchParams.set(k, v);
    return rebuilt.toString();
  } catch {
    return u;
  }
}

export async function fetchAggregatedArticles(opts?: {
  category?: Category;
  sourceIds?: string[];
}): Promise<{ articles: ArticleItem[]; fetchedAt: string }> {
  const now = Date.now();
  if (cache && now - lastFetch < CACHE_TTL_MS) {
    return filterArticles(cache, opts);
  }

  const items: ArticleItem[] = [];

  // Build tasks for all feeds and fetch them in parallel with per-feed timeout
  const tasks = SOURCES.flatMap((source) =>
    source.feeds.map(async (feed) => {
      try {
        const url = normalizeFeedUrl(feed.url);
        const res = await parseWithTimeout(url, FEED_TIMEOUT_MS);
        for (const entry of (res.items as AnyItem[]) ?? []) {
          const title = (entry.title || "").trim();
          const link = (entry.link || "").trim();
          if (!title || !link) continue;
          const id = stableHash(`${source.id}:${title}`);
          const pub = entry.isoDate || entry.pubDate || undefined;
          const summary = (entry.contentSnippet || entry.content || entry.summary || "").toString();
          const image = extractImage(entry);

          items.push({
            id,
            sourceId: source.id,
            sourceName: source.name,
            title,
            summary,
            url: link,
            image,
            publishedAt: pub ? new Date(pub).toISOString() : undefined,
            categories: feed.categories,
          });
        }
      } catch (e) {
        console.warn("[Aggregator] Feed error", { source: source.id, url: feed.url, error: (e as Error)?.message });
      }
    })
  );

  await Promise.allSettled(tasks);

  // De-duplicate by normalized title hash per source + title
  const seen = new Set<string>();
  const deduped = items.filter((a) => {
    const key = `${a.sourceId}:${a.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by published date desc
  deduped.sort((a, b) => {
    const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bt - at;
  });

  // Fallback: if nothing fetched (network or feed changes), show a few sample items
  const nowISO = formatISO(new Date());
  const withFallback = deduped.length > 0 ? deduped : sampleArticles(nowISO);

  cache = { articles: withFallback, fetchedAt: nowISO };
  lastFetch = now;

  return filterArticles(cache, opts);
}

function filterArticles(
  data: { articles: ArticleItem[]; fetchedAt: string },
  opts?: { category?: Category; sourceIds?: string[] }
): { articles: ArticleItem[]; fetchedAt: string } {
  const { category, sourceIds } = opts || {};
  let filtered = data.articles;
  if (category) {
    filtered = filtered.filter((a) => a.categories.includes(category));
  }
  if (sourceIds && sourceIds.length) {
    const set = new Set(sourceIds);
    filtered = filtered.filter((a) => set.has(a.sourceId));
  }
  return { articles: filtered, fetchedAt: data.fetchedAt };
}

export function invalidateCache() {
  cache = null;
  lastFetch = 0;
}

function sampleArticles(nowISO: string): ArticleItem[] {
  const base: Array<Omit<ArticleItem, "id" | "publishedAt"> & { publishedAt?: string }> = [
    {
      sourceId: "oneindia-telugu",
      sourceName: "OneIndia Telugu",
      title: "నేటి ముఖ్యాంశాలు: రాజకీయాలపై కీలక పరిణామాలు",
      summary: "తెలుగు రాష్ట్రాల్లో రాజకీయ పరిణామాలపై తాజా అప్‌డేట్లు.",
      url: "https://telugu.oneindia.com/",
      image: undefined,
      categories: ["top", "politics"],
      publishedAt: nowISO,
    },
    {
      sourceId: "oneindia-telugu",
      sourceName: "OneIndia Telugu",
      title: "సినిమా వార్తలు: కొత్త విడుదలలు, సమీక్షలు",
      summary: "టాలీవుడ్‌లో విడుదలైన తాజా సినిమాల వివరాలు.",
      url: "https://telugu.oneindia.com/movies/",
      image: undefined,
      categories: ["cinema"],
      publishedAt: nowISO,
    },
    {
      sourceId: "oneindia-telugu",
      sourceName: "OneIndia Telugu",
      title: "క్రీడలు: భారత జట్టు సంచలన విజయం",
      summary: "క్రికెట్‌లో భారత జట్టు విజయంతో పాటు మరిన్ని క్రీడా వార్తలు.",
      url: "https://telugu.oneindia.com/sports/",
      image: undefined,
      categories: ["sports"],
      publishedAt: nowISO,
    },
  ];
  const mapped: ArticleItem[] = base.map((b) => ({
    id: stableHash(`${b.sourceId}:${b.title}`),
    sourceId: b.sourceId,
    sourceName: b.sourceName,
    title: b.title,
    summary: b.summary,
    url: b.url,
    image: b.image,
    categories: b.categories,
    publishedAt: b.publishedAt || nowISO,
  }));
  return mapped;
}

function extractImage(entry: AnyItem): string | undefined {
  // 1) enclosure
  const enclosureUrl =
    typeof entry.enclosure === "object" && entry.enclosure && "url" in entry.enclosure
      ? (entry.enclosure.url as string | undefined)
      : undefined;
  if (enclosureUrl) return enclosureUrl;
  // 2) media:content or media:thumbnail
  const mediaContent = entry["media:content"]; // may be object or array
  if (mediaContent) {
    if (Array.isArray(mediaContent)) {
      for (const m of mediaContent) {
        if (m && typeof m === "object" && "url" in m && (m as { url?: unknown }).url) {
          return (m as { url?: string }).url;
        }
      }
    } else if (typeof mediaContent === "object" && mediaContent && "url" in mediaContent) {
      const u = (mediaContent as { url?: unknown }).url;
      if (typeof u === "string") return u;
    }
  }
  const mediaThumb = entry["media:thumbnail"];
  if (mediaThumb) {
    if (Array.isArray(mediaThumb)) {
      for (const m of mediaThumb) {
        if (m && typeof m === "object" && "url" in m && (m as { url?: unknown }).url) {
          return (m as { url?: string }).url;
        }
      }
    } else if (typeof mediaThumb === "object" && mediaThumb && "url" in mediaThumb) {
      const u = (mediaThumb as { url?: unknown }).url;
      if (typeof u === "string") return u;
    }
  }
  // 3) Try parsing the first img src from content:encoded
  const html = entry["content:encoded"] as string | undefined;
  if (html) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m && m[1]) return m[1];
  }
  return undefined;
}
