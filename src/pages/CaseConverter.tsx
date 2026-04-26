import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { getToolBySlug } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Eraser, Volume2, Type } from "lucide-react";
import { toast } from "sonner";
import { TTSButton } from "@/components/TTSButton";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { FAQ } from "@/components/FAQ";

export default function CaseConverter() {
  const tool = getToolBySlug("case-converter")!;
  const [input, setInput] = useState("");
  const { add } = useSessionHistory();

  const handleTransform = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'alternating') => {
    if (!input.trim()) return;
    
    let transformed = "";
    switch (type) {
      case 'upper':
        transformed = input.toUpperCase();
        break;
      case 'lower':
        transformed = input.toLowerCase();
        break;
      case 'title':
        transformed = input.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        transformed = input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'alternating':
        transformed = input.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
    }
    setInput(transformed);
    toast.success(`Converted to ${type} case!`);
    add({ tool: tool.name, toolSlug: tool.slug, input: type, output: transformed.slice(0, 200) });
  };

  const handleClear = () => setInput("");

  const handleCopy = () => {
    if (!input.trim()) return;
    navigator.clipboard.writeText(input);
    toast.success("Copied to clipboard!");
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <ToolShell
      tool={tool}
      title="Case Converter"
      description="Quickly transform your text between UPPERCASE, lowercase, Title Case, and more."
      metaTitle="Free Case Converter Online - UPPERCASE, lowercase, Title Case"
      metaDescription="Easily change the case of your text. Convert to UPPERCASE, lowercase, Title Case, Sentence case, or Alternating case instantly. Free, fast, and mobile-friendly."
      inputSection={
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="case-input">Your Text</Label>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            </div>
            <Textarea
              id="case-input"
              placeholder="Type or paste your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[250px] text-base leading-relaxed resize-y"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleTransform('upper')} variant="secondary" size="sm" className="font-bold">UPPERCASE</Button>
            <Button onClick={() => handleTransform('lower')} variant="secondary" size="sm">lowercase</Button>
            <Button onClick={() => handleTransform('title')} variant="secondary" size="sm">Title Case</Button>
            <Button onClick={() => handleTransform('sentence')} variant="secondary" size="sm">Sentence case</Button>
            <Button onClick={() => handleTransform('alternating')} variant="secondary" size="sm">aLtErNaTiNg CaSe</Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border pt-4">
            <Button onClick={handleCopy} disabled={!input.trim()} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Text
            </Button>
            <TTSButton text={input} />
            <Button variant="outline" onClick={handleClear} disabled={!input.trim()} className="gap-2">
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      }
      seoContent={
        <>
          <h2>What is a Case Converter?</h2>
          <p>
            A case converter is a simple but powerful tool that allows you to change the capitalization of your text 
            instantly. Whether you accidentally left Caps Lock on or need to format a title for an article, 
            our tool handles it with a single click.
          </p>
          
          <h2>Supported Case Types</h2>
          <ul>
            <li><strong>UPPERCASE:</strong> CONVERTS ALL LETTERS TO CAPITAL LETTERS.</li>
            <li><strong>lowercase:</strong> converts all letters to small letters.</li>
            <li><strong>Title Case:</strong> Capitalizes The First Letter Of Each Word.</li>
            <li><strong>Sentence case:</strong> Capitalizes the first letter of each sentence.</li>
            <li><strong>Alternating case:</strong> cOnVeRtS tExT iNtO aLtErNaTiNg CaSe.</li>
          </ul>

          <h2>Why use Wordspack Case Converter?</h2>
          <p>
            Unlike many other tools, Wordspack is built for speed and privacy. All transformations happen 
            locally in your browser—your text never leaves your device. Plus, with integrated Text-to-Speech, 
            you can listen to your formatted text immediately.
          </p>

          <FAQ
            items={[
              {
                question: "Is this tool free?",
                answer: "Yes, the Case Converter is 100% free to use with no limits on text length."
              },
              {
                question: "Does it work with special characters?",
                answer: "Yes, it preserves numbers, punctuation, and special characters while only transforming alphabetic letters."
              },
              {
                question: "Can I use it on mobile?",
                answer: "Absolutely! The tool is fully responsive and works perfectly on any mobile browser."
              }
            ]}
          />
        </>
      }
    />
  );
}
