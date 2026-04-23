export const TYPING_PASSAGES: string[] = [
  "The quick brown fox jumps over the lazy dog while the bright sun begins to set behind the rolling hills, painting the sky in shades of orange and pink.",
  "Practice is the bridge between knowing and doing. Each small effort you make today builds the skill you will rely on tomorrow without even thinking about it.",
  "A well written sentence can change the way a reader feels in a single moment. Choose your words with care, and let clarity guide every paragraph that follows.",
  "Curiosity is the engine of progress. Ask better questions, listen with patience, and let what you learn shape the next question you ask after that.",
  "Good design is honest. It does not pretend to be more than it is, and it never tries to manipulate the buyer with promises that the product cannot keep.",
  "The mountain looked impossible from the valley, but each step was simple. By the time the sun reached the peak, the climbers had reached it together too.",
  "Reading widely is one of the cheapest forms of travel. A single book can take you across continents, across centuries, and across entire ways of seeing the world.",
  "Small habits compound into remarkable results. Show up, do the work, and trust the long, slow magic of consistency to deliver outcomes you cannot yet imagine.",
  "Music has the power to fold a memory back into the present. One familiar chord can return you to a summer afternoon you had nearly forgotten ever existed.",
  "Kindness costs nothing and yet pays interest forever. A small gesture today might be the moment a stranger remembers when they need courage tomorrow morning.",
  "Innovation rarely arrives as a single bolt of lightning. More often it is the quiet result of many tiny improvements stacked patiently on top of one another.",
  "The ocean teaches patience to anyone willing to listen. Tides do not rush, storms do not last, and the horizon is always exactly as far as you need it to be.",
];

export const pickPassage = () => TYPING_PASSAGES[Math.floor(Math.random() * TYPING_PASSAGES.length)];
