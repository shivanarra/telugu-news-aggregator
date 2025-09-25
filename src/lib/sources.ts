import { Category, SourceConfig } from "./types";

export const SOURCES: SourceConfig[] = [
  {
    id: "google-news-te",
    name: "Google News (Telugu)",
    homepage: "https://news.google.com/?hl=te-IN&gl=IN&ceid=IN:te",
    logo: "/logos/google-news.png",
    feeds: [
      { url: "https://news.google.com/rss?hl=te-IN&gl=IN&ceid=IN:te", categories: ["top"] },
      { url: "https://news.google.com/rss/search?q=రాజకీయాలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["politics"] },
      { url: "https://news.google.com/rss/search?q=సినిమా&hl=te-IN&gl=IN&ceid=IN:te", categories: ["cinema"] },
      { url: "https://news.google.com/rss/search?q=క్రీడలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["sports"] },
      { url: "https://news.google.com/rss/search?q=వ్యాపారం&hl=te-IN&gl=IN&ceid=IN:te", categories: ["business"] },
      { url: "https://news.google.com/rss/search?q=టెక్నాలజీ&hl=te-IN&gl=IN&ceid=IN:te", categories: ["tech"] },
      { url: "https://news.google.com/rss/search?q=ఆంధ్రప్రదేశ్+OR+తెలంగాణ&hl=te-IN&gl=IN&ceid=IN:te", categories: ["state"] },
      { url: "https://news.google.com/rss/search?q=జాతీయ+వార్తలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["national"] },
      { url: "https://news.google.com/rss/search?q=అంతర్జాతీయ+వార్తలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["international"] },
    ],
  },
  {
    id: "sakshi-google",
    name: "Sakshi (Google News)",
    homepage: "https://www.sakshi.com",
    logo: "/logos/sakshi.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:sakshi.com&hl=te-IN&gl=IN&ceid=IN:te", categories: ["top"] },
      { url: "https://news.google.com/rss/search?q=site:sakshi.com+రాజకీయాలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["politics"] },
      { url: "https://news.google.com/rss/search?q=site:sakshi.com+సినిమా&hl=te-IN&gl=IN&ceid=IN:te", categories: ["cinema"] },
      { url: "https://news.google.com/rss/search?q=site:sakshi.com+క్రీడలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["sports"] },
      { url: "https://news.google.com/rss/search?q=site:sakshi.com+వ్యాపారం&hl=te-IN&gl=IN&ceid=IN:te", categories: ["business"] },
    ],
  },
  {
    id: "eenadu-google",
    name: "Eenadu (Google News)",
    homepage: "https://www.eenadu.net",
    logo: "/logos/eenadu.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:eenadu.net&hl=te-IN&gl=IN&ceid=IN:te", categories: ["top"] },
      { url: "https://news.google.com/rss/search?q=site:eenadu.net+రాజకీయాలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["politics"] },
      { url: "https://news.google.com/rss/search?q=site:eenadu.net+సినిమా&hl=te-IN&gl=IN&ceid=IN:te", categories: ["cinema"] },
    ],
  },
  {
    id: "andhrajyothy-google",
    name: "Andhra Jyothy (Google News)",
    homepage: "https://www.andhrajyothy.com",
    logo: "/logos/andhrajyothy.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:andhrajyothy.com&hl=te-IN&gl=IN&ceid=IN:te", categories: ["top"] },
      { url: "https://news.google.com/rss/search?q=site:andhrajyothy.com+రాజకీయాలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["politics"] },
      { url: "https://news.google.com/rss/search?q=site:andhrajyothy.com+సినిమా&hl=te-IN&gl=IN&ceid=IN:te", categories: ["cinema"] },
    ],
  },
  {
    id: "tv9telugu-google",
    name: "TV9 Telugu (Google News)",
    homepage: "https://www.tv9telugu.com",
    logo: "/logos/tv9.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:tv9telugu.com&hl=te-IN&gl=IN&ceid=IN:te", categories: ["top"] },
      { url: "https://news.google.com/rss/search?q=site:tv9telugu.com+రాజకీయాలు&hl=te-IN&gl=IN&ceid=IN:te", categories: ["politics"] },
    ],
  },
  {
    id: "ntvtelugu-google",
    name: "NTV Telugu (Google News)",
    homepage: "https://www.ntvtelugu.com",
    logo: "/logos/ntv.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:ntvtelugu.com&hl=te-IN&gl=IN&ceid=IN:te", categories: ["top"] },
    ],
  },
  {
    id: "123telugu-google",
    name: "123Telugu (Google News)",
    homepage: "https://www.123telugu.com",
    logo: "/logos/123telugu.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:123telugu.com&hl=te-IN&gl=IN&ceid=IN:te", categories: ["cinema"] },
    ],
  },
  {
    id: "gulte-google",
    name: "Gulte (Google News)",
    homepage: "https://www.gulte.com",
    logo: "/logos/gulte.png",
    feeds: [
      { url: "https://news.google.com/rss/search?q=site:gulte.com&hl=te-IN&gl=IN&ceid=IN:te", categories: ["cinema"] },
    ],
  },
  {
    id: "oneindia-telugu",
    name: "OneIndia Telugu",
    homepage: "https://telugu.oneindia.com",
    logo: "/logos/oneindia.png",
    feeds: [
      // Common OneIndia Telugu category feeds (subject to change by publisher)
      { url: "https://telugu.oneindia.com/rss/news-fb.xml", categories: ["top"] },
      { url: "https://telugu.oneindia.com/rss/politics-fb.xml", categories: ["politics"] },
      { url: "https://telugu.oneindia.com/rss/movies-fb.xml", categories: ["cinema"] },
      { url: "https://telugu.oneindia.com/rss/sports-fb.xml", categories: ["sports"] },
      { url: "https://telugu.oneindia.com/rss/business-fb.xml", categories: ["business"] },
      { url: "https://telugu.oneindia.com/rss/technology-fb.xml", categories: ["tech"] },
      { url: "https://telugu.oneindia.com/rss/andhra-pradesh-fb.xml", categories: ["state"] },
      { url: "https://telugu.oneindia.com/rss/telangana-fb.xml", categories: ["state"] },
    ],
  },
  {
    id: "sakshi",
    name: "Sakshi",
    homepage: "https://www.sakshi.com",
    logo: "/logos/sakshi.png",
    feeds: [
      // RSS URLs vary; we will augment later. Using homepage as placeholder category pages via server-side parsing when allowed.
    ],
  },
  {
    id: "eenadu",
    name: "Eenadu",
    homepage: "https://www.eenadu.net",
    logo: "/logos/eenadu.png",
    feeds: [],
  },
  {
    id: "andhra-jyothy",
    name: "Andhra Jyothy",
    homepage: "https://www.andhrajyothy.com",
    logo: "/logos/andhrajyothy.png",
    feeds: [],
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
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
