import { useEffect, useMemo, useRef, useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/tools";
import { pickPassage } from "@/data/typingPassages";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { RotateCcw, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQ } from "@/components/FAQ";
import { trackEvent } from "@/lib/analytics";

const tool = getToolBySlug("typing-speed-test")!;

const TypingSpeedTest = () => {
  const [passage, setPassage] = useState(() => pickPassage());
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { add } = useSessionHistory();

  useEffect(() => {
    trackEvent(tool.name);
  }, []);

  useEffect(() => {
    if (!startedAt || finishedAt) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt, finishedAt]);

  const elapsedSec = useMemo(() => {
    if (!startedAt) return 0;
    const end = finishedAt ?? now;
    return Math.max(0.001, (end - startedAt) / 1000);
  }, [startedAt, finishedAt, now]);

  const correctCount = useMemo(() => {
    let c = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === passage[i]) c++;
    return c;
  }, [typed, passage]);

  const wpm = Math.round((correctCount / 5) / (elapsedSec / 60)) || 0;
  const accuracy = typed.length === 0 ? 100 : Math.round((correctCount / typed.length) * 100);

  const handleChange = (v: string) => {
    if (finishedAt) return;
    if (!startedAt && v.length > 0) setStartedAt(Date.now());
    if (v.length > passage.length) v = v.slice(0, passage.length);
    setTyped(v);
    if (v === passage) {
      const end = Date.now();
      setFinishedAt(end);
      const durationMins = (end - (startedAt ?? end)) / 60000;
      const finalWpm = Math.round((passage.length / 5) / Math.max(0.001, durationMins));
      add({
        tool: tool.name,
        toolSlug: tool.slug,
        input: `${passage.slice(0, 30)}…`,
        output: `${finalWpm} WPM, 100% accuracy`,
      });
    }
  };

  const stop = () => {
    if (!startedAt || finishedAt) return;
    const end = Date.now();
    setFinishedAt(end);
    const finalWpm = Math.round((correctCount / 5) / ((end - startedAt) / 60000)) || 0;
    const finalAcc = typed.length === 0 ? 100 : Math.round((correctCount / typed.length) * 100);
    add({
      tool: tool.name,
      toolSlug: tool.slug,
      input: `${passage.slice(0, 30)}…`,
      output: `${finalWpm} WPM, ${finalAcc}% accuracy (stopped)`,
    });
  };

  const reset = () => {
    setPassage(pickPassage());
    setTyped("");
    setStartedAt(null);
    setFinishedAt(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <ToolShell
      tool={tool}
      title="Typing Speed Test"
      description="Measure your real typing speed and accuracy in WPM. Practice as often as you like — your last results are saved for two hours."
      metaTitle="Typing Speed Test — Free WPM & Accuracy Test | Wordspack"
      metaDescription="Test your typing speed in real time. Get instant WPM and accuracy results with a clean, distraction-free typing test from Wordspack."
      inputSection={
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[10px] bg-secondary/70 p-3 text-center">
              <div className="text-xl font-bold text-primary">{wpm}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">WPM</div>
            </div>
            <div className="rounded-[10px] bg-secondary/70 p-3 text-center">
              <div className="text-xl font-bold text-primary">{accuracy}%</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Accuracy</div>
            </div>
            <div className="rounded-[10px] bg-secondary/70 p-3 text-center">
              <div className="text-xl font-bold text-primary">{elapsedSec.toFixed(1)}s</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Time</div>
            </div>
          </div>

          <div className="rounded-[10px] bg-secondary/40 p-4 leading-relaxed text-base font-mono select-none">
            {passage.split("").map((ch, i) => {
              const t = typed[i];
              const status = t == null ? "pending" : t === ch ? "correct" : "wrong";
              return (
                <span
                  key={i}
                  className={cn(
                    status === "correct" && "text-primary",
                    status === "wrong" && "text-destructive bg-destructive/10 rounded-sm",
                    status === "pending" && "text-muted-foreground/70",
                    i === typed.length && !finishedAt && "border-l-2 border-primary animate-pulse",
                  )}
                >
                  {ch}
                </span>
              );
            })}
          </div>

          <textarea
            ref={inputRef}
            value={typed}
            onChange={(e) => handleChange(e.target.value)}
            disabled={!!finishedAt}
            placeholder="Click here and start typing the passage above…"
            autoFocus
            className="w-full min-h-[100px] rounded-[10px] border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" />
              New passage
            </Button>
            <Button
              onClick={stop}
              variant="destructive"
              disabled={!startedAt || !!finishedAt}
            >
              <Square className="h-4 w-4" />
              Stop & score
            </Button>
          </div>

          {finishedAt ? (
            <div className="text-center py-4 mt-2 border-t border-border pt-6 animate-fade-in">
              <h3 className="text-2xl font-bold text-primary mb-2">Done! 🎉</h3>
              <p className="text-muted-foreground">
                You typed at <strong>{wpm} WPM</strong> with <strong>{accuracy}%</strong> accuracy.
              </p>
              <Button onClick={reset} className="mt-4" size="lg">
                <RotateCcw className="h-4 w-4" /> Try again
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mt-2 text-center sm:text-left">
              Your final results will appear here when you finish typing the passage. Live stats are shown above.
            </p>
          )}
        </div>
      }
      seoContent={
        <>
          <h2 className="text-xl font-semibold">Accurate Online Typing Speed Test (WPM)</h2>
          <p>
            Wordspack’s typing speed test is designed to provide you with a precise measurement of your typing performance.
            Unlike simple word-only tests, we use real-world paragraphs to simulate actual writing conditions. The moment
            you press your first key, our high-resolution timer begins, measuring your <strong>Words Per Minute (WPM)</strong>
            and <strong>accuracy percentage</strong> in real-time. Whether you are preparing for a job interview, a
            transcription role, or simply want to improve your productivity, our test gives you the data you need to succeed.
          </p>

          <h3 className="text-lg font-semibold mt-4">Understanding WPM and Accuracy Benchmarks</h3>
          <p>
            What is a 'good' typing speed? For most office jobs, an average speed of 40 to 50 WPM is sufficient.
            However, for roles that involve heavy writing—such as programming, journalism, or administration—speeds
            of 70 to 90 WPM are often expected. While speed is important, accuracy is paramount. A fast typist who
            makes frequent errors is often less productive than a slower, more precise one. Our test highlights
            mistakes in real-time, helping you identify which character combinations are slowing you down.
          </p>

          <h3 className="text-lg font-semibold mt-4">Proven Strategies to Improve Your Typing Speed</h3>
          <p>
            Improving your typing speed requires consistent, focused practice. We recommend short, daily sessions rather
            than long, infrequent ones. Focus on maintaining a proper 'home row' position and avoid looking at your
            keyboard. Try to keep your wrists relaxed and your posture upright. As you practice with our diverse range
            of passages, you'll find that your muscle memory improves, allowing you to type complete words and phrases
            rather than individual letters.
          </p>

          <h3 className="text-lg font-semibold mt-4">Distraction-Free and Privacy-Focused</h3>
          <p>
            Our typing test is built to be clean and distraction-free, allowing you to focus entirely on your performance.
            All calculations happen locally in your browser, meaning your privacy is protected and your results are
            delivered instantly. Pair this test with our <strong>Word Counter</strong> to see how your speed translates
            into actual writing volume, or use the <strong>Word of the Day</strong> to find new content to practice with.
          </p>

          <FAQ
            items={[
              {
                question: "How is WPM calculated?",
                answer:
                  "Words Per Minute (WPM) is calculated by taking the number of correct characters typed, dividing by 5 (the average length of a word), and then dividing by the time taken in minutes.",
              },
              {
                question: "What is a good score on a typing test?",
                answer:
                  "An average typing speed is around 40 WPM. A speed of 60 WPM or higher is considered very good, while professional typists often reach 100+ WPM with high accuracy.",
              },
              {
                question: "Does this test support mobile devices?",
                answer:
                  "Yes! While touch typing is best practiced on a physical keyboard, our test works on mobile devices so you can check your thumb-typing speed as well.",
              },
              {
                question: "How often should I practice?",
                answer:
                  "For the best results, we recommend practicing for 10-15 minutes every day. Consistency is the most important factor in building the muscle memory required for fast typing.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default TypingSpeedTest;
