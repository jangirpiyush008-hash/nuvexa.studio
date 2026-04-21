// Nuvexa — Sentinel-inspired interactions

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLenis();
  initCursor();
  initNav();
  initMobileMenu();
  initProgress();
  initReveal();
  initCounters();
  initNeedsPicker();
  initPinnedServices();
  initMarqueeClone();
  initTestimonialsLoop();
  initAccordion();
  initYear();
});

/* ───── Preloader ───── */
function initPreloader() {
  const pre = document.querySelector('.preloader');
  if (!pre) return;
  const spans = pre.querySelectorAll('.preloader__inner span');
  const dot = pre.querySelector('.preloader__dot');
  if (!window.gsap) { pre.style.display = 'none'; return; }
  const tl = gsap.timeline();
  tl.to(spans, { y: 0, duration: 0.85, stagger: 0.05, ease: 'expo.out' })
    .to(dot, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, '-=0.3')
    .to(pre, { autoAlpha: 0, duration: 0.6, ease: 'power3.inOut', delay: 0.45, onComplete: () => pre.remove() });
}

/* ───── Lenis smooth scroll ───── */
let lenis;
function initLenis() {
  if (!window.Lenis) return;
  lenis = new Lenis({ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1.1, touchMultiplier: 1.6 });
  lenis.on('scroll', () => { if (window.ScrollTrigger) ScrollTrigger.update(); });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  if (window.gsap) gsap.ticker.lagSmoothing(0);
}

/* ───── Custom cursor ───── */
function initCursor() {
  if (window.matchMedia('(max-width: 900px), (hover: none)').matches) return;
  const c = document.createElement('div');
  c.className = 'cursor';
  document.body.append(c);
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  const loop = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    c.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  const selector = 'a, button, .chip, .btn, .work-card, .module, .tool, .nav__cta, .nav__academy, .testimonial';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(selector)) c.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(selector)) c.classList.remove('hover');
  });
}

/* ───── Nav scrolled state ───── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => { nav.classList.toggle('scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ───── Mobile menu ───── */
function initMobileMenu() {
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ───── Scroll progress ───── */
function initProgress() {
  const bar = document.querySelector('.progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / h) * 100) + '%';
  }, { passive: true });
}

/* ───── Reveal on scroll ───── */
function initReveal() {
  if (!window.gsap || !window.ScrollTrigger) return;

  document.querySelectorAll('.r-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });

  document.querySelectorAll('.r-in').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });

  // Split words
  document.querySelectorAll('[data-split]').forEach(el => {
    const words = el.innerHTML.trim().split(/(<[^>]+>|\s+)/).filter(Boolean);
    let html = '';
    words.forEach(w => {
      if (w.match(/<[^>]+>/) || w.match(/^\s+$/)) html += w;
      else html += `<span class="split-w" style="display:inline-block;overflow:hidden;vertical-align:top;"><span style="display:inline-block;transform:translateY(110%);">${w}</span></span> `;
    });
    el.innerHTML = html;
  });
  document.querySelectorAll('[data-split]').forEach(el => {
    const inner = el.querySelectorAll('.split-w > span');
    gsap.to(inner, {
      y: 0, duration: 1, stagger: 0.04, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
}

/* ───── Counters ───── */
function initCounters() {
  if (!window.gsap || !window.ScrollTrigger) return;
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            const val = target >= 100 ? Math.floor(obj.v) : obj.v.toFixed(1);
            el.textContent = prefix + val + suffix;
          }
        });
      }
    });
  });
}

/* ───── Needs picker ───── */
function initNeedsPicker() {
  const picker = document.querySelector('.needs__chips');
  const summary = document.querySelector('.needs__summary-value');
  const submit = document.querySelector('.needs__submit');
  if (!picker || !summary || !submit) return;

  const chips = picker.querySelectorAll('.chip');
  const state = new Set();

  const render = () => {
    const labels = [...state].map(id => picker.querySelector(`[data-need="${id}"]`)?.dataset.label).filter(Boolean);
    if (labels.length === 0) {
      summary.textContent = 'Nothing selected yet — pick one or many.';
      submit.classList.remove('active');
    } else {
      summary.textContent = labels.join(' · ');
      submit.classList.add('active');
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.need;
      if (state.has(id)) { state.delete(id); chip.classList.remove('selected'); }
      else { state.add(id); chip.classList.add('selected'); }
      render();
    });
  });

  submit.addEventListener('click', () => {
    if (state.size === 0) return;
    const qs = [...state].join(',');
    window.location.href = `contact.html?needs=${encodeURIComponent(qs)}`;
  });

  render();
}

/* ───── Pinned services (Apple-style scrub) ───── */
function initPinnedServices() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const section = document.querySelector('.services-pin');
  if (!section) return;
  const slides = section.querySelectorAll('.services-pin__slide');
  const visuals = section.querySelectorAll('.services-pin__visual');
  const bars = section.querySelectorAll('.services-pin__progress-bar');
  const counter = section.querySelector('.services-pin__counter-current');
  const total = slides.length;
  if (!total) return;

  const setActive = (i) => {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    visuals.forEach((v, idx) => v.classList.toggle('active', idx === i));
    bars.forEach((b, idx) => {
      b.classList.toggle('active', idx === i);
      b.classList.toggle('done', idx < i);
    });
    if (counter) counter.textContent = String(i + 1).padStart(2, '0');
  };

  setActive(0);

  if (window.matchMedia('(max-width: 900px)').matches) {
    // On mobile, activate on scroll into view
    slides.forEach((s, i) => {
      ScrollTrigger.create({
        trigger: s,
        start: 'top 70%',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      });
    });
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * total}`,
    pin: '.services-pin__sticky',
    scrub: 0.5,
    invalidateOnRefresh: true,
    onUpdate: (st) => {
      const i = Math.min(total - 1, Math.floor(st.progress * total));
      setActive(i);
    }
  });
}

/* ───── Marquee duplicate ───── */
function initMarqueeClone() {
  document.querySelectorAll('.ticker__track').forEach(tr => {
    tr.innerHTML += tr.innerHTML;
  });
}

/* ───── Testimonials infinite ───── */
function initTestimonialsLoop() {
  if (!window.gsap) return;
  const track = document.querySelector('.testimonials__track');
  if (!track) return;
  const original = track.innerHTML;
  track.innerHTML += original;
  const totalWidth = track.scrollWidth / 2;
  gsap.to(track, { x: -totalWidth, duration: 42, ease: 'none', repeat: -1 });
}

/* ───── Accordion ───── */
function initAccordion() {
  document.querySelectorAll('.module').forEach(mod => {
    mod.addEventListener('click', () => mod.classList.toggle('open'));
  });
}

/* ───── Year ───── */
function initYear() {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}
