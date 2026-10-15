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

// ============ MOCK (DEMO_MODE) ============
const mock = {
  async sendOtp(phone) {
    console.log(`[DEMO] OTP untuk ${phone}: 123456`);
    return { phone, expiresInMinutes: 5 };
  },
  async verifyOtp(phone, code) {
    if (code.length !== 6) throw new Error('Kode harus 6 digit');
    return { token: 'demo-token-' + phone, phone };
  },
  async me() {
    const session = JSON.parse(localStorage.getItem('pride_session') || '{}');
    return { phone: session.phone, name: 'Demo User' };
  },
  async listTemplates() { return TEMPLATES; },
  async detailTemplate(id) { return TEMPLATES.find((t) => t.id === id); },

  async listUndangan() { return []; },
  async createUndangan(data) { return { id: 'demo', ...data }; },
  async updateUndangan(id, data) { return { id, ...data }; },
  async deleteUndangan() { return { ok: true }; },

  // Guests / tamu
  async listGuests() { return []; },
  async addGuest(data) {
    return { id: 'guest-' + Date.now(), ...data, rsvp: 'pending' };
  },

  // Wishes / ucapan
  async listWishes() { return []; },
  async submitRsvp(data) {
    return { id: 'rsvp-' + Date.now(), ...data, createdAt: new Date().toISOString() };
  },
};

// ============ REAL ============
const real = {
  sendOtp: (phone) => request('/auth/otp/send', { method: 'POST', body: { phone } }),
  verifyOtp: (phone, code, meta = {}) =>
    request('/auth/otp/verify', { method: 'POST', body: { phone, code, ...meta } }),
  me: () => request('/auth/me', { auth: true }),

  listTemplates: (category) =>
    request(
      `/templates${
        category && category !== 'Semua'
          ? `?category=${encodeURIComponent(category)}`
          : ''
      }`,
    ),
  detailTemplate: (id) => request(`/templates/${id}`),

  listUndangan: () => request('/undangan', { auth: true }),
  createUndangan: (data) => request('/undangan', { method: 'POST', body: data, auth: true }),
  updateUndangan: (id, data) =>
    request(`/undangan/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteUndangan: (id) => request(`/undangan/${id}`, { method: 'DELETE', auth: true }),

  // Guests / tamu
  listGuests: () => request('/guests', { auth: true }),
  addGuest: (data) => request('/guests', { method: 'POST', body: data, auth: true }),

  // Wishes / ucapan (RSVP)
  listWishes: () => request('/wishes'),
  submitRsvp: (data) => request('/rsvp', { method: 'POST', body: data }),
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
export const listWishes = impl.listWishes;
export const submitRsvp = impl.submitRsvp;