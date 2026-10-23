/**
 * Halaman "Cara Kerja Aplikasi": ringkasan 5 langkah + halaman tiap langkah
 * dengan simulasi interaktif sederhana.
 */

const ICONS = {
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  report: '<path d="M4 4h16v16H4z"/><path d="M8 16V11M12 16V8M16 16v-3"/>'
};
const icon = (name, size = 22) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

export const STEPS = [
  {
    n: 1, icon: 'file', color: '#F15A24',
    title: 'Membaca Data Lapangan',
    oneLiner: 'Membuka rekaman dari alat (STO) dan dari derek kabel (TDF).',
    paragraphs: [
      'Setelah alat diangkat dari sumur, kita punya <b>dua file</b>: rekaman sensor dari memori alat (<b>STO</b>) dan catatan kedalaman dari derek kabel di permukaan (<b>TDF</b>).',
      'Isi kedua file masih berupa kode mesin yang tidak bisa dibaca manusia. Aplikasi menerjemahkannya menjadi tabel angka — ratusan ribu baris — tanpa ada satu pun data yang hilang atau diubah.'
    ],
    analogy: 'Seperti memindahkan foto dari kartu memori kamera ke komputer agar bisa dilihat.',
    inApp: 'Menu "Plot File STO & TDF"'
  },
  {
    n: 2, icon: 'clock', color: '#0EA5E9',
    title: 'Menyamakan Jam',
    oneLiner: 'Jam alat dan jam derek dicocokkan agar datanya sejajar.',
    paragraphs: [
      'Alat di dalam sumur dan derek di permukaan punya jam masing-masing. Seringkali selisihnya beberapa detik. Kalau dibiarkan, data sensor akan "nyasar" ke kedalaman yang salah.',
      'Aplikasi menampilkan kedua grafik atas-bawah. Pola yang sama (misalnya saat alat melewati sambungan pipa) dicocokkan sampai sejajar — bisa digeser manual atau otomatis.'
    ],
    analogy: 'Seperti menyamakan suara dan gambar pada video yang tidak sinkron.',
    inApp: 'Grafik "Dual Plot" & tombol Auto-Sync'
  },
  {
    n: 3, icon: 'layers', color: '#22C55E',
    title: 'Mengubah ke Kedalaman & Satuan Nyata',
    oneLiner: 'Angka mentah diubah jadi psi, °C, dan disusun per kedalaman.',
    paragraphs: [
      'Sensor sebenarnya hanya mencatat angka mentah (misalnya "48.213"). Dengan data kalibrasi dari pabrik, aplikasi mengubahnya menjadi satuan yang kita kenal: <b>psi</b> untuk tekanan, <b>°C</b> untuk suhu, dan <b>barel per hari</b> untuk aliran.',
      'Lalu data yang tadinya diurutkan berdasarkan <b>waktu</b> disusun ulang berdasarkan <b>kedalaman</b>. Hasilnya grafik memanjang ke bawah, persis seperti bentuk sumurnya.'
    ],
    analogy: 'Seperti menerjemahkan bahasa asing, lalu menyusun catatan harian menjadi peta.',
    inApp: 'Menu "Calibration" & "Data Merge"'
  },
  {
    n: 4, icon: 'target', color: '#8B5CF6',
    title: 'Fokus pada Zona Penting',
    oneLiner: 'Memilih bagian sumur tempat minyak benar-benar mengalir.',
    paragraphs: [
      'Sumur bisa sedalam ribuan meter, tetapi minyak hanya masuk dari bagian tertentu (zona perforasi). Bagian lainnya tidak terlalu penting untuk dianalisis.',
      'Engineer cukup menentukan batas atas dan bawah zona. Aplikasi memotong data di luar zona itu sehingga analisis lebih fokus dan rapi.'
    ],
    analogy: 'Seperti memotong video panjang hanya pada bagian yang penting.',
    inApp: 'Menu "Korelasi & Interpretasi"'
  },
  {
    n: 5, icon: 'report', color: '#F59E0B',
    title: 'Membuat Laporan',
    oneLiner: 'Hasil akhir dikemas jadi laporan grafik standar industri.',
    paragraphs: [
      'Semua hasil olahan dikemas menjadi <b>laporan strip log</b>: lembar memanjang berisi grafik per kedalaman, lengkap dengan identitas sumur, tanggal, dan catatan.',
      'Data juga bisa disimpan dalam format standar (<b>LAS</b>, <b>WIS</b>, <b>CSV</b>) agar bisa dibuka software lain yang dipakai perusahaan minyak.'
    ],
    analogy: 'Seperti hasil medical check-up yang dicetak rapi dan siap dibaca dokter.',
    inApp: 'Ekspor LAS / WIS / CSV & PDF Strip Log'
  }
];

/* ======================================================================
   Halaman ringkasan
   ====================================================================== */
export function renderOverview(root) {
  document.title = 'Cara Kerja Aplikasi — PDU PLT Suite';
  root.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="page-head">
          <span class="eyebrow">Cara kerja aplikasi</span>
          <h1>5 Langkah Mengubah Data Mentah Menjadi Laporan</h1>
          <p class="lead">Data yang terekam di lapangan masih "mentah". Berikut perjalanan data tersebut di dalam aplikasi <b>PLT Suite</b> sampai menjadi laporan yang siap dibaca.</p>
        </div>

        <div class="io-band">
          <div class="io-box">
            <span class="io-label">Masuk</span>
            <div class="io-files"><span class="file-chip orange">STO</span><span class="file-chip blue">TDF</span></div>
            <small>Rekaman alat & derek</small>
          </div>
          <div class="io-arrow">→</div>
          <div class="io-box io-app">
            <img src="/icon-company.png" alt="" />
            <b>PLT Suite</b>
            <small>Diolah dalam 5 langkah</small>
          </div>
          <div class="io-arrow">→</div>
          <div class="io-box">
            <span class="io-label">Keluar</span>
            <div class="io-files"><span class="file-chip green">Grafik</span><span class="file-chip amber">PDF</span><span class="file-chip purple">LAS</span></div>
            <small>Laporan & data standar</small>
          </div>
        </div>

        <div class="steps-grid">
          ${STEPS.map(s => `
            <a class="step-card" href="#/cara-kerja/${s.n}" style="--c:${s.color}">
              <div class="step-card-top">
                <span class="step-icon">${icon(s.icon)}</span>
                <span class="step-no">Langkah ${s.n}</span>
              </div>
              <h3>${s.title}</h3>
              <p>${s.oneLiner}</p>
              <span class="step-link">Pelajari & coba →</span>
            </a>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ======================================================================
   Halaman tiap langkah
   ====================================================================== */
export function renderStep(root, n) {
  const step = STEPS.find(s => s.n === n);
  if (!step) { location.hash = '#/cara-kerja'; return; }
  document.title = `Langkah ${n}: ${step.title} — PDU PLT Suite`;

  root.innerHTML = `
    <div class="page">
      <div class="container">
        <a href="#/cara-kerja" class="back-link">← Semua langkah</a>
        <nav class="stepper" aria-label="Langkah">
          ${STEPS.map(s => `
            <a href="#/cara-kerja/${s.n}" class="stepper-item ${s.n === n ? 'active' : ''} ${s.n < n ? 'done' : ''}">
              <span class="stepper-dot">${s.n < n ? '✓' : s.n}</span>
              <span class="stepper-label">${s.title}</span>
            </a>`).join('<span class="stepper-line"></span>')}
        </nav>

        <div class="step-layout">
          <div class="step-text" style="--c:${step.color}">
            <span class="step-badge">${icon(step.icon, 18)} Langkah ${n} dari 5</span>
            <h1>${step.title}</h1>
            ${step.paragraphs.map(p => `<p>${p}</p>`).join('')}
            <div class="analogy-box"><b>Ibaratnya:</b> ${step.analogy}</div>
            <div class="inapp"><span>Di aplikasi:</span> ${step.inApp}</div>
          </div>
          <div class="sim-card" id="sim"></div>
        </div>

        <div class="step-nav">
          ${n > 1 ? `<a class="btn btn-ghost" href="#/cara-kerja/${n - 1}">← Langkah ${n - 1}</a>` : `<a class="btn btn-ghost" href="#/">← Beranda</a>`}
          ${n < 5 ? `<a class="btn btn-primary" href="#/cara-kerja/${n + 1}">Lanjut: ${STEPS[n].title} →</a>` : `<a class="btn btn-primary" href="#/">Selesai — Kembali ke Beranda</a>`}
        </div>
      </div>
    </div>`;

  const sim = root.querySelector('#sim');
  const mounts = { 1: simIngest, 2: simSync, 3: simConvert, 4: simZone, 5: simReport };
  return mounts[n](sim);
}

/* ======================================================================
   Utilitas kanvas
   ====================================================================== */
function setupCanvas(canvas, height) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || 460;
  canvas.width = w * dpr;
  canvas.height = height * dpr;
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w, h: height };
}

function grid(ctx, w, h, step = 40) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#EEF2F7';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke(); }
  for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke(); }
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
}

const simHead = (title, status, statusId = '') => `
  <div class="sim-head">
    <span class="sim-title"><span class="sim-dot"></span>Coba sendiri: ${title}</span>
    <span class="pill" ${statusId ? `id="${statusId}"` : ''}>${status}</span>
  </div>`;

/* ======================================================================
   Simulasi 1 — membaca file
   ====================================================================== */
function simIngest(box) {
  box.innerHTML = `
    ${simHead('Membuka file', 'Belum dibuka', 'ing-status')}
    <div class="file-rows">
      <div class="file-row">
        <span class="file-chip orange">STO</span>
        <div class="file-info"><b>Rekaman_Alat.sto</b><small>Dari memori alat di dalam sumur</small></div>
        <span class="file-count" id="sto-c">0 baris</span>
      </div>
      <div class="file-row">
        <span class="file-chip blue">TDF</span>
        <div class="file-info"><b>Kedalaman_Derek.tdf</b><small>Dari derek kabel di permukaan</small></div>
        <span class="file-count" id="tdf-c">0 baris</span>
      </div>
    </div>
    <div class="code-preview" id="code-prev">
      <div class="code-label">Isi file sebelum dibaca (kode mesin):</div>
      <code>53 54 4F 20 31 2E 30 20 20 20 00 00 40 00 18 00 10 00 42 00 00 00 A4 1B ...</code>
    </div>
    <table class="data-table" id="tbl" hidden>
      <thead><tr><th>Jam</th><th>Kedalaman</th><th>Tekanan (mentah)</th><th>Suhu (mentah)</th></tr></thead>
      <tbody></tbody>
    </table>
    <button class="btn btn-primary btn-block" id="ing-btn">Buka & Baca Kedua File</button>`;

  const rows = [
    ['10:30:25.00', '6.120,0 ft', '48.213', '31.904'],
    ['10:30:25.04', '6.120,1 ft', '48.219', '31.906'],
    ['10:30:25.08', '6.120,1 ft', '48.224', '31.905'],
    ['10:30:25.12', '6.120,2 ft', '48.230', '31.909'],
    ['10:30:25.16', '6.120,3 ft', '48.236', '31.911']
  ];
  let timer;
  box.querySelector('#ing-btn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Sedang membaca...';
    const status = box.querySelector('#ing-status');
    status.textContent = 'Membaca...';
    status.className = 'pill pill-amber';
    let sto = 0, tdf = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      sto = Math.min(sto + 12500, 245820);
      tdf = Math.min(tdf + 3500, 68420);
      box.querySelector('#sto-c').textContent = sto.toLocaleString('id-ID') + ' baris';
      box.querySelector('#tdf-c').textContent = tdf.toLocaleString('id-ID') + ' baris';
      if (sto >= 245820) {
        clearInterval(timer);
        status.textContent = '100% terbaca';
        status.className = 'pill pill-green';
        btn.textContent = 'Selesai — 314.240 baris data siap diolah';
        box.querySelector('#code-prev').hidden = true;
        const tbl = box.querySelector('#tbl');
        tbl.hidden = false;
        tbl.querySelector('tbody').innerHTML = rows.map((r, i) =>
          `<tr style="animation-delay:${i * 80}ms">${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
      }
    }, 45);
  });
  return () => clearInterval(timer);
}

/* ======================================================================
   Simulasi 2 — menyamakan jam
   ====================================================================== */
function simSync(box) {
  box.innerHTML = `
    ${simHead('Menyamakan jam', 'Selisih +3,2 detik', 'sync-status')}
    <canvas class="sim-canvas" id="cv"></canvas>
    <div class="slider-row">
      <label for="sync-r">Geser jam alat</label>
      <b id="sync-v">+3,2 detik</b>
    </div>
    <input type="range" class="range" id="sync-r" min="-8" max="8" step="0.1" value="3.2" />
    <button class="btn btn-ghost btn-block" id="sync-auto">Samakan Otomatis</button>`;

  const canvas = box.querySelector('#cv');
  let offset = 3.2, anim;
  const peaks = [0.22, 0.48, 0.74];

  const draw = () => {
    const { ctx, w, h } = setupCanvas(canvas, 230);
    grid(ctx, w, h);
    const mid = h / 2;
    ctx.strokeStyle = '#CBD5E1';
    ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();

    const track = (baseY, color, shift, label) => {
      ctx.fillStyle = color;
      ctx.font = '600 12px Inter';
      ctx.fillText(label, 10, baseY - 72);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        let v = 0;
        peaks.forEach(p => { v += Math.exp(-Math.pow((x - (p * w + shift)) / 7, 2)) * 48; });
        const y = baseY - v + Math.sin(x * 0.25) * 1.5;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    track(mid - 14, '#F15A24', 0, 'Data alat (STO) — tanda sambungan pipa');
    track(h - 14, '#0EA5E9', offset * 12, 'Data derek (TDF) — tanda sambungan pipa');

    const aligned = Math.abs(offset) < 0.25;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = aligned ? '#22C55E' : '#94A3B8';
    peaks.forEach(p => { ctx.beginPath(); ctx.moveTo(p * w, 20); ctx.lineTo(p * w, h); ctx.stroke(); });
    ctx.setLineDash([]);
  };

  const status = box.querySelector('#sync-status');
  const slider = box.querySelector('#sync-r');
  const label = box.querySelector('#sync-v');
  const update = () => {
    const s = (offset >= 0 ? '+' : '') + offset.toFixed(1).replace('.', ',');
    label.textContent = `${s} detik`;
    if (Math.abs(offset) < 0.25) { status.textContent = 'Sudah sejajar!'; status.className = 'pill pill-green'; }
    else { status.textContent = `Selisih ${s} detik`; status.className = 'pill pill-amber'; }
    draw();
  };
  slider.addEventListener('input', () => { offset = parseFloat(slider.value); update(); });
  box.querySelector('#sync-auto').addEventListener('click', () => {
    cancelAnimationFrame(anim);
    const tick = () => {
      offset += (0 - offset) * 0.12;
      if (Math.abs(offset) < 0.02) offset = 0;
      slider.value = offset;
      update();
      if (offset !== 0) anim = requestAnimationFrame(tick);
    };
    tick();
  });
  update();
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  return () => { cancelAnimationFrame(anim); window.removeEventListener('resize', onResize); };
}

/* ======================================================================
   Simulasi 3 — konversi satuan & kedalaman
   ====================================================================== */
function simConvert(box) {
  box.innerHTML = `
    ${simHead('Ubah data mentah', 'Data mentah', 'cv-status')}
    <div class="toggle-group" role="tablist">
      <button class="toggle active" data-mode="raw">Sebelum</button>
      <button class="toggle" data-mode="cal">Sesudah</button>
    </div>
    <canvas class="sim-canvas" id="cv"></canvas>
    <p class="sim-caption" id="cv-cap"></p>`;

  const canvas = box.querySelector('#cv');
  let mode = 'raw';
  const noise = Array.from({ length: 400 }, () => Math.random() - 0.5);

  const draw = () => {
    const { ctx, w, h } = setupCanvas(canvas, 280);
    grid(ctx, w, h);
    ctx.font = '600 11px Inter';

    if (mode === 'raw') {
      // Horizontal: waktu → angka mentah
      ctx.fillStyle = '#64748B';
      ctx.fillText('Waktu →', w - 60, h - 10);
      ctx.save(); ctx.translate(14, h / 2 + 40); ctx.rotate(-Math.PI / 2); ctx.fillText('Angka mentah (counts)', 0, 0); ctx.restore();
      [['#3B82F6', 90, 'Tekanan: 48.213 ... 52.904'], ['#EF4444', 180, 'Suhu: 31.904 ... 33.120']].forEach(([c, base, lbl]) => {
        ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath();
        for (let i = 0; i < 400; i++) {
          const x = 30 + (i / 400) * (w - 40);
          const y = base + Math.sin(i * 0.05) * 18 + noise[i] * 14 - (i / 400) * 30;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = c; ctx.fillText(lbl, 34, base - 34);
      });
    } else {
      // Vertikal: kedalaman ↓, satuan nyata
      const left = 70;
      ctx.fillStyle = '#F8FAFC'; ctx.fillRect(0, 0, left - 8, h);
      ctx.fillStyle = '#475569';
      for (let i = 0; i <= 5; i++) {
        const y = 24 + i * ((h - 40) / 5);
        ctx.fillText(`${(6000 + i * 200).toLocaleString('id-ID')} ft`, 6, y + 4);
      }
      ctx.fillText('Kedalaman ↓', 6, 14);
      const tw = (w - left - 10) / 2;
      [['#3B82F6', 0, 'Tekanan (psi)', '2.580 → 2.950'], ['#EF4444', 1, 'Suhu (°C)', '73 → 82']].forEach(([c, k, lbl, range]) => {
        const x0 = left + k * tw;
        ctx.strokeStyle = '#E2E8F0'; ctx.strokeRect(x0 + 0.5, 20.5, tw - 6, h - 32);
        ctx.fillStyle = c; ctx.fillText(lbl, x0 + 6, 14);
        ctx.strokeStyle = c; ctx.lineWidth = 2.2; ctx.beginPath();
        for (let i = 0; i < 200; i++) {
          const y = 24 + (i / 200) * (h - 40);
          let x = x0 + 14 + (i / 200) * (tw - 40);
          if (k === 1 && i > 110 && i < 140) x -= Math.sin(((i - 110) / 30) * Math.PI) * 26; // anomali suhu
          x += noise[i] * 2;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#64748B'; ctx.fillText(range, x0 + 6, h - 2);
      });
      ctx.fillStyle = '#EF4444';
      ctx.fillText('← suhu turun: ada cairan masuk', left + tw + 6, 24 + (125 / 200) * (h - 40));
    }
  };

  const status = box.querySelector('#cv-status');
  const cap = box.querySelector('#cv-cap');
  const setMode = (m) => {
    mode = m;
    box.querySelectorAll('.toggle').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    if (m === 'raw') {
      status.textContent = 'Data mentah'; status.className = 'pill pill-amber';
      cap.innerHTML = 'Angka masih mentah dan diurutkan menurut <b>waktu</b>. Sulit dipahami.';
    } else {
      status.textContent = 'Sudah dikalibrasi'; status.className = 'pill pill-green';
      cap.innerHTML = 'Angka sudah dalam <b>psi</b> & <b>°C</b>, disusun menurut <b>kedalaman</b>. Terlihat ada perubahan suhu di sekitar 6.630 ft.';
    }
    draw();
  };
  box.querySelectorAll('.toggle').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  setMode('raw');
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

/* ======================================================================
   Simulasi 4 — memilih zona
   ====================================================================== */
function simZone(box) {
  const D0 = 5000, D1 = 8000;
  box.innerHTML = `
    ${simHead('Pilih zona minyak', 'Zona belum tepat', 'zn-status')}
    <canvas class="sim-canvas" id="cv"></canvas>
    <div class="slider-row"><label>Batas atas</label><b id="zn-top-v"></b></div>
    <input type="range" class="range" id="zn-top" min="${D0}" max="${D1}" step="10" value="5400" />
    <div class="slider-row"><label>Batas bawah</label><b id="zn-bot-v"></b></div>
    <input type="range" class="range" id="zn-bot" min="${D0}" max="${D1}" step="10" value="7600" />
    <button class="btn btn-ghost btn-block" id="zn-auto">Pilih Otomatis Zona Aliran Terbesar</button>`;

  const canvas = box.querySelector('#cv');
  const topR = box.querySelector('#zn-top'), botR = box.querySelector('#zn-bot');
  const flow = (d) => {
    // aliran naik di zona perforasi 6.200–6.700 ft
    const z = Math.exp(-Math.pow((d - 6450) / 170, 2));
    return 0.08 + z * 0.85 + Math.sin(d * 0.05) * 0.02;
  };

  const draw = () => {
    const top = +topR.value, bot = +botR.value;
    const { ctx, w, h } = setupCanvas(canvas, 260);
    grid(ctx, w, h);
    const yOf = (d) => 10 + ((d - D0) / (D1 - D0)) * (h - 20);
    const left = 70;

    ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.fillRect(left, yOf(top), w - left - 10, yOf(bot) - yOf(top));
    ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 2;
    [top, bot].forEach(d => { ctx.beginPath(); ctx.moveTo(left, yOf(d)); ctx.lineTo(w - 10, yOf(d)); ctx.stroke(); });

    ctx.font = '600 11px Inter'; ctx.fillStyle = '#475569';
    for (let d = D0; d <= D1; d += 500) ctx.fillText(`${d.toLocaleString('id-ID')} ft`, 6, yOf(d) + 4);

    // kurva aliran
    ctx.strokeStyle = '#0EA5E9'; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let d = D0; d <= D1; d += 10) {
      const x = left + 10 + flow(d) * (w - left - 40);
      d === D0 ? ctx.moveTo(x, yOf(d)) : ctx.lineTo(x, yOf(d));
    }
    ctx.stroke();
    ctx.fillStyle = '#0EA5E9'; ctx.fillText('Aliran cairan →', w - 110, 22);
    ctx.fillStyle = '#B45309'; ctx.fillText('lubang perforasi', left + 6, yOf(6450) + 4);
  };

  const status = box.querySelector('#zn-status');
  const update = (src) => {
    let top = +topR.value, bot = +botR.value;
    if (top > bot - 100) { if (src === topR) topR.value = bot - 100; else botR.value = top + 100; }
    top = +topR.value; bot = +botR.value;
    box.querySelector('#zn-top-v').textContent = `${top.toLocaleString('id-ID')} ft`;
    box.querySelector('#zn-bot-v').textContent = `${bot.toLocaleString('id-ID')} ft`;
    const good = top >= 6050 && top <= 6300 && bot >= 6600 && bot <= 6850;
    status.textContent = good ? `Tepat! Zona ${(bot - top).toLocaleString('id-ID')} ft` : `Zona ${(bot - top).toLocaleString('id-ID')} ft — masih terlalu lebar/meleset`;
    status.className = good ? 'pill pill-green' : 'pill pill-amber';
    draw();
  };
  topR.addEventListener('input', () => update(topR));
  botR.addEventListener('input', () => update(botR));
  let anim;
  box.querySelector('#zn-auto').addEventListener('click', () => {
    cancelAnimationFrame(anim);
    const tick = () => {
      const t = +topR.value + (6180 - topR.value) * 0.15;
      const b = +botR.value + (6720 - botR.value) * 0.15;
      topR.value = Math.round(t); botR.value = Math.round(b);
      update();
      if (Math.abs(t - 6180) > 5 || Math.abs(b - 6720) > 5) anim = requestAnimationFrame(tick);
      else { topR.value = 6180; botR.value = 6720; update(); }
    };
    tick();
  });
  update();
  const onResize = () => draw();
  window.addEventListener('resize', onResize);
  return () => { cancelAnimationFrame(anim); window.removeEventListener('resize', onResize); };
}

/* ======================================================================
   Simulasi 5 — laporan
   ====================================================================== */
function simReport(box) {
  box.innerHTML = `
    ${simHead('Buat laporan', 'Skala 1:200')}
    <div class="paper">
      <div class="paper-title">
        <img src="/icon-company.png" alt="" />
        <div>
          <b>PRODUCTION LOGGING — STRIP LOG</b>
          <small>Sumur MINAS-01 • Lapangan Riau • 23-Oct-2026</small>
        </div>
      </div>
      <div class="paper-tracks">
        <div class="ptrack"><div class="ptrack-h" style="color:#22C55E">Batuan (GR)</div>
          <svg viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M40 0 C20 30 70 50 45 80 S20 130 60 150 S40 190 50 200" stroke="#22C55E" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/></svg></div>
        <div class="ptrack depth"><div class="ptrack-h">Kedalaman</div>
          <div class="depth-ticks"><span>6.100</span><span>6.300</span><span>6.500</span><span>6.700</span><span>6.900</span></div></div>
        <div class="ptrack"><div class="ptrack-h" style="color:#3B82F6">Tekanan & Suhu</div>
          <svg viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M15 0 L85 200" stroke="#3B82F6" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/><path d="M30 0 L50 95 L38 115 L62 200" stroke="#EF4444" stroke-width="2" stroke-dasharray="4 3" fill="none" vector-effect="non-scaling-stroke"/></svg></div>
        <div class="ptrack"><div class="ptrack-h" style="color:#0EA5E9">Aliran</div>
          <svg viewBox="0 0 100 200" preserveAspectRatio="none"><path d="M10 0 L10 70 C40 90 80 95 85 120 L85 200" stroke="#0EA5E9" stroke-width="2.4" fill="none" vector-effect="non-scaling-stroke"/></svg>
          <span class="pnote">← minyak masuk</span></div>
      </div>
    </div>
    <div class="format-row">
      <span>Simpan juga sebagai:</span>
      <span class="file-chip purple">LAS</span><span class="file-chip blue">WIS</span><span class="file-chip green">CSV</span>
    </div>
    <button class="btn btn-primary btn-block" id="rp-btn">Buat Laporan PDF</button>`;

  box.querySelector('#rp-btn').addEventListener('click', () => toast('Contoh laporan strip log PDF berhasil dibuat (demo).'));
}
