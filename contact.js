// contact.js
const WORKER_URL = 'https://contact-worker.ukjbowman.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('contact-submit');
  const successMsg = document.getElementById('contact-success');
  const errorMsg   = document.getElementById('contact-error');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    successMsg.hidden = true;
    errorMsg.hidden   = true;

    const payload = {
      name:      document.getElementById('cf-name').value.trim(),
      email:     document.getElementById('cf-email').value.trim(),
      subject:   document.getElementById('cf-subject').value,
      message:   document.getElementById('cf-message').value.trim(),
      honeypot:  document.getElementById('cf-website').value, // bot trap
    };

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res  = await fetch(WORKER_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        successMsg.hidden = false;
        form.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        errorMsg.textContent = data.error || 'Something went wrong. Please try again.';
        errorMsg.hidden      = false;
      }
    } catch {
      errorMsg.textContent = 'Could not send your message. Check your connection and try again.';
      errorMsg.hidden      = false;
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send message';
    }
  });
});
