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
 sendOtp: (phone) => request('/auth/otp/send', { method: 'POST', body: { phone } }),
verifyOtp: (phone, code, meta = {}) => request('/auth/otp/verify', { method: 'POST', body: { phone, code, ...meta } }),

  listTemplates: (category) =>
    request(`/templates${category && category !== 'Semua' ? `?category=${encodeURIComponent(category)}` : ''}`),
  detailTemplate: (id) => request(`/templates/${id}`),

  listUndangan: () => request('/undangan', { auth: true }),
  createUndangan: (data) => request('/undangan', { method: 'POST', body: data, auth: true }),
  updateUndangan: (id, data) => request(`/undangan/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteUndangan: (id) => request(`/undangan/${id}`, { method: 'DELETE', auth: true }),

  // GUESTS (Tamu)
  listGuests: (undanganId) => request(`/guests?undanganId=${undanganId}`, { auth: true }),
  addGuest: (data) => request('/guests', { method: 'POST', body: data, auth: true }),
  updateGuest: (id, data) => request(`/guests/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteGuest: (id) => request(`/guests/${id}`, { method: 'DELETE', auth: true }),
  getGuestBySlug: (slug) => request(`/guests/by-slug/${slug}`),
  rsvpBySlug: (data) => request('/guests/rsvp', { method: 'POST', body: data }),

  // Wishes (Ucapan)
  listWishes: () => request('/rsvp'),
  submitRsvp: (data) => request('/rsvp', { method: 'POST', body: data }),
};

// ============ MOCK (Cuma buat jaga-jaga) ============
const mock = {
  async sendOtp(phone) { return { phone }; },
  async verifyOtp(phone, code) { return { token: 'demo', phone }; },
  async me() { return { phone: 'demo' }; },
  async listTemplates() { return TEMPLATES; },
  async listGuests() { return []; },
  async addGuest(data) { return { id: '1', ...data }; },
  async listWishes() { return []; },
  async submitRsvp(data) { return { id: '1', ...data }; },
};

const impl = DEMO_MODE ? mock : real;

export const sendOtp = impl.sendOtp;
export const verifyOtp = impl.verifyOtp;
export const me = impl.me;
export const listTemplates = impl.listTemplates;
export const detailTemplate = impl.detailTemplate;
export const listUndangan = impl.listUndangan;
export const createUndangan = impl.createUndangan;
export const updateUndangan = impl.updateUndangan;
export const deleteUndangan = impl.deleteUndangan;
export const listGuests = impl.listGuests;
export const addGuest = impl.addGuest;
export const updateGuest = impl.updateGuest;
export const deleteGuest = impl.deleteGuest;
export const getGuestBySlug = impl.getGuestBySlug;
export const rsvpBySlug = impl.rsvpBySlug;
export const listWishes = impl.listWishes;
export const submitRsvp = impl.submitRsvp;