import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LeafIcon } from '../components/Logo';
import { register, login } from '../services/api';
import { useAuth } from '../auth';
import PageTransition from '../components/PageTransition';

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Semua kolom wajib diisi.'); return; }
    
    setError(''); setBusy(true);
    try {
      await register(form);
      const result = await login(form.email, form.password);
      signIn({ token: result.token, user: result.user });
      navigate('/dashboard');
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
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop" alt="Wedding" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
          <Link to="/" className="relative z-10 flex items-center gap-3 text-white w-max group">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-all"><LeafIcon /></div>
            <span className="font-serif text-3xl tracking-wide">pride</span>
          </Link>
          <div className="relative z-10">
            <div className="w-12 h-[1px] bg-[#A98B5A] mb-6" />
            <h2 className="font-serif text-5xl text-white leading-tight mb-4">Mulai ceritamu<br/>di sini.</h2>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/5 border border-[#EAEAEA]">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-2">Daftar Akun</h1>
              <p className="text-gray-500 text-sm">Buat akun untuk mulai membuat undangan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nama Kamu" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A98B5A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="kamu@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A98B5A]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Minimal 6 karakter" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A98B5A]" />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-center">{error}</p>}

              <button type="submit" disabled={busy} className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50 mt-2">
                {busy ? 'Mendaftar...' : 'Daftar & Masuk'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Sudah punya akun? <Link to="/masuk" className="text-[#A98B5A] font-semibold hover:underline">Masuk di sini</Link></p>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}