# Pride – Front end

Front end website undangan digital **Pride**, dibuat dengan React (Vite) dan React Router.
Tampilan mengikuti desain UI/UX di kanvas desain Pride.

## Menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev      # buka alamat yang tampil, biasanya http://localhost:5173
npm run build    # hasil build ada di folder dist
```

> Catatan: project ini disusun di lingkungan tanpa akses ke registry npm, jadi `npm install`
> dan `npm run build` belum pernah dijalankan. Kode sudah lolos pemeriksaan sintaks, tetapi
> jalankan dua perintah di atas lebih dulu dan perbaiki bila ada galat.

## Halaman

| Alamat | File | Isi |
| --- | --- | --- |
| `/` | `src/pages/Home.jsx` | Landing page: acara, fitur, cara kerja, template, paket, FAQ |
| `/katalog` | `src/pages/Katalog.jsx` | Katalog dengan filter jenis acara dan kolom cari |
| `/undangan` | `src/pages/Undangan.jsx` | Contoh undangan (mobile), countdown, RSVP, ucapan |
| `/masuk` | `src/pages/Login.jsx` | Masuk dengan nomor WhatsApp dan kode 6 digit |
| `/dashboard` | `src/pages/Dashboard.jsx` | Ringkasan, daftar tamu, ucapan (wajib masuk dulu) |
| `/tutorial` | `src/pages/Tutorial.jsx` | Panduan enam langkah |

Parameter alamat yang dipakai:

- `/katalog?kategori=Wisuda&cari=toga` untuk filter katalog.
- `/undangan?template=noir&to=Budi` untuk memilih template dan nama tamu.
- `/masuk?paket=Standard&template=aurelia` untuk membawa pilihan ke halaman masuk.

## Struktur

```
src/
  components/   Navbar, Footer, Button, kartu template, kartu paket, dll.
  pages/        Satu file per halaman
  data/         Teks landing page dan data template contoh
  services/     api.js: satu-satunya tempat pemanggilan back end
  styles/       global.css (token), components.css, pages.css
  auth.jsx      Sesi masuk (disimpan di localStorage)
  config.js     Nomor WhatsApp admin, kontak, mode demo
```

Warna dan huruf ada di bagian atas `src/styles/global.css` (`:root`).

## Yang perlu diisi tim

- `src/config.js`: `ADMIN_WHATSAPP` dan akun Instagram/TikTok.
- `src/data/content.js`: harga dan durasi paket (`Rp [HARGA]`, `[DURASI]`).
- `src/components/Logo.jsx`: ganti logo buatan ulang dengan berkas logo asli.
- Foto, peta, dan video tutorial yang sekarang masih berupa tanda kurung siku.

## Untuk back end (Lutfi)

Semua halaman memanggil fungsi di `src/services/api.js`. Selama `DEMO_MODE = true`
(di `src/config.js`) data disimpan di browser. Untuk menyambung ke back end, ubah
`DEMO_MODE` menjadi `false` dan sesuaikan `API_BASE_URL`. Endpoint yang diharapkan:

| Fungsi | Endpoint | Kirim | Terima |
| --- | --- | --- | --- |
| `sendOtp` | `POST /auth/otp` | `{ phone }` | `{ ok: true }` |
| `verifyOtp` | `POST /auth/verify` | `{ phone, code }` | `{ token, phone }` |
| `listGuests` | `GET /guests` | - | `[{ id, name, status, count }]` |
| `addGuest` | `POST /guests` | `{ name, count, status }` | tamu yang dibuat |
| `listWishes` | `GET /wishes` | - | `[{ id, name, message }]` |
| `submitRsvp` | `POST /rsvp` | `{ name, attendance, message }` | ucapan yang dibuat |

Nilai `status` tamu: `Hadir`, `Tidak hadir`, `Belum konfirmasi`.
Nomor telepon dikirim tanpa awalan 0 atau 62 (contoh `81234567890`).
Token dari `verifyOtp` belum dikirim sebagai header; tambahkan di fungsi `request`
setelah format autentikasinya disepakati.

## Belum dikerjakan

- Penyuntingan data acara dan unggah foto di dashboard (tombol Sunting dan Impor tamu masih tanda).
- Pembayaran paket setelah masuk.
- Data undangan (nama mempelai, tanggal, lokasi) masih contoh di `Undangan.jsx`.
