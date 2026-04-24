import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, RefreshCw, ListFilter, FileText } from "lucide-react";
import { toast } from "sonner";
import { aiService, SummarizeMode } from "@/lib/ai";
import { TTSButton } from "@/components/TTSButton";
import { FAQ } from "@/components/FAQ";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TextSummarizer() {
  const tool = getToolBySlug("text-summarizer")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<SummarizeMode>("medium");
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await aiService.summarize(input, mode);
      setOutput(result);
      toast.success("Summary generated!");
    } catch (error) {
      toast.error("Failed to generate summary. Please try again.");
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
      title="Text Summarizer"
      description="Condense long articles, reports, or documents into key points and digestible summaries."
      metaTitle="Free Text Summarizer Online - Summarize Articles Instantly"
      metaDescription="Use our AI text summarizer to condense long content into short, medium, or detailed summaries. Save time and get the key points instantly."
      hasOutput={!!output || isLoading}
      outputSection={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Summary
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
            <div className="space-y-4">
              <div className="bg-secondary/20 p-6 rounded-xl border border-border min-h-[150px] text-lg leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Original</p>
                  <p className="text-sm font-semibold">{inputWordCount} words</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Summary</p>
                  <p className="text-sm font-semibold">{outputWordCount} words</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-center col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Reduction</p>
                  <p className="text-sm font-bold text-primary">
                    {Math.round(((inputWordCount - outputWordCount) / Math.max(1, inputWordCount)) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      inputSection={
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="summarize-input">Original Content</Label>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">{inputWordCount} words</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Length:</span>
              <Select value={mode} onValueChange={(v) => setMode(v as SummarizeMode)}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (15%)</SelectItem>
                  <SelectItem value="medium">Medium (35%)</SelectItem>
                  <SelectItem value="detailed">Detailed (60%)</SelectItem>
                  <SelectItem value="bullets">Key Points (Bullets)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Textarea
            id="summarize-input"
            placeholder="Enter the full text of an article, essay, or document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] text-base"
          />
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={handleSummarize} disabled={isLoading || !input.trim()} className="gap-2">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ListFilter className="h-4 w-4" />}
              Generate Summary
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
          <h2>What is a Text Summarizer?</h2>
          <p>
            A text summarizer is an AI-driven tool that analyzes long pieces of writing and extracts the 
            most important information. It helps you save time by providing the "TL;DR" (Too Long; Didn't Read) 
            of any document, article, or essay.
          </p>
          
          <h2>How to Use the Summarizer</h2>
          <ol>
            <li>Paste your long text into the input field.</li>
            <li>Select your preferred summary length (Short, Medium, or Detailed).</li>
            <li>Click "Generate Summary".</li>
            <li>Review the extracted key points and copy them for your use.</li>
          </ol>

          <h2>Who is this for?</h2>
          <ul>
            <li><strong>Researchers:</strong> Quickly scan papers to see if they're relevant.</li>
            <li><strong>Students:</strong> Get the main points of long readings for study notes.</li>
            <li><strong>Busy Professionals:</strong> Summarize long emails or reports instantly.</li>
            <li><strong>Content Creators:</strong> Create quick summaries for social media or newsletters.</li>
          </ul>

          <FAQ
            items={[
              {
                question: "How accurate is the summary?",
                answer: "Our AI uses advanced processing to identify key sentences and main themes, providing a highly accurate overview of the original text."
              },
              {
                question: "Is there a word limit?",
                answer: "You can summarize texts up to several thousand words long."
              },
              {
                question: "Can I listen to the summary?",
                answer: "Yes! Use the 'Listen' button next to the results to hear the summary read aloud."
              }
            ]}
          />
        </>
      }
    />
  );
}
