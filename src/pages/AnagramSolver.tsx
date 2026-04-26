import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, Play, RefreshCw, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { DICTIONARY } from "@/data/dictionary";
import { solveAnagrams } from "@/lib/ai";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";

export default function AnagramSolver() {
  const tool = getToolBySlug("anagram-solver")!;
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const { add } = useSessionHistory();

  const handleSolve = () => {
    if (!input.trim()) return;
    setIsSolving(true);
    // Add small delay for UX
    setTimeout(() => {
      const found = solveAnagrams(input, DICTIONARY);
      setResults(found);
      add({ tool: tool.name, toolSlug: tool.slug, input: input, output: found.slice(0, 8).join(", ") || `${found.length} results` });
      setIsSolving(false);
      if (found.length === 0) {
        toast.info("No anagrams found in our dictionary.");
      }
    }, 300);
  };

  const handleClear = () => {
    setInput("");
    setResults([]);
  };

  const handleCopy = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(", "));
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolShell
      tool={tool}
      title="Anagram Solver"
      description="Find all possible valid English words by rearranging letters."
      metaTitle="Free Anagram Solver Online - Find Every Possible Word"
      metaDescription="Quickly solve any anagram. Enter letters or a phrase to find all valid English words you can make by rearranging them. Perfect for Scrabble and word games."
      hasOutput={results.length > 0}
      outputSection={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Results ({results.length})</h3>
            <div className="flex gap-2">
              <TTSButton text={results.join(", ")} />
              <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 px-2 gap-1.5">
                <Copy className="h-4 w-4" />
                <span className="text-xs font-medium">Copy</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((word) => (
              <span key={word} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm border border-border shadow-sm">
                {word}
              </span>
            ))}
          </div>
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="anagram-input">Enter letters or a word</Label>
            <Input
              id="anagram-input"
              placeholder="e.g. listen, silent, or aenrgm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-lg py-6"
              onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSolve} className="gap-2" disabled={isSolving || !input.trim()}>
              {isSolving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Solve Anagram
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!input && results.length === 0} className="gap-2">
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      }
      seoContent={
        <>
          <h2>What is an Anagram Solver?</h2>
          <p>
            An anagram solver is a tool designed to rearrange a set of letters to form all possible valid words. 
            Whether you're stuck on a word game, looking for creative inspiration, or just curious about what 
            words can be formed from your name, our solver provides instant results using a curated English dictionary.
          </p>
          
          <h2>How to use the Anagram Solver</h2>
          <ol>
            <li>Type your letters or word into the input field above.</li>
            <li>Click "Solve Anagram" or press Enter.</li>
            <li>View all valid words found in our dictionary.</li>
            <li>Use the "Listen" button to hear the results or "Copy" to save them.</li>
          </ol>

          <h2>Benefits of our Anagram Solver</h2>
          <ul>
            <li><strong>Fast & Reliable:</strong> Instant results with no server lag.</li>
            <li><strong>Mobile Friendly:</strong> Works perfectly on smartphones and tablets.</li>
            <li><strong>TTS Integration:</strong> Listen to the words generated.</li>
            <li><strong>No Sign-up:</strong> 100% free and private.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "What is an anagram?",
                answer: "An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once."
              },
              {
                question: "Does this solver work for multiple words?",
                answer: "Yes, you can enter multiple words or a phrase, and it will treat all characters (excluding spaces) as a single pool of letters to solve."
              },
              {
                question: "Is there a letter limit?",
                answer: "While there's no hard limit, the solver works best for words and phrases up to 15-20 characters."
              }
            ]}
          />
        </>
      }
    />
  );
}
