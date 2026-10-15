// Pengaturan yang perlu diisi tim sebelum rilis.

// Nomor WhatsApp admin, format internasional tanpa tanda + (contoh: 6281234567890).
export const ADMIN_WHATSAPP = '628XXXXXXXXXX';

export const whatsappLink = (text = 'Halo Pride, saya butuh bantuan.') =>
  `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;

export const CONTACT = {
  instagram: '[AKUN INSTAGRAM]',
  tiktok: '[AKUN TIKTOK]',
};

// Di production pakai env var VITE_API_URL.
// Di lokal pakai proxy Vite (/api -> localhost:3000).
export const DEMO_MODE = false;

export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';