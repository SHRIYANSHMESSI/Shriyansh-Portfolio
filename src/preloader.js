import { gsap } from 'gsap';

// x position (% of viewport), start rotation, rotation added while falling.
const DROPS = [
  { x: 15, start: -5, end: 45 },
  { x: 72, start: 3, end: -60 },
  { x: 35, start: -7, end: 80 },
  { x: 85, start: 4, end: -45 },
  { x: 25, start: 6, end: -70 },
  { x: 58, start: -4, end: 55 },
  { x: 45, start: 7, end: -85 },
  { x: 78, start: -6, end: 65 },
  { x: 8, start: 5, end: 50 },
  { x: 92, start: -3, end: -75 },
];

/** "Raining chips" preloader. Resolves once the overlay is gone. */
export function runPreloader() {
  return new Promise((resolve) => {
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.home-footer');
    gsap.set([header, footer], { opacity: 0 });

    const overlay = document.createElement('div');
    overlay.className = 'preloader';
    const clip = document.createElement('div');
    clip.className = 'preloader-clip';
    clip.setAttribute('aria-hidden', 'true');
    document.body.append(overlay, clip);
    document.documentElement.classList.remove('motion-pending');

    const chips = [...document.querySelectorAll('#skills-physics .skill-chip')];
    const tl = gsap.timeline({
      onComplete() {
        overlay.remove();
        clip.remove();
        gsap.to([header, footer], { opacity: 1, duration: 0.35, ease: 'power2.out' });
        document.body.classList.add('preloader-complete');
        resolve();
      },
    });

    chips.forEach((chip, i) => {
      const cfg = DROPS[i % DROPS.length];
      const clone = chip.cloneNode(true);
      clone.className = 'preloader-chip';
      clone.removeAttribute('style');
      const startTop = -150 - i * 80;
      clone.style.top = `${startTop}px`;
      clone.style.left = `${cfg.x}%`;
      clip.appendChild(clone);
      gsap.set(clone, { xPercent: -50, rotation: cfg.start });
      tl.to(
        clone,
        { y: window.innerHeight - startTop + 400, rotation: cfg.start + cfg.end, duration: 1.4, ease: 'power1.in' },
        i * 0.08
      );
    });

    if (!chips.length) tl.to({}, { duration: 0.1 });
  });
}
