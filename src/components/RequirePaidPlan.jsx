import { cloneElement, useEffect, useState } from 'react';
import Layout from './Layout';
import PackageGate from './PackageGate';
import { getPackageAccess } from '../services/api';

export default function RequirePaidPlan({ children }) {
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getPackageAccess()
      .then((result) => {
        if (active) setAccess(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Status paket gagal dimuat.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (loading) {
    return <Layout><div className="container package-access-loading" role="status">Memeriksa akses paket…</div></Layout>;
  }

  if (error) {
    return <Layout><div className="container package-access-error" role="alert">{error}</div></Layout>;
  }

  if (!access?.active) {
    const orderId = localStorage.getItem('pride-last-order');
    const planId = localStorage.getItem('pride-last-order-plan')
      || localStorage.getItem('pride-plan')
      || 'basic';
    const checkoutLink = orderId
      ? `/checkout?paket=${encodeURIComponent(planId)}&order=${encodeURIComponent(orderId)}`
      : '/paket';
    return (
      <Layout>
        <PackageGate
          eyebrow="AKSES DASHBOARD"
          title="Paket belum aktif."
          description="Dashboard akan terbuka setelah admin memverifikasi pembayaran. Kamu juga bisa melihat status pesanan yang sedang diproses."
          actionHref={checkoutLink}
          actionLabel={orderId ? 'Lihat status pesanan' : 'Pilih paket'}
        />
      </Layout>
    );
  }

  return cloneElement(children, { packageAccess: access });
}
