import { gsap } from 'gsap';
import { hasHover, reducedMotion } from './motion.js';

const TARGETS = '.project-card, .hero__carousel-item';
const POS_KEY = 'cursor-pos';

/** Square cursor that eases after the pointer and grows into a "View" disc over projects. */
export function initCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor || !hasHover() || reducedMotion()) return;

  document.body.classList.add('cursor-active');
  // Start where the pointer was on the previous page, so the cursor doesn't fly in from the centre.
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(POS_KEY)); } catch { /* ignore */ }
  const target = saved && Number.isFinite(saved.x) ? { x: saved.x, y: saved.y } : { x: innerWidth / 2, y: innerHeight / 2 };
  const pos = { ...target };
  gsap.set(cursor, { x: pos.x, y: pos.y });
  let visible = false;

  addEventListener('pagehide', () => {
    try { sessionStorage.setItem(POS_KEY, JSON.stringify(target)); } catch { /* ignore */ }
  });

  addEventListener('mousemove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  });

  gsap.ticker.add(() => {
    // Nothing to do once the cursor has caught up with the pointer.
    if (Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1) return;
    const lerp = 1 - Math.pow(0.65, gsap.ticker.deltaRatio());
    pos.x += (target.x - pos.x) * lerp;
    pos.y += (target.y - pos.y) * lerp;
    gsap.set(cursor, { x: pos.x, y: pos.y });
  });

  // Coming from another page the cursor is already on screen, so show it at once.
  const show = () => {
    visible = true;
    if (saved) gsap.set(cursor, { opacity: 1 });
    else gsap.to(cursor, { opacity: 1, duration: 0.3 });
  };
  if (document.body.classList.contains('preloader-complete')) show();
  else {
    const mo = new MutationObserver(() => {
      if (document.body.classList.contains('preloader-complete')) {
        mo.disconnect();
        show();
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.2 }));
  document.addEventListener('mouseenter', () => visible && gsap.to(cursor, { opacity: 1, duration: 0.2 }));

  // Delegated so cards rendered later still work.
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(TARGETS)) cursor.classList.add('custom-cursor--active');
  });
  document.addEventListener('mouseout', (e) => {
    const from = e.target.closest(TARGETS);
    if (from && !from.contains(e.relatedTarget)) cursor.classList.remove('custom-cursor--active');
  });
}
