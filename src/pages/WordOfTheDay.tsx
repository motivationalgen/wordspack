import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { CopyButton } from "@/components/CopyButton";
import { getToolBySlug } from "@/lib/tools";
import { getDailyWord, getPreviousDays, type DailyWord } from "@/data/wordOfDay";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ } from "@/components/FAQ";
import { trackEvent } from "@/lib/analytics";

const tool = getToolBySlug("word-of-the-day")!;

const formatDate = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

const WordOfTheDay = () => {
  const today = useMemo(() => getDailyWord(), []);
  const previous = useMemo(() => getPreviousDays(7), []);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { add } = useSessionHistory();

  useEffect(() => {
    trackEvent(tool.name);
    add({ tool: tool.name, toolSlug: tool.slug, input: formatDate(new Date()), output: today.entry.word });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderEntry = (entry: DailyWord) => (
    <>
      <p className="text-base text-foreground">{entry.meaning}</p>
      <blockquote className="mt-3 italic text-muted-foreground">“{entry.examples[0]}”</blockquote>
      <blockquote className="mt-2 italic text-muted-foreground">“{entry.examples[1]}”</blockquote>
    </>
  );

  return (
    <ToolShell
      tool={tool}
      title="Word of the Day"
      description="Expand your vocabulary one word at a time. A new English word, with meaning and examples, every single day."
      metaTitle="Word of the Day — Daily Vocabulary Builder | Wordspack"
      metaDescription="Discover a new English word each day with meaning and example sentences. Build your vocabulary effortlessly with Wordspack's Word of the Day."
      inputSection={
        <div className="text-center py-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{formatDate(new Date())}</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary mb-3">{today.entry.word}</h2>
          <div className="max-w-xl mx-auto text-left sm:text-center">{renderEntry(today.entry)}</div>
          <div className="mt-5 flex justify-center">
            <CopyButton
              value={`${today.entry.word} — ${today.entry.meaning} Examples: ${today.entry.examples[0]} | ${today.entry.examples[1]}`}
              label="Copy"
            />
          </div>
        </div>
      }
      bottomSection={
        <div>
          <h3 className="font-semibold mb-3">Previous 7 days</h3>
          <ul className="divide-y divide-border">
            {previous.map((p, i) => {
              const isOpen = openIdx === i;
              return (
                <li key={p.date.toISOString()} className="py-1">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-start gap-3 py-3 text-left hover:bg-accent/50 rounded-md px-2 -mx-2 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs uppercase tracking-wide text-muted-foreground w-20 shrink-0 mt-1">
                      {formatDate(p.date)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-primary">{p.entry.word}</div>
                      {!isOpen && (
                        <div className="text-sm text-muted-foreground line-clamp-2 font-normal">{p.entry.meaning}</div>
                      )}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 mt-1 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="pl-[5.75rem] pr-2 pb-4 font-normal animate-fade-in">
                      {renderEntry(p.entry)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      }
      seoContent={
        <>
          <h2 className="text-xl font-semibold">Master Your Vocabulary with Word of the Day</h2>
          <p>
            Building a richer vocabulary is one of the most effective ways to improve your communication skills. Better
            words make you a sharper writer, a more persuasive speaker, and a more nuanced thinker. The Wordspack Word
            of the Day picks a single beautiful, useful, or unusual English word for you to learn each morning. Our goal
            is to help you expand your linguistic horizons without the need for signups or email lists—just a clean,
            focused page for your daily learning habit.
          </p>

          <h3 className="text-lg font-semibold mt-4">How Daily Word Learning Works</h3>
          <p>
            The featured word changes automatically based on the day of the year, ensuring that everyone visiting on the
            same date sees the same word. This creates a shared learning experience. Below the main daily entry, you
            can browse the previous seven days of words. Simply tap any entry to reveal its full meaning, phonetic
            pronunciation (where applicable), and multiple example sentences to help you understand the context.
          </p>

          <h3 className="text-lg font-semibold mt-4">Tips for Building a Lasting Vocabulary</h3>
          <p>
            To truly master a new word, we recommend a simple three-step process: First, read the meaning and study the
            example sentences. Second, try writing your own sentence using the word in a personal context. Third, look
            for opportunities to use the word in your speaking or writing throughout the day. Passive reading is a good
            start, but active usage is what locks a new word into your long-term memory.
          </p>

          <h3 className="text-lg font-semibold mt-4">Integrate with Other Writing Tools</h3>
          <p>
            Combine your daily word habit with other Wordspack utilities for a complete writing suite. Use the{" "}
            <strong>Word Counter</strong> to track how often you incorporate new vocabulary into your essays, or test
            your typing speed with the new word using our <strong>Typing Speed Test</strong>. If you're feeling
            playful, feed today's word into the <strong>Word Scrambler</strong> to see what other words are hidden
            within its letters.
          </p>

          <FAQ
            items={[
              {
                question: "How is the Word of the Day selected?",
                answer:
                  "Our words are curated from a list of high-leverage English vocabulary. The selection rotates deterministically based on the current date, so every user sees the same 'Word of the Day' at the same time.",
              },
              {
                question: "Can I see previous words from the past week?",
                answer:
                  "Yes! We keep a history of the previous 7 days directly on the page. You can click on any previous date to see the word, its definition, and examples.",
              },
              {
                question: "Is there a way to save the words I like?",
                answer:
                  "Currently, you can use the 'Copy' button to save the word and its definition to your clipboard. We recommend keeping a personal digital journal or physical notebook to track your favorite new words.",
              },
              {
                question: "Why should I learn a new word every day?",
                answer:
                  "Consistently learning new words improves cognitive function, enhances your ability to express complex ideas, and can even boost your professional and academic performance by giving you a more versatile 'toolset' for communication.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default WordOfTheDay;
