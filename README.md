# OleTide

Marketing site for OleTide, a LiveOps partner for Roblox games.

Next.js 16 (App Router, Turbopack), Tailwind v4, Motion, Lenis, Phosphor icons.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- `app/` holds the layout (fonts, preloader, nav, cursor, grain) and the single page.
- `components/` holds one file per section, plus shared primitives in `components/ui.tsx`.
- `assets/` holds the logo and game stills, imported statically so they get blur placeholders.
- `lib/site.ts` holds the contact email, nav links and easing curves.

The contact email (`hello@oletide.com`) is a placeholder. Set the real address in `lib/site.ts`.
