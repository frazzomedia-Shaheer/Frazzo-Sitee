/* ══════════════════════════════════════════
   FRAZZO MEDIA — main.js
   ══════════════════════════════════════════ */

'use strict';

/* ── 1. CURSOR ── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function trackRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  })();

  const hoverEls = 'a, button, .svc-card, .why-pill, .review-card, .chip, .pf-step, .an-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
})();


/* ── 2. PRELOADER ── */
(function initPreloader() {
  const loader  = document.getElementById('preloader');
  const counter = document.getElementById('preCounter');
  if (!loader) return;

  let count = 0;
  const target = 100;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 4) + 1;
    if (count >= target) count = target;
    if (counter) counter.textContent = count;
    if (count >= target) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('out');
        triggerHeroReveal();
      }, 400);
    }
  }, 28);
})();


/* ── 3. HERO REVEAL ── */
function triggerHeroReveal() {
  const els = document.querySelectorAll('.reveal-hero');
  els.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0) * 150;
    setTimeout(() => el.classList.add('in'), delay + 100);
  });
}


/* ── 4. NAV SCROLL ── */
(function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 5. HAMBURGER ── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ── 6. SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();


/* ── 7. HERO PARTICLE CANVAS ── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 70;
  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.8 + 0.3,
    a:  Math.random() * 0.5 + 0.1,
    hue: Math.random() > 0.8 ? 320 : 185
  }));

  let mouseX = -999, mouseY = -999;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Subtle mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += dx / dist * 0.06;
        p.vy += dy / dist * 0.06;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,65%,${p.a})`;
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${0.07 * (1 - d / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── 8. PARALLAX ── */
(function initParallax() {
  const hero    = document.getElementById('hero');
  const content = hero ? hero.querySelector('.hero-content') : null;
  const grid    = hero ? hero.querySelector('.hero-grid-lines') : null;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (content) {
      content.style.transform = `translateY(${y * 0.14}px)`;
      content.style.opacity   = Math.max(0, 1 - y / 600);
    }
    if (grid) {
      grid.style.transform = `translateY(${y * 0.06}px)`;
    }
  }, { passive: true });
})();


/* ── 9. COUNTERS ── */
(function initCounters() {
  const els = document.querySelectorAll('[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el     = e.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = String(target).includes('.');
      const suffix  = el.classList.contains('ast-num')
        ? (target === 98 ? '' : target === 2.4 ? '' : '')
        : '';
      const duration = 1800;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const val      = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
})();


/* ── 10. DONUT CHARTS ── */
(function initDonutCharts() {
  const charts = [
    { id: 'roasCanvas',  pct: 80, color: '#00f0ff' },
    { id: 'engCanvas',   pct: 92, color: '#ff2d78' },
    { id: 'convCanvas',  pct: 68, color: '#a78bfa' }
  ];

  charts.forEach(({ id, pct, color }) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 80;
    canvas.width  = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2, r = size * 0.38;

    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      let current = 0;
      const target = pct;
      const interval = setInterval(() => {
        current = Math.min(current + 1.2, target);
        drawDonut(ctx, cx, cy, r, current / 100, color, size);
        if (current >= target) clearInterval(interval);
      }, 18);
    }, { threshold: 0.3 });
    obs.observe(canvas);

    drawDonut(ctx, cx, cy, r, 0, color, size);
  });

  function drawDonut(ctx, cx, cy, r, progress, color, size) {
    ctx.clearRect(0, 0, size, size);
    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 5;
    ctx.stroke();
    // Fill
    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
})();


/* ── 11. ANALYTICS BARS ── */
(function initBars() {
  const fills = document.querySelectorAll('.ast-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      e.target.style.width = e.target.dataset.w + '%';
    });
  }, { threshold: 0.4 });
  fills.forEach(f => obs.observe(f));
})();


/* ── 12. PROCESS LINE FILL ── */
(function initProcessLine() {
  const fill = document.getElementById('processLineFill');
  if (!fill) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    setTimeout(() => { fill.style.height = '100%'; }, 200);
  }, { threshold: 0.2 });
  obs.observe(fill.parentElement);
})();


/* ── 13. REVIEWS SLIDER ── */
(function initReviews() {
  const track   = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsWrap = document.getElementById('rcDots');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  let current = 0;
  let perView = getPerView();
  const total = Math.ceil(cards.length / perView);

  function getPerView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  // Build dots
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'rc-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.rc-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    const cardWidth = cards[0].offsetWidth + 32; // gap
    track.style.transform = `translateX(-${current * cardWidth * perView}px)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play
  let autoplay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const newPerView = getPerView();
    if (newPerView !== perView) {
      perView = newPerView;
      current = 0;
      goTo(0);
      buildDots();
    } else {
      goTo(current);
    }
  }, { passive: true });

  buildDots();
  goTo(0);
})();


/* ── 14. CONTACT FORM ── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('cfSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const orig = btn.querySelector('span').textContent;
    btn.querySelector('span').textContent = 'Sending...';
    btn.disabled = true;

    // Simulate send (replace with real backend/formspree)
    setTimeout(() => {
      btn.querySelector('span').textContent = '✓ Sent!';
      if (success) success.classList.add('show');
      setTimeout(() => {
        btn.querySelector('span').textContent = orig;
        btn.disabled = false;
        if (success) success.classList.remove('show');
        form.reset();
      }, 4000);
    }, 1200);
  });
})();


/* ── 15. SMOOTH ANCHOR SCROLL ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ── 16. SCROLL-SPEED PARALLAX (sections) ── */
(function initSectionParallax() {
  const cards = document.querySelectorAll('.svc-card, .why-pill');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    cards.forEach((card, i) => {
      const speed = (i % 2 === 0 ? 0.015 : -0.015);
      const rect  = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        card.style.transform = `translateY(${(rect.top - window.innerHeight * 0.5) * speed}px)`;
      }
    });
  }, { passive: true });
})();


/* ── 17. NUMBER SUFFIX DISPLAY ── */
(function addCounterSuffixes() {
  // ast-num items get suffixes after counting
  const map = {
    150: '+',
    2.4: 'M',
    98:  '%',
    500: '+'
  };
  const obs = new MutationObserver(() => {});
  document.querySelectorAll('.ast-num[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = map[target] || '';
    el.dataset.suffix = suffix;

    const origObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      origObs.disconnect();
      const isFloat  = String(target).includes('.');
      const duration = 1800;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const val      = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + (progress < 1 ? '' : suffix);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    origObs.observe(el);
  });
})();


/* ── 18. GLITCH EFFECT on hero title lines ── */
(function initGlitch() {
  const lines = document.querySelectorAll('.ht-line');
  setInterval(() => {
    const target = lines[Math.floor(Math.random() * lines.length)];
    if (!target) return;
    target.style.textShadow = '2px 0 #ff2d78, -2px 0 #00f0ff';
    setTimeout(() => {
      target.style.textShadow = '';
    }, 80);
  }, 3500);
})();
