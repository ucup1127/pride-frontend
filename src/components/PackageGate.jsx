import { Link } from 'react-router-dom';

const STEPS = ['Paket', 'Pembayaran', 'Template'];

export default function PackageGate({
  eyebrow = 'LANGKAH BERIKUTNYA',
  title = 'Pilih paket sebelum memilih template.',
  description = 'Pilih paket yang sesuai, selesaikan pembayaran, lalu pilih desain undanganmu.',
  actionHref = '/paket',
  actionLabel = 'Pilih paket',
}) {
  return (
    <section className="container package-gate">
      <div className="package-gate__card">
        <div className="package-gate__eyebrow eyebrow">{eyebrow}</div>
        <h1 className="display package-gate__title">{title}</h1>
        <p className="package-gate__text">{description}</p>
        <ol className="package-gate__steps" aria-label="Urutan membuat undangan">
          {STEPS.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {step}
            </li>
          ))}
        </ol>
        <Link className="btn btn--primary package-gate__cta" to={actionHref}>
          {actionLabel} <span aria-hidden="true">→</span>
        </Link>
        <Link className="package-gate__back" to="/">
          Kembali ke beranda
        </Link>
      </div>
    </section>
  );
}
