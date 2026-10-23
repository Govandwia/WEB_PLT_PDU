import { RigScene, LAYERS, MAX_DEPTH_FT } from '../components/RigScene.js';
import { SENSORS } from '../data/sensors.js';

/**
 * Bubble penjelasan yang menempel pada objek 3D.
 * dx/dy: jarak offset dari titik 3D
 */
const BUBBLES = [
  {
    id: 'rig', num: 1, side: 'left', dx: -45, dy: -60,
    title: 'Rig (Menara)',
    short: 'Menara tempat menggantung kabel untuk menurunkan alat ke dalam sumur.',
    more: 'Di puncak menara ada roda kabel (sheave). Kabel dari truk melewati roda ini lalu turun lurus ke lubang sumur.'
  },
  {
    id: 'cable', num: 3, side: 'right', dx: 45, dy: -60,
    title: 'Kabel Wireline',
    short: 'Kabel baja kuat yang menahan alat hingga ribuan meter ke bawah.',
    more: 'Panjang kabel yang diulur dari derek itulah yang menunjukkan kedalaman alat di dalam sumur.'
  },
  {
    id: 'truck', num: 2, side: 'right', dx: 50, dy: -110,
    title: 'Truk Logging & Derek Kabel',
    short: 'Menggulung kabel dan mencatat kedalaman alat setiap saat.',
    more: 'Catatan kedalaman ini disimpan dalam file <b>TDF</b>. Isinya: jam, kedalaman, dan tarikan kabel.'
  },
  {
    id: 'tool', num: 5, side: 'right', dx: 60, dy: 35, wide: true,
    title: 'Alat PLT (Logging Tool)',
    short: 'Rangkaian 7 sensor yang merekam kondisi sumur 25 kali setiap detik.',
    more: 'tool'
  },
  {
    id: 'casing', num: 4, side: 'left', dx: -50, dy: 0,
    title: 'Pipa Sumur (Casing)',
    short: 'Pipa baja pelindung lubang sumur, disambung kira-kira setiap 10 meter.',
    more: 'Di zona minyak, dinding pipa sengaja dilubangi (perforasi) agar minyak bisa masuk ke dalam sumur.'
  },
  {
    id: 'reservoir', num: 6, side: 'right', dx: 55, dy: 0,
    title: 'Lapisan Minyak (Reservoir)',
    short: 'Batuan berpori tempat minyak tersimpan. Minyak masuk ke sumur lewat lubang perforasi.',
    more: 'Tugas utama PLT adalah mencari tahu: dari lubang mana minyak paling banyak keluar, dan apakah ada air yang ikut masuk.'
  }
];

function toolBubbleMore() {
  return `
    <p class="bubble-note">Klik salah satu sensor (atau klik langsung alatnya di gambar):</p>
    <ul class="sensor-list">
      ${SENSORS.map(s => `
        <li><button class="sensor-item" data-sensor="${s.id}">
          <span class="sensor-dot" style="background:${s.color}"></span>${s.short}
        </button></li>`).join('')}
    </ul>
    <div class="sensor-detail" data-detail>
      <p>Hasil rekaman sensor disimpan di memori alat sebagai file <b>STO</b>.</p>
    </div>`;
}

export function renderHome(root) {
  let scene = null;
  document.title = 'PDU PLT Suite — Mengenal Production Logging Tool';
  root.innerHTML = `
    <section class="home-hero" id="home-hero">
      <div class="scene-host" id="scene-host"></div>
      <svg class="leader-svg" id="leader-svg"></svg>
      <div class="layer-tags" id="layer-tags">
        ${LAYERS.map(l => `<span class="layer-tag" data-layer="${l.id}"><b>${l.name}</b> <small>${l.depth}</small></span>`).join('')}
      </div>
      <div class="bubble-layer" id="bubble-layer"></div>

      <!-- KARTU PENJELASAN KOMPONEN AKTIF KHUSUS MOBILE (Anti-Tabrakan & Rapi) -->
      <div class="mobile-component-card" id="mobile-component-card">
        <div class="mcc-tabs" id="mcc-tabs">
          ${BUBBLES.map((b, idx) => `
            <button class="mcc-tab ${idx === 0 ? 'active' : ''}" data-idx="${idx}" type="button">
              <span>${b.num}</span> ${b.title.split(' ')[0]}
            </button>
          `).join('')}
        </div>
        <div class="mcc-body">
          <div class="mcc-nav-row">
            <div class="mcc-badge">
              <span id="mcc-num">1</span>
              <b id="mcc-title">Rig (Menara)</b>
            </div>
            <div class="mcc-arrows">
              <button class="mcc-arrow" id="mcc-prev" type="button" aria-label="Sebelumnya">‹</button>
              <button class="mcc-arrow" id="mcc-next" type="button" aria-label="Berikutnya">›</button>
            </div>
          </div>
          <p class="mcc-short" id="mcc-short">Menara tempat menggantung kabel untuk menurunkan alat ke dalam sumur.</p>
          <div class="mcc-more" id="mcc-more"></div>
          <button class="btn btn-ghost btn-sm mcc-toggle" id="mcc-toggle" type="button">Pelajari Lebih Lanjut</button>
        </div>
      </div>

      <!-- Petunjuk Scroll & Interaksi di Pojok Kiri Bawah -->
      <div class="hero-hint">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <rect x="7" y="2" width="10" height="20" rx="5"/>
          <path d="M12 6v4"/>
        </svg>
        <span><b>Scroll mouse ke bawah</b> untuk menjelajah sumur lebih dalam (hingga 15.000 ft)</span>
      </div>

      <!-- KARTU PENJELASAN DI KANAN ATAS (Sesuai Permintaan) -->
      <div class="hero-card hero-card-topright">
        <span class="eyebrow">Parama Data Unit • PLT Suite</span>
        <h1>Memeriksa Kesehatan Sumur Minyak dari Dalam Bumi</h1>
        <p>
          <b>Production Logging Tool (PLT)</b> adalah rangkaian sensor pintar yang diturunkan ribuan meter
          ke dalam sumur untuk merekam tekanan, suhu, dan aliran minyak. Aplikasi <b>PLT Suite</b> mengolah rekamannya
          menjadi grafik dan laporan visual yang mudah dibaca.
        </p>
        <div class="hero-actions">
          <a href="#/cara-kerja" class="btn btn-primary">Lihat Cara Kerja Aplikasi →</a>
          <a href="#/alat" class="btn btn-ghost">Kenali 7 Sensornya</a>
        </div>
      </div>

      <!-- PANEL KENDALI DEREK KABEL (Di Kanan Bawah) -->
      <div class="control-panel">
        <div class="cp-head">
          <div>
            <div class="cp-title">Kendali Derek Kabel Wireline</div>
            <div class="cp-sub">Scroll mouse atau geser tuas kedalaman</div>
          </div>
          <div class="cp-depth"><span id="cp-depth">0</span><small> ft</small></div>
        </div>
        <input type="range" class="range" id="cp-range" min="0" max="${MAX_DEPTH_FT}" value="0" step="25" aria-label="Kedalaman alat" />
        
        <!-- Tombol Preset Cepat ke Kedalaman Penting -->
        <div class="preset-pills">
          <button class="preset-pill active" data-ft="0">Permukaan (0 ft)</button>
          <button class="preset-pill" data-ft="2500">Pasir (2.500 ft)</button>
          <button class="preset-pill" data-ft="5000">Serpih (5.000 ft)</button>
          <button class="preset-pill" data-ft="8000">★ Minyak (8.000 ft)</button>
          <button class="preset-pill" data-ft="15000">Dasar (15.000 ft)</button>
        </div>

        <div class="cp-readings">
          <div class="reading"><span>Tekanan</span><b id="cp-pres">14,7 psi</b></div>
          <div class="reading"><span>Suhu</span><b id="cp-temp">28,0 °C</b></div>
          <div class="reading wide"><span>Posisi Lapisan</span><b id="cp-layer">Di menara (di atas tanah)</b></div>
        </div>
        <div class="cp-actions">
          <button class="btn btn-primary btn-sm" id="cp-down">Turun ke Lapisan Minyak (8.000 ft)</button>
          <button class="btn btn-ghost btn-sm" id="cp-up">Kembali ke Permukaan</button>
        </div>
        <label class="cp-toggle"><input type="checkbox" id="cp-bubbles" checked /> Tampilkan bubble penjelasan</label>
      </div>
    </section>

    <!-- Bagian Gambaran Alur -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Gambaran singkat</span>
          <h2>Dari Dalam Sumur Sampai Jadi Laporan</h2>
          <p>Ada dua "perekam" yang bekerja bersamaan. Aplikasi PLT Suite menggabungkan keduanya.</p>
        </div>
        <div class="journey-grid">
          <div class="journey-card">
            <div class="journey-num" style="background:#FFF1EA;color:#F15A24">1</div>
            <h3>Alat merekam di dalam sumur</h3>
            <p>Sensor mencatat tekanan, suhu, jenis cairan, dan aliran 25 kali per detik ke chip memori alat (file <b>STO</b>).</p>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-card">
            <div class="journey-num" style="background:#E0F2FE;color:#0284C7">2</div>
            <h3>Derek mencatat kedalaman</h3>
            <p>Di permukaan, derek kabel mencatat di kedalaman berapa alat berada pada setiap detik (file <b>TDF</b>).</p>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-card">
            <div class="journey-num" style="background:#DCFCE7;color:#16A34A">3</div>
            <h3>Aplikasi mengolah datanya</h3>
            <p>PLT Suite menyatukan kedua file, mengubahnya menjadi grafik per kedalaman, lalu membuat laporan resmi.</p>
          </div>
        </div>

        <div class="cta-band">
          <div>
            <h3>Ingin tahu bagaimana data itu diolah?</h3>
            <p>Ikuti 5 langkah sederhana cara kerja aplikasi PLT Suite, lengkap dengan simulasi interaktif yang bisa Anda coba.</p>
          </div>
          <a href="#/cara-kerja/1" class="btn btn-white">Mulai Langkah 1 →</a>
        </div>
      </div>
    </section>
  `;

  const hero = root.querySelector('#home-hero');
  const layerEl = root.querySelector('#bubble-layer');
  const svg = root.querySelector('#leader-svg');
  const tagEls = [...root.querySelectorAll('.layer-tag')];

  /* ---------------- bubbles ---------------- */
  const bubbles = BUBBLES.map(cfg => {
    const el = document.createElement('div');
    el.className = `bubble bubble--${cfg.side}${cfg.wide ? ' bubble--wide' : ''}`;
    el.innerHTML = `
      <div class="bubble-head">
        <span class="bubble-num">${cfg.num}</span>
        <span class="bubble-title">${cfg.title}</span>
      </div>
      <p class="bubble-short">${cfg.short}</p>
      <div class="bubble-more">${cfg.more === 'tool' ? toolBubbleMore() : `<p>${cfg.more}</p>`}</div>
      <button class="bubble-toggle" type="button">Selengkapnya</button>`;
    layerEl.appendChild(el);
    const state = { cfg, el, w: 0, h: 0 };
    const ro = new ResizeObserver(() => { state.w = el.offsetWidth; state.h = el.offsetHeight; });
    ro.observe(el);
    state.ro = ro;

    el.querySelector('.bubble-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(state, !el.classList.contains('expanded'));
    });
    el.querySelector('.bubble-head').addEventListener('click', () => setExpanded(state, !el.classList.contains('expanded')));

    // Di mobile, klik pin memicu kartu komponen mobile aktif
    el.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.stopPropagation();
        const targetIdx = BUBBLES.findIndex(item => item.id === cfg.id);
        if (targetIdx !== -1) updateMobileCard(targetIdx);
      }
    });

    return state;
  });

  function setExpanded(state, on) {
    state.el.classList.toggle('expanded', on);
    state.el.querySelector('.bubble-toggle').textContent = on ? 'Tutup' : 'Selengkapnya';
    if (on) layerEl.appendChild(state.el);
    if (!on && state.cfg.id === 'tool') selectSensor(null);
  }

  const toolBubble = bubbles.find(b => b.cfg.id === 'tool');
  function selectSensor(id) {
    const s = SENSORS.find(x => x.id === id);
    toolBubble.el.querySelectorAll('.sensor-item').forEach(btn => btn.classList.toggle('active', btn.dataset.sensor === id));
    const detail = toolBubble.el.querySelector('[data-detail]');
    if (s) {
      detail.innerHTML = `
        <div class="sensor-detail-title" style="color:${s.color}">${s.name}</div>
        <p>${s.desc}</p>
        <p class="analogy"><b>Ibaratnya:</b> ${s.analogy}</p>
        <p class="reading-sample">Contoh bacaan: <b>${s.reading}</b></p>`;
    } else {
      detail.innerHTML = `<p>Hasil rekaman sensor disimpan di memori alat sebagai file <b>STO</b>.</p>`;
    }
    scene && scene.highlight(id);
  }
  toolBubble.el.querySelectorAll('.sensor-item').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); selectSensor(btn.dataset.sensor); });
  });

  /* ---------------- mobile component card controller ---------------- */
  let currentMobileIdx = 0;
  const mccCard = root.querySelector('#mobile-component-card');
  const mccTabs = root.querySelector('#mcc-tabs');
  const mccNum = root.querySelector('#mcc-num');
  const mccTitle = root.querySelector('#mcc-title');
  const mccShort = root.querySelector('#mcc-short');
  const mccMore = root.querySelector('#mcc-more');
  const mccToggle = root.querySelector('#mcc-toggle');

  function updateMobileCard(idx) {
    currentMobileIdx = idx;
    const b = BUBBLES[idx];
    if (!b) return;

    // Aktifkan pin yang sesuai
    bubbles.forEach((item, i) => item.el.classList.toggle('active', i === idx));

    // Aktifkan tab pill
    if (mccTabs) {
      mccTabs.querySelectorAll('.mcc-tab').forEach((tab, i) => tab.classList.toggle('active', i === idx));
    }

    if (mccNum) mccNum.textContent = b.num;
    if (mccTitle) mccTitle.textContent = b.title;
    if (mccShort) mccShort.textContent = b.short;

    if (mccMore) {
      if (b.more === 'tool') {
        mccMore.innerHTML = toolBubbleMore();
        mccMore.querySelectorAll('.sensor-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.dataset.sensor;
            mccMore.querySelectorAll('.sensor-item').forEach(x => x.classList.toggle('active', x.dataset.sensor === sid));
            const s = SENSORS.find(x => x.id === sid);
            const detail = mccMore.querySelector('[data-detail]');
            if (s && detail) {
              detail.innerHTML = `
                <div class="sensor-detail-title" style="color:${s.color}">${s.name}</div>
                <p>${s.desc}</p>
                <p class="analogy"><b>Ibaratnya:</b> ${s.analogy}</p>
                <p class="reading-sample">Contoh: <b>${s.reading}</b></p>`;
            }
            scene && scene.highlight(sid);
          });
        });
      } else {
        mccMore.innerHTML = `<p>${b.more}</p>`;
      }
    }

    // Arahkan kedalaman alat jika memilih komponen bawah tanah
    if (b.id === 'reservoir') {
      scene && scene.goToReservoir();
    } else if (b.id === 'rig' || b.id === 'truck' || b.id === 'cable') {
      if (scene && scene.getFraction() > 0.3) {
        scene.goToSurface();
      }
    }
  }

  if (mccCard) {
    if (mccTabs) {
      mccTabs.querySelectorAll('.mcc-tab').forEach(tab => {
        tab.addEventListener('click', () => updateMobileCard(parseInt(tab.dataset.idx, 10)));
      });
    }

    const prevBtn = root.querySelector('#mcc-prev');
    const nextBtn = root.querySelector('#mcc-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const next = (currentMobileIdx - 1 + BUBBLES.length) % BUBBLES.length;
        updateMobileCard(next);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = (currentMobileIdx + 1) % BUBBLES.length;
        updateMobileCard(next);
      });
    }

    if (mccToggle) {
      mccToggle.addEventListener('click', () => {
        const exp = mccCard.classList.toggle('expanded');
        mccToggle.textContent = exp ? 'Tutup Penjelasan' : 'Pelajari Lebih Lanjut';
      });
    }
  }

  /* ---------------- controls & telemetry ---------------- */
  const range = root.querySelector('#cp-range');
  const depthEl = root.querySelector('#cp-depth');
  const presEl = root.querySelector('#cp-pres');
  const tempEl = root.querySelector('#cp-temp');
  const layerNameEl = root.querySelector('#cp-layer');
  const presetPills = root.querySelectorAll('.preset-pill');
  let draggingRange = false;

  const fmt = (n, d = 0) => n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });

  const heroCardEl = root.querySelector('.hero-card');
  const controlPanelEl = root.querySelector('.control-panel');
  const heroHintEl = root.querySelector('.hero-hint');

  function resolveBubbleCollisions(boxes, obstacles, bounds) {
    const { minX, maxX, minY, maxY } = bounds;
    const GAP = 16;

    for (let iter = 0; iter < 20; iter++) {
      let shifted = false;

      // 1. Antar bubble: saling menjauhkan jika overlap
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], b = boxes[j];

          const overlapX = (a.w / 2 + b.w / 2 + GAP) - Math.abs((a.x + a.w / 2) - (b.x + b.w / 2));
          const overlapY = (a.h / 2 + b.h / 2 + GAP) - Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));

          if (overlapX > 0 && overlapY > 0) {
            shifted = true;
            if (overlapY <= overlapX * 1.25) {
              const dy = overlapY / 2;
              if (a.y <= b.y) {
                a.y -= dy;
                b.y += dy;
              } else {
                a.y += dy;
                b.y -= dy;
              }
            } else {
              const dx = overlapX / 2;
              if (a.x <= b.x) {
                a.x -= dx;
                b.x += dx;
              } else {
                a.x += dx;
                b.x -= dx;
              }
            }
          }
        }
      }

      // 2. Bubble dengan elemen antarmuka statis (Hero Card, Control Panel, Hero Hint)
      for (const b of boxes) {
        for (const obs of obstacles) {
          const overlapX = (b.w / 2 + obs.w / 2 + GAP) - Math.abs((b.x + b.w / 2) - (obs.x + obs.w / 2));
          const overlapY = (b.h / 2 + obs.h / 2 + GAP) - Math.abs((b.y + b.h / 2) - (obs.y + obs.h / 2));

          if (overlapX > 0 && overlapY > 0) {
            shifted = true;
            if (overlapY < overlapX) {
              b.y += (b.y + b.h / 2 < obs.y + obs.h / 2 ? -overlapY : overlapY);
            } else {
              b.x += (b.x + b.w / 2 < obs.x + obs.w / 2 ? -overlapX : overlapX);
            }
          }
        }

        // 3. Batas layar viewport
        b.x = Math.max(minX, Math.min(maxX - b.w, b.x));
        b.y = Math.max(minY, Math.min(maxY - b.h, b.y));
      }

      if (!shifted) break;
    }
  }

  function placeBubbles(anchors) {
    const isMobile = window.innerWidth <= 768;
    const sceneHostEl = root.querySelector('#scene-host');
    const W = hero.clientWidth;
    const H = isMobile ? (sceneHostEl ? sceneHostEl.clientHeight : 380) : hero.clientHeight;

    if (isMobile) {
      bubbles.forEach(b => {
        const a = anchors[b.cfg.id];
        if (!a) return;
        const el = b.el;

        if (a.y < 10 || a.y > H - 10 || a.x < -30 || a.x > W + 30) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';

        const px = Math.max(10, Math.min(W - 42, a.x - 16));
        const py = Math.max(10, Math.min(H - 42, a.y - 16));
        const isAct = el.classList.contains('active');
        const scaleStr = isAct ? ' scale(1.22)' : '';
        el.style.transform = `translate(${Math.round(px)}px, ${Math.round(py)}px)${scaleStr}`;
      });
      svg.innerHTML = '';
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const getObstacleRect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - heroRect.left,
        y: r.top - heroRect.top,
        w: r.width,
        h: r.height
      };
    };

    const obstacles = [
      getObstacleRect(heroCardEl),
      getObstacleRect(controlPanelEl),
      getObstacleRect(heroHintEl)
    ].filter(Boolean);

    const activeBoxes = [];
    bubbles.forEach(b => {
      const a = anchors[b.cfg.id];
      if (!a) return;
      const { cfg, el } = b;
      const w = b.w || el.offsetWidth || (cfg.wide ? 290 : 245);
      const h = b.h || el.offsetHeight || 110;

      // Sembunyikan bubble jika titik 3D berada di luar batas layar (misal rig tergulung ke atas saat alat turun dalam)
      if (a.y < 30 || a.y > H - 30 || a.x < -150 || a.x > W + 150) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';

      let x = cfg.side === 'right' ? a.x + cfg.dx : (cfg.side === 'left' ? a.x + cfg.dx - w : a.x - w / 2);
      let y = a.y + cfg.dy - h / 2;

      x = Math.max(16, Math.min(W - w - 16, x));
      y = Math.max(72, Math.min(H - h - 16, y));

      activeBoxes.push({ b, a, x, y, w, h });
    });

    resolveBubbleCollisions(activeBoxes, obstacles, {
      minX: 16,
      maxX: W - 16,
      minY: 72,
      maxY: H - 16
    });

    let lines = '';
    activeBoxes.forEach(({ b, a, x, y, w, h }) => {
      b.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

      // Hubungkan garis ke sisi bubble yang paling dekat dengan titik 3D
      let bx, by;
      if (a.x <= x) {
        bx = x;
        by = Math.max(y + 14, Math.min(y + h - 14, a.y));
      } else if (a.x >= x + w) {
        bx = x + w;
        by = Math.max(y + 14, Math.min(y + h - 14, a.y));
      } else {
        bx = Math.max(x + 16, Math.min(x + w - 16, a.x));
        by = a.y < y + h / 2 ? y : y + h;
      }

      lines += `<line x1="${a.x}" y1="${a.y}" x2="${bx}" y2="${by}" />
                <circle cx="${a.x}" cy="${a.y}" r="6" class="dot-halo" />
                <circle cx="${a.x}" cy="${a.y}" r="3.5" class="dot" />`;
    });
    svg.innerHTML = lines;

    tagEls.forEach(tag => {
      const a = anchors['layer_' + tag.dataset.layer];
      if (a && a.y > 60 && a.y < H - 40) {
        tag.style.display = 'block';
        tag.style.top = `${a.y}px`;
      } else {
        tag.style.display = 'none';
      }
    });
  }

  scene = new RigScene(root.querySelector('#scene-host'), {
    onFrame: (f) => {
      placeBubbles(f.anchors);
      depthEl.textContent = fmt(f.depthFt);
      // Tekanan bertambah ~0.433 psi per kaki kedalaman
      presEl.textContent = `${fmt(14.7 + f.depthFt * 0.44, 0)} psi`;
      // Gradien suhu: 28°C di permukaan + ~0.0085°C per kaki
      tempEl.textContent = `${fmt(28 + f.depthFt * 0.0085, 1)} °C`;
      layerNameEl.textContent = f.layerName;
      layerNameEl.classList.toggle('is-oil', f.layerId === 'reservoir');
      if (!draggingRange) range.value = f.depthFt;

      // Perbarui pill aktif
      presetPills.forEach(p => {
        const targetFt = parseInt(p.dataset.ft, 10);
        p.classList.toggle('active', Math.abs(f.depthFt - targetFt) < 1200);
      });
    },
    onToolClick: (sensorId) => {
      setExpanded(toolBubble, true);
      selectSensor(sensorId);
    }
  });

  if (mccCard) {
    updateMobileCard(0);
  }

  range.addEventListener('pointerdown', () => { draggingRange = true; });
  range.addEventListener('pointerup', () => { draggingRange = false; });
  range.addEventListener('input', () => scene.goToDepth(parseFloat(range.value)));

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const ft = parseFloat(pill.dataset.ft);
      scene.goToDepth(ft);
    });
  });

  root.querySelector('#cp-down').addEventListener('click', () => scene.goToReservoir());
  root.querySelector('#cp-up').addEventListener('click', () => scene.goToSurface());
  root.querySelector('#cp-bubbles').addEventListener('change', (e) => hero.classList.toggle('bubbles-hidden', !e.target.checked));

  // Wheel listener pada area hero untuk scroll kedalaman
  const onHeroWheel = (e) => {
    if (e.target.closest('.bubble-more') || e.target.closest('.hero-card')) return;
    const frac = scene.getFraction();
    // Jika sudah di paling dasar dan scroll ke bawah, biarkan scroll halaman normal
    if (frac >= 0.999 && e.deltaY > 0) return;
    // Jika sudah di paling atas dan scroll ke atas, biarkan scroll halaman normal
    if (frac <= 0.001 && e.deltaY < 0) return;

    e.preventDefault();
    const deltaFrac = (e.deltaY > 0 ? 1 : -1) * 0.038;
    scene.addFraction(deltaFrac);
  };
  hero.addEventListener('wheel', onHeroWheel, { passive: false });

  return () => {
    hero.removeEventListener('wheel', onHeroWheel);
    bubbles.forEach(b => b.ro.disconnect());
    scene.dispose();
  };
}
