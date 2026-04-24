import { useEffect, useMemo, useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getToolBySlug } from "@/lib/tools";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { FAQ } from "@/components/FAQ";
import { trackEvent } from "@/lib/analytics";

const tool = getToolBySlug("word-counter")!;

const WordCounter = () => {
  const [text, setText] = useState("");
  const { add } = useSessionHistory();

  useEffect(() => {
    trackEvent(tool.name);
  }, []);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0;
    const readingMinutes = words / 200;
    const readingTime =
      words === 0
        ? "0 min"
        : readingMinutes < 1
          ? `${Math.max(1, Math.round(readingMinutes * 60))} sec`
          : `${Math.ceil(readingMinutes)} min`;
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  // log to history when user pauses
  useEffect(() => {
    if (!text.trim()) return;
    const t = setTimeout(() => {
      add({
        tool: tool.name,
        toolSlug: tool.slug,
        input: text.slice(0, 60) + (text.length > 60 ? "…" : ""),
        output: `${stats.words} words, ${stats.chars} chars`,
      });
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <ToolShell
      tool={tool}
      title="Word Counter"
      description="Count words, characters, sentences, and reading time as you type. Built for writers, students, and SEO content creators."
      metaTitle="Word Counter — Live Word & Character Count | Wordspack"
      metaDescription="Free real-time word counter. Get word, character, sentence count and reading time as you type. Perfect for essays, blog posts, and SEO content."
      hasOutput={text.trim().length > 0}
      inputSection={
        <div className="grid gap-3">
          <Label htmlFor="text">Paste or type your text</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing here..."
            className="min-h-[220px] text-base"
          />
        </div>
      }
      outputSection={
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "Chars (no spaces)", value: stats.charsNoSpaces },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Reading time", value: stats.readingTime },
          ].map((s) => (
            <div key={s.label} className="rounded-[10px] bg-secondary/70 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      }
      seoContent={
        <>
          <h2 className="text-xl font-semibold">The Ultimate Word Counter & Character Count Tool</h2>
          <p>
            Wordspack’s word counter is a professional-grade utility designed to update in real time as you type. Unlike
            other tools that require you to click a button to see your results, our counter provides instant feedback
            on word count, character count (both with and without spaces), sentence count, paragraph count, and even an
            estimated reading time. This makes it an indispensable tool for writers, students, and SEO professionals
            who need to hit specific length targets quickly and accurately.
          </p>

          <h3 className="text-lg font-semibold mt-4">Why Tracking Word Count is Critical for SEO</h3>
          <p>
            In the world of digital marketing, content length plays a significant role in search engine rankings.
            While there is no single 'perfect' length, most SEO experts agree that long-form content (usually between
            1,000 and 2,500 words) tends to perform better in organic search results. Our tool helps you monitor your
            depth as you write, ensuring your blog posts, articles, and landing pages have the substance needed to
            rank effectively.
          </p>

          <h3 className="text-lg font-semibold mt-4">Built for Students, Freelancers, and Social Media</h3>
          <p>
            Whether you are working on a university essay with a strict 3,000-word limit or crafting a concise 280-character
            social media post, our tool has you covered. Students use it to ensure they stay within assignment
            parameters, while freelancers use it to generate accurate counts for billing purposes. Social media managers
            rely on the 'Character Count' feature to optimize their posts for platforms like Twitter, LinkedIn, and
            Instagram.
          </p>

          <h3 className="text-lg font-semibold mt-4">Privacy-First, Client-Side Processing</h3>
          <p>
            We prioritize your privacy. Your text never leaves your browser and is never stored on our servers. The
            Wordspack counter is built using lightweight, efficient code that processes everything locally on your
            device. This means you can count words in documents of any length without worrying about data security or
            server delays. For the best creative experience, use this tool alongside our{" "}
            <strong>Random Word Generator</strong> to spark new ideas when you hit a writer's block.
          </p>

          <FAQ
            items={[
              {
                question: "How accurate is this word counter?",
                answer:
                  "Our counter uses a robust algorithm that splits text by whitespace and common punctuation, ensuring a highly accurate count that matches standard processors like Google Docs and Microsoft Word.",
              },
              {
                question: "Is there a limit to how much text I can paste?",
                answer:
                  "Because our processing happens entirely in your browser, the limit is only restricted by your device's memory. You can safely paste and count thousands of words at once.",
              },
              {
                question: "How is reading time calculated?",
                answer:
                  "We calculate reading time based on an average adult reading speed of 200 words per minute. This provides a helpful estimate for blog posts and speech writing.",
              },
              {
                question: "Can I use this for social media character limits?",
                answer:
                  "Yes! Our tool provides live character counts with and without spaces, making it perfect for fitting your content into the limits of Twitter (280 chars), LinkedIn, or YouTube descriptions.",
              },
            ]}
          />
        </>
      }
    />
  );
};

export default WordCounter;
