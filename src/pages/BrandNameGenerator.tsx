import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/CopyButton";
import { getToolBySlug } from "@/lib/tools";
import { generateBrandNames, type BrandStyle } from "@/data/brandNames";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { Wand2 } from "lucide-react";
import { FAQ } from "@/components/FAQ";

const tool = getToolBySlug("brand-name-generator")!;

const STYLES: { value: BrandStyle; label: string }[] = [
  { value: "modern", label: "Modern" },
  { value: "tech", label: "Tech" },
  { value: "luxury", label: "Luxury" },
  { value: "fun", label: "Fun" },
];

const BrandNameGenerator = () => {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState<BrandStyle>("modern");
  const [names, setNames] = useState<string[] | null>(null);
  const { add } = useSessionHistory();

  const handleGenerate = () => {
    const keywords = keyword
      .split(",")
      .map((k) => k.trim().toLowerCase().replace(/[^a-z]/g, ""))
      .filter(Boolean);
    const list = keywords.length ? keywords : ["spark"];
    const perKeyword = Math.max(4, Math.ceil(16 / list.length));
    const merged: string[] = [];
    for (const k of list) {
      const part = generateBrandNames(k, style, perKeyword);
      for (const name of part) if (!merged.includes(name)) merged.push(name);
    }
    const result = merged.slice(0, 16);
    setNames(result);
    add({ tool: tool.name, toolSlug: tool.slug, input: `${list.join(", ")} (${style})`, output: result.slice(0, 4).join(", ") + "…" });
  };

  return (
    <ToolShell
      tool={tool}
      title="Brand Name Generator"
      description="Invent catchy, original brand names for your startup, side project, or product launch in seconds."
      metaTitle="Brand Name Generator — Free Startup Name Ideas | Wordspack"
      metaDescription="Generate unique brand names instantly. Pick a style — modern, tech, luxury, or fun — and get 16 name ideas for your startup or product."
      hasOutput={!!names}
      inputSection={
        <div className="grid gap-5">
          <div>
            <Label htmlFor="kw" className="mb-2 block">Keyword(s)</Label>
            <Input
              id="kw"
              placeholder="e.g. coffee, beans, brew"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.slice(0, 80))}
            />
            <p className="text-xs text-muted-foreground mt-1">Tip: separate multiple keywords with commas to blend ideas.</p>
          </div>
          <div>
            <Label className="mb-2 block">Style</Label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${style === s.value ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:bg-accent"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} size="lg" className="w-full sm:w-auto">
            <Wand2 className="h-4 w-4" />
            Generate names
          </Button>
        </div>
      }
      outputSection={
        names === null ? (
          <p className="text-muted-foreground text-sm">Enter a keyword and pick a style to brainstorm 16 unique brand names.</p>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Name ideas</h3>
              <CopyButton value={names.join("\n")} label="Copy all" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {names.map((n) => (
                <button
                  key={n}
                  onClick={() => navigator.clipboard.writeText(n)}
                  className="rounded-[10px] border border-border bg-card hover:bg-accent transition-colors px-3 py-3 text-sm font-semibold text-primary"
                  title="Click to copy"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )
      }
      seoContent={
        <>
          <h2 className="text-xl font-semibold">The Ultimate Brand Name Generator for Startups and Projects</h2>
          <p>
            Finding the perfect name for your business or project is one of the most critical steps in building a brand.
            Wordspack’s brand name generator is a high-speed brainstorming tool that combines your core keywords with
            curated naming patterns to produce dozens of original, catchy ideas in seconds. Whether you're launching a
            SaaS startup, a luxury boutique, or a creative side project, our generator helps you find a name that
            resonates with your target audience.
          </p>

          <h3 className="text-lg font-semibold mt-4">Pick a Naming Style That Matches Your Vision</h3>
          <p>
            Different industries require different naming vibes. Our tool offers four distinct styles:{" "}
            <strong>Modern</strong> for clean, contemporary consumer brands; <strong>Tech</strong> for engineering and
            software infrastructure; <strong>Luxury</strong> for premium, high-end products; and <strong>Fun</strong>{" "}
            for playful businesses, games, and food-related startups. By selecting a style, you ensure that the
            generated names align with the professional image you want to project.
          </p>

          <h3 className="text-lg font-semibold mt-4">How to Evaluate Your New Brand Name Ideas</h3>
          <p>
            Once you have a list of potential names, we recommend evaluating them based on three criteria: memorability,
            pronunciation, and availability. A great name should be easy to say aloud and simple to spell. After
            shortlisting your favorites, check for domain name availability (like .com or .io) and search trademark
            databases to ensure you can legally own the brand. Remember, the best names often spark an emotional
            connection or tell a story about your mission.
          </p>

          <h3 className="text-lg font-semibold mt-4">Expand Your Brand Strategy with More Tools</h3>
          <p>
            A brand is more than just a name. Use our <strong>Word Counter</strong> to craft your initial taglines and
            mission statements, ensuring they are punchy and fit social media limits. If you're looking for more
            creative inspiration, our <strong>Random Word Generator</strong> can help you discover complementary product
            names or thematic keywords for your marketing campaigns. At Wordspack, we provide the tools you need to
            turn a simple idea into a memorable brand.
          </p>

          <FAQ
            items={[
              {
                question: "How does the brand name generator work?",
                answer:
                  "Our generator takes your input keywords and blends them with specific prefixes, suffixes, and linguistic patterns tailored to the style you select (Modern, Tech, Luxury, or Fun).",
              },
              {
                question: "How many names can I generate at once?",
                answer:
                  "Each click generates 16 unique name ideas based on your keywords and selected style. You can change styles or keywords and click again for a completely fresh list.",
              },
              {
                question: "What makes a 'good' brand name?",
                answer:
                  "A good brand name is usually short (2-3 syllables), easy to pronounce, and memorable. It should also be unique enough to stand out in your industry and have an available domain name.",
              },
              {
                question: "Are these names trademarked?",
                answer:
                  "The names are generated dynamically and are not pre-checked for trademarks. We strongly recommend performing a thorough trademark search and checking domain availability before committing to a name.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default BrandNameGenerator;
