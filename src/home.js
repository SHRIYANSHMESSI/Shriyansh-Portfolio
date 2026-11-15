import { gsap } from 'gsap';
import { site, skills, projects } from './projects-data.js';
import { renderIcons } from './icons.js';
import { runPreloader } from './preloader.js';
import { createPhysics } from './physics.js';
import { initPixelate } from './pixelate.js';
import { initCarousel } from './carousel.js';
import { isDesktopWidth, isDesktopMotion, physicsAllowed, reducedMotion, watch, nextFrame } from './motion.js';

const TRAIL_COPIES = 5;
const SEEN_KEY = 'preloader-seen';

function preloaderSeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
function markPreloaderSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked: preloader just replays */ }
}
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

function media(src, alt, eager) {
  if (isVideo(src)) return `<video src="${src}" autoplay loop muted playsinline aria-label="${esc(alt)}"></video>`;
  return `<img src="${src}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async" />`;
}

function renderHeadline() {
  const h1 = document.querySelector('[data-headline]');
  const [line1, line2] = site.headline;
  const words = (text) => text.split(' ').map((w) => `<span class="word">${esc(w)}</span>`).join(' ');
  const copies = Array.from({ length: TRAIL_COPIES }, (_, i) =>
    `<span class="line__pixelated" data-trail="${i}" aria-hidden="true">${esc(line2)}</span>`
  ).join('');
  h1.innerHTML =
    `<span class="line">${words(line1)}</span>` +
    `<span class="line line--pixelate"><span class="line__original">${words(line2)}</span>${copies}</span>`;
  h1.setAttribute('aria-label', `${line1} ${line2}`);

  document.querySelector('[data-subline]').innerHTML = site.subline.map((l) => `<span>${esc(l)}</span>`).join('');
}

function renderSkills() {
  document.getElementById('skills-physics').innerHTML = skills
    .map((s, i) => `<span class="skill-chip" data-chip="${(i % 8) + 1}"><i data-lucide="${s.icon}"></i>${esc(s.label)}</span>`)
    .join('');
}

function renderCarousel() {
  const cards = projects.map((p, i) => {
    const cover = p.cover
      ? media(p.cover, p.title, i < 3)
      : `<div class="placeholder-cover" style="--ph:${p.tint || 'var(--color-bg-alt)'}"><span>Cover image needed</span></div>`;
    return `<a class="hero__carousel-item" href="/projects/${p.slug}/">
      ${cover}
      <div class="hero__carousel-overlay">
        <span class="hero__carousel-index">${pad(i + 1)}</span>
        <span class="hero__carousel-title">${esc(p.title)}</span>
      </div>
    </a>`;
  });
  cards.push(`<a class="hero__carousel-item hero__carousel-item--more" href="${site.moreWork}" target="_blank" rel="noopener noreferrer">
    <span class="more-work">More Work <i data-lucide="arrow-up-right"></i></span>
  </a>`);
  document.getElementById('carousel').innerHTML = cards.join('');
}

function revealDesktop() {
  gsap.fromTo('.hero__title .word', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' });
  gsap.fromTo('.hero__subline', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' });
  gsap.fromTo('.hero__carousel-item', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
}

function revealMobile() {
  gsap.fromTo('.hero__title .word', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
  gsap.fromTo('.hero__subline', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.25, ease: 'power3.out' });

  const items = document.querySelectorAll('.hero__carousel-item');
  gsap.set(items, { y: 30, opacity: 0 });
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      if (!visible.length) return;
      gsap.to(visible, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
      visible.forEach((el) => io.unobserve(el));
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

export async function initHome() {
  renderHeadline();
  renderSkills();
  renderCarousel();
  renderIcons();
  initCarousel(document.querySelector('.hero__carousel-wrap'));

  const done = () => document.body.classList.add('preloader-complete');

  if (reducedMotion()) {
    document.documentElement.classList.remove('home-pending');
    document.body.classList.add('static-chips');
    document.documentElement.classList.remove('motion-pending');
    done();
    return;
  }

  // Hide the reveal targets right away so they don't show once and then pop in.
  gsap.set(['.hero__title .word', '.hero__subline'], { opacity: 0 });
  if (isDesktopWidth()) gsap.set('.hero__carousel-item', { opacity: 0 });
  document.documentElement.classList.remove('home-pending');

  // Measure chips only after the font has loaded.
  await document.fonts.ready;
  await nextFrame();
  await nextFrame();

  if (isDesktopWidth() && !preloaderSeen()) {
    // The chip rain plays once per tab; coming back to home just reveals the content.
    await runPreloader();
    markPreloaderSeen();
    revealDesktop();
  } else {
    document.documentElement.classList.remove('motion-pending');
    done();
    isDesktopWidth() ? revealDesktop() : revealMobile();
  }

  // Physics: on for wide screens, torn down when the layout goes mobile.
  const physics = createPhysics(document.getElementById('skills-physics'));
  if (physicsAllowed()) physics.start();
  watch(physicsAllowed, (on) => (on ? physics.start() : physics.stop()));

  // Pixel trail: desktop with hover only.
  const pixelate = initPixelate(document.querySelector('.line--pixelate'));
  pixelate.setEnabled(isDesktopMotion());
  watch(isDesktopMotion, (on) => pixelate.setEnabled(on));
}
