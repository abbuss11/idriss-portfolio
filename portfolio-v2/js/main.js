/* =========================================================
   Idrissa Moutari — Portfolio v2 · interactions & motion
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Découpage des titres en lettres ---------- */
  $$('[data-split]').forEach((el, w) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map((c, i) =>
      `<span class="char" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
    el.style.setProperty('--d', `${w % 2 ? 150 : 0}ms`);
  });

  /* ---------- Préchargeur ---------- */
  const loader = $('#loader');
  const log = $('#loaderLog');
  const bar = $('#loaderBar');
  const pct = $('#loaderPct');
  const steps = [
    'init portfolio.v2',
    'loading modules: laravel, react, flutter',
    'compiling design system',
    'connecting to Niamey ⇄ world',
    'rendering experience'
  ];

  function finishLoading() {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    $$('#hero [data-split]').forEach(el => el.classList.add('is-in'));
    startTyping();
    setTimeout(glitchLoop, 1800);
  }

  if (reduceMotion) {
    finishLoading();
  } else {
    let p = 0, step = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 7 + 2);
      bar.style.width = p + '%';
      pct.textContent = String(Math.floor(p)).padStart(3, '0') + '%';
      const target = Math.floor((p / 100) * steps.length);
      while (step < target && step < steps.length) {
        const line = document.createElement('p');
        line.className = 'ok';
        line.textContent = steps[step++];
        log.appendChild(line);
      }
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(finishLoading, 350);
      }
    }, 55);
  }

  /* ---------- Effet machine à écrire ---------- */
  const roles = ['Développeur Web Full-Stack', 'Webmaster & SEO', 'Laravel · React · Flutter', 'UI Designer & Graphiste', 'Lead Tech Communities'];
  const typed = $('#typed');
  function startTyping() {
    if (reduceMotion) { typed.textContent = roles[0]; return; }
    let r = 0, i = 0, del = false;
    (function loop() {
      const word = roles[r];
      typed.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(loop, 1600); }
      if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
      i += del ? -1 : 1;
      setTimeout(loop, del ? 35 : 70);
    })();
  }

  /* ---------- Glitch périodique ---------- */
  const glitch = $('.glitch');
  function glitchLoop() {
    glitch.classList.add('is-glitching');
    setTimeout(() => glitch.classList.remove('is-glitching'), 350);
    setTimeout(glitchLoop, 2500 + Math.random() * 3500);
  }

  /* ---------- Fond : réseau de particules ---------- */
  const canvas = $('#bg');
  const ctx = canvas.getContext('2d');
  let W, H, DPR, particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    const count = Math.min(110, Math.floor((innerWidth * innerHeight) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35 * DPR, vy: (Math.random() - .5) * .35 * DPR,
      r: (Math.random() * 1.4 + .4) * DPR,
      hue: Math.random() < .5 ? '34,228,255' : '139,92,255'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // halos de couleur
    const t = performance.now() / 6000;
    const g1 = ctx.createRadialGradient(W * (.2 + .1 * Math.sin(t)), H * .25, 0, W * .2, H * .25, W * .5);
    g1.addColorStop(0, 'rgba(139,92,255,.16)'); g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W * (.85 + .08 * Math.cos(t)), H * .7, 0, W * .85, H * .7, W * .45);
    g2.addColorStop(0, 'rgba(34,228,255,.10)'); g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

    const maxD = 130 * DPR;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // répulsion douce de la souris
      const dxm = p.x - mouse.x * DPR, dym = p.y - mouse.y * DPR;
      const dm = Math.hypot(dxm, dym);
      if (dm < 120 * DPR) { p.x += dxm / dm * 1.2; p.y += dym / dm * 1.2; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},.8)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(${p.hue},${(1 - d / maxD) * .22})`;
          ctx.lineWidth = DPR * .6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  resize(); draw();
  addEventListener('resize', resize);

  /* ---------- Curseur personnalisé ---------- */
  const cursor = $('#cursor'), dot = $('#cursorDot');
  let cx = -100, cy = -100, tx = -100, ty = -100;
  addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    tx = e.clientX; ty = e.clientY;
    dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });
  if (finePointer) {
    (function follow() {
      cx += (tx - cx) * .18; cy += (ty - cy) * .18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    })();
    $$('a, button, [data-tilt]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ---------- Boutons magnétiques ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Inclinaison 3D + lueur qui suit la souris ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach(el => {
      const strength = el.id === 'orb' ? 14 : 7;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        el.style.transform = `perspective(900px) rotateX(${(.5 - py) * strength}deg) rotateY(${(px - .5) * strength}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Apparition au scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      if (en.target.matches('.hero__stats')) runCounters(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, [data-split]:not(#hero [data-split])').forEach(el => io.observe(el));

  /* ---------- Compteurs ---------- */
  function runCounters(scope) {
    $$('[data-count]', scope).forEach(el => {
      const end = +el.dataset.count;
      if (reduceMotion) { el.textContent = end; return; }
      const t0 = performance.now(), dur = 1600;
      (function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ---------- Scroll : nav, progression, timeline, liens actifs ---------- */
  const nav = $('#nav');
  const progress = $('#scrollProgress');
  const timeline = $('#timeline');
  const fill = $('#timelineFill');
  const sections = $$('main section[id]');
  const links = $$('#navLinks a');
  let lastY = scrollY;

  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !nav.classList.contains('is-open'));
    lastY = y;

    const tr = timeline.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * .6 - tr.top) / tr.height));
    fill.style.transform = `scaleY(${k})`;

    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) current = s.id; });
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  $('#burger').addEventListener('click', () => nav.classList.toggle('is-open'));
  links.forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));

  /* ---------- Filtres projets ---------- */
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    $$('#projectList .project').forEach((p, i) => {
      const show = f === 'all' || p.dataset.cat === f;
      p.classList.toggle('is-hidden', !show);
      p.classList.remove('is-filtering');
      if (show) {
        p.classList.add('is-in');
        void p.offsetWidth;
        p.style.animationDelay = `${i * 60}ms`;
        p.classList.add('is-filtering');
      }
    });
  }));
})();
