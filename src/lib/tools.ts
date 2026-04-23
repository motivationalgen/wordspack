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
];

export const getToolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
