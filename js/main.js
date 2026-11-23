// ==========================================================
// Linki do mediów społecznościowych – uzupełnij tutaj.
// Pusty link = pozycja znika ze stopki.
// ==========================================================
const SOCIAL = {
  instagram: 'https://instagram.com/',
  pinterest: 'https://pinterest.com/',
  behance: 'https://behance.net/',
  linkedin: 'https://linkedin.com/'
};

document.querySelectorAll('[data-social]').forEach((a) => {
  const url = SOCIAL[a.dataset.social];
  if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
  else { a.closest('li')?.remove(); }
});

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Nagłówek: tło po przewinięciu, chowanie przy scrollu w dół ----------
const header = document.querySelector('[data-header]');
let lastY = window.scrollY;
const onScrollHeader = () => {
  const y = window.scrollY;
  const heroH = window.innerHeight * 0.85;
  header.classList.toggle('is-solid', y > heroH - 84);
  header.classList.toggle('is-hidden', y > lastY && y > heroH);
  lastY = y;
};
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

// ---------- Menu mobilne ----------
const menu = document.getElementById('menu');
const openBtn = document.querySelector('[data-menu-open]');
const setMenu = (open) => {
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
};
openBtn?.addEventListener('click', () => setMenu(true));
document.querySelectorAll('[data-menu-close], #menu nav a').forEach((el) => el.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

// ---------- Pokaz zdjęć w hero ----------
const slides = [...document.querySelectorAll('.hero-slide')];
if (slides.length) {
  const count = document.querySelector('[data-count]');
  const name = document.querySelector('[data-slide-name]');
  const bar = document.querySelector('[data-bar]');
  const pad = (n) => String(n).padStart(2, '0');
  let i = 0;
  const show = (n) => {
    slides[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    count.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
    name.textContent = slides[i].dataset.name;
    bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
  };
  if (!reduceMotion) {
    bar.classList.add('run');
    setInterval(() => show(i + 1), 6000);
  }
}

// ---------- Filtr realizacji ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project[data-cat]');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    projects.forEach((p) => { p.hidden = !(f === 'all' || p.dataset.cat === f); });
  });
});

// ---------- Animacje wejścia ----------
const revealEls = document.querySelectorAll('.reveal, .unveil, [data-split]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));

  // Zabezpieczenie: gdyby observer nie zadziałał, pokaż to, co jest już na ekranie
  const check = () => {
    const vh = window.innerHeight;
    revealEls.forEach((el) => {
      if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < vh * 0.95) el.classList.add('is-visible');
    });
  };
  window.addEventListener('load', check);
  window.addEventListener('scroll', () => requestAnimationFrame(check), { passive: true });
  setTimeout(check, 600);
}

// ---------- Paralaksa zdjęć ----------
const layers = [...document.querySelectorAll('.parallax-img')];
if (!reduceMotion && layers.length) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((img) => {
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) return;
      const progress = (box.top + box.height) / (vh + box.height); // 1 → 0
      img.style.transform = `translateY(${(0.5 - progress) * 14}%)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ---------- Lightbox galerii projektu ----------
const lb = document.querySelector('[data-lightbox]');
if (lb) {
  const imgs = [...document.querySelectorAll('[data-gallery] .zoom img')];
  const big = lb.querySelector('img');
  const counter = lb.querySelector('[data-lb-count]');
  let cur = 0; let opener = null;
  const big2 = (src) => src.replace(/w=\d+/, 'w=2400');
  const render = () => {
    big.src = big2(imgs[cur].currentSrc || imgs[cur].src);
    big.alt = imgs[cur].alt;
    counter.textContent = `${cur + 1} / ${imgs.length}`;
  };
  const open = (n) => {
    cur = n; render(); opener = document.activeElement;
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  };
  const close = () => {
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; opener?.focus();
  };
  const step = (d) => { cur = (cur + d + imgs.length) % imgs.length; render(); };
  imgs.forEach((img, n) => img.closest('.zoom').addEventListener('click', () => open(n)));
  lb.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lb]')?.dataset.lb;
    if (a === 'close' || e.target === lb) close();
    if (a === 'prev') step(-1);
    if (a === 'next') step(1);
  });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

// ---------- Formularz (podłącz backend, np. Formspree albo funkcja na Vercelu) ----------
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    // TODO: fetch(form.action, { method: 'POST', body: new FormData(form) })
    status.textContent = 'Dziękuję! Odezwę się w ciągu dwóch dni roboczych.';
    form.reset();
  });
}
