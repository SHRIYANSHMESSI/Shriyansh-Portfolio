import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

// Tweakable constants
export const PHYSICS = {
  gravity: { x: -0.015, y: 2 },
  restitution: 0.65,
  friction: 0.05,
  frictionAir: 0.03,
  density: 0.15,
  wall: 50,
};

const MOUSE_EVENTS = ['mousemove', 'mousedown', 'mouseup', 'wheel', 'mousewheel', 'DOMMouseScroll', 'touchmove', 'touchstart', 'touchend'];
const MOUSE_HANDLERS = {
  mousemove: 'mousemove', mousedown: 'mousedown', mouseup: 'mouseup',
  wheel: 'mousewheel', mousewheel: 'mousewheel', DOMMouseScroll: 'mousewheel',
  touchmove: 'mousemove', touchstart: 'mousedown', touchend: 'mouseup',
};

/** Real 2D physics for DOM skill chips. start()/stop() can be called repeatedly. */
export function createPhysics(container) {
  let engine, mouse, floor, rightWall, raf, last, items, resizeTimer;

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!engine) return;
      const W = container.clientWidth;
      const H = container.clientHeight;
      Body.setPosition(floor, { x: W / 2, y: H + PHYSICS.wall / 2 });
      Body.setPosition(rightWall, { x: W + PHYSICS.wall / 2, y: H / 2 - H });
    }, 100);
  }

  function tick(t) {
    const dt = last ? t - last : 1000 / 60;
    last = t;
    Engine.update(engine, Math.min(dt, 1000 / 60));
    for (const item of items) {
      const { el, body, w, h } = item;
      const { x, y } = body.position;
      // Resting chips don't move, so skip the style write (saves a style recalc every frame).
      if (Math.abs(x - item.x) < 0.05 && Math.abs(y - item.y) < 0.05 && Math.abs(body.angle - item.a) < 0.0005) continue;
      item.x = x; item.y = y; item.a = body.angle;
      el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${body.angle}rad)`;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (engine) return;
    const W = container.clientWidth;
    const H = container.clientHeight;
    if (!W || !H) return;

    engine = Engine.create({ gravity: PHYSICS.gravity, positionIterations: 8, velocityIterations: 12 });
    const t = PHYSICS.wall;
    const tall = H * 4; // walls extend upward: no ceiling, chips fall in from above
    floor = Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true });
    const leftWall = Bodies.rectangle(-t / 2, H / 2 - H, t, tall, { isStatic: true });
    rightWall = Bodies.rectangle(W + t / 2, H / 2 - H, t, tall, { isStatic: true });

    const chips = [...container.querySelectorAll('.skill-chip')];
    items = chips.map((el, i) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = Math.min(Math.random() * (W * 0.5) + w / 1.75, Math.max(w / 2, W - w / 2));
      const y = -50 - Math.random() * 100 - i * 55;
      const body = Bodies.rectangle(x, y, w, h, {
        restitution: PHYSICS.restitution,
        friction: PHYSICS.friction,
        frictionAir: PHYSICS.frictionAir,
        frictionStatic: 0.0001,
        slop: 0.05,
        density: PHYSICS.density,
        chamfer: { radius: 4 },
        angle: (Math.random() - 0.5) * 0.75,
      });
      el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`;
      el.style.opacity = '1';
      return { el, body, w, h, x: NaN, y: NaN, a: NaN };
    });

    mouse = Mouse.create(container);
    // Let the page keep its own wheel behaviour.
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach((e) => container.removeEventListener(e, mouse.mousewheel));
    const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });

    Composite.add(engine.world, [floor, leftWall, rightWall, ...items.map((i) => i.body), mc]);
    addEventListener('resize', onResize);
    last = 0;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (!engine) return;
    cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
    MOUSE_EVENTS.forEach((e) => container.removeEventListener(e, mouse[MOUSE_HANDLERS[e]]));
    Composite.clear(engine.world, false);
    Engine.clear(engine);
    items.forEach(({ el }) => { el.style.transform = ''; el.style.opacity = ''; });
    engine = mouse = items = null;
  }

  return { start, stop };
}
