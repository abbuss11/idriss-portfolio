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
  const ROLES = {
    fr: ['Développeur Web Full-Stack', 'Webmaster & SEO', 'Laravel · React · Flutter', 'UI Designer & Graphiste', 'Lead Tech Communities'],
    en: ['Full-Stack Web Developer', 'Webmaster & SEO', 'Laravel · React · Flutter', 'UI Designer & Graphic Artist', 'Tech Communities Lead']
  };
  let roles = ROLES.fr;
  document.addEventListener('langchange', e => {
    roles = ROLES[e.detail];
    if (reduceMotion) typed.textContent = roles[0];
  });
  const typed = $('#typed');
  function startTyping() {
    if (reduceMotion) { typed.textContent = roles[0]; return; }
    let r = 0, i = 0, del = false;
    (function loop() {
      const word = roles[r % roles.length];
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

/* =========================================================
   Surprises : console interactive, globe holographique,
   pluie matrix et texte brouillé
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Texte brouillé sur les index de section ---------- */
  const glyphs = '!<>-_\\/[]{}=+*^?#01ABCDEF';
  function scramble(el) {
    const final = el.textContent;
    let frame = 0;
    const total = 22;
    (function tick() {
      el.innerHTML = [...final].map((c, i) => {
        if (c === ' ' || frame / total > i / final.length) return c;
        return `<span class="scramble-char">${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`;
      }).join('');
      if (frame++ < total) requestAnimationFrame(tick);
      else el.textContent = final;
    })();
  }
  if (!reduceMotion) {
    const so = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { scramble(en.target); so.unobserve(en.target); }
    }), { threshold: 1 });
    $$('.section__index').forEach(el => so.observe(el));
    $$('#navLinks a').forEach(a => a.addEventListener('mouseenter', () => scramble(a)));
  }

  /* ---------- Globe holographique ---------- */
  const globe = $('#globe');
  if (globe) {
    const g = globe.getContext('2d');
    const rad = d => d * Math.PI / 180;
    // Contours simplifiés des continents [lon, lat]
    const land = [
      [[-17,21],[-16,28],[-10,30],[-6,36],[10,37],[11,33],[20,32],[32,31],[34,28],[43,12],[51,12],[51,10],[42,-1],[40,-10],[40,-16],[35,-24],[33,-27],[27,-34],[20,-35],[18,-32],[12,-17],[13,-6],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
      [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[8,57],[5,59],[5,62],[14,67],[20,70],[30,70],[40,67],[45,60],[55,55],[50,45],[40,44],[30,41],[26,40],[23,36],[20,40],[15,38],[12,44],[8,44],[3,42],[-2,37]],
      [[26,40],[36,36],[35,32],[43,13],[52,16],[57,22],[60,25],[67,24],[72,20],[77,8],[80,14],[87,22],[92,22],[98,16],[100,8],[104,1],[106,10],[109,12],[108,21],[118,24],[122,30],[122,37],[126,38],[129,35],[130,43],[141,47],[142,53],[140,58],[155,59],[163,61],[180,66],[180,72],[140,73],[110,77],[80,73],[68,70],[55,68],[40,67],[45,60],[55,55],[50,45],[40,44],[30,41]],
      [[-168,66],[-162,60],[-152,58],[-135,57],[-124,48],[-124,40],[-117,32],[-110,23],[-105,20],[-95,16],[-88,15],[-83,10],[-78,8],[-81,9],[-86,13],[-90,21],[-97,22],[-97,27],[-90,29],[-83,29],[-80,25],[-81,31],[-76,35],[-70,41],[-66,45],[-60,46],[-56,52],[-60,55],[-64,60],[-78,62],[-85,66],[-95,70],[-110,68],[-125,70],[-140,70],[-156,71]],
      [[-55,60],[-44,60],[-20,70],[-20,80],[-60,82],[-70,77],[-55,70]],
      [[-78,8],[-72,12],[-62,10],[-52,5],[-50,0],[-35,-5],[-35,-9],[-39,-14],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-62,-40],[-65,-45],[-68,-50],[-69,-55],[-74,-52],[-74,-45],[-72,-35],[-71,-25],[-70,-18],[-76,-14],[-81,-6],[-80,0],[-77,4]],
      [[114,-22],[114,-34],[118,-35],[124,-33],[132,-31],[138,-35],[141,-38],[147,-38],[150,-37],[153,-30],[153,-25],[146,-19],[142,-11],[136,-12],[131,-11],[126,-14],[122,-18]],
      [[-5,50],[1,51],[-2,55],[-5,58],[-6,56]],
      [[130,31],[135,34],[140,35],[142,40],[141,45],[139,40],[133,34]],
      [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]]
    ];
    const inPoly = (x, y, poly) => {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };
    // Points répartis uniformément sur la sphère (spirale de Fibonacci)
    const dots = [];
    const N = 4200;
    for (let i = 0; i < N; i++) {
      const lat = Math.asin(1 - 2 * (i + .5) / N) * 180 / Math.PI;
      const lon = ((i * 137.508) % 360) - 180;
      dots.push({ lat, lon, land: land.some(p => inPoly(lon, lat, p)) });
    }
    const home = { name: 'Niamey', lon: 2.11, lat: 13.51 };
    const cities = [
      { name: 'Paris', lon: 2.35, lat: 48.86 }, { name: 'Dakar', lon: -17.45, lat: 14.69 },
      { name: 'New York', lon: -74, lat: 40.7 }, { name: 'Lagos', lon: 3.38, lat: 6.52 },
      { name: 'Dubaï', lon: 55.3, lat: 25.2 }, { name: 'Montréal', lon: -73.6, lat: 45.5 },
      { name: 'Nairobi', lon: 36.8, lat: -1.3 }
    ];
    const toVec = (lon, lat) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];
    const arcs = cities.map(c => {
      const a = toVec(home.lon, home.lat), b = toVec(c.lon, c.lat);
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const om = Math.acos(Math.min(1, dot));
      const pts = [];
      for (let k = 0; k <= 40; k++) {
        const t = k / 40;
        const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
        const lift = 1 + .22 * Math.sin(Math.PI * t) * om;
        pts.push([(a[0] * s1 + b[0] * s2) * lift, (a[1] * s1 + b[1] * s2) * lift, (a[2] * s1 + b[2] * s2) * lift]);
      }
      return { city: c, pts, offset: Math.random() };
    });

    let size, DPR, rot = rad(-home.lon) - .35, tilt = rad(-18), dragging = false, lastX = 0, vel = 0, visible = false;
    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      size = globe.clientWidth * DPR;
      globe.width = globe.height = size;
    }
    function project([x, y, z]) {
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const x1 = x * cr + z * sr, z1 = -x * sr + z * cr;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const y1 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      const R = size * .4;
      return [size / 2 + x1 * R, size / 2 - y1 * R, z2];
    }
    function render(now) {
      if (!visible) return;
      g.clearRect(0, 0, size, size);
      const R = size * .4;
      // contour
      const halo = g.createRadialGradient(size / 2, size / 2, R * .9, size / 2, size / 2, R * 1.12);
      halo.addColorStop(0, 'rgba(34,228,255,0)'); halo.addColorStop(.5, 'rgba(34,228,255,.18)'); halo.addColorStop(1, 'rgba(34,228,255,0)');
      g.fillStyle = halo; g.beginPath(); g.arc(size / 2, size / 2, R * 1.12, 0, Math.PI * 2); g.fill();
      g.strokeStyle = 'rgba(34,228,255,.35)'; g.lineWidth = DPR;
      g.beginPath(); g.arc(size / 2, size / 2, R, 0, Math.PI * 2); g.stroke();

      // points
      for (const d of dots) {
        const [sx, sy, z] = project(toVec(d.lon, d.lat));
        if (z < 0) continue;
        const a = .15 + z * .85;
        g.fillStyle = d.land ? `rgba(34,228,255,${a})` : `rgba(139,92,255,${a * .22})`;
        const r = (d.land ? 1.5 : 1) * DPR * (.6 + z * .5);
        g.fillRect(sx - r / 2, sy - r / 2, r, r);
      }

      // arcs animés
      const t = now / 2600;
      for (const arc of arcs) {
        const prog = (t + arc.offset) % 1.4;
        const head = Math.min(1, prog) * arc.pts.length;
        const tail = Math.max(0, prog - .45) * arc.pts.length;
        g.lineWidth = 1.6 * DPR;
        for (let k = Math.floor(tail); k < Math.floor(head) - 1; k++) {
          const p1 = project(arc.pts[k]), p2 = project(arc.pts[k + 1]);
          if (p1[2] < -.05 || p2[2] < -.05) continue;
          const f = (k - tail) / Math.max(1, head - tail);
          g.strokeStyle = `rgba(255,63,164,${.15 + f * .85})`;
          g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke();
        }
        const [cx, cy, cz] = project(toVec(arc.city.lon, arc.city.lat));
        if (cz > 0) {
          g.fillStyle = 'rgba(232,236,245,.9)';
          g.beginPath(); g.arc(cx, cy, 2.2 * DPR, 0, Math.PI * 2); g.fill();
          if (cz > .35) {
            g.font = `${10 * DPR}px "JetBrains Mono", monospace`;
            g.fillStyle = `rgba(138,147,168,${cz})`;
            g.fillText(arc.city.name, cx + 6 * DPR, cy - 4 * DPR);
          }
        }
      }

      // Niamey : balise pulsante
      const [hx, hy, hz] = project(toVec(home.lon, home.lat));
      if (hz > 0) {
        const pulse = (now / 1400) % 1;
        g.strokeStyle = `rgba(61,255,168,${1 - pulse})`; g.lineWidth = 1.5 * DPR;
        g.beginPath(); g.arc(hx, hy, (4 + pulse * 18) * DPR, 0, Math.PI * 2); g.stroke();
        g.fillStyle = '#3dffa8'; g.shadowColor = '#3dffa8'; g.shadowBlur = 14 * DPR;
        g.beginPath(); g.arc(hx, hy, 4 * DPR, 0, Math.PI * 2); g.fill();
        g.shadowBlur = 0;
        g.font = `600 ${12 * DPR}px "Space Grotesk", sans-serif`; g.fillStyle = '#e8ecf5';
        g.fillText('Niamey', hx + 9 * DPR, hy + 4 * DPR);
      }

      if (!dragging) { vel *= .95; rot += reduceMotion ? 0 : .0018 + vel; }
      requestAnimationFrame(render);
    }
    resize();
    addEventListener('resize', resize);
    new IntersectionObserver(([en]) => {
      const was = visible;
      visible = en.isIntersecting;
      if (visible && !was) requestAnimationFrame(render);
    }).observe(globe);

    // Faire tourner le globe à la souris / au doigt
    globe.style.touchAction = 'pan-y';
    globe.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; globe.setPointerCapture(e.pointerId); });
    globe.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) * .008;
      rot += dx; vel = dx * .3; lastX = e.clientX;
    });
    const stop = () => { dragging = false; };
    globe.addEventListener('pointerup', stop);
    globe.addEventListener('pointercancel', stop);
    globe.parentElement.removeAttribute('aria-hidden');
    globe.setAttribute('role', 'img');
    globe.setAttribute('aria-label', 'Globe interactif : Niamey relié à Paris, Dakar, New York, Lagos, Dubaï, Montréal et Nairobi');
    globe.style.cursor = 'grab';
  }

  /* ---------- Pluie matrix ---------- */
  const matrix = $('#matrix');
  let matrixRunning = false;
  function runMatrix(ms = 6000) {
    if (matrixRunning || reduceMotion) return;
    matrixRunning = true;
    const m = matrix.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    matrix.width = innerWidth * DPR; matrix.height = innerHeight * DPR;
    const fs = 16 * DPR, cols = Math.ceil(matrix.width / fs);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const chars = 'アイウエオカキクケコサシスセソ01IDRISSANIAMEY<>/{}';
    matrix.classList.add('is-on');
    const end = performance.now() + ms;
    (function frame(now) {
      m.fillStyle = 'rgba(5,6,10,.12)';
      m.fillRect(0, 0, matrix.width, matrix.height);
      m.font = `${fs}px "JetBrains Mono", monospace`;
      drops.forEach((y, i) => {
        m.fillStyle = Math.random() < .05 ? '#e8ecf5' : (i % 3 ? '#22e4ff' : '#3dffa8');
        m.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
        drops[i] = y * fs > matrix.height && Math.random() > .975 ? 0 : y + 1;
      });
      if (now < end) return requestAnimationFrame(frame);
      matrix.classList.remove('is-on');
      setTimeout(() => { m.clearRect(0, 0, matrix.width, matrix.height); matrixRunning = false; }, 700);
    })(performance.now());
  }

  // Code Konami : ↑ ↑ ↓ ↓ ← → ← → B A
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kpos = 0;
  addEventListener('keydown', e => {
    kpos = e.key.toLowerCase() === konami[kpos].toLowerCase() ? kpos + 1 : (e.key === konami[0] ? 1 : 0);
    if (kpos === konami.length) { kpos = 0; runMatrix(); }
  });

  /* ---------- Console interactive ---------- */
  const term = $('#term'), body = $('#termBody'), form = $('#termForm'), input = $('#termIn'), chips = $('#termChips');
  const history = [];
  let hpos = 0, booted = false, lastFocus = null;

  const out = html => {
    const p = document.createElement('p');
    p.innerHTML = html;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  };
  const link = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
  const goTo = id => { close(); setTimeout(() => $(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 150); };

  const commands = {
    help: () => out(
`<span class="c">Commandes disponibles</span>
  <span class="g">whoami</span>       qui suis-je ?
  <span class="g">skills</span>       ma stack technique
  <span class="g">projets</span>      mes projets phares
  <span class="g">experience</span>   mon parcours
  <span class="g">contact</span>      me joindre
  <span class="g">cv</span>           télécharger mon CV (PDF)
  <span class="g">goto</span> &lt;section&gt; profil · stack · parcours · projets · contact
  <span class="g">github</span> · <span class="g">linkedin</span>
  <span class="g">matrix</span>       🟩 essaie pour voir
  <span class="g">clear</span> · <span class="g">exit</span>
<span class="muted">Astuces : Tab pour compléter, ↑ ↓ pour l'historique.</span>`),
    whoami: () => out(
`<span class="c">Idrissa Moutari</span> <span class="muted">(aka ABBA)</span> — Développeur Web · Webmaster
Diplômé en Génie logiciel (EPI-Niger), basé à Niamey, Niger 🇳🇪.
Je conçois des plateformes web de bout en bout : modélisation, code, design et SEO.
Lead Tech Communities Clubs · Finaliste UNESCO Youth Hackathon 2025.`),
    skills: () => out(
`<span class="v">web</span>      Laravel · PHP · React · Vue.js · Inertia.js · Alpine.js · TailwindCSS · API REST
<span class="v">cms</span>      WordPress · Moodle
<span class="v">mobile</span>   Flutter · Ionic
<span class="v">data</span>     MySQL · PostgreSQL · Firebase · Supabase
<span class="v">devops</span>   Git · Netlify · Vercel · Render · VPS · Postman
<span class="v">digital</span>  SEO · stratégie de contenu · Google Ads · réseaux sociaux
<span class="v">design</span>   Figma · Adobe XD · Photoshop · Canva`),
    projets: () => out(
`<span class="p">01</span> FAL-PMS                gestion de projet Agile · Laravel + Inertia
<span class="p">02</span> Nexus Youth Summit     site événementiel bilingue · React + Supabase
<span class="p">03</span> DevWeek 2025           évaluation de hackathon en temps réel
<span class="p">04</span> MyPocket               budget personnel · Ionic + React
<span class="p">05</span> PROOF                  vérification foncière · Flutter + Firebase
<span class="p">06</span> 227 Cadre de Vie       signalement citoyen · web, mobile, USSD
<span class="p">07</span> Taza                   chatbot emploi WhatsApp · FastAPI + LLM
<span class="muted">→ tape</span> <span class="g">goto projets</span> <span class="muted">pour les voir en détail.</span>`),
    experience: () => out(
`<span class="c">2025–26</span>  Développeur logiciel (stage) · Futuristic Africa Lab
<span class="c">2025–26</span>  Lead Tech Communities Clubs · EPI-Niger
<span class="c">2024–26</span>  Graphiste & Community Manager · Indépendant
<span class="c">2022–24</span>  Technicien maintenance informatique · MI+
<span class="c">2023–26</span>  Licence pro Génie logiciel · EPI-Niger`),
    contact: () => out(
`email     <a href="mailto:0abbuss@gmail.com">0abbuss@gmail.com</a>
tél       <a href="tel:+22799410009">+227 99 41 00 09</a>
linkedin  ${link('https://linkedin.com/in/idriss11', 'in/idriss11')}
github    ${link('https://github.com/abbuss11', 'abbuss11')}`),
    cv: () => {
      out('<span class="g">✓</span> Téléchargement du CV…');
      const a = document.createElement('a');
      a.href = 'cv/CV_Idrissa_Moutari.pdf'; a.download = ''; a.click();
    },
    github: () => { out('Ouverture de GitHub…'); window.open('https://github.com/abbuss11', '_blank', 'noopener'); },
    linkedin: () => { out('Ouverture de LinkedIn…'); window.open('https://linkedin.com/in/idriss11', '_blank', 'noopener'); },
    goto: arg => {
      const map = { profil: '#about', stack: '#skills', parcours: '#experience', projets: '#projects', contact: '#contact', distinctions: '#awards' };
      if (map[arg]) { out(`→ ${arg}`); goTo(map[arg]); }
      else out('<span class="p">usage :</span> goto profil | stack | parcours | projets | distinctions | contact');
    },
    matrix: () => { out('<span class="g">Wake up, Neo…</span>'); close(); runMatrix(); },
    sudo: arg => out(arg === 'hire-me' || arg === 'recruter'
      ? '<span class="g">[sudo] accès accordé.</span> Excellent choix 😎 → <a href="mailto:0abbuss@gmail.com">0abbuss@gmail.com</a>'
      : '<span class="p">Permission refusée.</span> Essaie <span class="g">sudo hire-me</span>.'),
    date: () => out(new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })),
    ls: () => out('profil/  stack/  parcours/  projets/  distinctions/  contact/  <span class="g">CV_Idrissa_Moutari.pdf</span>'),
    clear: () => { body.innerHTML = ''; },
    exit: () => close()
  };
  const aliases = { aide: 'help', '?': 'help', projects: 'projets', moi: 'whoami', about: 'whoami', competences: 'skills', compétences: 'skills', parcours: 'experience', cls: 'clear', quit: 'exit' };

  function run(raw) {
    const line = raw.trim();
    out(`<span class="cmd"><b>idriss@niamey</b>:<span class="c">~</span>$ ${line.replace(/</g, '&lt;')}</span>`);
    if (!line) return;
    history.push(line); hpos = history.length;
    const [name, ...rest] = line.split(/\s+/);
    const key = aliases[name.toLowerCase()] || name.toLowerCase();
    if (commands[key]) commands[key](rest.join(' ').toLowerCase());
    else out(`<span class="p">commande introuvable :</span> ${name.replace(/</g, '&lt;')} — tape <span class="g">help</span>`);
  }

  function boot() {
    booted = true;
    out(`<span class="ascii">
 ██╗██████╗ ██████╗ ██╗███████╗███████╗
 ██║██╔══██╗██╔══██╗██║██╔════╝██╔════╝
 ██║██║  ██║██████╔╝██║███████╗███████╗
 ██║██║  ██║██╔══██╗██║╚════██║╚════██║
 ██║██████╔╝██║  ██║██║███████║███████║
 ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝</span>`);
    out('Bienvenue dans ma console 👋  Tape <span class="g">help</span> ou clique sur une commande ci-dessous.');
  }

  function open() {
    lastFocus = document.activeElement;
    term.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!booted) boot();
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    if (term.hidden) return;
    term.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  ['help', 'whoami', 'skills', 'projets', 'experience', 'contact', 'cv', 'sudo hire-me', 'matrix'].forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = c;
    b.addEventListener('click', () => { run(c); input.focus(); });
    chips.appendChild(b);
  });

  form.addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); hpos = Math.max(0, hpos - 1); input.value = history[hpos]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hpos = Math.min(history.length, hpos + 1); input.value = history[hpos] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const match = Object.keys(commands).filter(c => c.startsWith(input.value.toLowerCase()));
      if (match.length === 1) input.value = match[0] + ' ';
      else if (match.length > 1) out(`<span class="muted">${match.join('  ')}</span>`);
    }
    const toggleKey = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    if (e.key !== 'Escape' && !toggleKey) e.stopPropagation();
  });
  $('#termFab').addEventListener('click', open);
  $('#termClose').addEventListener('click', close);
  term.addEventListener('click', e => { if (e.target === term) close(); });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); term.hidden ? open() : close(); }
    else if (e.key === 'Escape') close();
  });
})();

/* =========================================================
   Bilingue FR / EN, titre d'onglet et message pour les devs
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggle = document.getElementById('langToggle');
  const nodes = [...document.querySelectorAll('[data-en]')];
  nodes.forEach(el => { el.dataset.fr = el.innerHTML; });
  let lang = 'fr';

  const resplit = el => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map((c, i) =>
      `<span class="char" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  };

  function setLang(next, animate = true) {
    if (next === lang) return;
    lang = next;
    document.documentElement.lang = lang;
    toggle.classList.toggle('is-en', lang === 'en');
    toggle.querySelectorAll('span').forEach(s => s.classList.toggle('is-on', s.dataset.l === lang));
    toggle.setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
    nodes.forEach(el => {
      if (el.hasAttribute('data-split')) {
        el.textContent = lang === 'en' ? el.dataset.en : el.dataset.fr.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
        resplit(el);
        if (el.classList.contains('is-in')) {
          el.classList.remove('is-in'); void el.offsetWidth; el.classList.add('is-in');
        }
        return;
      }
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.fr;
      if (animate && !reduceMotion) {
        el.classList.remove('i18n-swap'); void el.offsetWidth; el.classList.add('i18n-swap');
      }
    });
    document.querySelector('.glitch')?.setAttribute('data-text', 'Moutari');
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    if (animate && !reduceMotion) {
      const flash = document.createElement('div');
      flash.className = 'lang-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 900);
    }
    try { localStorage.setItem('lang', lang); } catch (e) { /* stockage indisponible */ }
  }

  // Le texte des titres découpés en lettres doit être relu après le découpage initial
  document.querySelectorAll('[data-split][data-en]').forEach(el => {
    el.dataset.fr = el.getAttribute('aria-label') || el.textContent;
  });

  toggle.addEventListener('click', () => setLang(lang === 'fr' ? 'en' : 'fr'));
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* stockage indisponible */ }
  const wanted = location.hash === '#en' ? 'en' : saved;
  if (wanted === 'en') setLang('en', false);

  /* ---------- Titre d'onglet ---------- */
  const titles = { fr: '👋 Reviens, le code t’attend !', en: '👋 Come back, the code is waiting!' };
  const original = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? titles[lang] : original;
  });

  /* ---------- Message caché dans la console du navigateur ---------- */
  console.log(
    '%c IM.dev %c Psst… tu inspectes mon code ? On devrait travailler ensemble → 0abbuss@gmail.com ',
    'background:linear-gradient(90deg,#22e4ff,#8b5cff,#ff3fa4);color:#05060a;font-weight:700;padding:6px 10px;border-radius:6px 0 0 6px',
    'background:#0b0d16;color:#22e4ff;padding:6px 10px;border-radius:0 6px 6px 0'
  );
})();
