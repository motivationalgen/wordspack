import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, Search, Volume2, BookOpen } from "lucide-react";
import { toast } from "sonner";
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

  const handleSearch = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      // Improved fetching: try exact related synonyms, "means like" matches, and antonyms
      const term = encodeURIComponent(input.trim());
      const max = 50;

      const [relSynRes, mlRes, antRes] = await Promise.all([
        fetch(`https://api.datamuse.com/words?rel_syn=${term}&max=${max}`),
        fetch(`https://api.datamuse.com/words?ml=${term}&max=${max}`),
        fetch(`https://api.datamuse.com/words?rel_ant=${term}&max=${max}`),
      ]);

      const relSynData: WordResult[] = await relSynRes.json();
      const mlData: WordResult[] = await mlRes.json();
      const antData: WordResult[] = await antRes.json();

      // Combine and deduplicate synonyms (prefer rel_syn then ml), keep highest score
      const map = new Map<string, WordResult>();
      [...relSynData, ...mlData].forEach((w) => {
        const existing = map.get(w.word);
        if (!existing || (w.score ?? 0) > (existing.score ?? 0)) {
          map.set(w.word, w);
        }
      });

      const combinedSyns = Array.from(map.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      setSynonyms(combinedSyns.slice(0, max));
      setAntonyms(antData.slice(0, max));

      if (combinedSyns.length === 0 && antData.length === 0) {
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

  const handleCopy = (words: WordResult[]) => {
    if (words.length === 0) return;
    navigator.clipboard.writeText(words.map(w => w.word).join(", "));
    toast.success("Copied to clipboard!");
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
                        onClick={() => { setInput(item.word); handleSearch(); }}
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
                    <Button variant="outline" size="sm" onClick={() => handleCopy(antonyms)} className="h-8 px-2 gap-1.5">
                      <Copy className="h-4 w-4" />
                      <span className="text-xs font-medium">Copy All</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {antonyms.map((item) => (
                      <button
                        key={item.word}
                        onClick={() => { setInput(item.word); handleSearch(); }}
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
          <h2>What is a Synonym & Antonym Finder?</h2>
          <p>
            A synonym and antonym finder is an essential tool for any writer looking to expand their 
            vocabulary and find more precise words for their context. A synonym is a word with the same 
            or similar meaning, while an antonym is a word with the opposite meaning.
          </p>
          
          <h2>How to use our Thesaurus Tool</h2>
          <ol>
            <li>Type a single word into the search box.</li>
            <li>Press Enter or click the search icon.</li>
            <li>Browse the lists of synonyms and antonyms.</li>
            <li>Click on any result to immediately search for that word's synonyms.</li>
          </ol>

          <h2>Benefits of using a Thesaurus</h2>
          <ul>
            <li><strong>Improve Writing Quality:</strong> Avoid using the same words repeatedly.</li>
            <li><strong>Be More Precise:</strong> Find the word that captures the exact nuance you need.</li>
            <li><strong>Learn New Words:</strong> Expand your vocabulary naturally as you write.</li>
            <li><strong>Better SEO:</strong> Use varied keywords to help your content reach more people.</li>
          </ul>

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
                answer: "We use the Datamuse API, which provides high-quality results from a massive linguistic database."
              }
            ]}
          />
        </>
      }
    />
  );
}
