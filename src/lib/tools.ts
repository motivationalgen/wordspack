export type ToolMeta = {
  slug: string;
  path: string;
  name: string;
  short: string;
  emoji: string;
};

export const TOOLS: ToolMeta[] = [
  { slug: "word-scrambler", path: "/word-scrambler", name: "Word Scrambler", short: "Unscramble letters into valid words.", emoji: "🔤" },
  { slug: "random-word-generator", path: "/random-word-generator", name: "Random Word Generator", short: "Get fresh random words on demand.", emoji: "🎲" },
  { slug: "word-counter", path: "/word-counter", name: "Word Counter", short: "Live word, character & reading time stats.", emoji: "🧮" },
  { slug: "word-of-the-day", path: "/word-of-the-day", name: "Word of the Day", short: "A new word every day with examples.", emoji: "📅" },
  { slug: "brand-name-generator", path: "/brand-name-generator", name: "Brand Name Generator", short: "Invent catchy brand names instantly.", emoji: "✨" },
  { slug: "typing-speed-test", path: "/typing-speed-test", name: "Typing Speed Test", short: "Measure your WPM and accuracy.", emoji: "⌨️" },
  { slug: "paraphrasing-tool", path: "/paraphrasing-tool", name: "Paraphrasing Tool", short: "Rewrite text while preserving meaning.", emoji: "🔄" },
  { slug: "grammar-checker", path: "/grammar-checker", name: "Grammar Checker", short: "Fix spelling and grammar mistakes.", emoji: "✍️" },
  { slug: "text-summarizer", path: "/text-summarizer", name: "Text Summarizer", short: "Condense long text into key points.", emoji: "📝" },
  { slug: "synonym-antonym-finder", path: "/synonym-antonym-finder", name: "Synonym & Antonym Finder", short: "Find the perfect word for any context.", emoji: "📖" },
  { slug: "anagram-solver", path: "/anagram-solver", name: "Anagram Solver", short: "Find all possible anagrams for any word.", emoji: "🧩" },
  { slug: "rhyme-generator", path: "/rhyme-generator", name: "Rhyme Generator", short: "Find perfect and near rhymes instantly.", emoji: "🎶" },
  { slug: "case-converter", path: "/case-converter", name: "Case Converter", short: "Switch between UPPER, lower, Title Case.", emoji: "Aa" },
  { slug: "readability-checker", path: "/readability-checker", name: "Readability Checker", short: "Analyze text complexity and level.", emoji: "📊" },
  { slug: "sentence-rewriter", path: "/sentence-rewriter", name: "Sentence Rewriter", short: "Rewrite sentences for clarity and tone.", emoji: "✒️" },
];

export const getToolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
