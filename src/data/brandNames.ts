export type BrandStyle = "modern" | "tech" | "luxury" | "fun";

const PARTS: Record<BrandStyle, { prefix: string[]; suffix: string[]; vowels: string[] }> = {
  modern: {
    prefix: ["Nova", "Vibe", "Loop", "Pulse", "Drift", "Echo", "Forge", "Path", "Lumen", "Halo", "Verve", "Mode"],
    suffix: ["ly", "ify", "io", "wave", "lab", "works", "stack", "base", "flow", "studio", "edge", "kit"],
    vowels: ["a", "i", "o"],
  },
  tech: {
    prefix: ["Cyber", "Hyper", "Quant", "Neuro", "Logic", "Byte", "Nexus", "Vector", "Pixel", "Cloud", "Code", "Sync"],
    suffix: ["ly", "ix", "tech", "labs", "ai", "core", "hub", "net", "ops", "stack", "flow", "grid"],
    vowels: ["i", "y", "o"],
  },
  luxury: {
    prefix: ["Aurum", "Velvet", "Noir", "Maison", "Cara", "Soir", "Or", "Lume", "Belle", "Reve", "Sere", "Lux"],
    suffix: ["aire", "elle", "oire", "ique", "ana", "essa", "ora", "eta", "anova", "elle", "ette", "ora"],
    vowels: ["a", "e", "i"],
  },
  fun: {
    prefix: ["Zippy", "Pop", "Bingo", "Doodle", "Wiggle", "Snazzy", "Bubbly", "Jolly", "Happy", "Funky", "Zappy", "Peppy"],
    suffix: ["o", "oo", "y", "kins", "saurus", "tron", "pop", "bop", "zilla", "bee", "dee", "loo"],
    vowels: ["a", "e", "o"],
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function generateBrandNames(keyword: string, style: BrandStyle, count = 16): string[] {
  const k = keyword.trim().toLowerCase().replace(/[^a-z]/g, "");
  const seed = k || "spark";
  const { prefix, suffix, vowels } = PARTS[style];
  const out = new Set<string>();
  let safety = 0;
  while (out.size < count && safety++ < 200) {
    const r = Math.random();
    const p = prefix[Math.floor(Math.random() * prefix.length)];
    const s = suffix[Math.floor(Math.random() * suffix.length)];
    const v = vowels[Math.floor(Math.random() * vowels.length)];
    let name: string;
    if (r < 0.25) name = cap(seed) + s;
    else if (r < 0.5) name = p + cap(seed);
    else if (r < 0.7) name = cap(seed.slice(0, Math.max(3, Math.ceil(seed.length / 2)))) + v + s;
    else if (r < 0.85) name = p + s;
    else name = cap(seed) + v + cap(s);
    name = name.replace(/(.)\1{2,}/g, "$1$1");
    if (name.length >= 4 && name.length <= 14) out.add(name);
  }
  return Array.from(out).slice(0, count);
}
