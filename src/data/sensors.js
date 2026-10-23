/**
 * Data sensor pada rangkaian alat PLT (urutan dari atas ke bawah).
 * Bahasa dibuat sederhana agar mudah dipahami orang awam.
 * `h` = tinggi segmen pada model 3D (satuan scene).
 */
export const SENSORS = [
  {
    id: 'head',
    short: 'Kepala Kabel',
    name: 'Kepala Kabel (Cable Head)',
    color: '#F15A24',
    h: 0.35,
    analogy: 'Seperti colokan yang menyambungkan alat ke kabel.',
    desc: 'Titik sambung antara kabel wireline dan rangkaian alat. Posisi ini dipakai sebagai titik nol untuk mengukur jarak setiap sensor.',
    reading: 'Tarikan kabel: 1.420 lbs'
  },
  {
    id: 'ccl',
    short: 'Pendeteksi Sambungan Pipa',
    name: 'CCL — Casing Collar Locator',
    color: '#8B5CF6',
    h: 0.6,
    analogy: 'Seperti detektor logam di bandara.',
    desc: 'Mendeteksi sambungan pipa sumur yang ada setiap ±10 meter. Sambungan ini menjadi "patok meteran" agar kedalaman alat selalu tepat.',
    reading: 'Sinyal sambungan: 145 mV'
  },
  {
    id: 'gr',
    short: 'Sensor Radiasi Batuan',
    name: 'GR — Gamma Ray',
    color: '#22C55E',
    h: 0.75,
    analogy: 'Seperti membaca sidik jari batuan.',
    desc: 'Setiap jenis batuan memancarkan radiasi alami yang sangat kecil dan berbeda-beda. Sensor ini membacanya untuk mengenali lapisan batuan di sekitar sumur.',
    reading: '78 API (batu pasir)'
  },
  {
    id: 'temp',
    short: 'Sensor Suhu',
    name: 'WTT — Sensor Suhu',
    color: '#EF4444',
    h: 0.55,
    analogy: 'Seperti termometer yang sangat peka.',
    desc: 'Mengukur suhu cairan di dalam sumur. Perubahan suhu yang tiba-tiba menandakan ada minyak, gas, atau air yang masuk ke sumur di titik itu.',
    reading: '76,4 °C'
  },
  {
    id: 'pres',
    short: 'Sensor Tekanan',
    name: 'QPST — Sensor Tekanan',
    color: '#3B82F6',
    h: 0.8,
    analogy: 'Seperti alat ukur tekanan ban, tetapi ribuan kali lebih teliti.',
    desc: 'Mengukur tekanan cairan di dalam sumur. Tekanan menunjukkan seberapa kuat minyak bisa terdorong naik ke permukaan dengan sendirinya.',
    reading: '2.810 psi'
  },
  {
    id: 'dens',
    short: 'Sensor Kepadatan Cairan',
    name: 'FDIT — Sensor Densitas',
    color: '#F59E0B',
    h: 0.7,
    analogy: 'Seperti menimbang cairan untuk mengetahui jenisnya.',
    desc: 'Gas itu ringan, minyak sedang, dan air paling berat. Dengan mengukur berat jenis cairan, sensor ini tahu cairan apa yang sedang mengalir.',
    reading: '0,84 g/cc (minyak)'
  },
  {
    id: 'spin',
    short: 'Kincir Pengukur Aliran',
    name: 'Spinner — Pengukur Aliran',
    color: '#0EA5E9',
    h: 0.85,
    analogy: 'Seperti kincir angin yang berputar karena tiupan angin.',
    desc: 'Baling-baling kecil yang berputar ketika cairan mengalir melewatinya. Semakin cepat berputar, semakin banyak cairan yang mengalir.',
    reading: '24 putaran/detik'
  }
];

export const TOOL_LENGTH = SENSORS.reduce((sum, s) => sum + s.h, 0) + 0.3;
