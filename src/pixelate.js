// Tweakable constants
const RADIUS = 45; // px, size of the reveal disc
const SHRINK = 0.12; // radius drop per trail copy
const DECAY = 0.85; // shrink factor per frame after mouseleave

/** Pixelated trailing reveal under the cursor on the headline's second line. */
export function initPixelate(line) {
  const original = line.querySelector('.line__original');
  const copies = [...line.querySelectorAll('.line__pixelated')];
  const mouse = { x: 0, y: 0 };
  let pos = copies.map(() => ({ x: 0, y: 0 }));
  let enabled = false;
  let active = false;
  let scale = 0;
  let frame = 0;
  let raf = null;

  const setMask = (value) => {
    original.style.maskImage = value;
    original.style.webkitMaskImage = value;
  };

  function reset() {
    setMask('');
    // Hidden copies skip the SVG filter entirely, which is expensive to paint.
    copies.forEach((c) => {
      c.style.clipPath = 'circle(0px at 0% 50%)';
      c.style.visibility = 'hidden';
    });
    cancelAnimationFrame(raf);
    raf = null;
    scale = 0;
  }

  function loop() {
    frame++;
    if (active) {
      scale = 1;
      if (frame % 2 === 0) {
        for (let i = pos.length - 1; i > 0; i--) pos[i] = { ...pos[i - 1] };
        pos[0] = { ...mouse };
      }
    } else {
      scale *= DECAY;
      if (RADIUS * scale < 2) return reset();
    }

    const r = RADIUS * scale;
    setMask(`radial-gradient(circle ${r}px at ${mouse.x}px ${mouse.y}px, transparent 100%, black 100%)`);
    copies.forEach((c, i) => {
      c.style.clipPath = `circle(${RADIUS * (1 - i * SHRINK) * scale}px at ${pos[i].x}px ${pos[i].y}px)`;
    });
    raf = requestAnimationFrame(loop);
  }

  function track(e) {
    const rect = original.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  line.addEventListener('mouseenter', (e) => {
    if (!enabled) return;
    track(e);
    if (!raf) {
      pos = copies.map(() => ({ ...mouse }));
      copies.forEach((c) => (c.style.visibility = ''));
    }
    active = true;
    if (!raf) raf = requestAnimationFrame(loop);
  });
  line.addEventListener('mousemove', (e) => enabled && track(e));
  line.addEventListener('mouseleave', () => (active = false));

  reset();

  return {
    setEnabled(on) {
      enabled = on;
      if (!on) {
        active = false;
        reset();
      }
    },
  };
}
