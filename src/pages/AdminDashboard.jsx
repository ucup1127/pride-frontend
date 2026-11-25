import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { formatPackagePrice, getPackage } from '../data/packages';
import { getAdminSummary, listAdminOrders } from '../services/api';

const METRICS = [
  { key: 'totalOrders', label: 'Total pesanan', format: (value) => value },
  { key: 'pendingReviews', label: 'Perlu verifikasi', format: (value) => value },
  { key: 'activePackages', label: 'Paket aktif', format: (value) => value },
  { key: 'users', label: 'Total pengguna', format: (value) => value },
  { key: 'grossRevenue', label: 'Pembayaran disetujui', format: formatPackagePrice },
  { key: 'refundTotal', label: 'Refund tercatat', format: formatPackagePrice },
  { key: 'netRevenue', label: 'Penerimaan bersih', format: formatPackagePrice },
];

const STATUS_LABELS = {
  pending: 'Menunggu transfer',
  review: 'Perlu verifikasi',
  underpaid: 'Nominal kurang',
  overpaid: 'Nominal lebih',
  paid: 'Disetujui',
  refunded: 'Refund',
  expired: 'Kedaluwarsa',
  rejected: 'Ditolak',
};

export default function AdminDashboard() {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === 'admin';
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(isAdmin);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextSummary, orderResult] = await Promise.all([
        getAdminSummary(),
        listAdminOrders({ status: 'all', page: 1, pageSize: 8 }),
      ]);
      setSummary(nextSummary);
      setRecentOrders(orderResult.orders);
    } catch (loadError) {
      setError(loadError.message || 'Dashboard admin gagal dimuat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadDashboard();
  }, [isAdmin, loadDashboard]);

  if (!isAdmin) {
    return (
      <Layout>
        <section className="container admin-dashboard">
          <div className="eyebrow">RUANG PEMILIK PRIDE</div>
          <h1 className="display">Akses pemilik diperlukan.</h1>
          <p>Masuk dengan akun yang memiliki role admin untuk melihat dashboard Pride.</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container admin-dashboard">
        <header className="admin-dashboard__header">
          <div>
            <div className="eyebrow">RUANG PEMILIK PRIDE</div>
            <h1 className="display">Ringkasan bisnis.</h1>
            <p>Pantau pelanggan, paket aktif, pembayaran, dan refund dari satu tempat.</p>
          </div>
          <div className="admin-dashboard__actions">
            <button type="button" className="btn" onClick={loadDashboard} disabled={loading}>
              Muat ulang
            </button>
            <Link className="btn btn--primary" to="/admin/payments">
              Kelola pembayaran <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        {error && <p className="error-text" role="alert">{error}</p>}

        <section className="admin-dashboard__metrics" aria-label="Metrik bisnis Pride">
          {METRICS.map((metric) => {
            const value = summary?.[metric.key];
            return (
              <article className="admin-dashboard__metric" key={metric.key}>
                <span>{metric.label}</span>
                <strong>
                  {loading || value === undefined ? '—' : metric.format(value)}
                </strong>
              </article>
            );
          })}
        </section>

        <section className="admin-dashboard__orders">
          <header className="admin-dashboard__orders-header">
            <div>
              <div className="eyebrow">AKTIVITAS TERBARU</div>
              <h2 className="display">Pesanan terbaru</h2>
            </div>
            <Link className="text-link" to="/admin/payments">
              Lihat semua pesanan <span aria-hidden="true">→</span>
            </Link>
          </header>

          {loading && <p className="admin-dashboard__empty" role="status">Memuat aktivitas…</p>}
          {!loading && recentOrders.length === 0 && (
            <p className="admin-dashboard__empty">Belum ada pesanan.</p>
          )}
          {!loading && recentOrders.length > 0 && (
            <div className="admin-dashboard__table-wrap">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>Pesanan</th>
                    <th>Pelanggan</th>
                    <th>Paket</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Dibuat</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td><span className="admin-dashboard__order-id">{order.id}</span></td>
                      <td>
                        <strong>{order.user?.name || '—'}</strong>
                        <small>{order.user?.email || '—'}</small>
                      </td>
                      <td>{getPackage(order.plan)?.name || order.plan || '—'}</td>
                      <td>{formatPackagePrice(order.amount)}</td>
                      <td>
                        <span className={`admin-order-status admin-order-status--${order.status}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="admin-dashboard__note">
          Ringkasan pembayaran menghitung transaksi yang telah disetujui. Periksa bukti transfer dan kelola refund melalui halaman pembayaran.
        </aside>
      </section>
    </Layout>
  );
}
