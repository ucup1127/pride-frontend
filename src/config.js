export const ADMIN_WHATSAPP = '628XXXXXXXXXX';

export const whatsappLink = (text = 'Halo Pride, saya butuh bantuan.') =>
  `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;

export const CONTACT = {
  instagram: '[AKUN INSTAGRAM]',
  tiktok: '[AKUN TIKTOK]',
};

export const DEMO_MODE = true;
export const API_BASE_URL = '/api';