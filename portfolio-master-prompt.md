# MASTER PROMPT: Interactive Designer Portfolio (Physics Chips, Pixel-Trail Hover, Horizontal Project Carousel)

> Paste everything below the line into Claude Code / Cursor / any coding agent.
> Fill the `[BRACKETED]` fields first, or answer the agent's questions when it asks.

---

## 0. ROLE AND GOAL

You are a senior creative developer and product designer. Build a **production-quality, multi-page personal portfolio website** for me. It should be minimal, editorial and highly interactive, built around these signature interactions:

1. A preloader where skill "chips" fall from the top of the screen.
2. Skill chips that drop into the hero with real 2D physics. They can be dragged and thrown with the mouse.
3. A giant uppercase headline whose second line reveals a **pixelated, trailing circular reveal** under the cursor.
4. A horizontal project carousel that scrolls with the mouse wheel and also **auto-scrolls when the cursor nears the edges**.
5. A **custom square cursor** that grows into a labelled "View" disc over projects.
6. Smooth inertial scrolling and scroll-linked parallax on inner pages.

The overall feel should be calm, warm, restrained and confident: lots of whitespace, hairline borders, light typography, and motion that feels physical rather than flashy.

**Originality rule.** Recreate the *interaction mechanics and layout structure* described here. Do **not** copy any real person's text, images, name, logo or project content. Use only my content and my own visual identity below. Use placeholder content that is clearly marked until I supply the real material.

---

## 0.5 VIBE AND THEME (read before designing anything)

**Mood:** warm, quiet, editorial, crafted. The site feels like a printed lookbook on cream paper that happens to be playable. Visitors should smile at one or two playful physical moments (falling chips, a pixel trail) inside an otherwise very restrained, serious layout.

**Rules of taste**
- **One screen, one idea.** The home page is a single viewport with no page scroll on desktop. Nothing is stacked below it.
- **Calm color, loud imagery.** The UI chrome is cream and near-black only. The only color on the page comes from (a) the pastel skill chips and (b) the project cover images. Never add accent colors, gradients on the UI, or shadows.
- **Typography does the heavy lifting.** One font family, light weight, large uppercase headline, tiny uppercase labels. No bold paragraphs and no decorative fonts.
- **Sharp geometry.** Square corners everywhere, 1px hairlines, a square cursor.
- **Motion feels physical, not decorative.** Gravity, inertia, easing out, trails that fade. No bouncing logos, no spinning loaders, no scroll-jacking beyond smooth scroll.
- **Playful but quiet copy.** Short, confident, first-person lines. No buzzwords and no paragraphs on the home page.
- **Project covers are real work:** product screens, mockups, short looping clips. Use portrait 3:4 crops on the home carousel, and show the same work larger on the case-study page.
- **Interactions are discoverable by accident.** There are no instruction labels such as "drag me". Hover states, cursor changes and physical behavior teach the visitor.

If any choice is ambiguous, pick the calmer, more minimal option.

---

## 1. MY CONTENT: BUILT FROM MY RESUME (fill in / derive)

**I will attach my resume.** Before building, read it fully and derive all site content from it. Do not invent facts.

Mapping from resume to site:
- Name, contact links → header logo, About page, footer.
- Headline (2 short lines) and subline → propose 3 options from my resume's title and summary and ask me to choose. Line 2 gets the pixel effect, so keep it short.
- **8 skill chips** → pick my 8 strongest, most distinctive skills or disciplines from the resume (short labels of 1 to 2 words, uppercase-friendly), each with a fitting lucide icon. Show me the list for approval.
- **Projects** → turn my strongest 3 to 6 experiences or projects into case studies. For each, write `slug, title, role, one-line description`, and body blocks (heading / text / media) using only facts from my resume. Where a cover image is missing, create a clean neutral placeholder card and list which images I need to supply.
- About page → 2 to 3 paragraphs in first person, based on my resume's story, education and summary. Show me a draft for approval.
- Resume PDF → use the attached file as the header "Resume" link.
- External "More work" link: `[URL: portfolio / GitHub / Behance, optional]`

Fallback fields, only if the resume doesn't cover them:
- Name: `[YOUR NAME]`
- Role / headline (2 short lines, e.g. "DESIGNER / & BUILDER"): `[LINE 1]` / `[LINE 2]`. Line 2 gets the pixel-reveal effect, so keep it short.
- Subline (2 short lines): `[e.g. "Crafting without compromise / driven to keep learning"]`
- Skill chips (exactly 8 recommended, each with a lucide icon name): `[e.g. AI Systems (bot), UI/UX (layout), 3D Rendering (box), Branding (palette), Strategy (target), Development (code), Prototyping (sparkles), Research (clipboard-list)]`
- Projects (3 to 6): for each give `slug, title, role, one-line description, cover image/video, hero image/video, and body blocks (heading / text / media)`. If I haven't supplied any, generate 4 placeholder case studies and flag them clearly.
- External "More work" link (Behance / Dribbble / GitHub): `[URL]`
- About page: photo `[path]`, 2 to 3 paragraphs `[text]`
- Contact: email `[EMAIL]`, LinkedIn `[URL]`, X/Twitter or other `[URL]`
- Resume PDF: `[path]` (opens in a new tab from the header)
- Brand color direction: default is the warm "brown/cream" palette in §3. Replace it with `[MY PALETTE]` if I give one.

---

## 2. TECH STACK: ASK ME FIRST

**Before writing any code, ask me which tech stack I want.** Offer these options with a one-line pro/con each and give your recommendation:
1. **Vite + vanilla JS** (recommended: lightest, fastest, closest to the reference build)
2. **Next.js (React)** (good if I want to grow into a blog or CMS)
3. **Astro** (static-first, great performance, easy content pages)
4. **Plain HTML/CSS/JS with no build step** (simplest to host)
5. Something else I name

Whatever I pick, the interactions in §5 must behave identically. Map the libraries below onto that stack (for example, run the physics and cursor in client-only effects in React/Next, and keep the DOM-element chips approach).

The reference implementation used the following. Treat it as the default if I say "you decide":

- **Vite** with vanilla JavaScript (ES modules). No React and no heavy framework. This is a static multi-page site.
- **GSAP + ScrollTrigger** for all tweened animation and scrubbed parallax.
- **Lenis** for smooth scrolling, wired into the GSAP ticker so ScrollTrigger stays in sync.
- **Matter.js** (v0.20) for the chip physics.
- **lucide** (tree-shaken, only the icons used) for icons, rendered via `data-lucide` attributes and `createIcons`.
- **Google Font:** a geometric grotesk with a variable weight axis 100–900 (default: *Nata Sans*; substitute my font if I name one). Body weight is **300 (light)**; weight 400 is used only for small UI labels.
- Plain CSS with custom properties (design tokens). No Tailwind. Mobile-first where it makes sense, with the breakpoints listed below.
- Pages are real static HTML files: `/index.html`, `/about/index.html`, `/projects/<slug>/index.html`. Configure Vite with multiple inputs. Project pages share one JS bundle and render their content from a **single data array** (`projects` data module).
- Deployable to Cloudflare Pages, Netlify or Vercel. Provide the build/deploy steps.

---

## 3. DESIGN SYSTEM (tokens)

```css
:root{
  /* warm neutral scale */
  --brown-50:#FFFBF0; --brown-100:#F5EFE4; --brown-200:#E8DFD0; --brown-300:#D4C4AD;
  --brown-400:#B9A283; --brown-500:#9C8060; --brown-600:#7D6347; --brown-700:#5E4832;
  --brown-800:#3D2E1F; --brown-900:#261C12; --brown-950:#1A140F;

  --color-bg:var(--brown-50);
  --color-bg-alt:var(--brown-100);
  --color-bg-light:rgba(255,251,240,.5);
  --color-text:var(--brown-950);
  --color-border:rgba(26,20,15,.10);
  --color-border-alt:rgba(26,20,15,.05);

  --font-family:"Nata Sans",sans-serif;
  --weight-light:300; --weight-regular:400;
  --margin-page:20px;
  --border-hairline:1px solid var(--color-border);
  --border-hairline-xs:1px solid var(--color-border-alt);

  --text-xs:.75rem; --text-sm:.875rem; --text-base:1rem; --text-lg:1.25rem;
  --text-xl:1.5rem; --text-2xl:2rem; --text-3xl:3rem; --text-4xl:4rem; --text-5xl:6rem;
  --space-xs:.25rem; --space-sm:.5rem; --space-md:1rem; --space-lg:2rem; --space-xl:4rem; --space-2xl:8rem;
  --tracking-tight:-.03em; --tracking-tighter:-.05em;
}
```

**Style rules**
- Base: `box-sizing:border-box`, antialiased text, body weight 300, line-height 1.5, `overflow-x:hidden`, `a{color:inherit;text-decoration:none}`.
- `::selection` is inverted (text color as background, bg color as text).
- UI labels (logo, nav, footer links, section labels) are **uppercase, small (`--text-sm` or `--text-xs`), tight tracking (-0.03em)**.
- Display headlines are **uppercase, light weight, tracking -0.05em, line-height 0.9**.
- Cards and chips use **hairline borders only**: no shadows and no rounded corners. Everything is sharp and rectangular, including the cursor.
- Chip pastel backgrounds, assigned by `nth-child` (1 to 8): `#FFF0F0, #F0FFF4, #F0F4FF, #fffedf, #ffe4ff, #F0FFFF, #ffecda, #F5F0FF`. On hover a chip inverts to dark background with cream text.

---

## 4. PAGE STRUCTURE

### 4.1 Global header (all pages)
- `position:fixed`, full width, `z-index:100`, background = page bg, bottom hairline border, padding `1rem 20px`.
- Left: logo text (my name, uppercase, small), links to `/`.
- Right: nav links `About` and `Resume` (Resume opens the PDF in a new tab).
- Nav link hover: a 1px underline that grows from left to right (`width 0 → 100%`, 0.3s ease).
- **Attention "nudge" loop (desktop only):** every **3 seconds** the first nav link plays a push animation (`translateX 0 → -8px → +6px → +2px → 0`, 0.6s ease-out) and the second link plays a "receive" animation (delayed 0.15s; sits still for 30%, then `+8px → +3px → 0`). It looks as if the first link bumps the second. Disabled below 768px.

### 4.2 Home page (`/`)
**Locked to one screen.** `height:100svh; width:100vw; overflow:hidden; padding:20px; display:flex; flex-direction:column`. The page itself does not scroll vertically on desktop.

Inside, a `.hero` row (`padding-top:60px` to clear the header, `display:flex`, `gap:4rem`, `flex:1`):

**Left column (30% width, min 200px, max 30%, padding-right 2rem; column flex with `justify-content:space-between`):**
- **Top block:**
  - `<h1>` headline, `font-size:clamp(2.5rem,5vw,6rem)`, uppercase, light, tracking -0.05em, line-height .9. Each line is `display:block; overflow:hidden` (mask for the reveal). Line 1 is a plain line. **Line 2 is the pixelate line** (see §5.4).
  - Subline below: `clamp(1rem,1vw,1.25rem)`, light, `margin-top:1rem`.
- **Bottom block: the physics skills area** (`#skills-physics`, `position:relative; height:100%; width:100%; overflow:hidden`). See §5.2.

**Right area: the project carousel** (`flex:1`, see §5.5).

**Home footer** (below the hero, `flex-shrink:0`, row, space-between): left `© Developed by [YOUR NAME]` (xs, light); right a row of uppercase xs links with a small lucide icon each (Email / LinkedIn / X). Hover: `opacity:.6`, 0.3s.

### 4.3 Project (case study) page (`/projects/<slug>/`)
- Normal scrolling page, `max-width:900px`, centered, `padding:20px`.
- Top: `← Back to Work` link (small, hover opacity .6), then a big title (`4rem`, light, tracking -0.05em, line-height .95; `3rem` on mobile), then the role in bold (e.g. "Case Study") above a one-line description (`1.25rem`, line-height 1.6).
- Hero media, full width: an `<img>`, or a `<video autoplay loop muted playsinline>` when the file is `.mp4/.webm/.mov`.
- Body: a vertical flow of blocks rendered from the data array: `heading` (`2rem`, light), `text` (paragraph, line-height 1.6), and `media` (img or video, full width). 1rem gap between blocks.
- Document title format: `"<Project> — Portfolio"`.
- The custom cursor and Lenis smooth scroll also run on these pages.

### 4.4 About page (`/about/`)
- Two-column layout, `gap:4rem`, `padding-top:calc(60px + 4rem)`.
- **Left:** photo, 40% width, **`position:sticky`** (`top:calc(60px + 2rem)`), aspect ratio 3/4, `object-fit:cover`.
- **Right:** title "About" (`6rem`, light, tracking -0.05em), paragraphs (`1.25rem`, line-height 1.6, `max-width:600px`), then a contact block separated by a hairline top border: subtitle "Get in Touch", a short line, and the email as an underlined link (hairline bottom border, hover opacity .6).
- Mobile: columns stack, the photo becomes square and non-sticky.

### 4.5 Responsive rules
- **≤1024px:** hero text column becomes 35%; headline `clamp(2.5rem,6.25vw,3.5rem)`.
- **≤768px (mobile):**
  - Home becomes a normal scrolling page (`height:auto; overflow-y:auto`) with the hero stacked vertically.
  - Physics chips are **hidden**.
  - The pixelate hover is **disabled** and the headline mask is removed.
  - The carousel becomes a vertical stack of full-width cards (aspect 4/3).
  - The carousel arrow indicator is hidden.
  - The nav nudge is disabled.
  - The footer stacks.
- **Touch devices (`hover:none`):** hide the custom cursor and restore the native one.
- **`prefers-reduced-motion: reduce`:** no preloader, no Lenis, no physics. Chips render as a static wrapped flex row, the headline and cards appear instantly, and the cursor is hidden. Nothing may depend on animation to be visible.

### 4.6 MOBILE-FIRST RESPONSIVENESS (required, treat as a core feature)

The site must be fully usable and still feel premium on phones and tablets. The reference site does not shrink the desktop layout. It **swaps to a simpler layout** and drops the hover-only effects. Do the same, and make it work on real touch devices, not just a narrow desktop window.

**Breakpoints:** `≤768px` = mobile layout, `769–1024px` = tablet tweaks, `>1024px` = full desktop. Detect capability with media queries (`hover:none`, `pointer:coarse`, `prefers-reduced-motion`) and not only with width. A large touch tablet still gets no custom cursor.

**Mobile home (≤768px), verified behavior of the reference:**
- The one-screen lock is removed. The page scrolls normally (`height:auto; overflow-y:auto`), with no horizontal overflow at any width from 320px up.
- Header stays fixed and compact (logo left, two links right, same hairline border).
- Order top to bottom: headline (`clamp(2.5rem,10vw,3.5rem)`, still uppercase and light, both lines visible, plain text with no pixel effect), subline, then the project cards, then the footer.
- Project cards are a **single vertical column**, full width, **4:3** aspect, 1rem gap, with the same bottom gradient, index and title (`1.25rem`). Each is a normal tappable link.
- The skill chips, preloader, physics, custom cursor, pixel trail, carousel arrow indicator and nav nudge are all **off**. Do not leave empty space where they were.
- Entrance animations are kept but simplified: the headline words and subline fade up, and the cards fade up with a light stagger as they enter the viewport (IntersectionObserver or ScrollTrigger). Keep each under 0.8s.
- Body text is never smaller than 16px (prevents iOS zoom-on-focus), and tap targets are at least 44×44px.

**Mobile inner pages:**
- Project pages: title `3rem`, full-width media with `height:auto`, all blocks in one column, videos `playsinline muted loop autoplay` (autoplay only works muted on iOS).
- About page: columns stack, the photo is square and non-sticky, and the title drops to `3rem`.
- Resume link opens the PDF in a new tab.

**Tablet (769–1024px):** keep the desktop one-screen home, but the text column becomes 35% wide and the headline `clamp(2.5rem,6.25vw,3.5rem)`. Keep physics and the carousel, since a tablet has the room. Disable the custom cursor and pixel trail if the device has no hover (`hover:none`), and make the carousel swipe natively with touch.

**Robustness rules**
- Use `100svh` (not `100vh`) so mobile browser toolbars don't cut content. Use `env(safe-area-inset-*)` padding for notched phones.
- Gate every desktop-only effect behind a single `isDesktopMotion` check (`min-width:769px` AND `hover:hover` AND not reduced-motion), evaluated at load and again on `resize`/`orientationchange`. Tear down the physics loop and listeners when the check turns false, and start them when it turns true.
- No layout shift: set `aspect-ratio` or width/height on all images and videos. Lazy-load below-the-fold media. Serve responsive images with `srcset`/`sizes` and use short compressed mp4/webm instead of GIFs on mobile.
- Test targets: iPhone SE (375×667), iPhone 14 (390×844), Pixel 7 (412×915), iPad (768×1024) and a 320px-wide edge case, in portrait and landscape.
- Acceptance checks: no horizontal scrollbar, no overlapping elements, nothing clipped under the fixed header, text readable without zoom, every link tappable, and Lighthouse mobile score ≥ 90.

---

## 5. INTERACTIONS: IMPLEMENT EXACTLY

### 5.1 Preloader ("raining chips")
**Runs only on desktop (>768px) with motion allowed.**
1. On load, hide the header and home footer (`opacity:0`).
2. Append a full-screen overlay (`position:fixed; inset:0; z-index:300; background:var(--color-bg)`) and, above it, a transparent clip layer (`z-index:301; pointer-events:none; overflow:hidden`).
3. **Clone each skill chip** into the clip layer as `.preloader-chip` (larger: `font-size:clamp(3rem,5vw,5rem)`, padding `.5rem 2rem`, same pastel colors, no border).
4. Give each chip a fixed horizontal position (as % of viewport width) and start/end rotation:

| chip | x% | start° | end° (added) |
|---|---|---|---|
| 1 | 15 | -5 | +45 |
| 2 | 72 | 3 | -60 |
| 3 | 35 | -7 | +80 |
| 4 | 85 | 4 | -45 |
| 5 | 25 | 6 | -70 |
| 6 | 58 | -4 | +55 |
| 7 | 45 | 7 | -85 |
| 8 | 78 | -6 | +65 |

   Start position: `top = -150px - index*80px`, `transform: translateX(-50%) rotate(startRotation)`.
5. One GSAP timeline: each chip animates `y` to `window.innerHeight - startTop + 400` and rotates by its end value, `duration:1.4`, `ease:"power1.in"` (accelerating like gravity), with a **0.08s stagger** between chips.
6. On timeline complete: remove both layers, fade the header and footer in (`0.35s`, `power2.out`), add `preloader-complete` to `<body>`, and resolve a promise. **Only then** start the hero text reveal and the carousel entrance (§5.3).
7. Tie the cursor fade-in and physics start to `preloader-complete` (use a `MutationObserver` on the body class or an event).

### 5.2 Skill chips with real physics (Matter.js)
- Chips are **real DOM elements** (`.skill-chip`: `position:absolute; top:0; left:0; inline-flex; align-items:center; gap:.5rem; padding:.25rem 1rem; font-size:clamp(2rem,1.9vw,2.75rem); uppercase; light; tracking -0.03em; hairline-xs border; nowrap; user-select:none; will-change:transform; cursor:grab (grabbing on :active); opacity:0` initially). Each has a 1em lucide icon (stroke-width 1.5) followed by its label.
- Wait for `document.fonts.ready`, then two `requestAnimationFrame`s, so chip sizes are measured **after** the font loads.
- **World setup** (measured from the `#skills-physics` container):
  - `Engine.create({ gravity:{x:-0.015, y:2}, positionIterations:8, velocityIterations:12 })`. Note the tiny negative x gravity, which gently drifts chips left.
  - Three **static walls only**: floor, left wall, right wall (each ~50px thick). **No ceiling**, so chips can fall in from above.
  - One rectangle body per chip, sized to the chip's measured width/height, with: `restitution:.65, friction:.05, frictionAir:.03, frictionStatic:0.0001, slop:.05, density:.15, chamfer:{radius:4}`, a random starting angle in ±0.375 rad, spawn x random within the left half (`rand*(width*.5) + chipWidth/1.75`), and spawn y above the container (`-50 - rand*100 - index*55`).
  - **`Mouse` + `MouseConstraint`** (`stiffness:.2`, invisible) bound to the container, so users can grab, drag and fling chips.
- **Render loop:** a custom `requestAnimationFrame` loop (do not use Matter's Runner or Render) that calls `Engine.update(engine, Math.min(dt, 32))`, then writes `transform: translate(x - w/2, y - h/2) rotate(angle)` onto each chip element and sets `opacity:1`.
- **Hand-off from preloader:** start the physics loop `~2200 + 150 ms` after load (the preloader duration plus a buffer). Chips stay `opacity:0` until then, so the visitor feels the preloader chips "land" into the hero.
- Debounced (100ms) resize handler repositions the floor and right wall.
- Disabled on mobile and for reduced motion.

### 5.3 Entrance animations (after preloader)
- **Headline words:** each word is wrapped in `.line > .word`. Start at `y:100%, opacity:0` (the line's `overflow:hidden` masks them), then animate to `y:0, opacity:1`, `duration:1`, `stagger:.1`, `ease:"power3.out"`.
- **Subline:** `y:20 → 0`, `opacity 0 → 1`, `0.8s`, `power3.out`, delay `0.4s`.
- **Carousel items:** `y:60 → 0`, `opacity 0 → 1`, `0.8s`, `stagger:.12`, `power3.out`.

### 5.4 Pixelated trailing reveal on the headline's second line
**Desktop only.** This is the hover effect on the line (for example "& BUILDER").

*Markup:* the line contains a `.line__original` (the real text) plus **five** `aria-hidden` duplicates `.line__pixelated[data-trail="0..4"]`. Each duplicate sits `position:absolute; top:0; left:0` over the original, has `filter:url(#pixelate)`, `clip-path:circle(0px at 0% 50%)` and `pointer-events:none`. Trail opacities: `1, .7, .5, .3, .15`.

*SVG filter* (define once, hidden `0×0` SVG in the body):
```html
<filter id="pixelate" x="0%" y="0%" width="100%" height="100%">
  <feFlood x="4" y="4" height="2" width="2"/>
  <feComposite id="pixelSize" width="10" height="10"/>
  <feTile result="a"/>
  <feComposite in="SourceGraphic" in2="a" operator="in"/>
  <feMorphology id="pixelDilate" operator="dilate" radius="5"/>
</filter>
```

*Behavior:*
- The `.line--pixelate` wrapper has `cursor:pointer`, and `mouseenter`/`mouseleave` toggle an `active` flag.
- Track the mouse position relative to `.line__original`.
- While active, run a `requestAnimationFrame` loop:
  - The **original text gets a radial-gradient mask with a transparent hole** of radius **45px** at the cursor (`radial-gradient(circle 45px at X Y, transparent 100%, black 100%)`), so the crisp text disappears under the cursor.
  - Each pixelated copy is revealed with `clip-path: circle(R px at X Y)`. The radius shrinks with the trail index: `R = 45 * (1 - index*0.12)`.
  - **Trail:** keep a position history array. Every **2nd frame**, shift the history (`pos[i] = pos[i-1]`) and set `pos[0]` to the current mouse position. Copy *i* uses `pos[i]`, so the pixelated discs lag behind the cursor in a fading comet trail.
- On `mouseleave`: keep looping while shrinking. Multiply the mask radius and every clip radius by `0.85` each frame until `< 2px`, then reset to `circle(0px at 0% 50%)` and stop the loop (cancel the rAF).
- Mobile: remove entirely and show plain text.

### 5.5 Horizontal project carousel
- Container `.hero__carousel`: `display:flex; gap:1rem; overflow-x:auto; overflow-y:hidden; scrollbar hidden (all browsers); padding-right:20px`. Wrapper is `position:relative; overflow:hidden; flex:1`.
- **Cards** `.hero__carousel-item`: `flex:0 0 auto; height:100%; aspect-ratio:3/4; position:relative; overflow:hidden; hairline-xs border`. The cover `<img>` is `object-fit:cover`. A bottom gradient overlay (`linear-gradient(to top, rgba(26,20,15,.8), transparent)`) holds a small index ("01", "02", ...) and the title (`1.5rem`, light).
- **Generate the cards from the projects data array** (index zero-padded to 2 digits) and **append a final external "More Work ↗" card** (lucide `arrow-up-right`, `target="_blank" rel="noopener noreferrer"`).
- **Interaction 1, wheel hijack:** on `wheel`, if `|deltaY| > |deltaX|`, call `preventDefault()` (listener `{passive:false}`) and do `carousel.scrollLeft += deltaY`. Vertical wheel scrolls the strip sideways.
- **Interaction 2, edge auto-scroll:**
  - Track the mouse's normalized X within the carousel, from -1 to 1.
  - Dead zone: `|x| < 0.15` means no movement.
  - Outside it: `speed = sign(x) * ((|x| - 0.15) / (1 - 0.15)) * 8` px per frame, applied in a `requestAnimationFrame` loop while the pointer is inside.
  - Cancel the rAF on `mouseleave`.
- **Interaction 3, scroll indicator:** a 48×48 square at `right:24px; bottom:24px` with a frosted-glass look (`background:rgba(255,251,240,.5); backdrop-filter:blur(12px)`) containing a small arrow/chevron icon, `pointer-events:none`. It **fades out** (opacity 0, 0.3s) when `scrollLeft + clientWidth >= scrollWidth - 10`.
- Drag/scroll must also work with a trackpad (native `overflow-x:auto` stays enabled).

### 5.6 Custom cursor
- Element `.custom-cursor`: `position:fixed; top:0; left:0; 12×12px; background:var(--color-text); pointer-events:none; z-index:9999; transform:translate(-50%,-50%); display:flex; align-items:center; justify-content:center; transition: width .3s ease, height .3s ease`. **It is a square**, not a circle. It contains a `.custom-cursor__label` span (text "View", xs, uppercase, weight 400, cream color, `opacity:0`).
- Add `cursor-active` to `<body>` to hide the native cursor everywhere (`cursor:none` on body, `a` and `button`).
- **Smoothed follow:** on `mousemove` store the raw coordinates. Each GSAP-ticker tick, ease toward them with `lerp = 1 - Math.pow(0.65, gsap.ticker.deltaRatio())`, then `gsap.set(cursor, {x, y})`.
- **Active state:** on `mouseenter` of any `.project-card` or `.hero__carousel-item`, add `.custom-cursor--active` (grows to **100×100px**, and the label fades to opacity 1). Remove it on `mouseleave`.
- Fade the cursor in (0.3s) once `preloader-complete` is set. Fade out on `document mouseleave` (0.2s) and back in on `mouseenter`.
- Hidden entirely on touch (`@media (hover:none)`) and for reduced motion.

### 5.7 Smooth scroll and parallax
- **Lenis:** `duration:1.2`, `easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t))`, `orientation:'vertical'`, `smoothWheel:true`. Connect via `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t*1000))`, with `gsap.ticker.lagSmoothing(0)`. Include the standard Lenis CSS (`html.lenis`, `.lenis-smooth`, `.lenis-stopped`, and so on).
- **Parallax on any `.project-card` image** (used on grid layouts or inner pages): set `scale:1.15`, then tween to `scale:1, y:-30` with `ease:"none"` and a ScrollTrigger (`trigger: card; start:"top bottom"; end:"bottom top"; scrub:true`).
- Home is non-scrolling on desktop, so Lenis matters mainly on About and project pages and on the mobile home.

---

## 6. ACCESSIBILITY, PERFORMANCE, SEO

- Real `<a>` links for every card and nav item (keyboard-focusable with visible `:focus-visible` styling that matches the style). Pixel-trail duplicates are `aria-hidden`. Icons are `aria-hidden`. Every image has meaningful `alt`.
- Respect `prefers-reduced-motion` and touch input (see §4.5).
- Animate **only `transform` and `opacity`** wherever possible. Use `will-change:transform` on chips only. Lazy-load below-the-fold images. Use sized images or `aspect-ratio` to avoid layout shift. Prefer compressed `webp/avif` and short looping `mp4/webm` instead of heavy GIFs.
- Per-page `<title>`, meta description, Open Graph tags and a favicon. Add `sitemap.xml` and `robots.txt`.
- Target Lighthouse **≥ 95** on Performance, Accessibility and SEO on desktop.

---

## 7. DELIVERABLES AND WORKFLOW

1. **Ask me questions first, in this order, and wait for answers:** (a) which tech stack (§2); (b) approval of the headline options, the 8 skill chips and the project list you derived from my resume; (c) whether I have images, videos or mockups for each project; (d) whether to keep the default cream/brown palette and font or use my own. Keep it to a few short questions. If I don't answer, proceed with clearly labelled placeholders and list your assumptions.
2. Produce the full project:
   - file tree
   - `package.json`
   - `vite.config.js` (multi-page inputs)
   - `index.html`, `about/index.html` and one `projects/<slug>/index.html` per project
   - `src/main.js` split into modules: `preloader`, `physics`, `cursor`, `pixelate`, `carousel`, `scroll`, `nav-nudge`, `projects-data`
   - `src/styles/*.css`
3. Show every file in full. Do not elide with "...". The code must run with `npm install && npm run dev` and build with `npm run build`.
4. **Self-test before you finish.** Verify and report on each point:
   - the preloader plays once and hands off cleanly to the physics
   - chips collide, can be dragged and thrown, and never escape the floor or side walls
   - the pixel trail follows and decays smoothly
   - the wheel and edge auto-scroll behave as specified
   - the cursor grows to 100px on cards
   - mobile, tablet and reduced-motion fallbacks work
   - no console errors
5. End with: deploy steps, how to add a new project (edit one array and add one folder), and a short list of tweakable constants (gravity, restitution, trail radius, scroll speed, dead zone, lerp factor).

**Quality bar:** it should feel like a hand-crafted agency-grade portfolio. Be precise with spacing and timing, use no placeholder lorem text in the final design, and add no features beyond this spec unless I ask.
