import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOMENTS, FEATURES, STEPS, PLANS, FAQS } from '../data/content';
import { FEATURED_IDS, TEMPLATES } from '../data/templates';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import TemplateCard from '../components/TemplateCard';

export default function Home() {
  const featured = FEATURED_IDS.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean);

  return (
    <Layout>
      <PageTransition>
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl font-medium text-[#1A1A1A] leading-[1.1] mb-6 max-w-4xl mx-auto"
            >
              Undangan digital yang dibuat <em className="text-[#A98B5A] italic">sepenuh hati.</em>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Pilih template, isi data acara, lalu bagikan lewat satu tautan. Semuanya bisa selesai dalam hitungan menit.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/katalog" className="w-full sm:w-auto bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-semibold hover:bg-black transition-transform hover:scale-105 shadow-xl">
                Lihat Template
              </Link>
              <Link to="/undangan?template=aurelia" className="w-full sm:w-auto bg-white text-[#1A1A1A] border border-[#EAEAEA] px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                Contoh Undangan
              </Link>
            </motion.div>
          </div>
        </section>

        {/* MOMENTS SECTION */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Bukan hanya untuk pernikahan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOMENTS.slice(0, 6).map((m, i) => (
                <motion.div 
                  key={m.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/katalog?kategori=${encodeURIComponent(m.category)}`} className="block group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#1A1A1A]">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                      <h3 className="text-white font-serif text-3xl mb-2">{m.title}</h3>
                      <p className="text-white/80 text-sm">{m.text}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FITUR SECTION */}
        <section className="py-24 px-6 bg-[#FBF8F2]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Semua yang dibutuhkan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.slice(0, 6).map((f, i) => (
                <motion.div 
                  key={f.no}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-[#EAEAEA] hover:shadow-xl transition-shadow"
                >
                  <div className="text-[#A98B5A] font-bold text-xl mb-4">{f.no}</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">{f.title}</h3>
                  <p className="text-[#666] leading-relaxed">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPLATE SECTION */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Template pilihan</h2>
              <Link to="/katalog" className="text-[#A98B5A] font-semibold hover:underline">Lihat semua →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((t) => (
                <TemplateCard key={t.id} template={t} actionPath={`/masuk?template=${t.id}`} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 bg-[#1A1A1A] text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Siap membuat undanganmu?</h2>
            <p className="text-white/70 text-lg mb-10">Mulai dari memilih template. Data bisa kamu ubah kapan saja sebelum undangan disebar.</p>
            <Link to="/masuk" className="inline-block bg-[#A98B5A] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#8C7248] transition-colors shadow-2xl hover:scale-105 transition-transform">
              Mulai buat undangan
            </Link>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}