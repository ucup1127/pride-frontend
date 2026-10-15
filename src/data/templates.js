// Data contoh template. Nanti diganti data dari back end (GET /templates).

export const CATEGORIES = [
  'Semua',
  'Pernikahan',
  'Ulang tahun',
  'Wisuda',
  'Ujian & UP',
  'Bukber',
  'Khitanan',
  'Acara kantor',
  'Ucapan custom',
];

export const TEMPLATES = [
  { id: 'aurelia', name: 'Aurelia', style: 'Klasik', category: 'Pernikahan', tag: 'Populer', event: 'THE WEDDING OF', names: 'Nadia & Raka', date: '12 · 12 · 2026', bg: '#EFE6D3', fg: '#4A3A1E' },
  { id: 'verdant', name: 'Verdant', style: 'Botanikal', category: 'Pernikahan', tag: 'Baru', event: 'THE WEDDING OF', names: 'Salsa & Bima', date: '20 · 02 · 2027', bg: '#DDE3D3', fg: '#2F3B2A' },
  { id: 'noir', name: 'Noir', style: 'Modern', category: 'Pernikahan', tag: 'Populer', event: 'THE WEDDING OF', names: 'Tari & Dimas', date: '03 · 04 · 2027', bg: '#2A2926', fg: '#E8DCC0' },
  { id: 'blush', name: 'Blush', style: 'Romantis', category: 'Pernikahan', tag: 'Baru', event: 'THE WEDDING OF', names: 'Maya & Ardi', date: '15 · 05 · 2027', bg: '#F2DDD6', fg: '#5A3029' },
  { id: 'sage', name: 'Sage', style: 'Minimalis', category: 'Pernikahan', tag: 'Pernikahan', event: 'THE WEDDING OF', names: 'Lia & Fajar', date: '10 · 07 · 2027', bg: '#E6EADF', fg: '#33402D' },
  { id: 'gala', name: 'Gala', style: 'Elegan', category: 'Ulang tahun', tag: 'Ulang tahun', event: 'BIRTHDAY', names: 'Sinta 30', date: '08 · 03 · 2027', bg: '#F2DDD6', fg: '#5A3029' },
  { id: 'toga', name: 'Toga', style: 'Klasik', category: 'Wisuda', tag: 'Wisuda', event: 'WISUDA', names: 'Bima, S.T.', date: '14 · 08 · 2027', bg: '#DCE6EA', fg: '#243B47' },
  { id: 'sidang', name: 'Sidang', style: 'Formal', category: 'Ujian & UP', tag: 'Ujian', event: 'UJIAN PROPOSAL', names: 'Rani Putri', date: '[TANGGAL]', bg: '#E9E6E0', fg: '#2A2926' },
  { id: 'iftar', name: 'Iftar', style: 'Hangat', category: 'Bukber', tag: 'Bukber', event: 'BUKA PUASA BERSAMA', names: 'Bukber Alumni', date: '[TANGGAL]', bg: '#EADFC8', fg: '#4A3A1E' },
  { id: 'tirta', name: 'Tirta', style: 'Ceria', category: 'Khitanan', tag: 'Khitanan', event: 'KHITANAN', names: 'Aksa', date: '24 · 01 · 2027', bg: '#DCE6EA', fg: '#243B47' },
  { id: 'forum', name: 'Forum', style: 'Formal', category: 'Acara kantor', tag: 'Kantor', event: 'ANNUAL GATHERING', names: '[NAMA ACARA]', date: '[TANGGAL]', bg: '#E9E6E0', fg: '#2A2926' },
  { id: 'salam', name: 'Salam', style: 'Fleksibel', category: 'Ucapan custom', tag: 'Custom', event: 'UCAPAN', names: '[JUDUL KAMU]', date: '[TANGGAL]', bg: '#FBF8F2', fg: '#2A2926' },
];

export const FEATURED_IDS = ['aurelia', 'gala', 'toga'];

export const findTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
