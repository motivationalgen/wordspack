import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { CopyButton } from "@/components/CopyButton";
import { getToolBySlug } from "@/lib/tools";
import { getDailyWord, getPreviousDays, type DailyWord } from "@/data/wordOfDay";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { ChevronDown, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ } from "@/components/FAQ";
import { trackEvent } from "@/lib/analytics";
import { TTSButton } from "@/components/TTSButton";
import { SocialShareCard } from "@/components/SocialShareCard";
import { Button } from "@/components/ui/button";

const tool = getToolBySlug("word-of-the-day")!;

const formatDate = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

const WordOfTheDay = () => {
  const today = useMemo(() => getDailyWord(), []);
  const previous = useMemo(() => getPreviousDays(7), []);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showShare, setShowShare] = useState(false);
  const { add } = useSessionHistory();

  useEffect(() => {
    trackEvent(tool.name);
    add({ tool: tool.name, toolSlug: tool.slug, input: formatDate(new Date()), output: today.entry.word });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderEntry = (entry: DailyWord, showTTS = false) => (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-base sm:text-lg text-foreground leading-relaxed flex-1">{entry.meaning}</p>
        {showTTS && (
          <div className="shrink-0 pt-1">
            <TTSButton text={`${entry.word}. Meaning: ${entry.meaning}. Example one: ${entry.examples[0]}. Example two: ${entry.examples[1]}`} />
          </div>
        )}
      </div>
      <div className="space-y-3">
        <blockquote className="italic text-muted-foreground border-l-2 border-primary/20 pl-4 py-1">
          “{entry.examples[0]}”
        </blockquote>
        <blockquote className="italic text-muted-foreground border-l-2 border-primary/20 pl-4 py-1">
          “{entry.examples[1]}”
        </blockquote>
      </div>
    </div>
  );

  return (
    <ToolShell
      tool={tool}
      title="Word of the Day"
      description="Expand your vocabulary one word at a time. A new English word, with meaning and examples, every single day."
      metaTitle="Word of the Day — Daily Vocabulary Builder | Wordspack"
      metaDescription="Discover a new English word each day with meaning and example sentences. Build your vocabulary effortlessly with Wordspack's Word of the Day."
      inputSection={
        <div className="py-2">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">{formatDate(new Date())}</p>
            <div className="flex flex-col items-center gap-2 mb-6">
              <h2 className="text-5xl sm:text-7xl font-black text-primary tracking-tight">{today.entry.word}</h2>
              <div className="flex items-center gap-2 mt-2">
                <TTSButton 
                  text={today.entry.word} 
                  className="bg-primary/5 hover:bg-primary/10 rounded-full px-4" 
                />
              </div>
            </div>
            <div className="max-w-2xl mx-auto text-left bg-muted/30 p-6 sm:p-8 rounded-2xl border border-border/50">
              {renderEntry(today.entry, true)}
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CopyButton
                value={`${today.entry.word} — ${today.entry.meaning}\nExamples:\n1. ${today.entry.examples[0]}\n2. ${today.entry.examples[1]}`}
                label="Copy Details"
              />
              <Button 
                variant="outline" 
                className={cn("gap-2 border-primary/20 hover:border-primary/40", showShare && "bg-primary/10 text-primary")}
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="w-4 h-4" />
                {showShare ? "Hide Designer" : "Share on Socials"}
              </Button>
            </div>
          </div>

          {showShare && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <SocialShareCard 
                word={today.entry.word}
                meaning={today.entry.meaning}
                example={today.entry.examples[0]}
              />
            </div>
          )}
        </div>
      }
      bottomSection={
        <div className="mt-8 border-t pt-10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-primary/40 text-2xl">#</span>
            Vocabulary History
          </h3>
          <ul className="divide-y divide-border bg-card border rounded-2xl overflow-hidden">
            {previous.map((p, i) => {
              const isOpen = openIdx === i;
              return (
                <li key={p.date.toISOString()} className="group">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 py-5 text-left hover:bg-muted/50 transition-colors px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-20 shrink-0 font-bold">
                      {p.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-primary group-hover:translate-x-1 transition-transform inline-block">
                        {p.entry.word}
                      </div>
                      {!isOpen && (
                        <div className="text-sm text-muted-foreground line-clamp-1 font-medium mt-0.5">{p.entry.meaning}</div>
                      )}
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-all shrink-0", isOpen ? "rotate-180 text-primary" : "group-hover:text-foreground")} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-8 pt-2 bg-muted/20 animate-in fade-in slide-in-from-top-2">
                      <div className="ml-[6rem] max-w-xl">
                        {renderEntry(p.entry, true)}
                      </div>
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
          <h2 className="text-2xl font-bold mb-4">Master Your Vocabulary with Word of the Day</h2>
          <p className="mb-6">
            Building a richer vocabulary is one of the most effective ways to improve your communication skills. Better
            words make you a sharper writer, a more persuasive speaker, and a more nuanced thinker. The Wordspack Word
            of the Day picks a single beautiful, useful, or unusual English word for you to learn each morning. Our goal
            is to help you expand your linguistic horizons without the need for signups or email lists—just a clean,
            focused page for your daily learning habit.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">Listen and Share Your Learning</h3>
          <p className="mb-6">
            We've now integrated <strong>Text-to-Speech (TTS)</strong> technology, allowing you to hear the correct 
            pronunciation of each word and see how it sounds in context. Additionally, our new <strong>Social Media 
            Image Designer</strong> lets you create beautiful, customized cards for your favorite words. Choose 
            between solid colors, gradients, or elegant mesh backgrounds, and download a high-resolution image to 
            share on Instagram, Twitter, or WhatsApp.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">How Daily Word Learning Works</h3>
          <p className="mb-6">
            The featured word changes automatically based on the day of the year, ensuring that everyone visiting on the
            same date sees the same word. This creates a shared learning experience. Below the main daily entry, you
            can browse the previous seven days of words. Simply tap any entry to reveal its full meaning, phonetic
            pronunciation (where applicable), and multiple example sentences to help you understand the context.
          </p>

          <FAQ
            items={[
              {
                question: "How do I use the social media generator?",
                answer: "Simply click the 'Share on Socials' button. You can then customize the background style (solid, gradient, or mesh) and colors before downloading a PNG image ready for sharing."
              },
              {
                question: "Does the voice reader work on all devices?",
                answer: "Our Text-to-Speech uses your device's native synthesis engine. It works on most modern browsers and mobile devices, providing a variety of natural-sounding voices to choose from."
              },
              {
                question: "How is the Word of the Day selected?",
                answer:
                  "Our words are curated from a list of high-leverage English vocabulary. The selection rotates deterministically based on the current date, so every user sees the same 'Word of the Day' at the same time.",
              },
              {
                question: "Is there a way to save the words I like?",
                answer:
                  "You can use the 'Copy Details' button to save everything to your clipboard, or use the 'Share on Socials' button to create a beautiful image you can save to your phone or computer.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default WordOfTheDay;
