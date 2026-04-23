import { Link } from "react-router-dom";
import { TOOLS } from "@/lib/tools";

export const InternalLinks = ({ excludeSlug }: { excludeSlug?: string }) => {
  const items = TOOLS.filter((t) => t.slug !== excludeSlug);
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Try other Wordspack tools</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((t) => (
          <Link key={t.slug} to={t.path} className="tool-card !p-4">
            <div className="text-xl">{t.emoji}</div>
            <div className="font-semibold text-sm">{t.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{t.short}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};
