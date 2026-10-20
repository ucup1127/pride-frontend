import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TemplateCard from '../components/TemplateCard';
import { CATEGORIES, TEMPLATES } from '../data/templates';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Katalog() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('kategori');
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : 'Semua';
  const query = params.get('cari') || '';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && !(key === 'kategori' && value === 'Semua')) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        (category === 'Semua' || t.category === category) &&
        (!q || t.name.toLowerCase().includes(q) || t.style.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <Layout>
      <PageTransition>
        {/* HEADER KATALOG (Lebih Compact) */}
        <section className="bg-[#FBF8F2] pt-16 pb-12 px-6 border-b border-[#EAEAEA]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] uppercase mb-3">
                Katalog Template
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1A1A1A] leading-tight">
                Pilih desain yang <em className="italic text-[#A98B5A]">kamu suka.</em>
              </h1>
            </div>
            
            {/* Search Bar Minimalis */}
            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Cari template..."
                  value={query}
                  onChange={(e) => update('cari', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#EAEAEA] rounded-full text-sm focus:outline-none focus:border-[#A98B5A] focus:ring-1 focus:ring-[#A98B5A] transition-shadow"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY FILTER BAR (Biar Gak Ilang Pas Di-scroll) */}
        <div className="sticky top-20 z-40 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#EAEAEA] py-4 shadow-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {CATEGORIES.map((c) => {
                const isActive = c === category;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update('kategori', c)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-[#1A1A1A] text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-[#EAEAEA] hover:border-[#A98B5A] hover:text-[#A98B5A]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* GRID TEMPLATE (Card Lebih Kecil, 4 Kolom) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {visible.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visible.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 8) * 0.05 }} // Animasi muncul berurutan
                >
                  <TemplateCard template={t} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#EAEAEA]">
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">Template tidak ditemukan</h2>
              <p className="text-gray-500">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          )}
        </section>
      </PageTransition>
    </Layout>
  );
}