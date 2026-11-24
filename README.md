# Pride Studio Frontend

Frontend React + Vite untuk undangan digital Pride Studio.

## Jalankan lokal

1. Pastikan Node.js LTS terpasang.
2. Buka terminal di folder proyek.
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.

## Login dengan Google

1. Buat OAuth Client ID tipe **Web application** di Google Cloud Console.
2. Tambahkan origin frontend (misalnya `http://localhost:5173`) ke **Authorized JavaScript origins**.
3. Isi `VITE_GOOGLE_CLIENT_ID` di environment frontend dan `GOOGLE_CLIENT_ID` di backend dengan Client ID yang sama.
4. Set `VITE_DEMO_MODE=false` agar halaman masuk menggunakan endpoint backend.

Client ID bersifat publik; backend memverifikasi kredensial Google sebelum menerbitkan sesi Pride. Client secret tidak diperlukan untuk alur ini.

## Yang tersedia pada versi ini

- Halaman Home, Acara, Fitur, Paket, Checkout, Katalog, Editor, Preview Undangan, Login, dan Dashboard.
- **82 template contoh dalam delapan kategori:** Pernikahan (12), Ulang tahun (10), Wisuda (10), Sempro/Semhas (10), Bukber & Khitanan (10), Acara kantor (10), Aqiqah & Tasyakuran (10), dan Anniversary & Reuni (10).
- Setiap kategori dan template sudah memakai **foto asli** (Unsplash) yang relevan — bukan warna solid.
- **Hero preview** di Home menampilkan mockup HP dengan foto pengantin, seperti undangan formal.
- Katalog mengharuskan pengguna melewati alur paket dan konfirmasi pembayaran demo terlebih dahulu.
- Editor contoh untuk teks, tanggal, lokasi, warna, serta pilihan dan preview musik latar.
- Tombol bantuan Instagram menggunakan akun `@bypride.studio`.

## Struktur
