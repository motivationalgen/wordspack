import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, BarChart3, Info } from "lucide-react";
import { toast } from "sonner";
import { calculateReadability } from "@/lib/ai";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";
import { cn } from "@/lib/utils";

export default function ReadabilityChecker() {
  const tool = getToolBySlug("readability-checker")!;
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<ReturnType<typeof calculateReadability> | null>(null);

  const handleCheck = () => {
    if (!input.trim()) return;
    const result = calculateReadability(input);
    setStats(result);
  };

  const handleClear = () => {
    setInput("");
    setStats(null);
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const sentenceCount = input.split(/[.!?]+/).filter(Boolean).length;

  return (
    <ToolShell
      tool={tool}
      title="Readability Checker"
      description="Analyze your writing for clarity, grade level, and reading ease."
      metaTitle="Free Readability Checker - Flesch Reading Ease & Grade Level"
      metaDescription="Check the readability of your text instantly. Get Flesch Reading Ease scores, grade level estimates, and complexity analysis. Improve your writing for any audience."
      hasOutput={stats !== null}
      outputSection={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analysis Results
            </h3>
            <TTSButton text={`Your text has a readability score of ${stats?.score}. This corresponds to a ${stats?.level} reading level.`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary/30 p-4 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Flesch Score</p>
              <p className="text-3xl font-bold text-primary">{stats?.score}</p>
              <p className="text-xs text-muted-foreground mt-1">Higher is easier to read</p>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Grade Level</p>
              <p className="text-xl font-bold text-foreground">{stats?.level}</p>
              <p className="text-xs text-muted-foreground mt-1">Target audience level</p>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Complexity</p>
              <p className={cn(
                "text-xl font-bold",
                stats?.complexity === "Easy" ? "text-green-600" : 
                stats?.complexity === "Moderate" ? "text-orange-500" : "text-red-500"
              )}>
                {stats?.complexity}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Sentence structure density</p>
            </div>
          </div>

          <div className="flex gap-6 text-sm border-t border-border pt-4">
            <div><span className="text-muted-foreground">Words:</span> <span className="font-semibold">{wordCount}</span></div>
            <div><span className="text-muted-foreground">Sentences:</span> <span className="font-semibold">{sentenceCount}</span></div>
            <div><span className="text-muted-foreground">Avg. Word Length:</span> <span className="font-semibold">{(input.length / (wordCount || 1)).toFixed(1)} chars</span></div>
          </div>
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="readability-input">Paste your text to analyze</Label>
            <Textarea
              id="readability-input"
              placeholder="Enter your content here (articles, essays, emails...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] text-base"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleCheck} disabled={!input.trim()} className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Check Readability
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!input.trim() && !stats} className="gap-2">
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      }
      seoContent={
        <>
          <h2>What is a Readability Checker?</h2>
          <p>
            A readability checker evaluates how easy or difficult a piece of writing is to read. It uses 
            mathematical formulas like the **Flesch Reading Ease** to calculate scores based on sentence length 
            and word complexity (syllables).
          </p>
          
          <h2>Understanding the Flesch Score</h2>
          <p>
            The Flesch Reading Ease score typically ranges from 0 to 100:
          </p>
          <ul>
            <li><strong>90-100:</strong> Very easy to read. Easily understood by an average 11-year-old student.</li>
            <li><strong>60-70:</strong> Standard English. Easily understood by 13- to 15-year-old students.</li>
            <li><strong>0-30:</strong> Very difficult to read. Best understood by university graduates.</li>
          </ul>

          <h2>Why Readability Matters</h2>
          <p>
            Whether you're writing a blog post, a business proposal, or a school essay, knowing your 
            audience is key. A readability checker helps you:
          </p>
          <ul>
            <li>Improve user engagement by making content accessible.</li>
            <li>Optimize for SEO (Google favors content that is easy to read).</li>
            <li>Ensure clarity in technical documentation.</li>
            <li>Reach a wider global audience.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "What formula do you use?",
                answer: "We use the Flesch Reading Ease formula, which is one of the most reliable and widely used readability tests in the world."
              },
              {
                question: "What is a 'good' score?",
                answer: "For general web content, a score between 60 and 70 is ideal. For academic writing, 30-50 is common."
              },
              {
                question: "Does this store my text?",
                answer: "No. Your text is processed entirely in your browser. We do not store or see your content."
              }
            ]}
          />
        </>
      }
    />
  );
}
