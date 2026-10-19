import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { TIPS, TUTORIAL_STEPS } from '../data/content';
import { instagramChatLink } from '../config';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Tutorial() {
  return (
    <Layout>
      <PageTransition>
        {/* HEADER */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase mb-4"
          >
            Panduan Lengkap
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-brand-ink leading-tight mb-6"
          >
            Dari memilih template<br className="hidden md:block" /> sampai undangan tersebar
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Ikuti 6 langkah mudah berikut. Seluruh prosesnya bisa dilakukan langsung dari HP tanpa aplikasi tambahan.
          </motion.p>
        </section>

        {/* GRID KONTEN */}
        <section className="max-w-6xl mx-auto px-6 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KIRI: Video & Bantuan */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-6"
          >
            <div className="bg-brand-ink aspect-video rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5 L19 12 L8 19 Z" /></svg>
              </div>
              <span className="text-sm tracking-widest text-white/80">TONTON VIDEO</span>
            </div>

            <div className="bg-brand-bg border border-gray-200 rounded-3xl p-8">
              <h2 className="font-serif text-2xl mb-3 text-brand-ink">Butuh bantuan?</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">Admin kami siap membantu kamu lewat chat jika ada kendala saat membuat undangan.</p>
              <a href={instagramChatLink} target="_blank" rel="noreferrer" className="block text-center w-full bg-brand-ink text-white font-semibold py-3 rounded-full hover:bg-black transition-colors">
                Chat Admin via Instagram
              </a>
            </div>
          </motion.aside>

          {/* KANAN: Langkah-langkah */}
          <div className="lg:col-span-7 space-y-4">
            {TUTORIAL_STEPS.map((s, i) => (
              <motion.div 
                key={s.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F0EAE1] text-brand-gold font-bold text-lg flex items-center justify-center shrink-0">
                  {s.no}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-brand-ink mb-2">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-4">{s.text}</p>
                  <Link to={s.to} className="inline-flex items-center text-brand-gold font-semibold hover:gap-2 transition-all">
                    {s.cta}
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}