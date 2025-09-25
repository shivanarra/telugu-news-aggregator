import { ArticleItem } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export function ArticleList({ articles }: { articles: ArticleItem[] }) {
  if (!articles?.length) {
    return (
      <div className="text-center text-white/70 py-10">ఇప్పటికైతే వ్యాసాలు లేవు</div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((a) => (
        <ArticleCard key={a.id} a={a} />
      ))}
    </div>
  );
}
