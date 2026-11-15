const mq = {
  desktop: matchMedia('(min-width: 769px)'),
  hover: matchMedia('(hover: hover)'),
  reduced: matchMedia('(prefers-reduced-motion: reduce)'),
};

export const isDesktopWidth = () => mq.desktop.matches;
export const hasHover = () => mq.hover.matches;
export const reducedMotion = () => mq.reduced.matches;

/** Desktop-only hover effects: wide screen, real hover, motion allowed. */
export const isDesktopMotion = () => isDesktopWidth() && hasHover() && !reducedMotion();

/** Physics also runs on wide touch tablets. */
export const physicsAllowed = () => isDesktopWidth() && !reducedMotion();

/** Calls cb(value) whenever getter() flips, on resize / orientation / preference changes. */
export function watch(getter, cb) {
  let prev = getter();
  const check = () => {
    const next = getter();
    if (next !== prev) {
      prev = next;
      cb(next);
    }
  };
  addEventListener('resize', check);
  addEventListener('orientationchange', check);
  Object.values(mq).forEach((m) => m.addEventListener('change', check));
}

export const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
