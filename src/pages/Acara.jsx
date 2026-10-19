import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORY_COUNTS } from '../data/templates';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const blurbs = {
  'Pernikahan': 'Rayakan kisah kalian dengan undangan yang elegan.',
  'Ulang tahun': 'Undang orang tersayang untuk momen bertambah usia.',
  'Wisuda': 'Bagikan kabar kelulusan dengan desain yang berkesan.',
  'Sempro/Semhas': 'Undangan sidang proposal atau hasil yang rapi dan formal.',
  'Bukber & Khitanan': 'Kumpulkan keluarga dan sahabat dalam satu undangan.',
  'Acara kantor': 'Untuk gathering, seminar, meeting, dan acara perusahaan.',
  'Aqiqah & Tasyakuran': 'Rayakan kelahiran buah hati dengan undangan hangat.',
  'Anniversary & Reuni': 'Kenang momen berharga bersama orang terdekat.',
};

const CATEGORY_DATA = {
  'Pernikahan': { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&q=80' },
  'Ulang tahun': { img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=1000&fit=crop&q=80' },
  'Wisuda': { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1000&fit=crop&q=80' },
  'Sempro/Semhas': { img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=1000&fit=crop&q=80' },
  'Bukber & Khitanan': { img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=1000&fit=crop&q=80' },
  'Acara kantor': { img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=1000&fit=crop&q=80' },
  'Aqiqah & Tasyakuran': { img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=1000&fit=crop&q=80' },
  'Anniversary & Reuni': { img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1000&fit=crop&q=80' },
};

export default function Acara() {
  return (
    <Layout>
      <PageTransition>
        {/* HEADER */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] uppercase mb-4"
          >
            Untuk Setiap Momen
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] leading-tight mb-6"
          >
            Acara spesialmu, dengan gaya yang kamu pilih.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Pilih kategori acara untuk melihat koleksi template yang bisa kamu personalisasi.
          </motion.p>
        </section>

        {/* GRID KATEGORI */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(CATEGORY_COUNTS).map(([name, count], i) => {
              const data = CATEGORY_DATA[name] || {};
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i % 3) * 0.1 }}
                >
                  <Link
                    to={`/katalog?kategori=${encodeURIComponent(name)}`}
                    className="group block relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#1A1A1A]"
                  >
                    {/* Gambar Background */}
                    {data.img && (
                      <img
                        src={data.img}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Overlay Gelap */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/70 transition-colors duration-300" />

                    {/* Konten di dalam Card */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 text-white">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold tracking-wider text-white/70">
                          0{i + 1}
                        </span>
                        <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                          ↗
                        </span>
                      </div>

                      <div>
                        <h2 className="font-serif text-3xl mb-2">{name}</h2>
                        <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-2">
                          {blurbs[name]}
                        </p>
                        <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-medium">
                          {count} template
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="bg-white border-t border-[#EAEAEA] py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-6">
              Temukan desain yang paling kamu suka.
            </h2>
            <Link 
              to="/katalog" 
              className="inline-block bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-semibold hover:bg-black transition-transform hover:scale-105"
            >
              Lihat Semua Katalog
            </Link>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}