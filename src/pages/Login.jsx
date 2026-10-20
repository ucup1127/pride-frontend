import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafIcon } from '../components/Logo';
import { useAuth } from '../auth';
import { findTemplate } from '../data/templates';
import { sendOtp, verifyOtp } from '../services/api';
import PageTransition from '../components/PageTransition';

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
  const [step, setStep] = useState('phone'); // 'phone' | 'code'
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
    <PageTransition>
      <div className="min-h-screen flex bg-[#FBF8F2]">
        
        {/* === KIRI: GAMBAR & BRANDING (Sembunyi di Mobile) === */}
        <aside className="hidden lg:flex w-1/2 relative bg-[#1A1A1A] flex-col justify-between p-12 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop" 
            alt="Wedding" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
          
          <Link to="/" className="relative z-10 flex items-center gap-3 text-white w-max group">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all">
              <LeafIcon />
            </div>
            <span className="font-serif text-3xl tracking-wide">pride</span>
          </Link>

          <div className="relative z-10">
            <div className="w-12 h-[1px] bg-[#A98B5A] mb-6" />
            <h2 className="font-serif text-5xl text-white leading-tight mb-4">
              Selangkah lagi<br/>menuju undanganmu.
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              Masuk dengan nomor WhatsApp. Tidak perlu membuat akun atau mengingat kata sandi.
            </p>
          </div>
        </aside>

        {/* === KANAN: FORM LOGIN === */}
        <main className="flex-1 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/5 border border-[#EAEAEA]">
            
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-2">Masuk</h1>
              <p className="text-gray-500 text-sm">Kami akan mengirim kode verifikasi ke WhatsApp-mu.</p>
            </div>

            {/* Box Pilihan Paket */}
            <div className="bg-[#FBF8F2] rounded-2xl p-4 mb-8 text-center border border-[#EAEAEA]">
              <span className="block text-[0.65rem] font-bold tracking-[0.15em] text-[#A98B5A] uppercase mb-1">Paket Dipilih</span>
              <strong className="text-sm text-[#1A1A1A]">{selection}</strong>
            </div>

            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.form 
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={requestCode} 
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#A98B5A] transition-colors">
                      <span className="px-4 py-3.5 bg-gray-100 text-gray-500 font-semibold border-r border-gray-200">+62</span>
                      <input
                        type="tel"
                        placeholder="812 3456 7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-[#1A1A1A] font-medium"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={busy}
                    className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50 mt-2"
                  >
                    {busy ? 'Mengirim...' : 'Kirim Kode'}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={submitCode} 
                  className="space-y-6"
                >
                  <div className="text-center">
                    <label className="block text-xs font-bold tracking-[0.15em] text-gray-500 mb-4">MASUKKAN 6 DIGIT</label>
                    <div className="flex justify-between gap-2">
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
                          className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:border-[#A98B5A] focus:bg-white outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={busy}
                    className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {busy ? 'Memeriksa...' : 'Masuk & Lanjut'}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => { setStep('phone'); setError(''); }} 
                    className="w-full text-center text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors"
                  >
                    Ganti nomor
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-sm text-red-600 bg-red-50 p-3 rounded-xl text-center border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Dengan masuk, kamu menyetujui <a href="#" className="underline hover:text-gray-600">Syarat</a> & <a href="#" className="underline hover:text-gray-600">Privasi</a>.
              </p>
            </div>

          </div>
        </main>
      </div>
    </PageTransition>
  );
}