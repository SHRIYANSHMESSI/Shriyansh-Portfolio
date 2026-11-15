import { initCursor } from './cursor.js';
import { initScroll } from './scroll.js';

const page = document.body.dataset.page;

// Each page only loads the code it needs (the home page's physics, preloader and
// carousel stay off the about, contact and project pages).
if (page === 'home') {
  import('./home.js').then((m) => m.initHome());
} else {
  if (page === 'project') import('./project-page.js').then((m) => m.initProjectPage());
  if (page === 'contact') import('./contact-form.js').then((m) => m.initContactForm());
  document.body.classList.add('preloader-complete');
}

initCursor();
initScroll(page);
