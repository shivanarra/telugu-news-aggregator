import Parser from "rss-parser";
import { formatISO } from "date-fns";
import { stableHash } from "./hash";
import { ArticleItem, Category } from "./types";
import { SOURCES } from "./sources";
import * as cheerio from "cheerio";

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
const CACHE_TTL_MS = 30 * 1000; // 30 seconds
// Per-feed timeout to keep SSR fast but reduce timeouts in production
const FEED_TIMEOUT_MS = 8000; // 8 seconds per feed

type FeedOutput = { items?: AnyItem[] };

async function parseWithTimeout(url: string, timeoutMs: number): Promise<FeedOutput> {
  return (await Promise.race([
    parser.parseURL(url),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), timeoutMs)),
  ])) as unknown as FeedOutput;
}

// HTML adapter for sources without RSS: fetch homepage/listing and extract latest links.
async function fetchFromHtmlSource(sourceId: string, sourceName: string, homepage: string): Promise<ArticleItem[]> {
  const res = await fetch(homepage, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TeluguNewsBot/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Attempt to get a page-level published time (fallback)
  const pageMetaTime = (
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="pubdate"]').attr('content') ||
    $('meta[name="date"]').attr('content') ||
    $('time[datetime]').first().attr('datetime') ||
    ''
  ).trim();

  const candidates: Array<{ title: string; url: string; image?: string; publishedAt?: string }> = [];
  $("article a, .article a, .post a, .story a, .list a, .news-list a, .news a, .headline a").each((_, el) => {
    const a = $(el);
    const href = a.attr("href") || "";
    const text = a.text().trim();
    if (!href || !text) return;
    if (text.length < 12) return;
    const url = new URL(href, homepage).toString();
    const img = a.closest("article").find("img").attr("src") || a.find("img").attr("src");
    const image = img ? new URL(img, homepage).toString() : undefined;
    // Try to find a nearby time element
    let publishedAt = a.closest('article').find('time[datetime]').attr('datetime')
      || a.closest('.post,.story,.list,.news,.headline').find('time[datetime]').attr('datetime')
      || undefined;
    if (!publishedAt && pageMetaTime) publishedAt = pageMetaTime;
    candidates.push({ title: text, url, image, publishedAt });
  });

  const seen = new Set<string>();
  const picked = candidates.filter((c) => {
    const k = c.title.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 30);

  const nowISO = formatISO(new Date());
  const items: ArticleItem[] = picked.map((c) => ({
    id: stableHash(`${sourceId}:${c.title}`),
    sourceId,
    sourceName,
    title: c.title,
    summary: undefined,
    url: c.url,
    image: c.image,
    categories: ["top"],
    publishedAt: c.publishedAt && !Number.isNaN(Date.parse(c.publishedAt))
      ? new Date(c.publishedAt).toISOString()
      : nowISO,
  }));
  return items;
}

async function fetchFeedWithRetry(url: string, timeoutMs: number): Promise<FeedOutput> {
  try {
    return await parseWithTimeout(url, timeoutMs);
  } catch (e) {
    const msg = (e as Error)?.message || "";
    // retry once on timeout or transient errors
    if (msg.includes("timeout") || msg.includes("ETIMEDOUT") || msg.includes("ENOTFOUND")) {
      try {
        return await parseWithTimeout(url, Math.min(timeoutMs * 2, 15000));
      } catch (e2) {
        throw e2;
      }
    }
    throw e;
  }
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
  // Build tasks for all sources. If RSS feeds exist, use them; otherwise use custom HTML fetchers.
  const tasks: Array<Promise<void>> = [];
  for (const source of SOURCES) {
    if (source.feeds && source.feeds.length) {
      for (const feed of source.feeds) {
        tasks.push((async () => {
          try {
            const url = normalizeFeedUrl(feed.url);
            const res = await fetchFeedWithRetry(url, FEED_TIMEOUT_MS);
            for (const entry of (res.items as AnyItem[]) ?? []) {
              const title = (entry.title || "").trim();
              const link = (entry.link || "").trim();
              if (!title || !link) continue;
              const id = stableHash(`${source.id}:${title}`);
              const pub = (entry.isoDate || entry.pubDate) as string | undefined;
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
        })());
      }
    } else {
      // Custom HTML fetcher path
      tasks.push((async () => {
        try {
          const htmlItems = await fetchFromHtmlSource(source.id, source.name, source.homepage);
          for (const it of htmlItems) items.push(it);
        } catch (e) {
          console.warn("[Aggregator] HTML fetch error", { source: source.id, error: (e as Error)?.message });
        }
      })());
    }
  }

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
