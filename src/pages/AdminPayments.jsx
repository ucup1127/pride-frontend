import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { formatPackagePrice, getPackage } from '../data/packages';
import {
  approveAdminOrder,
  getAdminSummary,
  listAdminOrders,
  refundAdminOrder,
} from '../services/api';

const PAGE_SIZE = 20;
const STATUS_LABELS = {
  all: 'Semua status',
  pending: 'Menunggu transfer',
  review: 'Menunggu verifikasi',
  underpaid: 'Nominal kurang',
  overpaid: 'Nominal lebih',
  paid: 'Sudah dibayar',
  refunded: 'Refund tercatat',
  expired: 'Kedaluwarsa',
  rejected: 'Ditolak (riwayat lama)',
};

const SUMMARY_CARDS = [
  { key: 'totalOrders', label: 'Total pesanan', format: (value) => value },
  { key: 'pendingOrders', label: 'Menunggu transfer', format: (value) => value },
  { key: 'pendingReviews', label: 'Perlu diperiksa', format: (value) => value },
  { key: 'paidOrders', label: 'Pesanan disetujui', format: (value) => value },
  { key: 'activePackages', label: 'Paket aktif', format: (value) => value },
  { key: 'users', label: 'Total pengguna', format: (value) => value },
  { key: 'grossRevenue', label: 'Pembayaran disetujui', format: formatPackagePrice },
  { key: 'refundedOrders', label: 'Pesanan refund', format: (value) => value },
  { key: 'refundTotal', label: 'Refund tercatat', format: formatPackagePrice },
  { key: 'netRevenue', label: 'Penerimaan bersih', format: formatPackagePrice },
];

export default function AdminPayments() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'admin';
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [forms, setForms] = useState({});
  const [status, setStatus] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(isAdmin);
  const [summaryLoading, setSummaryLoading] = useState(isAdmin);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [notice, setNotice] = useState('');

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError('');
    try {
      setSummary(await getAdminSummary());
    } catch (loadError) {
      setSummaryError(loadError.message || 'Ringkasan admin gagal dimuat.');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await listAdminOrders({
        status,
        search,
        page,
        pageSize: PAGE_SIZE,
      });
      setOrders(result.orders);
      setTotal(result.total);
    } catch (loadError) {
      setError(loadError.message || 'Daftar pesanan gagal dimuat.');
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    if (isAdmin) {
      loadSummary();
      loadOrders();
    }
  }, [isAdmin, loadOrders, loadSummary]);

  const reload = async () => {
    await Promise.all([loadSummary(), loadOrders()]);
  };

  const updateForm = (orderId, field, value) => {
    setForms((current) => ({
      ...current,
      [orderId]: { ...current[orderId], [field]: value },
    }));
  };

  const approve = async (order) => {
    setBusyId(order.id);
    setError('');
    setNotice('');
    try {
      await approveAdminOrder(order.id);
      setNotice(`Pesanan ${order.id} disetujui dan paket aktif. Periksa log backend untuk status notifikasi WhatsApp.`);
      await reload();
    } catch (actionError) {
      setError(actionError.message || 'Pesanan gagal disetujui.');
    } finally {
      setBusyId('');
    }
  };

  const refund = async (order) => {
    const form = forms[order.id] || {};
    setBusyId(order.id);
    setError('');
    setNotice('');
    try {
      await refundAdminOrder(order.id, {
        refundAmount: Number(form.refundAmount ?? order.transferAmount),
        adminFee: Number(form.adminFee || 0),
        note: (form.note || '').trim(),
      });
      setNotice(`Refund pesanan ${order.id} berhasil dicatat.`);
      await reload();
    } catch (actionError) {
      setError(actionError.message || 'Refund gagal dicatat.');
    } finally {
      setBusyId('');
    }
  };

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  if (!isAdmin) {
    return (
      <Layout>
        <section className="container admin-payments">
          <div className="eyebrow">AREA ADMIN</div>
          <h1 className="display">Akses tidak tersedia.</h1>
          <p>Halaman ini hanya dapat dibuka oleh akun admin Pride.</p>
        </section>
      </Layout>
    );
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  return (
    <Layout>
      <section className="container admin-payments">
        <div className="eyebrow">AREA ADMIN · RINGKASAN & PEMBAYARAN</div>
        <div className="admin-payments__title-row">
          <div>
            <h1 className="display">Dashboard admin.</h1>
            <p className="lead">Pantau pesanan, verifikasi transfer, dan catat refund.</p>
          </div>
          <button className="btn admin-payments__refresh" type="button" onClick={reload} disabled={loading || summaryLoading}>
            Muat ulang
          </button>
        </div>

        {error && <p className="error-text" role="alert">{error}</p>}
        {summaryError && <p className="error-text" role="alert">{summaryError}</p>}
        {notice && <p className="admin-payments__notice" role="status">{notice}</p>}

        <section className="admin-summary" aria-label="Ringkasan Pride">
          {SUMMARY_CARDS.map((card) => (
            <article className="admin-summary__card" key={card.key}>
              <span>{card.label}</span>
              <strong>
                {summaryLoading || summary?.[card.key] === undefined
                  ? '—'
                  : card.format(summary[card.key])}
              </strong>
            </article>
          ))}
        </section>

        <section className="admin-orders">
          <header className="admin-orders__header">
            <div>
              <div className="eyebrow">PENGELOLAAN PESANAN</div>
              <h2 className="display">Semua pesanan</h2>
            </div>
            <span>{total.toLocaleString('id-ID')} pesanan</span>
          </header>

          <form className="admin-orders__filters" onSubmit={applySearch}>
            <label className="field">
              Cari pesanan atau pelanggan
              <input
                className="input"
                type="search"
                placeholder="ID, nama, email, atau WhatsApp"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>
            <label className="field">
              Status
              <select
                className="input"
                value={status}
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value);
                }}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </label>
            <button className="btn btn--primary" type="submit">Cari</button>
          </form>

          {loading && <p className="admin-orders__empty" role="status">Memuat pesanan…</p>}
          {!loading && orders.length === 0 && (
            <p className="admin-orders__empty">Tidak ada pesanan untuk filter ini.</p>
          )}

          <div className="admin-payments__list">
            {!loading && orders.map((order) => {
              const form = forms[order.id] || {};
              const planName = getPackage(order.plan)?.name || order.plan || 'Paket tidak dikenal';
              const canReview = ['review', 'underpaid', 'overpaid'].includes(order.status)
                && order.transferAmount !== null;
              return (
                <article className="admin-payment-card" key={order.id}>
                  <header className="admin-payment-card__header">
                    <div>
                      <span className={`admin-order-status admin-order-status--${order.status}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                      <h3 className="display">Paket {planName}</h3>
                      <p>Pesanan {order.id} · {new Date(order.createdAt).toLocaleString('id-ID')}</p>
                    </div>
                    <strong>{formatPackagePrice(order.amount)}</strong>
                  </header>

                  <dl className="admin-payment-card__details">
                    <div><dt>Pelanggan</dt><dd>{order.user?.name || '—'} · {order.user?.email || '—'}</dd></div>
                    <div><dt>Metode</dt><dd>{order.paymentMethod === 'bank_transfer' ? 'Transfer bank' : order.paymentMethod === 'ewallet' ? 'E-wallet' : '—'}</dd></div>
                    <div><dt>Nominal transfer</dt><dd>{order.transferAmount === null ? 'Belum dilaporkan' : formatPackagePrice(order.transferAmount)}</dd></div>
                    <div><dt>Pengirim / referensi</dt><dd>{order.transferSenderName || '—'} · {order.transferReference || '—'}</dd></div>
                    <div><dt>Waktu transfer</dt><dd>{order.transferDate ? new Date(order.transferDate).toLocaleString('id-ID') : '—'}</dd></div>
                    <div><dt>WhatsApp pelanggan</dt><dd>{order.contactPhone || '—'}</dd></div>
                    <div><dt>Waktu keputusan admin</dt><dd>{order.reviewedAt ? new Date(order.reviewedAt).toLocaleString('id-ID') : '—'}</dd></div>
                    {(order.reviewNote || order.refundAmount !== null) && (
                      <div><dt>Catatan / refund</dt><dd>{order.reviewNote || '—'} · Refund {formatPackagePrice(order.refundAmount || 0)} · Biaya {formatPackagePrice(order.adminFee || 0)}</dd></div>
                    )}
                  </dl>

                  {order.status === 'review' && (
                    <button className="btn btn--primary" type="button" disabled={busyId === order.id} onClick={() => approve(order)}>
                      {busyId === order.id ? 'Memproses…' : 'Setujui & aktifkan paket'}
                    </button>
                  )}

                  {canReview && (
                    <details className="admin-refund-details">
                      <summary>Catat refund / pembayaran tidak dapat diverifikasi</summary>
                      <form
                        className="admin-refund-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          refund(order);
                        }}
                      >
                        <div className="admin-refund-form__fields">
                          <label className="field">
                            Jumlah refund
                            <input
                              className="input"
                              type="number"
                              min="0"
                              step="1"
                              value={form.refundAmount ?? order.transferAmount}
                              onChange={(event) => updateForm(order.id, 'refundAmount', event.target.value)}
                              required
                            />
                          </label>
                          <label className="field">
                            Biaya admin aktual
                            <input
                              className="input"
                              type="number"
                              min="0"
                              step="1"
                              value={form.adminFee ?? '0'}
                              onChange={(event) => updateForm(order.id, 'adminFee', event.target.value)}
                              required
                            />
                          </label>
                        </div>
                        <label className="field">
                          Catatan untuk pelanggan
                          <textarea
                            className="input"
                            rows="2"
                            value={form.note || ''}
                            onChange={(event) => updateForm(order.id, 'note', event.target.value)}
                            required
                          />
                        </label>
                        <button className="btn" type="submit" disabled={busyId === order.id}>
                          {busyId === order.id ? 'Menyimpan…' : 'Simpan refund'}
                        </button>
                      </form>
                    </details>
                  )}
                </article>
              );
            })}
          </div>

          <footer className="admin-orders__pagination">
            <span>Menampilkan {firstItem}–{lastItem} dari {total}</span>
            <div>
              <button className="btn" type="button" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>
                Sebelumnya
              </button>
              <span>Halaman {page} / {pageCount}</span>
              <button className="btn" type="button" disabled={page >= pageCount || loading} onClick={() => setPage((value) => value + 1)}>
                Berikutnya
              </button>
            </div>
          </footer>
        </section>
      </section>
    </Layout>
  );
}
