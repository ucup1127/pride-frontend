import Layout from './Layout';
import PackageGate from './PackageGate';

export default function RequirePaidPlan({ children }) {
  const paidPlan = localStorage.getItem('pride-paid-plan');

  if (!paidPlan) {
    return (
      <Layout>
        <PackageGate
          eyebrow="AKSES DASHBOARD"
          title="Pilih paket untuk membuka dashboard."
          description="Selesaikan pembelian paket terlebih dahulu untuk mengelola undangan, daftar tamu, dan RSVP."
        />
      </Layout>
    );
  }

  return children;
}
