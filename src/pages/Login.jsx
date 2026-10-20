import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LeafIcon } from '../components/Logo';
import { useAuth } from '../auth';
import { findTemplate } from '../data/templates';
import { login } from '../services/api';
import PageTransition from '../components/PageTransition';

export default function Login() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signIn } = useAuth();

  const plan = params.get('paket');
  const templateId = params.get('template');
  const template = templateId ? findTemplate(templateId) : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Email dan password wajib diisi.'); return; }
    
    setError('');
    setBusy(true);
    try {
      const result = await login(email, password);
      signIn({ token: result.token, user: result.user, plan, template: templateId });
      
      const redirectPath = location.state?.from || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-[#FBF8F2]">
        <aside className="hidden lg:flex w-1/2 relative bg-[#1A1A1A] flex-col justify-between p-12 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop" alt="Wedding" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
          <Link to="/" className="relative z-10 flex items-center gap-3 text-white w-max group">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all"><LeafIcon /></div>
            <span className="font-serif text-3xl tracking-wide">pride</span>
          </Link>
          <div className="relative z-10">
            <div className="w-12 h-[1px] bg-[#A98B5A] mb-6" />
            <h2 className="font-serif text-5xl text-white leading-tight mb-4">Selangkah lagi<br/>menuju undanganmu.</h2>
            <p className="text-white/60 text-lg max-w-md">Masuk untuk mulai membuat undangan digital yang elegan.</p>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/5 border border-[#EAEAEA]">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-2">Masuk</h1>
              <p className="text-gray-500 text-sm">Gunakan email dan password akunmu.</p>
            </div>

            <div className="bg-[#FBF8F2] rounded-2xl p-4 mb-8 text-center border border-[#EAEAEA]">
              <span className="block text-[0.65rem] font-bold tracking-[0.15em] text-[#A98B5A] uppercase mb-1">Paket Dipilih</span>
              <strong className="text-sm text-[#1A1A1A]">
                {[plan && `Paket ${plan}`, template && `Template ${template.name}`].filter(Boolean).join(' · ') || 'Pilih Template / Paket'}
              </strong>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kamu@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A98B5A] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A98B5A] transition-colors" />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-center">{error}</p>}

              <button type="submit" disabled={busy} className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50 mt-2">
                {busy ? 'Memeriksa...' : 'Masuk'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Belum punya akun? <Link to="/daftar" className="text-[#A98B5A] font-semibold hover:underline">Daftar di sini</Link></p>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}