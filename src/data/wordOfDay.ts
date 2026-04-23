export type DailyWord = { word: string; meaning: string; examples: [string, string] };

export const WORDS_OF_DAY: DailyWord[] = [
  { word: "Ephemeral", meaning: "Lasting for a very short time.", examples: ["Cherry blossoms are ephemeral, blooming for just a week.", "Social media trends are ephemeral by nature."] },
  { word: "Serendipity", meaning: "Finding something good by chance.", examples: ["Meeting my mentor at that café was pure serendipity.", "Their friendship began with a moment of serendipity at the airport."] },
  { word: "Petrichor", meaning: "The pleasant smell of earth after rain.", examples: ["After the storm, the petrichor filled the garden.", "She opened the window to breathe in the petrichor."] },
  { word: "Luminous", meaning: "Giving off light; bright.", examples: ["The luminous moon lit the entire valley.", "Her luminous smile lit up the whole room."] },
  { word: "Quixotic", meaning: "Extremely idealistic and unrealistic.", examples: ["His quixotic plan to sail around the world inspired everyone.", "Her quixotic vision of world peace never wavered."] },
  { word: "Ineffable", meaning: "Too great to be expressed in words.", examples: ["She felt an ineffable joy when her child was born.", "The view from the summit was simply ineffable."] },
  { word: "Halcyon", meaning: "Denoting a period of peace and happiness.", examples: ["He often spoke of the halcyon days of his youth.", "The 90s were halcyon years for the music industry."] },
  { word: "Mellifluous", meaning: "Pleasingly smooth and musical to hear.", examples: ["Her mellifluous voice calmed the room.", "The cellist played a mellifluous melody."] },
  { word: "Sonder", meaning: "The realization that everyone has a complex life.", examples: ["Walking through the city, he was struck by sudden sonder.", "Sonder washed over her on the crowded subway."] },
  { word: "Lagniappe", meaning: "A small unexpected gift or bonus.", examples: ["The baker added a free cookie as a lagniappe.", "He left a generous tip as a lagniappe for the kind service."] },
  { word: "Vellichor", meaning: "The strange wistfulness of used bookstores.", examples: ["She loved the vellichor of the corner shop.", "Vellichor hung in the air of the dusty old library."] },
  { word: "Susurrus", meaning: "A soft murmuring or rustling sound.", examples: ["A susurrus of leaves filled the quiet woods.", "He fell asleep to the susurrus of the stream."] },
  { word: "Eloquent", meaning: "Fluent and persuasive in speaking.", examples: ["Her eloquent speech moved the audience.", "He gave an eloquent defense of his proposal."] },
  { word: "Resilient", meaning: "Able to recover quickly from difficulty.", examples: ["The resilient community rebuilt after the flood.", "Children are remarkably resilient after hardship."] },
  { word: "Solitude", meaning: "The state of being alone, often by choice.", examples: ["He found peace in the solitude of the mountains.", "She craves solitude after a long week of meetings."] },
  { word: "Wanderlust", meaning: "A strong desire to travel.", examples: ["Her wanderlust took her to thirty countries.", "The travel documentary fueled his wanderlust."] },
  { word: "Ethereal", meaning: "Extremely delicate, light, or otherworldly.", examples: ["An ethereal mist hung over the lake at dawn.", "Her ethereal voice silenced the entire hall."] },
  { word: "Saudade", meaning: "A deep emotional longing for something absent.", examples: ["Hearing the old song filled him with saudade.", "She wrote of the saudade she felt for her hometown."] },
  { word: "Cynosure", meaning: "A person or thing that attracts attention.", examples: ["The young pianist was the cynosure of the recital.", "Her red dress made her the cynosure of the gala."] },
  { word: "Effervescent", meaning: "Vivacious and enthusiastic.", examples: ["Her effervescent personality lit up the room.", "He greeted everyone with an effervescent smile."] },
  { word: "Alacrity", meaning: "Brisk and cheerful readiness.", examples: ["She accepted the challenge with alacrity.", "He answered the call with surprising alacrity."] },
  { word: "Pellucid", meaning: "Translucently clear.", examples: ["The pellucid stream revealed every pebble.", "Her pellucid prose made complex ideas easy to grasp."] },
  { word: "Quintessence", meaning: "The most perfect example of a quality.", examples: ["She is the quintessence of grace under pressure.", "This dish is the quintessence of Italian cooking."] },
  { word: "Scintillating", meaning: "Sparkling or shining brightly; brilliantly clever.", examples: ["We had a scintillating conversation about astronomy.", "The diamonds were scintillating under the lights."] },
  { word: "Insouciant", meaning: "Showing a casual lack of concern.", examples: ["He gave an insouciant shrug at the bad news.", "Her insouciant attitude irritated her colleagues."] },
  { word: "Ebullient", meaning: "Cheerful and full of energy.", examples: ["Her ebullient laughter was contagious.", "The team was ebullient after their victory."] },
  { word: "Limerence", meaning: "An intense romantic infatuation.", examples: ["His limerence for her clouded all judgment.", "Limerence often fades once daily life sets in."] },
  { word: "Numinous", meaning: "Having a strong spiritual quality.", examples: ["The cathedral had a numinous atmosphere.", "She felt a numinous presence in the ancient grove."] },
  { word: "Defenestrate", meaning: "To throw something out of a window.", examples: ["He jokingly threatened to defenestrate the broken laptop.", "The cat tried to defenestrate the small toy."] },
  { word: "Apricity", meaning: "The warmth of the sun in winter.", examples: ["We sat outside enjoying the apricity of February.", "Apricity is one of winter's small, quiet gifts."] },
  { word: "Gossamer", meaning: "Extremely light, delicate, or insubstantial.", examples: ["Her gossamer scarf fluttered in the breeze.", "The spider spun a gossamer web between the branches."] },
];

export function getDailyWord(date = new Date()): { entry: DailyWord; index: number } {
  // Normalize to calendar day using UTC to avoid timezone/DST issues
  // We use the local year/month/day but treat them as UTC components
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  
  const utcTimestamp = Date.UTC(y, m, d);
  const epochDays = Math.floor(utcTimestamp / 86400000);
  
  // Create a stable index based on the number of days since epoch
  // Adding the year helps keep the rotation unique across years
  const index = Math.abs(epochDays + y) % WORDS_OF_DAY.length;
  
  return { entry: WORDS_OF_DAY[index], index };
}

export function getPreviousDays(days = 7): { date: Date; entry: DailyWord }[] {
  const out = [];
  const today = new Date();
  
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({ date: d, entry: getDailyWord(d).entry });
  }
  return out;
}
