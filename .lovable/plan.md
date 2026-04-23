
# Wordspack — Smart Word Tools Web App

A fast, mobile-first, SEO-optimized collection of 6 word tools with a unified layout, session-based history, and AdSense-ready ad slots.

## Pages & Routes
- `/` — Homepage (hero + 6 tool cards + SEO intro)
- `/word-scrambler`
- `/random-word-generator`
- `/word-counter`
- `/word-of-the-day`
- `/brand-name-generator`
- `/typing-speed-test`
- `*` — 404

## Global Layout (consistent across all tool pages)
1. **Top Navbar** — Wordspack logo (left), tool links (collapsible on mobile)
2. **Top Banner Ad slot** (`.ad-slot.top-banner`)
3. **Tool Section**
   - H1 Tool Title + short description
   - Input area
   - Action button(s)
   - **In-Tool Ad slot** (`.ad-slot.in-tool`) — between input & output
   - Output area
   - **After-Results Ad slot** (dynamic, shown once output exists)
4. **Recent Activity** — last 5–10 session activities
5. **SEO Content Block** — 300–600 words per tool with H2s
6. **Internal Links** — "Try other tools" grid
7. **Footer** — SEO blurb + links to all tools
8. **Sidebar Ad** (desktop ≥lg only)
9. **Sticky Footer Ad** (mobile only)

## Design System
- Background: `#FFFFFF`
- Primary: Dark Ash Green `#2F4F4F`
- Secondary: Light Grey `#F5F5F5`
- Font: Inter (Google Fonts)
- Buttons: 10px radius, primary-filled with hover lift
- Cards: soft shadow, subtle hover scale
- Mobile-first, fully responsive

## Tool Logic

**1. Word Scrambler / Unscrambler**
- Input letters → generate all permutations/subsets
- Validate against bundled English dictionary (compact word list ~10k common words)
- Dedupe, sort by length (desc), filter by length dropdown
- Copy any word

**2. Random Word Generator**
- Slider 1–20, category dropdown (noun / verb / adjective / mixed)
- Bundled curated word lists per category
- Regenerate + copy-all

**3. Word Counter**
- Real-time as user types: words, characters (with/without spaces), sentences, paragraphs, reading time (200 wpm)
- Live stats grid

**4. Word of the Day**
- Curated array of 365+ words with meaning + example
- Index = day-of-year → deterministic daily rotation
- "Previous days" peek (last 7)

**5. Brand Name Generator**
- Keyword input + style chips (modern / tech / luxury / fun)
- Mix prefixes/suffixes/blends per style → 15 names
- Click any name to copy, regenerate button

**6. Typing Speed Test**
- Pool of ~20 paragraphs, random selection
- Timer starts on first keystroke, ends on completion
- Live WPM, accuracy %, errors highlighted
- Restart button + result summary

## Session History
- Custom hook `useSessionHistory`
- Stored in `sessionStorage` under `wordspack_history`
- Each entry: `{ tool, input, outputSummary, timestamp }`
- TTL filter: drop entries older than 2 hours on read
- Display last 10 on each tool page (and homepage)

## SEO
- React Helmet (or document head updates) per page: title, meta description, canonical
- Semantic H1 → H2 → H3 hierarchy
- 300–600 words of unique content per tool page
- Internal linking grid on every page
- `robots.txt` + sitemap-friendly URLs

## Ads (AdSense-ready)
Reusable `<AdSlot variant="top-banner | in-tool | after-results | sidebar | sticky-footer" />` component rendering empty styled containers with the right classes — ready for AdSense snippets later.

## Performance
- React.lazy + Suspense for each tool route
- Lightweight bundled word lists (JSON, tree-shaken per tool)
- Tailwind purge, no heavy libraries
- Smooth fade transitions between input/output states

## Components (reusable)
- `Layout` (Navbar + Footer + ad slots wrapper)
- `ToolShell` (title, input area, action, in-tool ad, output, after-results ad, recent activity, SEO content, internal links)
- `ToolCard`, `AdSlot`, `RecentActivity`, `CopyButton`, `SEOHead`

After approval I'll scaffold routes, build all 6 tools with real logic, wire session history, and apply the design system end-to-end.
