import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LeafIcon } from '../components/Logo';
import Button from '../components/Button';
import { useAuth } from '../auth';
import { DEMO_MODE } from '../config';
import { findTemplate } from '../data/templates';
import { sendOtp, verifyOtp } from '../services/api';

const CODE_LENGTH = 6;

// Ubah input apa pun (0812…, 62812…, 812…) menjadi 8xx tanpa awalan.
const normalizePhone = (value) => value.replace(/\D/g, '').replace(/^(62|0)/, '');

export default function Login() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signIn } = useAuth();

  const plan = params.get('paket');
  const templateId = params.get('template');
  const template = templateId ? findTemplate(templateId) : null;

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'code'
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef([]);

  // Pengguna yang sudah masuk langsung ke dashboard.
  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true });
  }, [session, navigate]);

  useEffect(() => {
    if (step === 'code') refs.current[0]?.focus();
  }, [step]);

  const normalized = normalizePhone(phone);
  const phoneValid = normalized.length >= 9 && normalized.length <= 13;

  const requestCode = async (e) => {
    e?.preventDefault();
    if (!phoneValid) {
      setError('Masukkan nomor WhatsApp yang valid, misalnya 812 3456 7890.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await sendOtp(normalized);
      setDigits(Array(CODE_LENGTH).fill(''));
      setStep('code');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      setDigits((d) => d.map((x, i) => (i === index ? '' : x)));
      return;
    }
    // Tempel beberapa digit sekaligus.
    setDigits((d) => {
      const next = [...d];
      clean
        .slice(0, CODE_LENGTH - index)
        .split('')
        .forEach((ch, i) => {
          next[index + i] = ch;
        });
      return next;
    });
    const focusIndex = Math.min(index + clean.length, CODE_LENGTH - 1);
    refs.current[focusIndex]?.focus();
  };

  const onKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const code = digits.join('');

  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError('Masukkan 6 digit kode verifikasi.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const result = await verifyOtp(normalized, code, { plan, template: templateId });
      signIn({ token: result.token, phone: normalized, plan, template: templateId });
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const selection =
    [plan && `Paket ${plan}`, template && `Template ${template.name}`].filter(Boolean).join(' · ') ||
    '[Nama Paket] · Template [Nama Template]';

  return (
    <div className="login">
      <aside className="login__aside">
        <Link to="/" className="logo" aria-label="Pride – beranda">
          <LeafIcon />
          <span className="logo__text">pride</span>
        </Link>
        <div className="stack gap-20 login__pitch">
          <div className="eyebrow">Digital Invitation</div>
          <p className="display">Selangkah lagi menuju undanganmu.</p>
          <p className="lead">
            Masuk dengan nomor WhatsApp. Tidak perlu membuat akun atau mengingat kata sandi.
          </p>
        </div>
        <small>© {new Date().getFullYear()} Pride</small>
      </aside>

      <main className="login__main">
        <div className="login__card">
          <div className="stack gap-8">
            <h1 className="display">Masuk via WhatsApp</h1>
            <p className="hint">
              Kami kirim kode verifikasi ke WhatsApp-mu. Setelah masuk, kamu lanjut ke pembelian
              paket.
            </p>
          </div>

          <div className="login__selected">
            <span>PAKET DIPILIH</span>
            <strong>{selection}</strong>
          </div>

          <form onSubmit={requestCode} noValidate className="stack gap-12">
            <div className="field">
              <label htmlFor="wa">Nomor WhatsApp</label>
              <div className="login__phone">
                <span>+62</span>
                <input
                  id="wa"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  className="input"
                  placeholder="812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={step === 'code'}
                />
              </div>
            </div>
            {step === 'phone' && (
              <Button type="submit" variant="primary" block disabled={busy}>
                {busy ? 'Mengirim…' : 'Kirim kode lewat WhatsApp'}
              </Button>
            )}
          </form>

          {step === 'code' && (
            <form onSubmit={submitCode} noValidate className="stack gap-12">
              <div className="login__divider">
                <span>KODE VERIFIKASI</span>
              </div>
              <fieldset className="login__code">
                <legend>Masukkan 6 digit kode</legend>
                <div className="login__digits">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (refs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? 'one-time-code' : 'off'}
                      maxLength={CODE_LENGTH}
                      aria-label={`Digit ${i + 1}`}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onKeyDown(i, e)}
                    />
                  ))}
                </div>
              </fieldset>
              <div className="row row--between hint">
                <span>Belum menerima kode?</span>
                <button type="button" className="link-button" onClick={requestCode} disabled={busy}>
                  Kirim ulang
                </button>
              </div>
              <Button type="submit" variant="primary" block disabled={busy}>
                {busy ? 'Memeriksa…' : 'Masuk & lanjut ke pembelian'}
              </Button>
              <button
                type="button"
                className="link-button link-button--center"
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
              >
                Ganti nomor
              </button>
            </form>
          )}

          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}

          {DEMO_MODE && (
            <p className="hint login__demo">
              Mode demo: kode 6 digit apa pun diterima sampai back end tersambung.
            </p>
          )}

          <p className="hint login__legal">
            Dengan masuk, kamu menyetujui syarat penggunaan dan kebijakan privasi Pride.{' '}
            <Link to="/tutorial" className="link-gold-text">
              Butuh bantuan? Lihat tutorial
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
