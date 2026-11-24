import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';

const plans = {
  basic: { name: 'Basic', price: 'Rp49.000' },
  plus: { name: 'Plus', price: 'Rp89.000' },
  premium: { name: 'Premium', price: 'Rp149.000' },
};

const paymentMethods = [
  {
    name: 'QRIS',
    description: 'Scan kode QR dari aplikasi pembayaran pilihanmu.',
    badge: 'Instan',
  },
  {
    name: 'Transfer bank',
    description: 'Instruksi transfer akan muncul setelah konfirmasi.',
    badge: 'Virtual account',
  },
  {
    name: 'E-wallet',
    description: 'Bayar dengan dompet digital yang kamu gunakan.',
    badge: 'Praktis',
  },
];

export default function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('paket') || localStorage.getItem('pride-plan') || 'plus';
  const plan = plans[id] || plans.plus;
  const [method, setMethod] = useState('QRIS');
  const [paid, setPaid] = useState(false);

  const finishDemoPayment = () => {
    localStorage.setItem('pride-paid-plan', id);
    navigate('/katalog');
  };

  return (
    <Layout>
      <section className="container page-head checkout-head">
        <div className="eyebrow">LANGKAH 02 · PEMBAYARAN</div>
        <h1 className="display page-head__title">Selesaikan pesananmu.</h1>
        <p className="lead page-head__text">
          Pilih metode pembayaran untuk melanjutkan ke koleksi template Pride.
        </p>
      </section>

      <section className="container checkout-layout">
        <div className="checkout-panel">
          <div className="checkout-panel__heading">
            <span className="checkout-step" aria-hidden="true">02</span>
            <div>
              <h2 className="display">Metode pembayaran</h2>
              <p>Pilih cara yang paling nyaman untukmu.</p>
            </div>
          </div>

          <fieldset className="payment-methods">
            <legend className="sr-only">Pilih metode pembayaran</legend>
            {paymentMethods.map((payment) => (
              <label
                className={`payment-option${method === payment.name ? ' is-selected' : ''}`}
                key={payment.name}
              >
                <input
                  type="radio"
                  name="method"
                  value={payment.name}
                  checked={method === payment.name}
                  onChange={() => setMethod(payment.name)}
                />
                <span className="payment-option__body">
                  <span className="payment-option__title">{payment.name}</span>
                  <span className="payment-option__description">{payment.description}</span>
                </span>
                <span className="payment-option__badge">{payment.badge}</span>
              </label>
            ))}
          </fieldset>

          <div className="checkout-demo-note">
            <span aria-hidden="true">i</span>
            Pembayaran saat ini masih berupa simulasi dan belum memotong saldo.
          </div>

          <button
            className="btn btn--primary btn--block checkout-submit"
            type="button"
            onClick={() => setPaid(true)}
          >
            Simulasikan pembayaran · {plan.price}
          </button>

          {paid && (
            <div className="success-note" role="status" aria-live="polite">
              <strong>Simulasi pembayaran berhasil.</strong>
              <p>Di versi produksi, status pembayaran harus dikonfirmasi oleh payment gateway.</p>
              <button className="btn btn--primary btn--block" type="button" onClick={finishDemoPayment}>
                Pilih template sekarang <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>

        <aside className="checkout-summary">
          <div className="eyebrow">RINGKASAN PESANAN</div>
          <h2 className="display">Paket {plan.name}</h2>
          <p>Undangan digital Pride Studio</p>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total pembayaran</span>
            <strong>{plan.price}</strong>
          </div>
          <Link to="/paket" className="text-link">← Ubah paket</Link>
          <div className="summary-secure">
            <span aria-hidden="true">✓</span>
            Transaksi demo · Tidak ada tagihan nyata
          </div>
        </aside>
      </section>
    </Layout>
  );
}
