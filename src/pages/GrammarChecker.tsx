import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { aiService, GrammarEngine } from "@/lib/ai";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function GrammarChecker() {
  const tool = getToolBySlug("grammar-checker")!;
  const [input, setInput] = useState("");
  const [engine, setEngine] = useState<GrammarEngine>("advanced");
  const [result, setResult] = useState<{
    correctedText: string;
    errorsCount: number;
    readabilityScore: number;
    readabilityLevel: string;
    corrections: string[];
    suggestions: string[];
    seoImprovements: string[];
    improvedVersion: string;
    fullReport: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const data = await aiService.checkGrammar(input, engine);
      setResult(data);
      if (data.errorsCount === 0) {
        toast.success("No grammar errors found!");
      } else {
        toast.info(`Found and fixed ${data.errorsCount} potential issues.`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to check grammar. Please try again.");
      // Fallback to local if advanced fails (likely CORS)
      if (engine !== "local") {
        toast.info("Switching to local processing engine...");
        setEngine("local");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  const handleApplyFixes = () => {
    if (!result?.correctedText) return;
    setInput(result.correctedText);
    toast.success("Applied all corrections to the editor!");
  };

  const handleRewrite = async () => {
    if (!result?.correctedText) return;
    setIsLoading(true);
    try {
      const rewritten = await aiService.paraphrase(result.correctedText, "creative");
      setResult({
        ...result,
        correctedText: rewritten,
      });
      toast.success("Text rewritten for better clarity!");
    } catch (error) {
      toast.error("Failed to rewrite text.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.correctedText) return;
    navigator.clipboard.writeText(result.correctedText);
    toast.success("Corrected text copied!");
  };

  const inputWordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const correctedWordCount = result?.correctedText ? result.correctedText.trim().split(/\s+/).length : 0;

  return (
    <ToolShell
      tool={tool}
      title="Grammar Checker"
      description="Fix spelling, punctuation, and grammar mistakes instantly."
      metaTitle="Free Online Grammar Checker - Fix Your Writing Fast"
      metaDescription="Improve your writing with our free grammar checker. Detect spelling errors, punctuation mistakes, and grammar issues instantly. Get professional results every time."
      hasOutput={!!result || isLoading}
      outputSection={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {result?.errorsCount === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                {result?.errorsCount === 0 ? "No Errors Found" : "Corrected Version"}
              </h3>
              {result?.correctedText && (
                <span className="text-xs text-muted-foreground font-medium">{correctedWordCount} words</span>
              )}
            </div>
            <div className="flex gap-2">
              <TTSButton text={result?.correctedText || ""} />
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!result} className="h-8 px-2 gap-1.5">
                <Copy className="h-4 w-4" />
                <span className="text-xs font-medium">Copy</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-full" />
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-secondary/50 rounded animate-pulse w-4/6" />
            </div>
          ) : result && (
            <div className="space-y-6">
              <section className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Corrected Version
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-amber-600 hover:text-amber-600 hover:bg-amber-50"
                      onClick={handleRewrite}
                      disabled={isLoading}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Rewrite for Clarity
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={handleApplyFixes}
                      disabled={isLoading}
                    >
                      <Zap className="w-3.5 h-3.5 mr-1.5" /> Apply to Editor
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(result.correctedText);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                    </Button>
                  </div>
                </div>
                <div className="p-5 text-foreground leading-relaxed">
                  {result.correctedText}
                </div>
              </section>

              <section className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/30 px-4 py-3 border-b">
                  <h3 className="font-semibold flex items-center gap-2 text-foreground">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Improvements Explained
                  </h3>
                </div>
                <div className="p-5">
                  {result.corrections.length > 0 ? (
                    <ul className="space-y-3">
                      {result.corrections.map((correction, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: correction.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      No specific errors detected. Your text is grammatically sound.
                    </p>
                  )}
                </div>
              </section>

              {/* Writing Score */}
              <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-orange-600">📊</span> Writing Score
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-orange-600">{result.readabilityScore}</span>
                    <span className="text-gray-400 font-medium">/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Level</p>
                    <p className="text-gray-900 font-medium">{result.readabilityLevel}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Errors Fixed</p>
                    <p className="text-gray-900 font-medium">{result.errorsCount}</p>
                  </div>
                </div>
              </section>

              {/* SEO Improvements */}
              {result.seoImprovements.length > 0 && (
                <section className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <span className="text-orange-500">🚀</span> SEO Writing Suggestions
                  </h3>
                  <div className="space-y-3">
                    {result.seoImprovements.map((improvement, i) => (
                      <div key={i} className="flex gap-3 text-gray-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        <p className="text-sm leading-relaxed">{improvement.replace(/^- \*\*(.*?)\*\*:/, '$1:')}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <Label htmlFor="grammar-input">Paste your text to check</Label>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">{inputWordCount} words</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
                <button
                  onClick={() => setEngine("local")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${engine === "local"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Zap className="h-3 w-3" /> Fast
                </button>
                <button
                  onClick={() => setEngine("advanced")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${engine === "advanced"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Sparkles className="h-3 w-3" /> Deep Scan
                </button>
                <button
                  onClick={() => setEngine("grammarly")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${engine === "grammarly"
                      ? "bg-background text-emerald-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <ShieldCheck className="h-3 w-3" /> Grammarly (WS)
                </button>
              </div>
            </div>
          </div>
          <Textarea
            id="grammar-input"
            placeholder="Type or paste your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] text-base focus-visible:ring-primary/20 transition-all border-muted-foreground/20"
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={handleCheck}
              disabled={isLoading || !input.trim()}
              className={`gap-2 h-11 px-6 shadow-md transition-all active:scale-95 ${engine === "advanced" ? "bg-primary hover:bg-primary/90" :
                  engine === "grammarly" ? "bg-emerald-600 hover:bg-emerald-700" : ""
                }`}
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : engine === "advanced" ? (
                <Sparkles className="h-5 w-5" />
              ) : engine === "grammarly" ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              {isLoading ? "Analyzing..." : engine === "advanced" ? "Run Deep Scan" : engine === "grammarly" ? "Run Grammarly Check" : "Check Grammar"}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={isLoading || (!input && !result)} className="gap-2 h-11 px-6">
              <Eraser className="h-5 w-5 text-muted-foreground" />
              Clear
            </Button>
          </div>
        </div>
      }

      seoContent={
        <>
          <h2>Why Use an Online Grammar Checker?</h2>
          <p>
            Even the best writers make mistakes. An online grammar checker acts as a second pair of eyes,
            catching typos, punctuation slips, and grammatical errors that you might have missed.
            It's a fast and reliable way to ensure your writing is professional and clear.
          </p>

          <h2>What We Check For</h2>
          <ul>
            <li><strong>Spelling:</strong> Catch common typos and misspelled words.</li>
            <li><strong>Punctuation:</strong> Ensure commas, periods, and apostrophes are in the right place.</li>
            <li><strong>Basic Grammar:</strong> Fix subject-verb agreement and basic tense issues.</li>
            <li><strong>Clarity:</strong> Identify sentences that might be confusing to readers.</li>
          </ul>

          <h2>Perfect For:</h2>
          <ul>
            <li><strong>Students:</strong> Polish essays and assignments before submission.</li>
            <li><strong>Professionals:</strong> Send error-free emails and reports.</li>
            <li><strong>Non-Native Speakers:</strong> Improve your English writing confidence.</li>
            <li><strong>Writers:</strong> Quick proofreading for blog posts and creative projects.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "Is this grammar checker free?",
                answer: "Yes, our tool is 100% free and requires no registration."
              },
              {
                question: "Can it handle long texts?",
                answer: "Yes, you can paste long paragraphs and the checker will process them in seconds."
              },
              {
                question: "Is my data private?",
                answer: "Absolutely. We do not store your text or share it with third parties."
              }
            ]}
          />
        </>
      }
    />
  );
}
