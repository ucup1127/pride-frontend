import { API_BASE_URL, DEMO_MODE } from '../config';
import { TEMPLATES } from '../data/templates';

const TOKEN_KEY = 'pride_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json.data ?? json;
}

// ============ REAL API (Nyambung ke Backend) ============
const real = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me', { auth: true }),

  // Templates
  listTemplates: (category) =>
    request(`/templates${category && category !== 'Semua' ? `?category=${encodeURIComponent(category)}` : ''}`),
  detailTemplate: (id) => request(`/templates/${id}`),

  // Undangan
  listUndangan: () => request('/undangan', { auth: true }),
  createUndangan: (data) => request('/undangan', { method: 'POST', body: data, auth: true }),
  updateUndangan: (id, data) => request(`/undangan/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteUndangan: (id) => request(`/undangan/${id}`, { method: 'DELETE', auth: true }),
  getUndanganBySlug: (slug) => request(`/undangan/public/${slug}`),

  // Guests (Tamu)
  listGuests: (undanganId) => request(`/guests?undanganId=${undanganId}`, { auth: true }),
  addGuest: (data) => request('/guests', { method: 'POST', body: data, auth: true }),
  bulkAddGuests: (data) => request('/guests/bulk', { method: 'POST', body: data, auth: true }),
  updateGuest: (id, data) => request(`/guests/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteGuest: (id) => request(`/guests/${id}`, { method: 'DELETE', auth: true }),
  getGuestBySlug: (slug) => request(`/guests/by-slug/${slug}`),
  rsvpBySlug: (data) => request('/guests/rsvp', { method: 'POST', body: data }),

  // Wishes (Ucapan)
  listWishes: (undanganId) => request(`/wishes/${undanganId}`),
  createWish: (data) => request('/wishes', { method: 'POST', body: data }),
};

// ============ MOCK (Cuma buat jaga-jaga kalau DEMO_MODE true) ============
const mock = {
  async register(data) { return data; },
  async login(email, password) { return { token: 'demo', user: { email, name: 'Demo' } }; },
  async me() { return { email: 'demo@pride.com', name: 'Demo User' }; },
  
  async listTemplates() { return TEMPLATES; },
  async detailTemplate(id) { return TEMPLATES.find((t) => t.id === id); },
  
  async listUndangan() { return []; },
  async createUndangan(data) { return { id: 'demo', ...data }; },
  async updateUndangan(id, data) { return { id, ...data }; },
  async deleteUndangan() { return { ok: true }; },
  async getUndanganBySlug(slug) { return { id: 'demo', slug, data: {} }; },
  
  async listGuests() { return []; },
  async addGuest(data) { return { id: '1', ...data }; },
  async bulkAddGuests() { return { count: 0 }; },
  async getGuestBySlug(slug) { return { nama: 'Demo Tamu', undangan: { templateId: 'aurelia', slug: 'demo' } }; },
  
  async listWishes() { return []; },
  async createWish(data) { return { id: Date.now().toString(), ...data }; },
};

const impl = DEMO_MODE ? mock : real;

// Ekspor semua fungsi
export const register = impl.register;
export const login = impl.login;
export const me = impl.me;

export const listTemplates = impl.listTemplates;
export const detailTemplate = impl.detailTemplate;

export const listUndangan = impl.listUndangan;
export const createUndangan = impl.createUndangan;
export const updateUndangan = impl.updateUndangan;
export const deleteUndangan = impl.deleteUndangan;
export const getUndanganBySlug = impl.getUndanganBySlug;

export const listGuests = impl.listGuests;
export const addGuest = impl.addGuest;
export const bulkAddGuests = impl.bulkAddGuests;
export const updateGuest = impl.updateGuest;
export const deleteGuest = impl.deleteGuest;
export const getGuestBySlug = impl.getGuestBySlug;
export const rsvpBySlug = impl.rsvpBySlug;

export const listWishes = impl.listWishes;
export const createWish = impl.createWish;