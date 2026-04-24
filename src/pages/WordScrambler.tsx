import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/CopyButton";
import { getToolBySlug } from "@/lib/tools";
import { unscramble } from "@/data/dictionary";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { Sparkles } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { trackEvent } from "@/lib/analytics";

const tool = getToolBySlug("word-scrambler")!;

const WordScrambler = () => {
  const [letters, setLetters] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [maxLen, setMaxLen] = useState(0);
  const [filter, setFilter] = useState<number>(0); // 0 = all
  const { add } = useSessionHistory();

  useEffect(() => {
    trackEvent(tool.name);
  }, []);

  const handleSolve = () => {
    const r = unscramble(letters);
    setResults(r);
    setMaxLen(letters.length);
    setFilter(0);
    add({ tool: tool.name, toolSlug: tool.slug, input: letters, output: `${r.length} words found` });
  };

  useEffect(() => {
    if (filter > maxLen) setFilter(0);
  }, [maxLen, filter]);

  const filtered = useMemo(() => {
    if (!results) return [];
    if (filter === 0) return results;
    return results.filter((w) => w.length === filter);
  }, [results, filter]);

  const lengthTicks = useMemo(() => Array.from({ length: maxLen }, (_, i) => i + 1), [maxLen]);

  return (
    <ToolShell
      tool={tool}
      title="Word Scrambler & Unscrambler"
      description="Enter a jumble of letters and get every valid English word you can build from them. Perfect for Scrabble, Wordle, and crossword puzzles."
      metaTitle="Word Scrambler & Unscrambler — Find Valid Words | Wordspack"
      metaDescription="Free word scrambler and unscrambler. Enter letters and instantly get all valid English words sorted by length. Great for Scrabble, Wordle, and word games."
      hasOutput={!!results}
      inputSection={
        <div className="grid gap-3">
          <Label htmlFor="letters">Letters (up to 9)</Label>
          <Input
            id="letters"
            placeholder="e.g. listen"
            value={letters}
            onChange={(e) => setLetters(e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 9))}
            className="text-lg uppercase tracking-widest"
            autoFocus
          />
          <Button onClick={handleSolve} disabled={!letters.trim()} size="lg" className="w-full sm:w-auto">
            <Sparkles className="h-4 w-4" />
            Unscramble
          </Button>
        </div>
      }
      outputSection={
        results === null ? (
          <p className="text-muted-foreground text-sm">Enter some letters above and tap unscramble to see all possible words.</p>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No valid words found. Try different letters.</p>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <Label>Filter by length</Label>
                <span className="text-sm font-semibold text-primary">
                  {filter === 0 ? `All (${results.length})` : `${filter} letters`}
                </span>
              </div>
              {maxLen >= 2 ? (
                <>
                  <Slider
                    min={0}
                    max={maxLen}
                    step={1}
                    value={[filter]}
                    onValueChange={(v) => setFilter(v[0])}
                  />
                  <div
                    className="grid mt-2 text-[11px] text-muted-foreground font-medium"
                    style={{ gridTemplateColumns: `repeat(${maxLen + 1}, minmax(0, 1fr))` }}
                  >
                    <span className="text-left">All</span>
                    {lengthTicks.map((n) => (
                      <span key={n} className="text-center">{n}</span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Enter more letters to filter results.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filtered.map((w) => (
                <button
                  key={w}
                  onClick={() => navigator.clipboard.writeText(w)}
                  className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
                  title="Click to copy"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )
      }
      seoContent={
        <>
          <h2 className="text-xl font-semibold">Ultimate Word Scrambler & Unscrambler Tool</h2>
          <p>
            A word scrambler — or unscrambler — is an essential utility that takes a jumbled set of letters and
            identifies every valid English word that can be formed from them. Whether you are a competitive Scrabble
            player, a daily Wordle enthusiast, or someone who loves solving crosswords, our tool provides instant,
            accurate results. Built with speed and privacy in mind, Wordspack’s unscrambler runs entirely in your
            browser, ensuring your data never leaves your device.
          </p>

          <h3 className="text-lg font-semibold mt-4">How to Unscramble Letters Effectively</h3>
          <p>
            Using our word finder is simple. Just type up to nine letters into the input field and hit "Unscramble."
            Within milliseconds, you will see a comprehensive list of words, neatly sorted by length from longest to
            shortest. You can then use our length filter to narrow down the results to specifically fit your puzzle's
            requirements. Tap any word to copy it instantly to your clipboard, making it easier than ever to fill in
            your game board or crossword grid.
          </p>

          <h3 className="text-lg font-semibold mt-4">Perfect for Scrabble, Wordle, and More</h3>
          <p>
            Are you stuck with a difficult Scrabble rack full of vowels? Or perhaps you are down to your last guess in
            Wordle and need to see all possible five-letter combinations? Our tool acts as a high-speed anagram solver
            and word generator. Beyond just games, writers use it to explore creative wordplay, and educators use it to
            design engaging vocabulary building exercises for students.
          </p>

          <h3 className="text-lg font-semibold mt-4">Maximize Your Word Game Strategy</h3>
          <p>
            To get the most out of our word unscrambler, try including common high-value letters like J, Q, X, and Z.
            Our dictionary is curated to include the most frequent and recognized words in the English language. For
            the best results, ensure you have a good balance of vowels (A, E, I, O, U). You can also use this tool
            alongside our <strong>Word Counter</strong> to track your writing progress or the{" "}
            <strong>Typing Speed Test</strong> to sharpen your input skills.
          </p>

          <FAQ
            items={[
              {
                question: "What is a word unscrambler used for?",
                answer:
                  "A word unscrambler is primarily used to find hidden words within a jumble of letters. It is popular for games like Scrabble, Words with Friends, and crossword puzzles where you need to identify valid words from a specific set of tiles or clues.",
              },
              {
                question: "Can I use this as an anagram solver?",
                answer:
                  "Yes! Our tool is a perfect anagram solver. By entering any word, it will find all possible rearrangements of those letters to form new valid English words.",
              },
              {
                question: "How many letters can I unscramble at once?",
                answer:
                  "Our current tool supports unscrambling up to 9 letters at a time. This limit ensures that the results are delivered instantly while remaining highly relevant for most popular word games.",
              },
              {
                question: "Is this word finder free to use?",
                answer:
                  "Absolutely. Wordspack provides this word unscrambler and all our other smart tools for words and creativity completely free of charge.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default WordScrambler;
