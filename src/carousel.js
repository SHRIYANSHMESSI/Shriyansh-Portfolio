import { isDesktopWidth, hasHover } from './motion.js';

// Tweakable constants
const DEAD_ZONE = 0.15; // centre area (normalised) with no auto-scroll
const MAX_SPEED = 8; // px per frame at the very edge

/** Horizontal carousel: wheel → sideways, edge auto-scroll, end-of-strip indicator. */
export function initCarousel(wrap) {
  const carousel = wrap.querySelector('.hero__carousel');
  const indicator = wrap.querySelector('.carousel-indicator');
  let nx = 0;
  let raf = null;

  const updateIndicator = () => {
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
    indicator?.classList.toggle('is-hidden', atEnd);
  };

  carousel.addEventListener(
    'wheel',
    (e) => {
      if (!isDesktopWidth()) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        carousel.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  function step() {
    const mag = Math.abs(nx);
    if (mag > DEAD_ZONE) {
      carousel.scrollLeft += Math.sign(nx) * ((mag - DEAD_ZONE) / (1 - DEAD_ZONE)) * MAX_SPEED;
    }
    raf = requestAnimationFrame(step);
  }

  carousel.addEventListener('mousemove', (e) => {
    if (!isDesktopWidth() || !hasHover()) return;
    const rect = carousel.getBoundingClientRect();
    nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(step);
  });

  carousel.addEventListener('mouseleave', () => {
    cancelAnimationFrame(raf);
    raf = null;
    nx = 0;
  });

  carousel.addEventListener('scroll', updateIndicator, { passive: true });
  addEventListener('resize', updateIndicator);
  updateIndicator();
}
