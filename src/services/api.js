import { API_BASE_URL, DEMO_MODE } from '../config';
import { TEMPLATES } from '../data/templates';

const TOKEN_KEY = 'pride_token';
const DEMO_UNDANGAN_KEY = 'pride_demo_undangan';
const DEMO_GUESTS_KEY = 'pride_demo_guests';
const DEMO_ORDERS_KEY = 'pride_demo_orders';
const DEMO_PAYMENT_OPTIONS = [
  { method: 'bank_transfer', provider: 'SeaBank', accountNumber: '0000000000', accountHolder: 'Luthfi Yusuf', isPlaceholder: true },
  { method: 'ewallet', provider: 'DANA', accountNumber: '081225367526', accountHolder: 'Luthfi Yusuf' },
];
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

function getDemoUndangan() {
  const saved = JSON.parse(localStorage.getItem(DEMO_UNDANGAN_KEY) || 'null');
  if (saved) return saved;
  return [{
    id: 'demo-undangan',
    judul: 'Undangan demo',
    templateId: 'aurelia',
    status: 'draft',
  }];
}

function getDemoGuests() {
  return JSON.parse(localStorage.getItem(DEMO_GUESTS_KEY) || '[]');
}

function getDemoOrders() {
  return JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || '[]');
}

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
  async register({ email, name }) {
    if (!email || !name) throw new Error('Nama dan email wajib diisi');
    return {
      token: `demo-token-${email}`,
      user: { id: 'demo-user', email, name, role: 'USER' },
    };
  },
  async login({ email, password }) {
    if (!email || !password) throw new Error('Email dan kata sandi wajib diisi');
    return {
      token: `demo-token-${email}`,
      user: { id: 'demo-user', email, name: email.split('@')[0], role: 'USER' },
    };
  },
  async googleLogin() {
    throw new Error('Login Google tidak tersedia pada mode demo.');
  },
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

  async listUndangan() { return getDemoUndangan(); },
  async createUndangan(data) {
    const created = { id: `demo-${Date.now()}`, ...data };
    const invitations = [...getDemoUndangan(), created];
    localStorage.setItem(DEMO_UNDANGAN_KEY, JSON.stringify(invitations));
    return created;
  },
  async updateUndangan(id, data) {
    const invitations = getDemoUndangan().map((item) =>
      item.id === id ? { ...item, ...data } : item,
    );
    localStorage.setItem(DEMO_UNDANGAN_KEY, JSON.stringify(invitations));
    return invitations.find((item) => item.id === id);
  },
  async deleteUndangan(id) {
    localStorage.setItem(
      DEMO_UNDANGAN_KEY,
      JSON.stringify(getDemoUndangan().filter((item) => item.id !== id)),
    );
    return { ok: true };
  },

  // Guests / tamu
  async listGuests(undanganId) {
    return getDemoGuests().filter((guest) => guest.undanganId === undanganId);
  },
  async addGuest(data) {
    const created = {
      id: `guest-${Date.now()}`,
      status: 'pending',
      slug: `tamu-${Date.now()}`,
      ...data,
    };
    localStorage.setItem(DEMO_GUESTS_KEY, JSON.stringify([...getDemoGuests(), created]));
    return created;
  },
  async bulkAddGuests(undanganId, guests) {
    const created = guests.map((guest, index) => ({
      id: `guest-${Date.now()}-${index}`,
      undanganId,
      status: 'pending',
      slug: `tamu-${Date.now()}-${index}`,
      ...guest,
    }));
    localStorage.setItem(DEMO_GUESTS_KEY, JSON.stringify([...getDemoGuests(), ...created]));
    return { count: created.length };
  },
  async deleteGuest(id) {
    localStorage.setItem(
      DEMO_GUESTS_KEY,
      JSON.stringify(getDemoGuests().filter((guest) => guest.id !== id)),
    );
    return { ok: true };
  },

  // Wishes / ucapan
  async listWishes() { return []; },
  async submitRsvp(data) {
    return { id: 'rsvp-' + Date.now(), ...data, createdAt: new Date().toISOString() };
  },
  async getPaymentOptions() {
    return DEMO_PAYMENT_OPTIONS;
  },
  async createManualOrder(data) {
    const prices = { basic: 39000, premium: 79000, exclusive: 149000 };
    const order = {
      id: `demo-order-${Date.now()}`,
      plan: data.plan,
      amount: prices[data.plan],
      paymentMethod: data.paymentMethod,
      contactPhone: data.phone,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    const instructions = DEMO_PAYMENT_OPTIONS.find((option) => option.method === data.paymentMethod);
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([...getDemoOrders(), order]));
    return { order, instructions };
  },
  async getManualOrder(id) {
    const order = getDemoOrders().find((item) => item.id === id);
    if (!order) throw new Error('Pesanan demo tidak ditemukan');
    return {
      order,
      instructions: DEMO_PAYMENT_OPTIONS.find((option) => option.method === order.paymentMethod),
    };
  },
  async submitManualTransfer(id, details) {
    const orders = getDemoOrders();
    const order = orders.find((item) => item.id === id);
    if (!order || order.status !== 'pending') throw new Error('Pesanan tidak dapat dilaporkan');
    const updated = {
      ...order,
      transferAmount: Number(details.amount),
      transferSenderName: details.senderName,
      transferReference: details.reference,
      transferDate: details.transferDate,
      status: Number(details.amount) === order.amount
        ? 'review'
        : Number(details.amount) < order.amount ? 'underpaid' : 'overpaid',
    };
    localStorage.setItem(
      DEMO_ORDERS_KEY,
      JSON.stringify(orders.map((item) => item.id === id ? updated : item)),
    );
    return updated;
  },
  async getPackageAccess() {
    return { active: false, package: null, invitationCount: 0, remainingInvitations: 0 };
  },
  async listAdminOrders() {
    throw new Error('Panel admin memerlukan backend aktif.');
  },
  async getAdminSummary() {
    throw new Error('Panel admin memerlukan backend aktif.');
  },
  async approveAdminOrder() {
    throw new Error('Panel admin memerlukan backend aktif.');
  },
  async refundAdminOrder() {
    throw new Error('Panel admin memerlukan backend aktif.');
  },
};

// ============ REAL ============
const real = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  googleLogin: (credential) =>
    request('/auth/google', { method: 'POST', body: { credential } }),
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
  listGuests: (undanganId) =>
    request(`/guests?undanganId=${encodeURIComponent(undanganId)}`, { auth: true }),
  addGuest: (data) => request('/guests', { method: 'POST', body: data, auth: true }),
  bulkAddGuests: (undanganId, guests) =>
    request('/guests/bulk', { method: 'POST', body: { undanganId, guests }, auth: true }),
  deleteGuest: (id) =>
    request(`/guests/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),

  // Wishes / ucapan (RSVP)
  listWishes: (undanganId) =>
    request(undanganId ? `/wishes/${encodeURIComponent(undanganId)}` : '/wishes'),
  submitRsvp: (data) => request('/rsvp', { method: 'POST', body: data }),
  getPaymentOptions: () => request('/manual-payment/options'),
  createManualOrder: (data) =>
    request('/manual-payment/orders', { method: 'POST', body: data, auth: true }),
  getManualOrder: (id) => request(`/manual-payment/orders/${encodeURIComponent(id)}`, { auth: true }),
  submitManualTransfer: (id, data) =>
    request(`/manual-payment/orders/${encodeURIComponent(id)}/transfer`, {
      method: 'POST',
      body: data,
      auth: true,
    }),
  getPackageAccess: () => request('/manual-payment/access', { auth: true }),
  getAdminSummary: () => request('/manual-payment/admin/summary', { auth: true }),
  listAdminOrders: (filters = {}) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
    });
    return request(`/manual-payment/admin/orders?${query.toString()}`, { auth: true });
  },
  approveAdminOrder: (id) =>
    request(`/manual-payment/admin/orders/${encodeURIComponent(id)}/approve`, { method: 'POST', auth: true }),
  refundAdminOrder: (id, data) =>
    request(`/manual-payment/admin/orders/${encodeURIComponent(id)}/refund`, { method: 'POST', body: data, auth: true }),
};

const impl = DEMO_MODE ? mock : real;

export const login = impl.login;
export const register = impl.register;
export const googleLogin = impl.googleLogin;
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
export const bulkAddGuests = impl.bulkAddGuests;
export const deleteGuest = impl.deleteGuest;
export const listWishes = impl.listWishes;
export const submitRsvp = impl.submitRsvp;
export const getPaymentOptions = impl.getPaymentOptions;
export const createManualOrder = impl.createManualOrder;
export const getManualOrder = impl.getManualOrder;
export const submitManualTransfer = impl.submitManualTransfer;
export const getPackageAccess = impl.getPackageAccess;
export const listAdminOrders = impl.listAdminOrders;
export const getAdminSummary = impl.getAdminSummary;
export const approveAdminOrder = impl.approveAdminOrder;
export const refundAdminOrder = impl.refundAdminOrder;