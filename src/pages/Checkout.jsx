import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { DEMO_MODE } from '../config';
import { formatPackagePrice, getPackage, PACKAGES } from '../data/packages';
import {
  createManualOrder,
  getManualOrder,
  getPaymentOptions,
  submitManualTransfer,
} from '../services/api';

const STATUS_LABELS = {
  pending: 'Menunggu transfer',
  review: 'Transfer dilaporkan · menunggu verifikasi admin',
  underpaid: 'Nominal kurang · paket belum aktif',
  overpaid: 'Nominal lebih · menunggu pemeriksaan admin',
  paid: 'Pembayaran disetujui · paket aktif',
  refunded: 'Refund telah dicatat admin',
  rejected: 'Pembayaran belum dapat diverifikasi',
  expired: 'Pesanan kedaluwarsa',
};

function toLocalDateTimeValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function Checkout() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const packageId = params.get('paket') || localStorage.getItem('pride-plan') || 'basic';
  const plan = getPackage(packageId) || PACKAGES[0];
  const orderId = params.get('order');

  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [transferAmount, setTransferAmount] = useState(String(plan.price));
  const [reference, setReference] = useState('');
  const [transferDate, setTransferDate] = useState(() => toLocalDateTimeValue(new Date()));
  const [order, setOrder] = useState(null);
  const displayedPlan = getPackage(order?.plan) || plan;
  const [instructions, setInstructions] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      const returnTo = `/checkout?paket=${plan.id}${orderId ? `&order=${encodeURIComponent(orderId)}` : ''}`;
      navigate(`/masuk?paket=${encodeURIComponent(plan.id)}`, {
        replace: true,
        state: { from: returnTo },
      });
    }
  }, [session, plan.id, orderId, navigate]);

  useEffect(() => {
    let active = true;
    getPaymentOptions()
      .then((available) => {
        if (!active) return;
        setMethods(available);
        setMethod((current) => current || available[0]?.method || '');
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Metode pembayaran gagal dimuat.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!orderId || !session) return undefined;
    let active = true;
    const refresh = async () => {
      try {
        const result = await getManualOrder(orderId);
        if (active) {
          setOrder(result.order);
          setInstructions(result.instructions);
          localStorage.setItem('pride-last-order', result.order.id);
          localStorage.setItem('pride-last-order-plan', result.order.plan);
        }
      } catch (loadError) {
        if (active) setError(loadError.message || 'Status pesanan gagal dimuat.');
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [orderId, session]);

  const createOrder = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await createManualOrder({ plan: plan.id, paymentMethod: method, phone });
      setOrder(result.order);
      setInstructions(result.instructions);
      localStorage.setItem('pride-last-order', result.order.id);
      localStorage.setItem('pride-last-order-plan', result.order.plan);
      const next = new URLSearchParams(params);
      next.set('paket', plan.id);
      next.set('order', result.order.id);
      setParams(next, { replace: true });
    } catch (createError) {
      setError(createError.message || 'Pesanan gagal dibuat.');
    } finally {
      setBusy(false);
    }
  };

  const reportTransfer = async (event) => {
    event.preventDefault();
    if (!order) return;
    setError('');
    setBusy(true);
    try {
      const result = await submitManualTransfer(order.id, {
        amount: Number(transferAmount),
        senderName,
        reference,
        transferDate: new Date(transferDate).toISOString(),
      });
      setOrder(result);
    } catch (submitError) {
      setError(submitError.message || 'Laporan transfer gagal dikirim.');
    } finally {
      setBusy(false);
    }
  };

  const selectedMethod = methods.find((item) => item.method === method);

  return (
    <Layout>
      <section className="container page-head checkout-head">
        <div className="eyebrow">PEMBAYARAN MANUAL</div>
        <h1 className="display page-head__title">Selesaikan pesananmu.</h1>
        <p className="lead page-head__text">
          Transfer ke rekening atau e-wallet Pride. Paket baru aktif setelah admin memeriksa transfer.
        </p>
      </section>

      <section className="container checkout-layout">
        <div className="checkout-panel">
          <div className="checkout-panel__heading">
            <span className="checkout-step" aria-hidden="true">01</span>
            <div>
              <h2 className="display">{order ? 'Instruksi pembayaran' : 'Pilih cara transfer'}</h2>
              <p>{order ? `Nomor pesanan ${order.id}` : 'Pilih transfer bank atau e-wallet.'}</p>
            </div>
          </div>

          {DEMO_MODE && (
            <div className="checkout-demo-note" role="note">
              <span aria-hidden="true">!</span>
              Mode demo aktif. Jangan melakukan transfer ke detail rekening demo.
            </div>
          )}

          {!order && (
            <form onSubmit={createOrder}>
              {methods.length === 0 ? (
                <div className="error-text" role="alert">
                  Metode pembayaran belum dikonfigurasi. Admin perlu mengisi detail rekening bank atau e-wallet di environment backend.
                </div>
              ) : (
                <>
                  <fieldset className="payment-methods">
                    <legend className="sr-only">Pilih metode transfer</legend>
                    {methods.map((option) => (
                      <label
                        className={`payment-option${method === option.method ? ' is-selected' : ''}`}
                        key={option.method}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          value={option.method}
                          checked={method === option.method}
                          onChange={() => setMethod(option.method)}
                          required
                        />
                        <span className="payment-option__body">
                          <span className="payment-option__title">
                            {option.method === 'bank_transfer' ? 'Transfer bank' : 'E-wallet'} · {option.provider}
                          </span>
                          <span className="payment-option__description">
                            Transfer manual dan tunggu verifikasi admin.
                          </span>
                        </span>
                      </label>
                    ))}
                  </fieldset>

                  <div className="field">
                    <label htmlFor="payment-phone">Nomor WhatsApp untuk pemberitahuan</label>
                    <input
                      id="payment-phone"
                      className="input"
                      type="tel"
                      autoComplete="tel"
                      placeholder="08xxxxxxxxxx"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>

                  <button className="btn btn--primary btn--block checkout-submit" type="submit" disabled={busy || !selectedMethod}>
                    {busy ? 'Membuat pesanan…' : 'Tampilkan instruksi transfer'}
                  </button>
                </>
              )}
            </form>
          )}

          {order && (
            <div className="manual-payment">
              <div className="checkout-demo-note" role="status">
                <span aria-hidden="true">i</span>
                Status: <strong>{STATUS_LABELS[order.status] || order.status}</strong>
              </div>

              {instructions && order.status === 'pending' && (
                <>
                  {instructions.isPlaceholder && (
                    <p className="payment-placeholder-warning" role="alert">
                      Rekening SeaBank ini dummy untuk pengembangan. Jangan transfer ke nomor ini.
                    </p>
                  )}
                  <dl className="payment-instructions">
                    <div><dt>Metode</dt><dd>{instructions.provider}</dd></div>
                    <div><dt>Nomor tujuan</dt><dd>{instructions.accountNumber}</dd></div>
                    <div><dt>Atas nama</dt><dd>{instructions.accountHolder}</dd></div>
                    <div><dt>Nominal tepat</dt><dd><strong>{formatPackagePrice(order.amount)}</strong></dd></div>
                    <div><dt>Batas pembayaran</dt><dd>{new Date(order.expiresAt).toLocaleString('id-ID')}</dd></div>
                  </dl>
                  {instructions.method === 'ewallet' && (
                    <div className="payment-qr-placeholder" role="note">
                      <div className="payment-qr-placeholder__visual" aria-hidden="true">
                        <span>QR</span>
                      </div>
                      <div>
                        <strong>QR DANA akan ditambahkan</strong>
                        <p>Placeholder ini belum bisa dipindai. Untuk sekarang, gunakan nomor DANA di atas.</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {order.status === 'pending' && (
                <>
                  <form className="transfer-report-form" onSubmit={reportTransfer}>
                    <h3 className="display">Sudah transfer?</h3>
                    <div className="field">
                      <label htmlFor="transfer-amount">Jumlah yang ditransfer (rupiah)</label>
                      <input
                        id="transfer-amount"
                        className="input"
                        type="number"
                        min="1"
                        step="1"
                        value={transferAmount}
                        onChange={(event) => setTransferAmount(event.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="sender-name">Nama pengirim</label>
                      <input id="sender-name" className="input" value={senderName} onChange={(event) => setSenderName(event.target.value)} required />
                    </div>
                    <div className="field">
                      <label htmlFor="transfer-reference">Nomor referensi transfer</label>
                      <input id="transfer-reference" className="input" value={reference} onChange={(event) => setReference(event.target.value)} required />
                    </div>
                    <div className="field">
                      <label htmlFor="transfer-date">Waktu transfer</label>
                      <input id="transfer-date" className="input" type="datetime-local" value={transferDate} onChange={(event) => setTransferDate(event.target.value)} required />
                    </div>
                    <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
                      {busy ? 'Mengirim laporan…' : 'Kirim laporan transfer'}
                    </button>
                  </form>
                  <p className="payment-policy">
                    Transfer harus sesuai nominal. Jika jumlah yang diterima kurang, paket tidak akan aktif. Admin akan memeriksa transfer dan mencatat refund setelah dikurangi biaya admin aktual, jika ada.
                  </p>
                </>
              )}

              {order.status === 'review' && (
                <p className="payment-policy">Admin sedang memeriksa transfer. Paket belum aktif. Status pesanan akan diperbarui di halaman ini; pemberitahuan WhatsApp bergantung pada konfigurasi layanan Pride.</p>
              )}
              {['underpaid', 'overpaid'].includes(order.status) && (
                <p className="payment-policy">
                  Nominal transfer tidak sesuai dengan tagihan. Paket tidak aktif; admin akan memeriksa dan mengurus refund dengan rincian biaya aktual.
                </p>
              )}
              {order.status === 'paid' && (
                <div className="success-note" role="status">
                  <strong>Paket {displayedPlan.name} sudah aktif.</strong>
                  <p>Admin telah menyetujui transfer. Kamu bisa membuka dashboard sekarang; jika pesan WhatsApp belum diterima, masuk ke akun Pride secara langsung.</p>
                  <Link className="btn btn--primary btn--block" to="/dashboard">Buka dashboard</Link>
                </div>
              )}
              {order.status === 'refunded' && (
                <p className="payment-policy">
                  Refund tercatat: {formatPackagePrice(order.refundAmount || 0)}; biaya admin: {formatPackagePrice(order.adminFee || 0)}.
                </p>
              )}
              {order.status === 'expired' && (
                <p className="payment-policy">Pesanan kedaluwarsa. Kembali ke halaman paket untuk membuat pesanan baru.</p>
              )}
              {order.status === 'rejected' && (
                <p className="payment-policy">Transfer belum dapat diverifikasi. Catatan admin: {order.reviewNote || 'Silakan hubungi bantuan Pride.'}</p>
              )}
            </div>
          )}

          {error && <p className="error-text" role="alert">{error}</p>}
        </div>

        <aside className="checkout-summary">
          <div className="eyebrow">RINGKASAN PESANAN</div>
          <h2 className="display">Paket {displayedPlan.name}</h2>
          <p>Website undangan digital Pride</p>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total transfer</span>
            <strong>{formatPackagePrice(order?.amount ?? displayedPlan.price)}</strong>
          </div>
          <Link to="/paket" className="text-link">← Ubah paket</Link>
          <div className="summary-secure">
            Transfer diverifikasi admin. Paket tidak aktif sebelum disetujui.
          </div>
        </aside>
      </section>
    </Layout>
  );
}
