// Deep link chat Instagram resmi Pride Studio.
export const INSTAGRAM_USERNAME = 'bypride.studio';
export const instagramChatLink = 'https://ig.me/m/bypride.studio';

// Kontak & sosial media
export const CONTACT = {
  instagram: '@bypride.studio',
  tiktok: '@bypride.studio',
  whatsapp: '6281234567890',
  email: 'hello@bypride.studio',
};

// Backend API: Kalau di Vercel ambil dari env, kalau di lokal pakai proxy /api
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

// Paksa demo mode mati
export const DEMO_MODE = false;

export const whatsappLink = (text = 'Halo Pride, saya butuh bantuan.') =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;