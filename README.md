# PDU PLT Suite — Web Interaktif 3D Production Logging Tool

Platform web interaktif 3D yang dirancang untuk menjelaskan cara kerja **Production Logging Tool (PLT)** dan alur pengolahan data petrofisika cerdas oleh **PT Parama Data Unit (PDU)**.

Dibuat dengan pendekatan ramah pengguna agar orang awam maupun profesional migas dapat memahami bagaimana sensor-sensor canggih memeriksa kondisi sumur minyak ribuan meter di bawah tanah dan bagaimana perangkat lunak **PLT Suite v3.5** mengolahnya menjadi laporan visual.

---

## 🌟 Fitur Utama

### 1. Simulasi 3D Cross-Section Sumur & Rig
- **Visualisasi Geologi Melintang**: Model 3D Drilling Rig, truk wireline, wellhead, dan penampang tanah berlapis (*soil*, *sandstone*, *shale*, *oil reservoir*, *deep sand & gas*, *brine aquifer*, *basement*).
- **Penjelajahan Kedalaman Ekstrem (0 - 15.000 ft)**:
  - Scroll mouse wheel langsung di area simulasi untuk menurunkan alat ke dalam sumur.
  - Kamera bergerak dinamis mengikuti posisi alat (*vertical tracking*) dengan interpolasi halus.
  - Tombol pintas cepat (*preset pills*): Permukaan (0 ft), Pasir (2.500 ft), Serpih (5.000 ft), ★ Lapisan Minyak (8.000 ft), dan Dasar (15.000 ft).
- **Bubble Penjelasan 3D Anti-Tabrakan**:
  - Penjelasan interaktif komponen Rig, Kabel Wireline, Truk Logging, Pipa Casing, Alat PLT, dan Lapisan Minyak.
  - Dilengkapi algoritma *2D collision resolution* otomatis agar bubble tidak pernah saling menutupi.
- **Telemetri Real-Time**:
  - Perhitungan tekanan hidrostatis (*psi*) dan gradien geotermal (*°C*) secara matematis sesuai kedalaman aktual.
  - Efek partikel rembesan minyak yang mengalir ke dalam sumur lewat lubang perforasi.

### 2. Alur 5 Tahap Pengolahan Data Aplikasi (Proses Petrofisika)
Penjelasan interaktif tahapan perangkat lunak mengolah rekaman sumur:
1. **Ekstraksi & Ingestion Berkas Lapangan (WIS/TDF/STO)**: Simulasi drag-and-drop parsing berkas biner Sitan.
2. **Sinkronisasi Otomatis Kedalaman & Waktu (Dual-Plot Time-Depth AutoSync)**: Algoritma penyamaan waktu alat di dasar sumur dan waktu tarikan derek di permukaan.
3. **Konversi Satuan & Kalibrasi Standar**: Kalibrasi sensor suhu (°C/°F), tekanan (psi/bar), gamma ray (API), dan kincir aliran (RPS).
4. **Pemotongan Zona Logging Berdasarkan Kedalaman (Depth Slicing)**: Isolasi interval kedalaman target (Up-Pass, Down-Pass, Flowing, Shut-In).
5. **Generasi Strip Log PDF Standar API & Export LAS 2.0 / CSV**: Pratinjau strip log visual multi-track dan ekspor data standar industri.

### 3. Studio Mengenal 7 Sensor PLT
Eksplorasi mendalam 7 sensor dengan analogi kehidupan sehari-hari:
- **Kepala Kabel & Tarikan**: Mengukur tarikan agar kabel tidak putus.
- **CCL (Casing Collar Locator)**: Pendeteksi sambungan pipa magnetik.
- **GR (Gamma Ray)**: Pendeteksi radioaktivitas alami batuan.
- **Platinum Temperature Sensor**: Sensor suhu presisi tinggi pendeteksi anomali gas.
- **Quartz Pressure Gauge**: Sensor tekanan kristal kuarsa.
- **Fluid Density Sensor**: Pendeteksi jenis cairan (minyak vs air vs gas).
- **Continuous & Fullbore Flowmeter (Spinner)**: Kincir pengukur laju aliran cairan sumur.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Core**: Vanilla HTML5, CSS3, & Modern Modular JavaScript (ES Modules).
- **3D Graphics Engine**: [Three.js](https://threejs.org/) (WebGL) dengan procedural texturing dan dynamic lighting.
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/).
- **Design System**: Light & Bright Theme dengan identitas warna PDU Orange (`#F15A24`), tipografi Outfit & Inter dari Google Fonts.

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- Git

### Instalasi & Menjalankan

1. Clone repositori:
```bash
git clone https://github.com/Govandwia/WEB_PLT_PDU.git
cd WEB_PLT_PDU
```

2. Instal dependensi:
```bash
npm install
```

3. Jalankan server pengembangan lokal:
```bash
npm run dev
```
Buka peramban pada alamat yang ditampilkan di terminal (biasanya `http://localhost:5173/`).

4. Build untuk produksi:
```bash
npm run build
```
Hasil build siap di-*deploy* akan berada di folder `dist/`.

---

## 📄 Hak Cipta & Lisensi

Dikembangkan untuk **PT Parama Data Unit (PDU)** — Solusi Instrumentasi dan Perangkat Lunak Petrofisika Sumur Migas & Panas Bumi.
