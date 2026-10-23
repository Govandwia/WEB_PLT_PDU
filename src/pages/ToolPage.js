import { SENSORS } from '../data/sensors.js';

export function renderToolPage(root) {
  document.title = 'Mengenal Sensor Alat PLT — PDU PLT Suite';
  root.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="page-head">
          <span class="eyebrow">Alat PLT</span>
          <h1>Satu Alat, Tujuh Sensor</h1>
          <p class="lead">Alat PLT adalah tabung baja sepanjang beberapa meter yang berisi beberapa sensor sekaligus. Klik bagian alat di kiri untuk melihat penjelasannya.</p>
        </div>

        <div class="tool-layout">
          <div class="tool-diagram-wrap">
            <div class="tool-cable"></div>
            <div class="tool-diagram">
              ${SENSORS.map(s => `
                <button class="tool-seg ${s.id === 'spin' ? 'is-spin' : ''}" data-id="${s.id}" style="--c:${s.color}; height:${Math.round(s.h * 95)}px">
                  <span class="tool-band"></span>
                  <span class="tool-seg-label">${s.short}</span>
                </button>`).join('')}
              <div class="tool-nose"></div>
            </div>
          </div>

          <div class="sensor-cards">
            ${SENSORS.map((s, i) => `
              <article class="sensor-card" id="card-${s.id}" style="--c:${s.color}">
                <div class="sensor-card-head">
                  <span class="sensor-no">${i + 1}</span>
                  <h3>${s.name}</h3>
                </div>
                <p>${s.desc}</p>
                <div class="sensor-meta">
                  <span class="analogy-chip"><b>Ibaratnya:</b> ${s.analogy}</span>
                  <span class="reading-chip">Contoh bacaan: <b>${s.reading}</b></span>
                </div>
              </article>`).join('')}
          </div>
        </div>

        <div class="cta-band">
          <div>
            <h3>Sudah kenal sensornya?</h3>
            <p>Sekarang lihat bagaimana rekaman sensor-sensor ini diolah oleh aplikasi PLT Suite.</p>
          </div>
          <a href="#/cara-kerja" class="btn btn-white">Lihat Cara Kerja →</a>
        </div>
      </div>
    </div>`;

  const select = (id, scroll) => {
    root.querySelectorAll('.tool-seg').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    root.querySelectorAll('.sensor-card').forEach(c => c.classList.toggle('active', c.id === `card-${id}`));
    if (scroll) root.querySelector(`#card-${id}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  root.querySelectorAll('.tool-seg').forEach(b => b.addEventListener('click', () => select(b.dataset.id, true)));
  root.querySelectorAll('.sensor-card').forEach(c => c.addEventListener('mouseenter', () => select(c.id.replace('card-', ''), false)));
}
