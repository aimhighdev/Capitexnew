/* CAPITEX — main.js */
document.addEventListener('DOMContentLoaded', () => {

  // ─── Year ─────────────────────────────────────────────
  document.querySelectorAll('.year-auto').forEach(el => { el.textContent = new Date().getFullYear(); });

  // ─── Menu panel ───────────────────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const menuPanel = document.getElementById('menuPanel');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const menuClose = document.getElementById('menuClose');

  function openMenu() {
    menuPanel && menuPanel.classList.add('open');
    menuBackdrop && menuBackdrop.classList.add('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuPanel && menuPanel.classList.remove('open');
    menuBackdrop && menuBackdrop.classList.remove('open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  menuBtn && menuBtn.addEventListener('click', openMenu);
  menuClose && menuClose.addEventListener('click', closeMenu);
  menuBackdrop && menuBackdrop.addEventListener('click', closeMenu);

  // ─── Back to top ──────────────────────────────────────
  const toTop = document.querySelector('.to-top');
  window.addEventListener('scroll', () => {
    toTop && toTop.classList.toggle('show', window.scrollY > 400);
  });
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ─── Scroll reveal ────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // ─── Count-up ─────────────────────────────────────────
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    countEls.forEach(el => co.observe(el));
  }

  // ─── Chat widget ──────────────────────────────────────
  const chatFab = document.getElementById('chatFab');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');

  chatFab && chatFab.addEventListener('click', () => chatPanel && chatPanel.classList.toggle('open'));
  chatClose && chatClose.addEventListener('click', () => chatPanel && chatPanel.classList.remove('open'));

  chatForm && chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = chatForm.querySelector('button[type=submit]');
    btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      await fetch('https://formspree.io/f/xpwboyrv', {
        method: 'POST', headers: { 'Accept': 'application/json' },
        body: new FormData(chatForm)
      });
      showToast('Message sent! We'll respond shortly.');
      chatForm.reset();
      chatPanel.classList.remove('open');
    } catch { showToast('Failed to send. Please try again.'); }
    btn.textContent = 'Send Message'; btn.disabled = false;
  });

  // ─── Formspree forms ──────────────────────────────────
  document.querySelectorAll('form[data-formspree]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…'; btn.disabled = true;
      try {
        const r = await fetch(`https://formspree.io/f/${form.dataset.formspree}`, {
          method: 'POST', headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (r.ok) { showToast('Submitted! We'll be in touch soon.'); form.reset(); }
        else showToast('Something went wrong. Please try again.');
      } catch { showToast('Network error. Please try again.'); }
      btn.textContent = orig; btn.disabled = false;
    });
  });

  // ─── Toast ────────────────────────────────────────────
  window.showToast = function(msg, duration = 3500) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  };

});
