import { site } from './projects-data.js';

const ENDPOINT = 'https://api.web3forms.com/submit';

/** Contact form → Web3Forms (emails the message to site.contactEmail), with hCaptcha + honeypot. */
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.contact-form__status');
  const button = form.querySelector('.contact-form__submit');

  const say = (text, kind = '') => {
    status.textContent = text;
    status.dataset.kind = kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Bots tick the hidden checkbox; quietly pretend it worked.
    if (form.botcheck.checked) {
      form.reset();
      say('Thanks, your message is on its way.', 'ok');
      return;
    }

    const captcha = form.querySelector('[name="h-captcha-response"]');
    if (!captcha || !captcha.value) {
      say('Please complete the captcha first.', 'error');
      return;
    }

    if (!site.web3formsKey || site.web3formsKey.startsWith('YOUR_')) {
      say('The form isn’t connected yet. Please email or call me instead.', 'error');
      return;
    }

    const data = new FormData(form);
    data.append('access_key', site.web3formsKey);
    data.append('subject', `New portfolio message from ${data.get('name')}`);
    data.append('from_name', 'Portfolio contact form');
    data.delete('botcheck');

    button.disabled = true;
    say('Sending…');

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Something went wrong.');
      form.reset();
      window.hcaptcha?.reset();
      say('Thanks, your message is on its way. I’ll get back to you soon.', 'ok');
    } catch (err) {
      say(`Couldn’t send: ${err.message} You can also email ${site.email}.`, 'error');
      window.hcaptcha?.reset();
    } finally {
      button.disabled = false;
    }
  });
}
