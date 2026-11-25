// Teks landing page dan tutorial dipisah dari komponen agar mudah diubah.

export const MOMENTS = [
  { title: 'Pernikahan', text: 'Cerita cinta, acara, peta, dan RSVP dalam satu tautan.', bg: '#EFE6D3', fg: '#3A2E16', category: 'Pernikahan' },
  { title: 'Ulang Tahun', text: 'Ajak teman dan keluarga merayakan dengan undangan penuh warna.', bg: '#F2DDD6', fg: '#4A241D', category: 'Ulang tahun' },
  { title: 'Wisuda', text: 'Bagikan kebahagiaan kelulusan dengan desain yang berkesan.', bg: '#DCE6EA', fg: '#1E3340', category: 'Wisuda' },
  { title: 'Sempro / Semhas', text: 'Informasikan jadwal dan lokasi sidang dengan tampilan formal.', bg: '#E9E6E0', fg: '#2A2926', category: 'Sempro/Semhas' },
  { title: 'Bukber & Khitanan', text: 'Undang keluarga dan sahabat untuk momen kebersamaan.', bg: '#DDE3D3', fg: '#26331F', category: 'Bukber & Khitanan' },
  { title: 'Acara Kantor', text: 'Undangan profesional untuk gathering, seminar, dan acara tim.', bg: '#E7DFD2', fg: '#393326', category: 'Acara kantor' },
];

export const FEATURES = [
  { no: '01', title: 'Template elegan', text: 'Koleksi desain minimalis yang bisa disesuaikan warna dan fontnya.' },
  { no: '02', title: 'RSVP & ucapan', text: 'Tamu konfirmasi kehadiran dan menulis ucapan langsung dari undangan.' },
  { no: '03', title: 'Peta lokasi', text: 'Tautan Google Maps agar tamu mudah menemukan tempat acara.' },
  { no: '04', title: 'Galeri & musik', text: 'Unggah foto prewedding dan pilih musik latar favorit.' },
  { no: '05', title: 'Nama tamu personal', text: 'Setiap tamu mendapat tautan dengan namanya sendiri.' },
  { no: '06', title: 'Countdown acara', text: 'Hitung mundur otomatis menuju hari H.' },
  { no: '07', title: 'Banyak jenis acara', text: 'Pernikahan, ulang tahun, wisuda, ujian, bukber, dan lainnya.' },
  { no: '08', title: 'Ucapan custom', text: 'Tulis judul, pesan, dan tampilan sendiri untuk momen apa pun.' },
  { no: '09', title: 'Bantuan via Instagram', text: 'Hubungi tim Pride melalui @bypride.studio jika kamu memerlukan bantuan.' },
];

export const STEPS = [
  { no: '1', title: 'Pilih template', text: 'Jelajahi katalog untuk pernikahan, ulang tahun, wisuda, dan acara lain.' },
  { no: '2', title: 'Masuk ke akun Pride', text: 'Pilih paket, lalu masuk menggunakan email dan kata sandi akunmu.' },
  { no: '3', title: 'Isi data acara', text: 'Nama, tanggal, lokasi, foto, atau ucapan custom milikmu.' },
  { no: '4', title: 'Bagikan & pantau', text: 'Kirim tautan lewat Instagram dan lihat konfirmasi tamu di dashboard.' },
];

export const FAQS = [
  { q: 'Bagaimana cara memesan?', a: 'Pilih paket, lalu masuk ke akun Pride menggunakan email dan kata sandi. Jika belum memiliki akun, hubungi tim Pride melalui halaman Bantuan.' },
  { q: 'Apakah undangan bisa diubah setelah dibagikan?', a: 'Bisa. Perubahan data langsung tampil di tautan yang sama.' },
  { q: 'Berapa lama undangan aktif?', a: 'Sesuai paket yang dipilih. Detail durasi ada di tabel paket.' },
  { q: 'Apakah tamu perlu memasang aplikasi?', a: 'Tidak. Undangan dibuka lewat browser di HP atau komputer.' },
  { q: 'Bagaimana cara memantau kehadiran tamu?', a: 'Semua konfirmasi RSVP muncul di dashboard pelanggan.' },
];

export const TUTORIAL_STEPS = [
  { no: '1', title: 'Pilih jenis acara', text: 'Buka katalog lalu filter sesuai acara: pernikahan, ulang tahun, wisuda, ujian, bukber, atau ucapan custom.', to: '/katalog', cta: 'Buka katalog' },
  { no: '2', title: 'Lihat pratinjau', text: 'Klik Pratinjau untuk melihat contoh undangan di tampilan HP sebelum memutuskan.', to: '/undangan', cta: 'Lihat contoh undangan' },
  { no: '3', title: 'Pilih paket dan masuk ke Pride', text: 'Klik Beli, lalu masuk menggunakan email dan kata sandi akun Pride. Jika belum memiliki akun, hubungi tim kami melalui halaman Bantuan.', to: '/masuk', cta: 'Masuk ke Pride' },
  { no: '4', title: 'Isi data acara', text: 'Lengkapi nama, tanggal, lokasi, foto, dan musik. Untuk ucapan custom, tulis judul dan pesanmu sendiri.', to: '/dashboard', cta: 'Buka dashboard' },
  { no: '5', title: 'Tambahkan daftar tamu', text: 'Masukkan nama tamu agar setiap orang mendapat tautan dengan namanya sendiri.', to: '/dashboard', cta: 'Kelola tamu' },
  { no: '6', title: 'Bagikan dan pantau', text: 'Salin tautan, kirim lewat Instagram, lalu pantau konfirmasi hadir dan ucapan di dashboard.', to: '/dashboard', cta: 'Lihat RSVP' },
];

export const TIPS = [
  { title: 'Siapkan foto lebih dulu', text: 'Pilih foto beresolusi baik agar tampil tajam di layar HP.' },
  { title: 'Cek ulang tanggal dan lokasi', text: 'Pastikan tautan peta mengarah ke tempat yang benar sebelum disebar.' },
  { title: 'Kirim sedikit demi sedikit', text: 'Sebar ke beberapa tamu dulu untuk memastikan tautannya terbuka dengan baik.' },
];
