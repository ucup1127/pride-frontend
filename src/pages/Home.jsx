import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOMENTS, FEATURES } from '../data/content';
import { FEATURED_IDS, TEMPLATES } from '../data/templates';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import TemplateCard from '../components/TemplateCard';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Gambar dummy buat background card (biar gak polos)
const MOMENT_IMAGES = {
  'Pernikahan': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'Ulang tahun': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  'Wisuda': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'Sempro/Semhas': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
  'Bukber & Khitanan': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
  'Acara kantor': 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  'Aqiqah & Tasyakuran': 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&q=80',
  'Anniversary & Reuni': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
};

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

        {/* =========================================
            SECTION MOMENTS (3D CAROUSEL SWIPER)
            ========================================= */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="text-center mb-16 px-6">
            <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Bukan hanya untuk pernikahan</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">Geser untuk melihat momen-momen spesial lainnya.</p>
          </div>

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'} // Biar otomatis ngikutin lebar card
            loop={true} // Biar bisa muter terus
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 35, // Derajat kemiringan card samping
              stretch: 0,
              depth: 150, // Efek 3D menjauh
              modifier: 1,
              slideShadows: false, // Kita matiin bayangan bawaan biar bersih
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="w-full pb-16"
          >
            {MOMENTS.map((m) => (
              <SwiperSlide key={m.title} className="max-w-[280px] md:max-w-[320px]">
                {({ isActive }) => (
                  <Link to={`/katalog?kategori=${encodeURIComponent(m.category)}`} className="block group">
                    <div 
                      className={`relative rounded-[2rem] overflow-hidden aspect-[3/4] transition-all duration-500 ease-out ${
                        isActive ? 'shadow-2xl scale-100' : 'opacity-50 blur-[2px] scale-90'
                      }`}
                    >
                      {/* Background Image */}
                      <img 
                        src={MOMENT_IMAGES[m.title] || MOMENT_IMAGES['Pernikahan']} 
                        alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Overlay Gelap */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      {/* Teks */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <h3 className="font-serif text-2xl md:text-3xl mb-2">{m.title}</h3>
                        <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  </Link>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

               {/* FITUR SECTION (Bento Grid & Horizontal Scroll) */}
        <section className="py-24 bg-[#FBF8F2] overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-12">
            <div className="text-center">
              <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] uppercase mb-3">Fitur Utama</div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Semua yang dibutuhkan</h2>
            </div>
          </div>

          {/* Container buat Horizontal Scroll di Mobile, Grid di Desktop */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 px-6 md:px-0 max-w-6xl mx-auto pb-8 scrollbar-hide snap-x snap-mandatory">
            {FEATURES.slice(0, 6).map((f, i) => {
              // Bikin ukuran card beda-beda (Bento style) khusus di desktop
              const isLarge = i === 0 || i === 5; // Card pertama & terakhir dibikin lebih lebar
              
              return (
                <motion.div 
                  key={f.no}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-white p-8 rounded-[2rem] border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300 group min-w-[280px] md:min-w-0 snap-center flex flex-col justify-between ${
                    isLarge ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
                >
                  {/* Ikon & Nomor */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#FBF8F2] flex items-center justify-center text-[#A98B5A] group-hover:scale-110 group-hover:bg-[#A98B5A] group-hover:text-white transition-all duration-300">
                      {/* Ikon Garis Elegan (SVG) */}
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                        {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                        {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
                        {i === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />}
                        {i === 4 && <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                        {i === 5 && <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                    </div>
                    <span className="font-serif text-3xl text-[#EAEAEA] group-hover:text-[#A98B5A] transition-colors">{f.no}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">{f.title}</h3>
                    <p className="text-[#666] leading-relaxed text-sm">{f.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-6 md:hidden px-6">
            <p className="text-xs text-gray-400 italic">Geser ke samping untuk melihat fitur lainnya →</p>
          </div>
        </section>

                {/* TEMPLATE SECTION */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] uppercase mb-3">Koleksi Kami</div>
                <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Template pilihan</h2>
              </div>
              <Link to="/katalog" className="text-[#A98B5A] font-semibold hover:underline flex items-center gap-2">
                Lihat semua template <span className="text-lg">→</span>
              </Link>
            </div>
            
            {/* Grid di Desktop, Horizontal Scroll di Mobile */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
              {featured.map((t) => (
                <div key={t.id} className="min-w-[260px] md:min-w-0 snap-center">
                  {/* Kita bungkus pake aspect-ratio 3:4 biar gak gede-gede amat di HP */}
                  <div className="aspect-[3/4]">
                    <TemplateCard template={t} actionPath={`/masuk?template=${t.id}`} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4 md:hidden">
              <p className="text-xs text-gray-400 italic">Geser ke samping untuk lihat template lain →</p>
            </div>
          </div>
        </section>

               {/* CTA SECTION */}
        <section className="relative py-32 px-6 bg-[#1A1A1A] overflow-hidden">
          {/* Ornamen Garis Tipis di Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
                Siap membuat <em className="italic text-[#A98B5A]">undanganmu?</em>
              </h2>
              <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
                Mulai dari memilih template. Data bisa kamu ubah kapan saja sebelum undangan disebar.
              </p>
              
              <div className="relative inline-block group">
                {/* Efek Glow di belakang tombol */}
                <div className="absolute -inset-1 bg-[#A98B5A] rounded-full blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
                
                <Link 
                  to="/masuk" 
                  className="relative inline-flex items-center justify-center bg-[#A98B5A] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#8C7248] transition-all transform hover:-translate-y-1"
                >
                  Mulai buat undangan
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}