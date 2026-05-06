# TODO - Fix web preview blank page

- [ ] Update `index.html` so production/preview loads the bundled Vite script (remove `/src/main.tsx` hard reference).
- [ ] Build (`vite build`) and verify locally via `npm run start` (Express serving `dist`).
- [ ] Smoke test homepage and one deep route (`/word-scrambler`).
- [ ] If still blank, check that preview host serves SPA fallback and that `base` is correct.

