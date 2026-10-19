import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LeafIcon } from '../components/Logo';
import { useAuth } from '../auth';
import { DEMO_MODE } from '../config';
import { findTemplate } from '../data/templates';
import { sendOtp, verifyOtp } from '../services/api';

const CODE_LENGTH = 6;

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
  const [step, setStep] = useState('phone');
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef([]);

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
    setDigits((d) => {
      const next = [...d];
      clean.slice(0, CODE_LENGTH - index).split('').forEach((ch, i) => {
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
    'Pilih Template / Paket';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FBF8F2' }}>
      
      {/* KIRI: Branding (Sembunyi di HP) */}
      <aside style={{ 
        flex: 1, 
        display: 'none', // Kita sembunyiin dulu biar aman di mobile
        padding: '60px', 
        background: '#FBF8F2', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        borderRight: '1px solid #EAEAEA'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LeafIcon />
          <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1A1A1A', fontFamily: 'serif' }}>pride</span>
        </Link>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', color: '#A98B5A', marginBottom: 20 }}>
            DIGITAL INVITATION
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', lineHeight: 1.1, color: '#1A1A1A', margin: '0 0 20px 0' }}>
            Selangkah lagi menuju undanganmu.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6 }}>
            Masuk dengan nomor WhatsApp. Tidak perlu membuat akun atau mengingat kata sandi.
          </p>
        </div>
        <small style={{ color: '#999' }}>© {new Date().getFullYear()} Pride Studio</small>
      </aside>

      {/* KANAN: Form Login */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '24px' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: '#FFF', 
          padding: '40px 32px', 
          borderRadius: '24px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          border: '1px solid #F0F0F0'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', margin: '0 0 10px 0', color: '#1A1A1A' }}>
              Masuk via WhatsApp
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, margin: 0 }}>
              Kami kirim kode verifikasi ke WhatsApp-mu.
            </p>
          </div>

          <div style={{ background: '#F9F9F9', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', border: '1px solid #EEE' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#888', marginBottom: 4 }}>PAKET DIPILIH</span>
            <strong style={{ fontSize: '0.95rem', color: '#1A1A1A' }}>{selection}</strong>
          </div>

          <form onSubmit={requestCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: 8 }}>Nomor WhatsApp</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#FAFAFA', border: '1px solid #DDD', borderRadius: '10px', overflow: 'hidden' }}>
                <span style={{ padding: '12px 16px', background: '#F0F0F0', color: '#666', fontWeight: 600, borderRight: '1px solid #DDD' }}>+62</span>
                <input
                  type="tel"
                  placeholder="812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={step === 'code'}
                  style={{ flex: 1, padding: '12px', border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem' }}
                />
              </div>
            </div>

            {step === 'phone' && (
              <button type="submit" disabled={busy} style={{ width: '100%', padding: '14px', background: '#1A1A1A', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                {busy ? 'Mengirim...' : 'Kirim Kode'}
              </button>
            )}
          </form>

          {step === 'code' && (
            <form onSubmit={submitCode} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', letterSpacing: '0.1em' }}>KODE VERIFIKASI</span>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    style={{ width: '45px', height: '55px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 600, border: '1px solid #DDD', borderRadius: '10px', background: '#FAFAFA' }}
                  />
                ))}
              </div>
              
              <button type="submit" disabled={busy} style={{ width: '100%', padding: '14px', background: '#1A1A1A', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                {busy ? 'Memeriksa...' : 'Masuk & Lanjut'}
              </button>
              
              <button type="button" onClick={() => setStep('phone')} style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Ganti nomor
              </button>
            </form>
          )}

          {error && <p style={{ color: '#D32F2F', fontSize: '0.85rem', textAlign: 'center', marginTop: 16, background: '#FFEBEE', padding: 10, borderRadius: 8 }}>{error}</p>}

          {DEMO_MODE && (
            <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: 20 }}>
              Mode demo: kode 6 digit apa pun diterima.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}