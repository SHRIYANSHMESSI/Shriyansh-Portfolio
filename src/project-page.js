import { gsap } from 'gsap';
import { projects } from './projects-data.js';
import { reducedMotion } from './motion.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

function media(src, alt, lazy = true) {
  if (isVideo(src)) return `<video src="${src}" autoplay loop muted playsinline aria-label="${esc(alt)}"></video>`;
  return `<img src="${src}" alt="${esc(alt)}" ${lazy ? 'loading="lazy"' : ''} decoding="async" />`;
}

function block(b, title) {
  if (b.type === 'heading') return `<h2>${esc(b.content)}</h2>`;
  if (b.type === 'text') return `<p>${esc(b.content)}</p>`;
  if (b.type === 'media') {
    const cap = b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : '';
    return `<figure>${media(b.src, b.alt || title)}${cap}</figure>`;
  }
  if (b.type === 'list') return `<ul class="project__list">${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  if (b.type === 'stats') {
    return `<dl class="project__stats">${b.items
      .map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`)
      .join('')}</dl>`;
  }
  if (b.type === 'story') {
    return `<section class="story">
      <p class="story__label">${esc(b.label || 'Problem I solved')}</p>
      <h3 class="story__title">${esc(b.title)}</h3>
      <div class="story__cols">
        <div><p class="story__head">What went wrong</p><p>${esc(b.problem)}</p></div>
        <div><p class="story__head">How I fixed it</p><p>${esc(b.fix)}</p></div>
      </div>
      ${b.lesson ? `<p class="story__lesson">${esc(b.lesson)}</p>` : ''}
    </section>`;
  }
  return '';
}

function nextLink(p) {
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  if (!next || next === p) return '';
  return `<a class="project__next" href="/projects/${next.slug}/">
    <span class="project__next-label">Next project</span>
    <span class="project__next-title">${esc(next.title)} →</span>
  </a>`;
}

function stackRow(stack) {
  if (!stack || !stack.length) return '';
  return `<ul class="project__stack" aria-label="Tech stack">${stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;
}

/** Renders the case study for <body data-slug="..."> from the projects array. */
export function initProjectPage() {
  const slug = document.body.dataset.slug;
  const p = projects.find((x) => x.slug === slug);
  const root = document.getElementById('project-root');
  if (!p) {
    root.innerHTML = '<h1 class="project__title">Project not found</h1>';
    return;
  }

  document.title = `${p.title} — Portfolio`;
  const hero = p.hero || p.cover;
  root.innerHTML = `
    <h1 class="project__title">${esc(p.title)}</h1>
    <p class="project__role">${esc(p.role)}</p>
    <p class="project__description">${esc(p.description)}</p>
    ${stackRow(p.stack)}
    <div class="project__hero">${
      hero ? media(hero, p.title, false) : `<div class="placeholder-cover" style="--ph:${p.tint || 'var(--color-bg-alt)'}"><span>Project image needed</span></div>`
    }</div>
    <div class="project__body">${p.blocks.map((b) => block(b, p.title)).join('')}</div>
    ${nextLink(p)}`;

  if (!reducedMotion()) {
    gsap.from('.project__title, .project__role, .project__description, .project__stack, .project__hero', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }
}
