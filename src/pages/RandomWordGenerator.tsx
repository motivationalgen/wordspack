import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/CopyButton";
import { getToolBySlug } from "@/lib/tools";
import { generateRandomWords, type WordCategory } from "@/data/randomWords";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { Shuffle } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const tool = getToolBySlug("random-word-generator")!;

const CATEGORIES: { value: WordCategory; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "noun", label: "Nouns" },
  { value: "verb", label: "Verbs" },
  { value: "adjective", label: "Adjectives" },
];

const RandomWordGenerator = () => {
  const [count, setCount] = useState(5);
  const [category, setCategory] = useState<WordCategory>("mixed");
  const [words, setWords] = useState<string[] | null>(null);
  const { add } = useSessionHistory();

  useEffect(() => {
    trackEvent(tool.name);
  }, []);

  const handleGenerate = () => {
    const w = generateRandomWords(count, category);
    setWords(w);
    add({ tool: tool.name, toolSlug: tool.slug, input: `${count} ${category}`, output: w.join(", ") });
  };

  return (
    <ToolShell
      tool={tool}
      title="Random Word Generator"
      description="Generate fresh random words instantly for writing prompts, games, brainstorming sessions, and creative challenges."
      metaTitle="Random Word Generator — Free & Instant | Wordspack"
      metaDescription="Generate random words by category — nouns, verbs, adjectives, or mixed. Free online tool perfect for writing prompts, brainstorming, and word games."
      hasOutput={!!words}
      inputSection={
        <div className="grid gap-5">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Number of words</Label>
              <span className="text-sm font-semibold text-primary">{count}</span>
            </div>
            <Slider min={1} max={20} step={1} value={[count]} onValueChange={(v) => setCount(v[0])} />
          </div>
          <div>
            <Label className="mb-2 block">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === c.value ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:bg-accent"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} size="lg" className="w-full sm:w-auto">
            <Shuffle className="h-4 w-4" />
            Generate
          </Button>
        </div>
      }
      outputSection={
        words === null ? (
          <p className="text-muted-foreground text-sm">Pick a category and tap Generate to get fresh words.</p>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Your words</h3>
              <CopyButton value={words.join(", ")} label="Copy all" />
            </div>
            <div className="flex flex-wrap gap-2">
              {words.map((w) => (
                <button
                  key={w}
                  onClick={() => navigator.clipboard.writeText(w)}
                  className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
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
          <h2 className="text-xl font-semibold">Instant Random Word Generator for Creative Inspiration</h2>
          <p>
            Wordspack’s random word generator is a powerful utility designed to spark creativity instantly. Whether you
            are a writer facing a mental block, a game designer needing seeds for level generation, or an educator
            building vocabulary exercises, our tool provides a steady stream of fresh inspiration. With a curated
            dictionary and multiple category filters, you can generate nouns, verbs, adjectives, or a mixed selection
            with just one tap.
          </p>

          <h3 className="text-lg font-semibold mt-4">Boost Your Creative Writing with Random Prompts</h3>
          <p>
            One of the most effective ways to use a random word generator is for writing prompts. Try the 'Three-Word
            Challenge': generate three random words and write a short story or poem that incorporates all of them. This
            exercise helps you build unexpected connections between concepts, which is the heart of creative thinking.
            Many successful authors and poets use similar techniques to find starting points for their next big projects.
          </p>

          <h3 className="text-lg font-semibold mt-4">Versatile Tool for Games, Brainstorming, and Naming</h3>
          <p>
            Beyond writing, our tool is perfect for a wide range of activities. Use it as a Pictionary word generator,
            a Charades prompt, or a tool for brainstorming brand and product names. Marketers often use random word
            pairings to discover unique brand associations, while programmers use them to generate test data or
            memorable slug identifiers. Our interface is optimized for speed, so you can cycle through hundreds of
            words in seconds.
          </p>

          <h3 className="text-lg font-semibold mt-4">Private and Lightweight Generation</h3>
          <p>
            The Wordspack generator runs entirely in your browser. This means there are no API requests, no data
            tracking, and no waiting. Our bundled dictionary is carefully curated to provide high-quality, meaningful
            words across all categories. For a full creative suite, pair this generator with our{" "}
            <strong>Word Counter</strong> to track your draft progress or the <strong>Word Scrambler</strong> to
            explore anagrams of the words you generate.
          </p>

          <FAQ
            items={[
              {
                question: "Can I choose specific word categories?",
                answer:
                  "Yes! You can filter the results to only show Nouns, Verbs, or Adjectives, or use the 'Mixed' setting to get a diverse selection of all three.",
              },
              {
                question: "How many words can I generate at once?",
                answer:
                  "Our tool allows you to generate between 1 and 20 words per click. This makes it flexible enough for everything from a single prompt to a full list for a game.",
              },
              {
                question: "Is there a limit to how many times I can use it?",
                answer:
                  "No, there are no limits. You can click 'Generate' as many times as you like to get thousands of different word combinations.",
              },
              {
                question: "Are these words suitable for children?",
                answer:
                  "Our word list is curated to be safe and suitable for a general audience, making it a great tool for classrooms and family game nights.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default RandomWordGenerator;
