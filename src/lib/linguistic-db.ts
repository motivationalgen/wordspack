/**
 * Advanced Linguistic Database for Paraphrasing and Writing Enhancement
 * Contains mappings for:
 * 1. Word-to-Synonym (Standard)
 * 2. Word-to-Sentence (Expansion)
 * 3. Sentence-to-Word (Conciseness)
 * 4. Phrase-to-Phrase (Varied complexity)
 */

export const wordToSentence: Record<string, string[]> = {
  "successful": [
    "achieving a level of accomplishment that is widely recognized",
    "having reached the desired goals and objectives with excellence",
    "faring well in a way that brings about positive and significant results"
  ],
  "challenge": [
    "a task or situation that tests someone's abilities to the fullest",
    "a demanding obstacle that requires significant effort and strategy to overcome",
    "an invitation to engage in a struggle or contest that demands growth"
  ],
  "innovation": [
    "the process of translating an idea or invention into a good or service that creates value",
    "a groundbreaking approach that introduces new and effective methods",
    "the act of revolutionizing existing systems through creative thinking"
  ],
  "leadership": [
    "the capacity to inspire and guide a group of individuals toward a common goal",
    "the exercise of influence and direction over a team or organization",
    "the art of motivating others to perform at their highest potential"
  ],
  "technology": [
    "the application of scientific knowledge for practical purposes in industry",
    "a complex system of tools and techniques developed to solve human problems",
    "the ever-evolving landscape of digital and mechanical advancements"
  ],
  "environment": [
    "the natural world as a whole or in a particular geographical area",
    "the surrounding conditions in which a person, animal, or plant lives",
    "the delicate ecosystem that sustains life on our planet"
  ],
  "education": [
    "the systematic process of receiving or giving instruction at a school or university",
    "the lifelong journey of acquiring knowledge, skills, and values",
    "the foundation upon which intellectual and social growth is built"
  ],
  "freedom": [
    "the power or right to act, speak, or think as one wants without hindrance",
    "the state of being unrestricted and able to pursue one's own destiny",
    "the fundamental human right to live life according to one's own principles"
  ],
  "happiness": [
    "a state of well-being characterized by emotions ranging from contentment to intense joy",
    "the profound sense of satisfaction and fulfillment in one's life",
    "a radiant condition of the mind and heart that stems from inner peace"
  ],
  "community": [
    "a group of people living in the same place or having a particular characteristic in common",
    "a supportive network of individuals who share shared values and goals",
    "the social fabric that connects us through mutual interests and support"
  ]
};

export const sentenceToWord: Record<string, string> = {
  "in the event that": "if",
  "at this point in time": "now",
  "due to the fact that": "because",
  "in order to": "to",
  "with the exception of": "except",
  "for the purpose of": "to",
  "in the near future": "soon",
  "in a consistent manner": "consistently",
  "at an early date": "soon",
  "take into consideration": "consider",
  "give an indication of": "indicate",
  "is able to": "can",
  "is capable of": "can",
  "it is necessary that": "must",
  "it is essential that": "must",
  "conduct an investigation into": "investigate",
  "make a decision": "decide",
  "perform an analysis of": "analyze",
  "put an end to": "end",
  "in close proximity to": "near",
  "with a view to": "to",
  "has the ability to": "can",
  "prior to": "before",
  "subsequent to": "after",
  "in the course of": "during",
  "in spite of the fact that": "although",
  "notwithstanding the fact that": "although",
  "on the grounds that": "because",
  "despite the fact that": "although"
};

export const massiveThesaurus: Record<string, string[]> = {
  "analyze": ["examine in detail", "scrutinize thoroughly", "evaluate critically", "investigate the components of", "dissect the information"],
  "beautiful": ["stunning", "exquisite", "magnificent", "aesthetically pleasing", "breathtaking", "gorgeous", "radiant"],
  "create": ["generate", "originate", "formulate", "construct", "fabricate", "bring into existence", "develop"],
  "effective": ["efficient", "productive", "impactful", "successful in producing results", "potent", "advantageous"],
  "future": ["upcoming era", "forthcoming years", "horizon", "prospective time", "time yet to come"],
  "growth": ["development", "expansion", "advancement", "progression", "augmentation", "evolution"],
  "help": ["assist", "facilitate", "support", "aid", "collaborate with", "provide guidance to"],
  "important": ["crucial", "pivotal", "significant", "paramount", "essential", "fundamental", "vital"],
  "knowledge": ["understanding", "expertise", "wisdom", "erudition", "intellectual capital", "insight"],
  "manage": ["administer", "supervise", "coordinate", "direct", "oversee", "orchestrate"],
  "opportunity": ["chance", "prospect", "possibility", "opening", "favorable circumstance"],
  "problem": ["issue", "challenge", "dilemma", "obstacle", "complication", "quandary"],
  "quality": ["standard", "caliber", "excellence", "superiority", "distinction"],
  "resource": ["asset", "capability", "supply", "inventory", "means"],
  "strategy": ["plan", "approach", "methodology", "tactical framework", "blueprint"],
  "system": ["framework", "structure", "mechanism", "network", "organization"],
  "understand": ["comprehend", "grasp", "perceive", "discern", "apprehend the meaning of"],
  "value": ["worth", "significance", "importance", "benefit", "merit"],
  "work": ["labor", "effort", "endeavor", "toil", "operation", "function"],
  "world": ["globe", "planet", "humanity", "existence", "global community"],
  "change": ["modify", "transform", "alter", "revolutionize", "adapt", "evolve"],
  "improve": ["enhance", "refine", "better", "upgrade", "elevate", "polish"],
  "clear": ["lucid", "transparent", "coherent", "unambiguous", "evident"],
  "strong": ["powerful", "robust", "resilient", "forceful", "vigorous"],
  "weak": ["fragile", "vulnerable", "feeble", "infirm", "delicate"],
  "fast": ["rapid", "swift", "expeditious", "accelerated", "brisk"],
  "slow": ["gradual", "deliberate", "leisurely", "sluggish", "measured"],
  "many": ["numerous", "multitudinous", "abundant", "manifold", "various"],
  "small": ["diminutive", "minute", "compact", "petite", "insignificant"],
  "big": ["massive", "immense", "gigantic", "substantial", "colossal"],
  "needs": ["requires", "necessitates", "demands", "calls for", "is in search of"],
  "work": ["labor", "effort", "toil", "endeavor", "tasks", "assignment"],
  "help": ["assist", "aid", "facilitate", "support", "back"],
  "easy": ["simple", "straightforward", "uncomplicated", "effortless", "manageable"],
  "hard": ["difficult", "challenging", "complex", "arduous", "strenuous"],
  "improve": ["enhance", "better", "refine", "upgrade", "polish"],
  "smart": ["intelligent", "clever", "bright", "sharp", "astute"],
  "begin": ["start", "initiate", "commence", "launch", "embark on"],
  "finish": ["complete", "conclude", "terminate", "wrap up", "finalize"],
  "happy": ["joyful", "content", "delighted", "cheerful", "pleased"],
  "sad": ["unhappy", "sorrowful", "depressed", "gloomy", "melancholy"],
  "good": ["excellent", "superior", "commendable", "positive", "beneficial"],
  "bad": ["poor", "negative", "detrimental", "unfavorable", "inferior"],
  "think": ["believe", "consider", "ponder", "reflect", "contemplate"],
  "say": ["state", "declare", "mention", "express", "remark"],
  "look": ["observe", "glance", "view", "examine", "inspect"],
  "use": ["utilize", "employ", "leverage", "apply", "operate"]
};

export const elaboratePhrases: Record<string, string[]> = {
  "a lot of": ["a vast multitude of", "an overwhelming abundance of", "a significant and diverse collection of"],
  "very good": ["exceptional in every regard", "outstandingly superior", "remarkably excellent"],
  "it is good": ["it demonstrates significant merit", "it possesses commendable qualities", "it reflects a high standard of excellence"],
  "think about": ["contemplate the implications of", "deliberate extensively upon", "give careful consideration to"],
  "talk about": ["discuss the intricacies of", "elaborate upon", "engage in a dialogue regarding"],
  "look at": ["examine the details of", "scrutinize the visual aspects of", "observe with keen interest"],
  "try to": ["endeavor to achieve", "strive diligently to", "make a concerted effort to"],
  "use this": ["utilize this resource", "employ this methodology", "leverage this tool for maximum effect"],
  "find out": ["discover the underlying facts", "ascertain the truth", "uncover the details of"],
  "get better": ["achieve a state of continuous improvement", "enhance one's current standing", "progress toward a higher level of mastery"]
};

export const grammarRules = [
  // Subject-Verb Agreement
  { pattern: /\b(i|you|we|they) (is|was)\b/gi, replacement: "$1 are", label: "Subject-Verb Agreement", explanation: "Use 'are' or 'were' with plural pronouns and 'you'." },
  { pattern: /\b(he|she|it) (are|were)\b/gi, replacement: "$1 is", label: "Subject-Verb Agreement", explanation: "Use 'is' or 'was' with third-person singular pronouns." },
  
  // Tense Consistency (Simple cases)
  { pattern: /\byesterday i (go|write|eat)\b/gi, replacement: (match: string, p1: string) => {
      const past: Record<string, string> = { "go": "went", "write": "wrote", "eat": "ate" };
      return `yesterday i ${past[p1.toLowerCase()] || p1}`;
  }, label: "Tense Consistency", explanation: "Use past tense for completed actions in the past." },

  // Prepositions
  { pattern: /\bdepend (on|upon|of)\b/gi, replacement: "depend on", label: "Preposition Mistake", explanation: "The correct preposition for 'depend' is 'on'." },
  { pattern: /\binterested (at|on|with)\b/gi, replacement: "interested in", label: "Preposition Mistake", explanation: "The correct preposition for 'interested' is 'in'." },
  { pattern: /\b(comply|compliance) (to|with)\b/gi, replacement: "$1 with", label: "Preposition Mistake", explanation: "Use 'with' after 'comply' or 'compliance'." },
  { pattern: /\bsimilar (with|to)\b/gi, replacement: "similar to", label: "Preposition Mistake", explanation: "The standard preposition after 'similar' is 'to'." },

  // Pronoun Errors
  { pattern: /\b(between|among) (you and i)\b/gi, replacement: "$1 you and me", label: "Pronoun Case", explanation: "Use the objective case 'me' after prepositions like 'between'." },
  { pattern: /\b(him and me) (went|did|saw)\b/gi, replacement: "He and I $2", label: "Pronoun Case", explanation: "Use the subjective case 'He and I' when they are the subjects of the sentence." },

  // Sentence Structure (Fragments/Run-ons - basic detection)
  { pattern: /\b(because|although|since) ([^.!?]+)[.!?]$/gi, replacement: (match: string) => match, label: "Sentence Fragment", explanation: "This looks like a dependent clause. Ensure it is attached to an independent clause." },
  
  // Word Usage / Vocabulary
  { pattern: /\b(accept|except) (to|the)\b/gi, replacement: (match: string, p1: string, p2: string) => {
      if (p1.toLowerCase() === 'except' && p2 === 'the') return `accept the`;
      return match;
  }, label: "Word Usage", explanation: "Confused 'accept' (receive) with 'except' (exclude)." },
  { pattern: /\b(affect|effect) (the|on)\b/gi, replacement: (match: string, p1: string, p2: string) => {
      if (p1.toLowerCase() === 'effect' && p2 === 'the') return `affect the`;
      return match;
  }, label: "Word Usage", explanation: "Usually 'affect' is a verb and 'effect' is a noun." },

  // Spelling & Punctuation Additions
  { pattern: /\bdefinately\b/gi, replacement: "definitely", label: "Spelling", explanation: "Corrected spelling of 'definitely'." },
  { pattern: /\bundestand\b/gi, replacement: "understand", label: "Spelling", explanation: "Corrected spelling of 'understand'." },
  { pattern: /\bhappend\b/gi, replacement: "happened", label: "Spelling", explanation: "Corrected spelling of 'happened'." },
  { pattern: /\bfrustating\b/gi, replacement: "frustrating", label: "Spelling", explanation: "Corrected spelling of 'frustrating'." },
  
  // Global Rules
  { pattern: /\balot\b/gi, replacement: "a lot", label: "Spelling", explanation: "Corrected 'alot' to 'a lot' (it is always two words)." },
  { pattern: /\bevery where\b/gi, replacement: "everywhere", label: "Spelling", explanation: "Corrected 'every where' to 'everywhere' (one word)." },
  { pattern: /\b(im|ive)\b/gi, replacement: (match: string) => match.toLowerCase() === 'im' ? "I’m" : "I’ve", label: "Punctuation/Style", explanation: "Added missing apostrophe and capitalized 'I'." },

  
  // Advanced Punctuation & Style
  { pattern: /\bdon't\b/gi, replacement: "don’t", label: "Punctuation/Style", explanation: "Changed straight apostrophe to curly apostrophe for stylistic consistency." },
  { pattern: /\bdont\b/gi, replacement: "don’t", label: "Punctuation", explanation: "Added missing apostrophe to 'don’t'." },
  { pattern: /\bIts\b/g, replacement: "It’s", label: "Punctuation", explanation: "Added missing apostrophe in 'It’s'." },
  { pattern: /\bits (really|very|quite)\b/gi, replacement: "it’s $1", label: "Punctuation", explanation: "Added missing apostrophe in 'it’s'." },
  { pattern: /,\s*its\b/gi, replacement: "; it’s", label: "Grammar/Punctuation", explanation: "Fixed comma splice by replacing comma with semicolon and adding apostrophe." },
  { pattern: /,\s*it['’]s\b/gi, replacement: "; it’s", label: "Grammar/Punctuation", explanation: "Fixed comma splice by replacing comma with semicolon." },
  
  // Punctuation & Capitalization
  { pattern: /\b(however|therefore|moreover|nevertheless|consequently|suddenly)\b(?!\s*,)/gi, replacement: "$1,", label: "Punctuation", explanation: "Added missing comma after introductory word." },
  { pattern: /\b(hello|hey|hi)\b(?!\s*[,!?.])/gi, replacement: "$1,", label: "Punctuation", explanation: "Added missing comma after interjection." },
  { pattern: /\b(yes|no)\b(?!\s*[,!?.])/gi, replacement: "$1,", label: "Punctuation", explanation: "Added missing comma after 'yes' or 'no' when used as an introductory word." },
  { pattern: /([.!?])([a-zA-Z])/g, replacement: "$1 $2", label: "Punctuation", explanation: "Added missing space after punctuation." },
  { pattern: /\s{2,}/g, replacement: " ", label: "Punctuation", explanation: "Removed unnecessary double spaces." },
  { pattern: /\bi\b/g, replacement: "I", label: "Capitalization", explanation: "Capitalized the first-person pronoun 'I'." },
  { pattern: /([.!?]\s+)([a-z])/g, replacement: (match: string, p1: string, p2: string) => p1 + p2.toUpperCase(), label: "Capitalization", explanation: "Capitalized the first word of the sentence." }
];

