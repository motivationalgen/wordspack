import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, PenLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { aiService, RewriteTone } from "@/lib/ai";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SentenceRewriter() {
  const tool = getToolBySlug("sentence-rewriter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tone, setTone] = useState<RewriteTone>("professional");
  const [isLoading, setIsLoading] = useState(false);
  const { add } = useSessionHistory();

  const handleRewrite = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await aiService.rewrite(input, tone);
      setOutput(result);
      toast.success("Rewritten successfully!");
      add({ tool: tool.name, toolSlug: tool.slug, input: input.slice(0,200), output: result.slice(0,200) });
    } catch (error) {
      toast.error("Failed to rewrite text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const inputWordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const outputWordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  return (
    <ToolShell
      tool={tool}
      title="Sentence Rewriter"
      description="Rewrite sentences to change their tone, improve clarity, or simplify complex language."
      metaTitle="Free Sentence Rewriter Online - Change Tone & Clarity"
      metaDescription="Instantly rewrite sentences for clarity, simplicity, or a professional tone. Perfect for refining emails, essays, and social media posts."
      hasOutput={!!output || isLoading}
      outputSection={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Rewritten Text
              </h3>
              <span className="text-xs text-muted-foreground font-medium">{outputWordCount} words</span>
            </div>
            <div className="flex gap-2">
              <TTSButton text={output} />
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output} className="h-8 px-2 gap-1.5">
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
          ) : (
            <div className="bg-secondary/20 p-4 rounded-xl border border-border min-h-[120px] text-lg leading-relaxed">
              {output}
            </div>
          )}
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="rewrite-input">Original Sentence</Label>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">{inputWordCount} words</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Tone:</span>
              <Select value={tone} onValueChange={(v) => setTone(v as RewriteTone)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Textarea
            id="rewrite-input"
            placeholder="Type a sentence you want to change..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] text-base"
          />
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleRewrite} disabled={isLoading || !input.trim()} className="gap-2">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
              Rewrite Sentence
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={isLoading || (!input && !output)} className="gap-2">
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      }
      seoContent={
        <>
          <h2>What is a Sentence Rewriter?</h2>
          <p>
            A sentence rewriter is an AI-powered tool that takes a single sentence and provides several 
            variations based on your desired tone and clarity. It helps you find the perfect way to 
            express an idea without changing the underlying meaning.
          </p>
          
          <h2>Supported Tones</h2>
          <ul>
            <li><strong>Professional:</strong> Ideal for business emails, reports, and formal documents.</li>
            <li><strong>Simple:</strong> Great for explaining complex ideas to a general audience.</li>
            <li><strong>Clear:</strong> Focuses on removing ambiguity and making the sentence easy to understand.</li>
          </ul>

          <h2>Why Use a Rewriter?</h2>
          <p>
            Sometimes you know what you want to say, but you can't find the right words. A rewriter 
            helps you:
          </p>
          <ul>
            <li>Avoid repetitive sentence structures.</li>
            <li>Make your writing more engaging.</li>
            <li>Adjust your tone to match your audience.</li>
            <li>Improve the flow of your writing.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "Is this tool free?",
                answer: "Yes, our sentence rewriter is 100% free and requires no sign-up."
              },
              {
                question: "Can it rewrite multiple sentences?",
                answer: "While optimized for single sentences, it can also handle short paragraphs."
              },
              {
                question: "How does it differ from paraphrasing?",
                answer: "Paraphrasing often changes the entire structure of a text, while rewriting focuses more on the tone and clarity of specific sentences."
              }
            ]}
          />
        </>
      }
    />
  );
}
