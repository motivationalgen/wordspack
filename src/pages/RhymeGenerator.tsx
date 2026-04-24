import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, Music, Volume2, Search } from "lucide-react";
import { toast } from "sonner";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";

interface RhymeResult {
  word: string;
  score: number;
  numSyllables: number;
}

export default function RhymeGenerator() {
  const tool = getToolBySlug("rhyme-generator")!;
  const [input, setInput] = useState("");
  const [perfectRhymes, setPerfectRhymes] = useState<RhymeResult[]>([]);
  const [nearRhymes, setNearRhymes] = useState<RhymeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const [perfectRes, nearRes] = await Promise.all([
        fetch(`https://api.datamuse.com/words?rel_rhy=${input.trim()}&max=30`),
        fetch(`https://api.datamuse.com/words?rel_nry=${input.trim()}&max=30`)
      ]);
      
      const perfectData = await perfectRes.json();
      const nearData = await nearRes.json();
      
      setPerfectRhymes(perfectData);
      setNearRhymes(nearData);
      
      if (perfectData.length === 0 && nearData.length === 0) {
        toast.info("No rhymes found for that word.");
      }
    } catch (error) {
      toast.error("Failed to fetch rhymes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setPerfectRhymes([]);
    setNearRhymes([]);
  };

  const handleCopy = (words: RhymeResult[]) => {
    if (words.length === 0) return;
    navigator.clipboard.writeText(words.map(w => w.word).join(", "));
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolShell
      tool={tool}
      title="Rhyme Generator"
      description="Find perfect and near rhymes for poems, songs, and creative writing."
      metaTitle="Free Rhyme Generator Online - Find Perfect & Near Rhymes"
      metaDescription="Find the perfect rhyme for any word instantly. Get perfect rhymes and near rhymes for your poetry, songwriting, or creative projects. Free and fast."
      hasOutput={perfectRhymes.length > 0 || nearRhymes.length > 0 || isLoading}
      outputSection={
        <div className="space-y-8">
          {isLoading ? (
            <div className="space-y-4 py-4">
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-full" />
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-5/6" />
            </div>
          ) : (
            <>
              {perfectRhymes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                      <Music className="h-5 w-5" />
                      Perfect Rhymes
                    </h3>
                    <div className="flex gap-2">
                      <TTSButton text={`Perfect rhymes for ${input}: ${perfectRhymes.map(w => w.word).join(", ")}`} />
                      <Button variant="outline" size="sm" onClick={() => handleCopy(perfectRhymes)} className="h-8 px-2 gap-1.5">
                        <Copy className="h-4 w-4" />
                        <span className="text-xs font-medium">Copy All</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {perfectRhymes.map((item) => (
                      <div
                        key={item.word}
                        className="group relative px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm border border-border shadow-sm hover:border-primary/50 transition-colors"
                      >
                        {item.word}
                        <span className="ml-1.5 text-[10px] opacity-40 group-hover:opacity-100">{item.numSyllables} syl.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nearRhymes.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-muted-foreground">
                      <Search className="h-5 w-5" />
                      Near Rhymes (Slant Rhymes)
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(nearRhymes)} className="h-8 px-2 gap-1.5">
                      <Copy className="h-4 w-4" />
                      <span className="text-xs font-medium">Copy All</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nearRhymes.map((item) => (
                      <div
                        key={item.word}
                        className="group relative px-3 py-1.5 bg-secondary/50 text-secondary-foreground/80 rounded-lg font-medium text-sm border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        {item.word}
                        <span className="ml-1.5 text-[10px] opacity-30 group-hover:opacity-100">{item.numSyllables} syl.</span>
                      </div>
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
            <Label htmlFor="rhyme-input">Enter a word to rhyme with</Label>
            <div className="flex gap-2">
              <Input
                id="rhyme-input"
                placeholder="e.g. cloud, ocean, fire..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-lg py-6"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="lg" disabled={isLoading || !input.trim()} className="px-6">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" onClick={handleClear} disabled={isLoading || (!input && perfectRhymes.length === 0)} className="gap-2">
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      }
      seoContent={
        <>
          <h2>What is a Rhyme Generator?</h2>
          <p>
            A rhyme generator is a tool that finds words that have similar ending sounds to a target word. 
            It's widely used by poets, songwriters, rappers, and creative writers to find the perfect 
            ending for a line or to explore new creative directions.
          </p>
          
          <h2>Perfect Rhymes vs. Near Rhymes</h2>
          <ul>
            <li><strong>Perfect Rhymes:</strong> Words where the ending vowel and all following sounds are identical (e.g., "cat" and "hat").</li>
            <li><strong>Near Rhymes (Slant Rhymes):</strong> Words that have similar but not identical sounds, often sharing just a vowel or consonant sound (e.g., "cloud" and "proud" are perfect, but "cloud" and "town" are near).</li>
          </ul>

          <h2>Why use Wordspack Rhyme Generator?</h2>
          <ul>
            <li><strong>Instant Results:</strong> No waiting for a server, results appear in milliseconds.</li>
            <li><strong>Syllable Counts:</strong> We show the syllable count for each word to help you maintain your meter and rhythm.</li>
            <li><strong>TTS Integration:</strong> Listen to the rhymes to hear how they sound together.</li>
            <li><strong>Free & Unlimited:</strong> Search as many words as you want for free.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "Can I filter by syllable count?",
                answer: "We display the syllable count next to each word to help you manually filter for your needs."
              },
              {
                question: "Does it work for phrases?",
                answer: "The tool is optimized for single words, which provides the most accurate rhyming results."
              },
              {
                question: "Is there a limit to the results?",
                answer: "We show up to 30 of the most relevant perfect rhymes and 30 near rhymes for every search."
              }
            ]}
          />
        </>
      }
    />
  );
}
