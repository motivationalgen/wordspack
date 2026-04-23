import { useSessionHistory } from "@/hooks/useSessionHistory";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";

const formatTime = (ts: number) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
};

export const RecentActivity = ({ slug, limit = 8 }: { slug?: string; limit?: number }) => {
  const { entries, clear } = useSessionHistory(slug);
  const list = entries.slice(0, limit);

  return (
    <section className="mt-8 rounded-[14px] border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" /> Recent activity
        </h2>
        {list.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Your recent activity will appear here. Stored in your browser session for 2 hours.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {list.map((e, i) => (
            <li key={`${e.timestamp}-${i}`} className="py-2.5 flex items-start gap-3 text-sm">
              <span className="mt-0.5 inline-flex h-6 px-2 items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary whitespace-nowrap">
                {e.tool}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-foreground">
                  <span className="text-muted-foreground">In:</span> {e.input || "—"}
                </p>
                <p className="truncate text-muted-foreground">
                  <span>Out:</span> {e.output}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(e.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
