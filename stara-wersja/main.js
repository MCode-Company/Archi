// ==========================================================
// Linki do mediów społecznościowych – uzupełnij tutaj,
// podmienią się na wszystkich stronach (elementy z data-social).
// ==========================================================
const SOCIAL = {
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  pinterest: 'https://pinterest.com/',
  linkedin: 'https://linkedin.com/',
  behance: 'https://behance.net/'
};

document.querySelectorAll('[data-social]').forEach((a) => {
  const url = SOCIAL[a.dataset.social];
  if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
  else { a.remove(); } // pusty link = ikona znika
});

// ---------- Rok w stopce ----------
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// ---------- Filtr portfolio ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const tiles = document.querySelectorAll('.tile[data-cat]');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    tiles.forEach((t) => { t.hidden = !(f === 'all' || t.dataset.cat === f); });
  });
});

// ---------- Fallback animacji dla przeglądarek bez scroll-driven animations ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasSDA = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');

if (!hasSDA && !reduceMotion) {
  document.documentElement.classList.add('no-sda');

  // Wjeżdżające sekcje
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Paralaksa
  const layers = [...document.querySelectorAll('.parallax')];
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((el) => {
      const box = el.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) return;
      const progress = (box.top + box.height) / (vh + box.height); // 1 → 0
      const shift = (0.5 - progress) * 18; // -9% … 9%
      el.style.transform = `translateY(${shift}%) scale(1.18)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ---------- Formularz (podłącz własny backend, np. Formspree / Netlify Forms / API) ----------
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    // TODO: wyślij dane, np. fetch(form.action, { method: 'POST', body: new FormData(form) })
    status.textContent = 'Dziękuję! Odpowiem najszybciej, jak to możliwe.';
    form.reset();
  });
}
