export const WORDS_BY_CATEGORY = {
  noun: [
    "river","mountain","forest","ocean","valley","castle","horizon","meadow","desert","glacier","harbor","village","island","canyon","savanna","plateau","prairie","tundra","bay","creek","cottage","palace","fortress","cavern","summit","ridge","fjord","lagoon","reef","oasis","grove","orchard","garden","library","museum","theater","stadium","bridge","tower","lantern","compass","journal","melody","whisper","echo","shadow","rainbow","comet","planet","galaxy","nebula","atom","crystal","feather","ribbon","chimney","window","ladder","mirror","kettle","button","pebble","puddle","blanket","candle","pillow","camera","engine","puzzle","blueprint","quill","sketch","piano","violin","guitar","drum","trumpet","harp","palette","sculpture","pottery","vendor","bakery","tailor","carpenter","blacksmith","explorer","scholar","poet","sailor","pilot","farmer","teacher","architect","engineer","doctor","painter","writer","gardener","builder","scientist","traveler","dreamer","wanderer"
  ],
  verb: [
    "wander","explore","create","imagine","discover","journey","sketch","whisper","sparkle","dance","gallop","glide","leap","race","build","craft","design","compose","invent","ignite","spark","flourish","unfold","reveal","unveil","embrace","cherish","savor","celebrate","wonder","marvel","ponder","reflect","analyze","examine","inspect","observe","describe","explain","compose","produce","cultivate","nurture","harvest","forge","mold","carve","weave","stitch","paint","sculpt","photograph","record","capture","summon","conjure","awaken","arouse","inspire","encourage","empower","support","uplift","educate","mentor","guide","lead","follow","listen","whisper","shout","cheer","laugh","smile","embrace","welcome","greet","thank","apologize","forgive","persist","endure","conquer","achieve","triumph","prevail","strive","practice","train","master","launch","release","publish","ship","deliver","share"
  ],
  adjective: [
    "vivid","serene","ancient","crystal","golden","silent","glowing","fearless","gentle","mighty","noble","quiet","radiant","silver","velvet","wild","witty","zesty","bold","brave","calm","clever","cosmic","cozy","crisp","curious","daring","dazzling","deep","delicate","dreamy","eager","earnest","elegant","emerald","epic","ethereal","fierce","fluffy","fragrant","fresh","gleaming","graceful","grand","hearty","humble","ivory","jovial","joyful","keen","lively","luminous","lush","majestic","mellow","misty","modest","mystic","nimble","peaceful","playful","plush","polished","pristine","quaint","quirky","rapid","rare","refined","regal","robust","rosy","rugged","rustic","sapphire","savory","scarlet","sleek","smooth","snug","solar","sparkling","spirited","steady","stellar","sublime","sunny","sweet","tender","tranquil","twinkling","unique","vast","vibrant","warm","whimsical","wise","woven"
  ],
};

export type WordCategory = keyof typeof WORDS_BY_CATEGORY | "mixed";

export function generateRandomWords(count: number, category: WordCategory): string[] {
  let pool: string[];
  if (category === "mixed") {
    pool = [...WORDS_BY_CATEGORY.noun, ...WORDS_BY_CATEGORY.verb, ...WORDS_BY_CATEGORY.adjective];
  } else {
    pool = WORDS_BY_CATEGORY[category];
  }
  const out: string[] = [];
  const used = new Set<number>();
  const n = Math.min(count, pool.length);
  while (out.length < n) {
    const i = Math.floor(Math.random() * pool.length);
    if (used.has(i)) continue;
    used.add(i);
    out.push(pool[i]);
  }
  return out;
}
