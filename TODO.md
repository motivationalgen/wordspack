# TODO

## White/blank site debugging
- [x] Identify dev build was failing due to SWC native binding errors.
- [x] Switch Vite plugin from `@vitejs/plugin-react-swc` to `@vitejs/plugin-react`.
- [x] Ensure dev server can start and serves HTML.
- [ ] Fix runtime error on deployed site: `HomeNoLayout is not defined` caused React to crash.
- [ ] Remove duplicate/mis-inserted `HomeNoLayout` declarations in `src/App.tsx`.
- [ ] Re-verify locally with `npm run dev` + check console for errors.
- [ ] Rebuild and deploy again; verify on wordspack.com.

