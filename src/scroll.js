import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { isDesktopWidth, reducedMotion } from './motion.js';

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scroll + parallax. The desktop home page doesn't scroll, so it skips Lenis there. */
export function initScroll(page) {
  if (reducedMotion()) return;
  if (page === 'home' && isDesktopWidth()) return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('.project-card').forEach((card) => {
    const img = card.querySelector('img, video');
    if (!img) return;
    gsap.set(img, { scale: 1.15 });
    gsap.to(img, {
      scale: 1,
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}
