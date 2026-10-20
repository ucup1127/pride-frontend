import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { findTemplate } from '../data/templates';
import { useAuth } from '../auth';
import { createUndangan } from '../services/api';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Layout from '../components/Layout';

export default function Editor() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const templateId = params.get('template') || 'aurelia';
  const template = findTemplate(templateId);

  const [form, setForm] = useState({
    mempelai1: '',
    mempelai2: '',
    tanggal: '',
    lokasi: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kalau user belum login, tendang ke halaman masuk
  useEffect(() => {
    if (!session) {
      navigate(`/masuk?template=${templateId}`, { replace: true });
    }
  }, [session, navigate, templateId]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mempelai1 || !form.mempelai2) {
      setError('Nama kedua mempelai wajib diisi.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Bikin slug unik dari nama (misal: nadia-raka-1234)
      const slug = `${form.mempelai1.toLowerCase().replace(/[^a-z0-9]/g, '')}-${form.mempelai2.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

      // Nembak API Backend
      const payload = {
        judul: `Undangan ${form.mempelai1} & ${form.mempelai2}`,
        templateId: template.id,
        slug: slug,
        isPublic: true,
        status: 'published',
        data: {
          mempelai1: form.mempelai1,
          mempelai2: form.mempelai2,
          tanggal: form.tanggal,
          lokasi: form.lokasi,
        }
      };

      await createUndangan(payload);
      
      // Kalau sukses, lempar ke dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!template) return <div className="p-10 text-center">Template tidak ditemukan.</div>;

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-[#FBF8F2] py-20 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* KIRI: Preview Template */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#EAEAEA] sticky top-24">
              <h2 className="font-serif text-2xl mb-4 text-center">Preview Template</h2>
              <div className="aspect-[3/4] rounded-xl overflow-hidden relative bg-gray-100">
                {template.img && (
                  <img src={template.img} alt="Preview" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-center">
                  <p className="text-xs tracking-[0.2em] uppercase mb-1">{template.event}</p>
                  <h3 className="font-serif text-3xl mb-2">
                    {form.mempelai1 || '[Mempelai 1]'} & {form.mempelai2 || '[Mempelai 2]'}
                  </h3>
                  <p className="text-sm opacity-80">{form.tanggal || template.date}</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">Template: <strong>{template.name}</strong></p>
            </div>

            {/* KANAN: Form Data */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-[#EAEAEA]">
              <div className="mb-8">
                <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] uppercase mb-2">Langkah Terakhir</div>
                <h1 className="font-serif text-4xl text-[#1A1A1A]">Isi Data Undangan</h1>
                <p className="text-gray-500 mt-2">Lengkapi data di bawah ini untuk membuat undanganmu.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Mempelai 1</label>
                    <input 
                      name="mempelai1" 
                      value={form.mempelai1} 
                      onChange={handleChange} 
                      placeholder="Contoh: Nadia" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A98B5A]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Mempelai 2</label>
                    <input 
                      name="mempelai2" 
                      value={form.mempelai2} 
                      onChange={handleChange} 
                      placeholder="Contoh: Raka" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A98B5A]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Acara</label>
                  <input 
                    type="date" 
                    name="tanggal" 
                    value={form.tanggal} 
                    onChange={handleChange} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A98B5A]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi Acara</label>
                  <input 
                    name="lokasi" 
                    value={form.lokasi} 
                    onChange={handleChange} 
                    placeholder="Contoh: Gedung Pernikahan, Jakarta" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A98B5A]" 
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? 'Menyimpan...' : 'Simpan & Buat Undangan'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}