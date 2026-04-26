import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, Search, Volume2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";

interface WordResult {
  word: string;
  score: number;
}

export default function SynonymFinder() {
  const tool = getToolBySlug("synonym-antonym-finder")!;
  const [input, setInput] = useState("");
  const [synonyms, setSynonyms] = useState<WordResult[]>([]);
  const [antonyms, setAntonyms] = useState<WordResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { add } = useSessionHistory();

  const handleSearch = async (termOverride?: string) => {
    const raw = (termOverride ?? input).trim();
    if (!raw) return;
    setIsLoading(true);
    try {
      // Improved fetching: try exact related synonyms, "means like" matches, and antonyms
      const term = encodeURIComponent(raw);
      const max = 50;

      const [relSynRes, mlRes, antRes] = await Promise.all([
        fetch(`https://api.datamuse.com/words?rel_syn=${term}&max=${max}`),
        fetch(`https://api.datamuse.com/words?ml=${term}&max=${max}`),
        fetch(`https://api.datamuse.com/words?rel_ant=${term}&max=${max}`),
      ]);

      const safeJson = async (res: Response) => {
        if (!res || !res.ok) return [] as any[];
        const j = await res.json().catch(() => []);
        return Array.isArray(j) ? j : [];
      };

      const relSynData: WordResult[] = await safeJson(relSynRes);
      const mlData: WordResult[] = await safeJson(mlRes);
      const antData: WordResult[] = await safeJson(antRes);

      // Combine and deduplicate synonyms (prefer rel_syn then ml), keep highest score
      const map = new Map<string, WordResult>();
      [...relSynData, ...mlData].forEach((w) => {
        if (!w || typeof w.word !== "string") return;
        const existing = map.get(w.word);
        if (!existing || (w.score ?? 0) > (existing.score ?? 0)) {
          map.set(w.word, w);
        }
      });

      const combinedSyns = Array.from(map.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));


      const syns = combinedSyns.slice(0, max);

      // Expand antonyms by also fetching synonyms of the antonyms (this surfaces related opposite words)
      const initialAnts = (Array.isArray(antData) ? antData : []).slice(0, max);
      const ANT_EXPAND_LIMIT = Math.min(8, initialAnts.length);
      let expandedAnts: WordResult[] = [];

      if (ANT_EXPAND_LIMIT > 0) {
        try {
          const expandPromises = initialAnts.slice(0, ANT_EXPAND_LIMIT).map((a) =>
            fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(a.word)}&max=20`).then((r) => safeJson(r))
          );
          const expandResults = await Promise.all(expandPromises);
          expandedAnts = expandResults.flat();
        } catch {
          expandedAnts = [];
        }
      }

      // Combine initial antonyms + expanded antonyms, dedupe and sort by score
      const antMap = new Map<string, WordResult>();
      [...initialAnts, ...expandedAnts].forEach((w) => {
        if (!w || typeof w.word !== "string") return;
        const existing = antMap.get(w.word);
        if (!existing || (w.score ?? 0) > (existing.score ?? 0)) {
          antMap.set(w.word, w);
        }
      });

      const ants = Array.from(antMap.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, max);

      setSynonyms(syns);
      setAntonyms(ants);

      // Record to session history (store concise output)
      const out = [...syns.slice(0, 8).map((s) => s.word), ...ants.slice(0, 8).map((a) => a.word)].slice(0, 12).join(", ");
      add({ tool: tool.name, toolSlug: tool.slug, input: raw, output: out || "—" });

      if (syns.length === 0 && ants.length === 0) {
        toast.info("No results found for that word.");
      }
    } catch (error) {
      toast.error("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setSynonyms([]);
    setAntonyms([]);
  };

  const handleCopy = async (words: WordResult[]) => {
    if (!words || words.length === 0) return;
    try {
      await navigator.clipboard.writeText(words.map((w) => w.word).join(", "));
      toast.success("Copied to clipboard!");
    } catch (e) {
      toast.error("Unable to copy to clipboard.");
    }
  };

  return (
    <ToolShell
      fullWidth
      tool={tool}
      title="Synonym & Antonym Finder"
      description="Find the perfect word with our instant thesaurus and antonym search."
      metaTitle="Free Online Synonym & Antonym Finder - Find Perfect Words"
      metaDescription="Search for synonyms and antonyms instantly. Improve your vocabulary and find the perfect word for any context with our free online thesaurus tool."
      hasOutput={synonyms.length > 0 || antonyms.length > 0 || isLoading}
      outputSection={
        <div className="space-y-8">
          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-full" />
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-5/6" />
            </div>
          ) : (
            <>
              {synonyms.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                      <Search className="h-5 w-5" />
                      Synonyms
                    </h3>
                    <div className="flex gap-2">
                      <TTSButton text={`Synonyms for ${input}: ${synonyms.map(w => w.word).join(", ")}`} />
                      <Button variant="outline" size="sm" onClick={() => handleCopy(synonyms)} className="h-8 px-2 gap-1.5">
                        <Copy className="h-4 w-4" />
                        <span className="text-xs font-medium">Copy All</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {synonyms.map((item) => (
                      <button
                        key={item.word}
                        onClick={() => { setInput(item.word); handleSearch(item.word); }}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium text-sm border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {item.word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {antonyms.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-destructive">
                      <BookOpen className="h-5 w-5" />
                      Antonyms
                    </h3>
                    <div className="flex gap-2">
                      <TTSButton text={`Antonyms for ${input}: ${antonyms.map(w => w.word).join(", ")}`} />
                      <Button variant="outline" size="sm" onClick={() => handleCopy(antonyms)} className="h-8 px-2 gap-1.5">
                        <Copy className="h-4 w-4" />
                        <span className="text-xs font-medium">Copy All</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {antonyms.map((item) => (
                      <button
                        key={item.word}
                        onClick={() => { setInput(item.word); handleSearch(item.word); }}
                        className="px-3 py-1.5 bg-destructive/5 text-destructive rounded-lg font-medium text-sm border border-destructive/10 hover:bg-destructive/10 transition-colors"
                      >
                        {item.word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word-input">Enter a word</Label>
            <div className="flex gap-2">
              <Input
                id="word-input"
                placeholder="e.g. happy, fast, professional..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-lg py-6"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="lg" disabled={isLoading || !input.trim()} className="px-6">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={handleClear} disabled={isLoading || (!input && synonyms.length === 0)} className="gap-2">
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      }
      seoContent={
        <>
          <h2><strong>What is a Synonym & Antonym Finder?</strong></h2>
          <p>
            A synonym and antonym finder is an essential tool for any writer looking to expand their
            vocabulary and find more precise words for their context. A synonym is a word with the same
            or similar meaning, while an antonym is a word with the opposite meaning. Our tool surfaces
            nuanced alternatives, near-synonyms, and related antonyms to help you choose the clearest
            wording for any sentence or headline.
          </p>

          <h2><strong>How to use our Thesaurus Tool</strong></h2>
          <ol>
            <li>Type a single word into the search box.</li>
            <li>Press Enter or click the search icon.</li>
            <li>Browse the lists of synonyms and antonyms.</li>
            <li>Click on any result to immediately search for that word's synonyms or antonyms.</li>
          </ol>

          <h2><strong>Benefits of using a Thesaurus</strong></h2>
          <ul>
            <li><strong>Improve Writing Quality:</strong> Avoid using the same words repeatedly.</li>
            <li><strong>Be More Precise:</strong> Find the word that captures the exact nuance you need.</li>
            <li><strong>Learn New Words:</strong> Expand your vocabulary naturally as you write.</li>
            <li><strong>Better SEO:</strong> Use varied keywords to help your content reach more people.</li>
          </ul>

          <h2><strong>Why our Antonym Coverage is Stronger</strong></h2>
          <p>
            Antonyms can be sparse in many datasets. To improve coverage, this tool queries multiple
            relationships: direct antonyms from Datamuse and related opposites discovered by expanding
            antonyms through their synonyms. This approach surfaces broader antonym sets and contextual
            opposites that are useful for editing, rewriting, and headline optimization.
          </p>

          <h2><strong>SEO & Use Cases</strong></h2>
          <p>
            Use this tool to optimize titles, meta descriptions, and on-page copy by testing alternate
            word choices. Try searching intent-driven keywords like "fast, quick, rapid" to discover
            synonyms and antonyms that match user intent. Our tool is ideal for content writers,
            marketers, and SEO specialists who want to find high-impact variants and long-tail keywords.
          </p>

          <FAQ
            items={[
              {
                question: "How many words can I find?",
                answer: "We provide up to 50 of the most relevant synonyms and antonyms for any given word."
              },
              {
                question: "Can I search for phrases?",
                answer: "The tool works best with single words, but it can handle some common two-word phrases."
              },
              {
                question: "Where do the results come from?",
                answer: "We use the Datamuse API, complemented by local expansion logic to surface additional antonyms and related words."
              }
            ]}
          />
        </>
      }
    />
  );
}
