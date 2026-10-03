/* PRETO SHOW — main.js
   Tudo em JavaScript puro. Dados editáveis no topo do ficheiro. */
(() => {
  'use strict';

  /* =========================================================
     DADOS (editar aqui)
     ========================================================= */
  const IMG = id => `https://i.scdn.co/image/ab67616d0000b273${id}`;
  const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/4YlvKlWWHJl1TuXvrk94OW';

  // Se tiver `spotify`, abre o leitor embutido; se não, abre a pesquisa no Spotify.
  const RELEASES = [
    { title: 'OZA', year: 2026, type: 'album', label: 'EP', spotify: 'album/2dEtPs0c1kMsjwv6ZechBi', cover: IMG('b7d913bc96e2ae010678d33b'), tag: 'NOVO' },
    { title: 'Coringa', year: 2026, type: 'single', label: 'Single', spotify: 'album/7uJ49bHlaBeEDwWpHcgLqT', cover: IMG('86bdaf1b07120fc4d3e1d2cc') },
    { title: 'Te Fiz Quê', year: 2026, type: 'single', label: 'Single' },
    { title: 'Cucú De Luxo', year: 2026, type: 'single', label: 'Single' },
    { title: 'Vai Começar', year: 2026, type: 'single', label: 'Single' },
    { title: 'Drip na Goiaba', year: 2026, type: 'single', label: 'Single' },
    { title: '3.7 Versatilidade', year: 2023, type: 'album', label: 'Álbum', spotify: 'album/1gXErpmgCot7kCKPibk9Lw', cover: IMG('ebb8c7e6d5d18752ab22d0b7') },
    { title: 'Vibe', year: 2021, type: 'album', label: 'EP' },
    { title: 'Banger', year: 2020, type: 'album', label: 'Álbum', spotify: 'album/2bg3udzQAWSpwyOM2BL3YQ', cover: IMG('8b76f15d063891188d3540ef') },
    { title: '150 Bpm', year: 2019, type: 'single', label: 'Single' },
    { title: 'Panamera', year: 2017, type: 'album', label: 'Álbum', spotify: 'album/4KAzaFzdnJOU4AwDGI8Tmz', cover: IMG('57c1f5bc73a2111f23b83e17') },
    { title: 'Vai Devagar', year: 2020, type: 'single', label: 'Single' },
  ];

  const VIDEOS = ['Coringa', 'Oza', 'Dança Assim', 'Djeguedje', 'Vai Devagar', '150 BPM'];

  // Arquivo de concertos (eventos públicos já realizados)
  const SHOWS = [
    { d: '21', m: 'JUL', y: '2023', venue: 'Lunabril Palace', city: 'Angola', note: 'com Chelsy Dinorah' },
    { d: '04', m: 'JUL', y: '2020', venue: 'Ao Vivo É-Kwanza', city: 'ZAP Viva · Em directo', note: 'Concerto solidário' },
    { d: '13', m: 'MAR', y: '2020', venue: 'Club Vulcão', city: 'Angola', note: 'Festa “Grande Cassete”' },
    { d: '01', m: 'FEV', y: '2020', venue: 'Zulu', city: 'Lobito', note: 'Siga Lá Luna' },
    { d: '—', m: 'MAI', y: '2019', venue: 'Sons do Atlântico', city: 'Baía de Luanda', note: '“150 BPM” ao vivo com Anitta' },
  ];

  const PRODUCTS = [
    { name: 'T-shirt OZA', sub: 'Algodão pesado · Preto', art: 'tee', color: '#0B0908', text: 'OZA' },
    { name: 'Hoodie Preto Show', sub: 'Bordado · Vermelho', art: 'hoodie', color: '#D62631', text: 'PS' },
    { name: 'Boné 150 BPM', sub: 'Ajustável · Preto/Ouro', art: 'cap', color: '#15110F', text: '150' },
    { name: 'Vinil OZA', sub: 'Edição limitada', art: 'vinyl', color: '#FFC21A', text: 'OZA' },
  ];

  // Para ligar a newsletter a um serviço (Mailchimp, Formspree, etc.) define o endpoint:
  const NEWSLETTER_ENDPOINT = '';

  /* =========================================================
     HELPERS
     ========================================================= */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const BEAT = 400; // 150 BPM
  let beatOn = !reduce;

  const toast = (msg) => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('is-on'), 2800);
  };

  /* =========================================================
     LOADER
     ========================================================= */
  const loader = $('#loader');
  const count = $('#loaderCount');
  document.body.classList.add('is-loading');
  const finishLoad = () => {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    setTimeout(() => loader.remove(), 1100);
  };
  if (reduce) { count.textContent = '150'; finishLoad(); }
  else {
    const start = performance.now(), dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      count.textContent = String(Math.round(e * 150)).padStart(3, '0');
      if (p < 1) requestAnimationFrame(tick); else setTimeout(finishLoad, 250);
    };
    requestAnimationFrame(tick);
  }

  /* =========================================================
     HERO CANVAS — padrão afro generativo que pulsa a 150 BPM
     ========================================================= */
  const canvas = $('#heroCanvas');
  const ctx = canvas.getContext('2d');
  const COLORS = ['#D62631', '#FFC21A', '#F4EDE4'];
  let W, H, cell, cols, rows, cells = [], mouse = { x: -9999, y: -9999 }, heroVisible = true;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = W < 600 ? 54 : 78;
    cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1;
    cells = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      cells.push({
        x, y,
        shape: Math.floor(Math.random() * 5),
        color: COLORS[Math.random() < .5 ? 0 : Math.random() < .55 ? 1 : 2],
        phase: Math.random() * Math.PI * 2,
        rot: Math.floor(Math.random() * 4) * Math.PI / 2,
      });
    }
  };

  const drawShape = (c, s, a) => {
    ctx.save();
    ctx.translate(c.x * cell + cell / 2, c.y * cell + cell / 2);
    ctx.rotate(c.rot);
    ctx.scale(s, s);
    ctx.globalAlpha = a;
    ctx.strokeStyle = c.color; ctx.fillStyle = c.color;
    ctx.lineWidth = 3.5;
    const h = cell * .36;
    ctx.beginPath();
    switch (c.shape) {
      case 0: // zigzag
        ctx.moveTo(-h, h * .4);
        for (let i = 0; i < 4; i++) ctx.lineTo(-h + (i + .5) * h / 2, i % 2 ? h * .4 : -h * .4), ctx.lineTo(-h + (i + 1) * h / 2, h * .4);
        ctx.stroke(); break;
      case 1: // circle + dot
        ctx.arc(0, 0, h * .8, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, h * .25, 0, Math.PI * 2); ctx.fill(); break;
      case 2: // triangle
        ctx.moveTo(0, -h); ctx.lineTo(h, h * .8); ctx.lineTo(-h, h * .8); ctx.closePath(); ctx.stroke(); break;
      case 3: // box X
        ctx.rect(-h * .8, -h * .8, h * 1.6, h * 1.6);
        ctx.moveTo(-h * .8, -h * .8); ctx.lineTo(h * .8, h * .8);
        ctx.moveTo(h * .8, -h * .8); ctx.lineTo(-h * .8, h * .8); ctx.stroke(); break;
      default: // diamond
        ctx.moveTo(0, -h); ctx.lineTo(h * .7, 0); ctx.lineTo(0, h); ctx.lineTo(-h * .7, 0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  };

  const t0 = performance.now();
  const render = (now) => {
    if (heroVisible) {
      ctx.clearRect(0, 0, W, H);
      const t = (now - t0);
      const beatP = beatOn ? (t % BEAT) / BEAT : 1;
      const kick = beatOn ? Math.pow(1 - beatP, 4) : 0; // decay per beat
      const wave = t / 1400;
      for (const c of cells) {
        const cx = c.x * cell + cell / 2, cy = c.y * cell + cell / 2;
        const dx = cx - mouse.x, dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - dist / 260);
        const w = (Math.sin(wave + c.phase + c.x * .35 + c.y * .2) + 1) / 2;
        const s = .55 + w * .3 + near * .6 + kick * .12;
        const a = .07 + w * .1 + near * .75 + kick * .05;
        drawShape(c, s, Math.min(a, 1));
      }
    }
    if (!reduce) requestAnimationFrame(render);
  };
  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(render);
  $('#hero').addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  $('#hero').addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe($('#hero'));

  /* =========================================================
     BEAT TOGGLE
     ========================================================= */
  const beatBtn = $('#beatToggle');
  const setBeat = (on) => {
    beatOn = on;
    document.body.classList.toggle('beat-off', !on);
    beatBtn.setAttribute('aria-pressed', on);
  };
  setBeat(beatOn);
  beatBtn.addEventListener('click', () => {
    setBeat(!beatOn);
    toast(beatOn ? 'Batida ligada — 150 BPM' : 'Batida em pausa');
  });

  /* =========================================================
     NAV: scroll state, hide on scroll down, active link
     ========================================================= */
  const nav = $('#nav');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !menu.classList.contains('is-open'));
    lastY = y;
  }, { passive: true });

  const links = $$('#navLinks a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['musica', 'videos', 'tour', 'loja', 'sobre'].forEach(id => spy.observe(document.getElementById(id)));

  /* mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const toggleMenu = (open) => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('is-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* =========================================================
     RELEASES
     ========================================================= */
  const playSvg = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const genBg = ['#D62631', '#221B18', '#A3141F'];
  $('#releases').innerHTML = RELEASES.map((r, i) => {
    const cover = r.cover
      ? `<img src="${r.cover}" alt="Capa de ${r.title}" loading="lazy" width="640" height="640">`
      : '';
    const genStyle = r.cover ? '' : `style="background:${genBg[i % 3]};color:${i % 3 === 1 ? '#FFC21A' : '#F4EDE4'}"`;
    return `
      <button class="release" data-type="${r.type}" data-i="${i}" aria-label="Ouvir ${r.title}">
        ${r.tag ? `<span class="release__tag">${r.tag}</span>` : ''}
        <div class="release__cover ${r.cover ? '' : 'release__cover--gen pattern-bg'}" ${genStyle}>
          ${cover || `<span>${r.title}</span>`}
          <div class="release__overlay"><span class="release__play">${playSvg}</span></div>
        </div>
        <div class="release__meta">
          <span class="release__title">${r.title}</span>
          <span class="release__type">${r.label} · ${r.year}</span>
        </div>
      </button>`;
  }).join('');

  $$('.release').forEach(el => el.addEventListener('click', () => {
    const r = RELEASES[+el.dataset.i];
    if (r.spotify) openPlayer(r.spotify);
    else window.open(`https://open.spotify.com/search/${encodeURIComponent('Preto Show ' + r.title)}`, '_blank', 'noopener');
  }));

  /* filters */
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', b === btn); });
    const f = btn.dataset.filter;
    $$('.release').forEach((el, i) => {
      const show = f === 'all' || el.dataset.type === f;
      el.classList.toggle('is-hidden', !show);
      if (show) { el.classList.remove('is-in'); setTimeout(() => el.classList.add('is-in'), 30 + i * 25); }
    });
  }));

  /* =========================================================
     PLAYER MODAL (Spotify embed)
     ========================================================= */
  const player = $('#player'), frame = $('#playerFrame');
  let lastFocus = null;
  function openPlayer(path) {
    lastFocus = document.activeElement;
    frame.innerHTML = `<iframe title="Leitor Spotify" src="https://open.spotify.com/embed/${path}?utm_source=generator&theme=0" width="100%" height="352" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    player.classList.add('is-open');
    player.setAttribute('aria-hidden', 'false');
    $('.player__close').focus();
  }
  const closePlayer = () => {
    player.classList.remove('is-open');
    player.setAttribute('aria-hidden', 'true');
    setTimeout(() => { frame.innerHTML = ''; }, 400);
    lastFocus && lastFocus.focus();
  };
  $$('[data-close]', player).forEach(b => b.addEventListener('click', closePlayer));
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (player.classList.contains('is-open')) closePlayer(); if (menu.classList.contains('is-open')) toggleMenu(false); }
  });
  $$('[data-play]').forEach(b => b.addEventListener('click', () => openPlayer(b.dataset.play)));
  $('.hero__cover').addEventListener('click', e => { e.preventDefault(); openPlayer('album/2dEtPs0c1kMsjwv6ZechBi'); });

  /* =========================================================
     VIDEOS
     ========================================================= */
  const yt = q => `https://www.youtube.com/results?search_query=${encodeURIComponent('Preto Show ' + q)}`;
  $('#videoList').innerHTML = VIDEOS.map((v, i) => `
    <a class="video-item reveal" href="${yt(v)}" target="_blank" rel="noopener">
      <span class="video-item__n">${String(i + 1).padStart(2, '0')}</span>
      <span class="video-item__t">${v}</span>
      <span class="video-item__a" aria-hidden="true">→</span>
    </a>`).join('');
  $('#videoPlay').addEventListener('click', () => window.open(yt('Coringa'), '_blank', 'noopener'));

  /* =========================================================
     TOUR
     ========================================================= */
  $('#tourList').innerHTML = SHOWS.map(s => `
    <li class="tour-row reveal">
      <div class="tour-row__date">${s.d} ${s.m}<small>${s.y}</small></div>
      <div><div class="tour-row__venue">${s.venue}</div><div class="tour-row__note">${s.note}</div></div>
      <div class="tour-row__city">${s.city}</div>
      <span class="tour-row__badge">Realizado</span>
    </li>`).join('');

  /* =========================================================
     STORE
     ========================================================= */
  const art = (p) => {
    const ink = p.color === '#FFC21A' ? '#0B0908' : '#FFC21A';
    switch (p.art) {
      case 'tee': return `<svg viewBox="0 0 200 200"><path d="M60 30 35 42 15 78l28 14 10-16v104h94V76l10 16 28-14-20-36-25-12c-6 14-22 22-40 22S66 44 60 30z" fill="${p.color}" stroke="#2a2320" stroke-width="2"/><text x="100" y="118" text-anchor="middle" font-family="Anton,Impact" font-size="40" fill="${ink}">${p.text}</text><path d="M70 132h60" stroke="#D62631" stroke-width="5"/></svg>`;
      case 'hoodie': return `<svg viewBox="0 0 200 200"><path d="M70 28c0 16 14 30 30 30s30-14 30-30l28 14 22 50-24 10-8-14v100H52V88l-8 14-24-10 22-50z" fill="${p.color}"/><path d="M78 30c4 18 12 26 22 26s18-8 22-26" fill="none" stroke="#0B0908" stroke-width="5"/><text x="100" y="128" text-anchor="middle" font-family="Anton,Impact" font-size="44" fill="#0B0908">${p.text}</text><rect x="70" y="150" width="60" height="22" rx="4" fill="#0B0908" opacity=".25"/></svg>`;
      case 'cap': return `<svg viewBox="0 0 200 200"><path d="M30 120c0-46 30-74 70-74s70 28 70 74z" fill="${p.color}" stroke="#2a2320" stroke-width="2"/><path d="M20 120h170c0 14-40 24-90 24S20 134 20 120z" fill="#D62631"/><circle cx="100" cy="48" r="6" fill="#FFC21A"/><text x="100" y="104" text-anchor="middle" font-family="Anton,Impact" font-size="38" fill="#FFC21A">${p.text}</text></svg>`;
      default: return `<svg viewBox="0 0 200 200"><rect x="22" y="40" width="120" height="120" fill="#D62631"/><text x="82" y="112" text-anchor="middle" font-family="Anton,Impact" font-size="34" fill="#0B0908">${p.text}</text><circle cx="120" cy="100" r="62" fill="#0B0908"/><circle cx="120" cy="100" r="52" fill="none" stroke="#2a2320" stroke-width="1"/><circle cx="120" cy="100" r="42" fill="none" stroke="#2a2320" stroke-width="1"/><circle cx="120" cy="100" r="22" fill="${p.color}"/><circle cx="120" cy="100" r="3" fill="#0B0908"/></svg>`;
    }
  };
  $('#products').innerHTML = PRODUCTS.map((p, i) => `
    <article class="product reveal tilt">
      <div class="product__stage">
        <div class="product__art"></div>
        <span class="product__flag">EM BREVE</span>
        ${art(p)}
      </div>
      <div class="product__body">
        <div><div class="product__name">${p.name}</div><div class="product__sub">${p.sub}</div></div>
        <button class="product__btn" data-p="${i}" aria-label="Pré-registo: ${p.name}" aria-pressed="false">+</button>
      </div>
    </article>`).join('');
  $$('.product__btn').forEach(b => b.addEventListener('click', () => {
    const on = !b.classList.contains('is-on');
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on);
    toast(on ? `${PRODUCTS[+b.dataset.p].name}: avisamos-te no lançamento` : 'Pré-registo removido');
  }));

  /* =========================================================
     NEWSLETTER
     ========================================================= */
  const form = $('#newsletterForm'), msg = $('#newsletterMsg'), email = $('#email');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
      email.classList.add('is-error');
      msg.textContent = 'Escreve um email válido.';
      email.focus();
      return;
    }
    email.classList.remove('is-error');
    if (NEWSLETTER_ENDPOINT) {
      try {
        await fetch(NEWSLETTER_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: val, country: $('#country').value }) });
      } catch (_) { msg.textContent = 'Não foi possível subscrever agora. Tenta mais tarde.'; return; }
    }
    msg.textContent = 'Estás dentro. Bem-vindo à família ✦';
    form.reset();
  });
  email.addEventListener('input', () => email.classList.remove('is-error'));

  /* =========================================================
     REVEAL ON SCROLL + COUNTERS
     ========================================================= */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .release').forEach((el, i) => {
    if (el.classList.contains('release')) el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });

  const countIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to, start = performance.now(), dur = 1600;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: .6 });
  $$('.counter').forEach(c => countIO.observe(c));

  /* =========================================================
     CURSOR + MAGNETIC + TILT (desktop only)
     ========================================================= */
  if (fine && !reduce) {
    const cur = $('#cursor');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      cx += (tx - cx) * .2; cy += (ty - cy) * .2;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', e => {
      cur.classList.toggle('is-hover', !!e.target.closest('a,button,.release,.product,select,input'));
    });

    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .25}px,${y * .35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* hero title parallax */
  if (!reduce) {
    const lines = $$('.hero__title .line');
    addEventListener('scroll', () => {
      const y = scrollY;
      if (y > innerHeight) return;
      lines[0].style.transform = `translateX(${-y * .25}px)`;
      lines[1].style.transform = `translateX(${y * .25}px)`;
    }, { passive: true });
  }

  $('#year').textContent = new Date().getFullYear();
})();
