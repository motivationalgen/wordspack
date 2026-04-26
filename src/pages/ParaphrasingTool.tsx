import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, Sparkles, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { aiService, ParaphraseMode } from "@/lib/ai";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ParaphrasingTool() {
  const tool = getToolBySlug("paraphrasing-tool")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ParaphraseMode>("standard");
  const [isLoading, setIsLoading] = useState(false);
  const { add } = useSessionHistory();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await aiService.paraphrase(input, mode);
      setOutput(result);
      toast.success("Text paraphrased successfully!");
      add({ tool: tool.name, toolSlug: tool.slug, input: input.slice(0,200), output: result.slice(0,200) });
    } catch (error) {
      toast.error("Failed to paraphrase text. Please try again.");
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
      title="Paraphrasing Tool"
      description="Rewrite sentences, paragraphs, or entire articles to improve clarity and avoid plagiarism."
      metaTitle="Free Paraphrasing Tool Online - Rewrite Text Instantly"
      metaDescription="Use our AI-powered paraphrasing tool to rewrite your text. Multiple modes: Standard, Fluency, and Creative. Improve writing quality and preserve original meaning."
      hasOutput={!!output || isLoading}
      outputSection={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Paraphrased Text
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
            <div className="bg-secondary/20 p-4 rounded-xl border border-border min-h-[150px] text-lg leading-relaxed">
              {output}
            </div>
          )}
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="paraphrase-input">Original Text</Label>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">{inputWordCount} words</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Mode:</span>
              <Select value={mode} onValueChange={(v) => setMode(v as ParaphraseMode)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="fluency">Fluency</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Textarea
            id="paraphrase-input"
            placeholder="Paste your text here to rewrite..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] text-base"
          />
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleGenerate} disabled={isLoading || !input.trim()} className="gap-2">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Paraphrase Now
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
          <h2>What is a Paraphrasing Tool?</h2>
          <p>
            A paraphrasing tool is an AI-powered utility that rewrites text by changing words and sentence 
            structures while preserving the original meaning. It's an essential tool for writers, students, 
            and professionals who want to improve their writing style or avoid repetitive language.
          </p>
          
          <h2>How our Paraphrasing Modes Work</h2>
          <ul>
            <li><strong>Standard:</strong> Balanced rewriting that maintains the original tone and structure.</li>
            <li><strong>Fluency:</strong> Focuses on making the text sound more natural and professional.</li>
            <li><strong>Creative:</strong> More adventurous rewriting that explores different ways to express ideas.</li>
          </ul>

          <h2>Benefits of Paraphrasing</h2>
          <ul>
            <li><strong>Avoid Plagiarism:</strong> Express existing ideas in your own unique voice.</li>
            <li><strong>Simplify Complex Ideas:</strong> Break down difficult concepts into easier language.</li>
            <li><strong>Improve Tone:</strong> Adjust your writing to be more professional or casual.</li>
            <li><strong>Save Time:</strong> Rewrite entire paragraphs in seconds.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "Is this tool free?",
                answer: "Yes, our paraphrasing tool is completely free to use with no hidden costs or sign-ups required."
              },
              {
                question: "Does it help with SEO?",
                answer: "Yes, by rewriting content to be more unique and readable, you can improve your search engine rankings."
              },
              {
                question: "Is the original meaning preserved?",
                answer: "Our AI is designed to understand context and ensure that the core message of your text remains the same."
              }
            ]}
          />
        </>
      }
    />
  );
}
