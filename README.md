# Shriyansh Saini — Portfolio

Vite + vanilla JS. GSAP, Lenis, Matter.js and lucide.

## Run it

```bash
npm install      # once
npm run dev      # local dev server, opens at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the built site
```

## Edit content

Everything lives in `src/projects-data.js`: name, contact, headline, the 8 skill chips and the projects.

**Add a project**
1. Add an entry to the `projects` array (slug, title, role, description, cover, hero, blocks).
2. Copy `projects/school-erp/` to `projects/<new-slug>/` and change `data-slug` and the `<title>` in its `index.html`.
3. Put images or short `.mp4` clips in `public/images/` and reference them as `/images/file.jpg`.

**Placeholders still to replace:** headline and subline, skill chips, project covers, About photo (`about/index.html`) and About text.

## Deploy

Netlify, Vercel or Cloudflare Pages: build command `npm run build`, output folder `dist`.

## Tweakable constants

- Physics (gravity, restitution, friction, density): `src/physics.js` → `PHYSICS`
- Pixel trail radius and decay: `src/pixelate.js` → `RADIUS`, `SHRINK`, `DECAY`
- Carousel edge scroll: `src/carousel.js` → `DEAD_ZONE`, `MAX_SPEED`
- Cursor smoothing: `src/cursor.js` → the `0.65` lerp base
- Preloader drop positions: `src/preloader.js` → `DROPS`
