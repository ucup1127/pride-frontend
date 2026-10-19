import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { findTemplate } from '../data/templates';
import { getGuestBySlug } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_DATE = new Date('2026-12-12T08:00:00+07:00');

// Komponen Countdown
function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const pad = (n) => String(n).padStart(2, '0');
  return [
    { label: 'Hari', value: pad(Math.floor(diff / 86400000)) },
    { label: 'Jam', value: pad(Math.floor((diff / 3600000) % 24)) },
    { label: 'Menit', value: pad(Math.floor((diff / 60000) % 60)) },
    { label: 'Detik', value: pad(Math.floor((diff / 1000) % 60)) },
  ];
}

// Komponen Pembungkus Animasi Scroll
const FadeInSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Undangan() {
  const { slug } = useParams(); 
  const [params] = useSearchParams();
  const audioRef = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [guestData, setGuestData] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [wishes, setWishes] = useState([]);
  const [form, setForm] = useState({ name: '', attendance: 'Hadir', message: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Efek biar pas undangan belum dibuka, layar ga bisa di-scroll
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      window.scrollTo(0, 0); // Paksa scroll ke atas pas dibuka
    }
  }, [isOpen]);

  useEffect(() => {
    async function loadData() {
      if (slug) {
        try {
          const data = await getGuestBySlug(slug);
          setGuestData(data);
          setTemplate(findTemplate(data.undangan.templateId));
          setForm(f => ({ ...f, name: data.nama }));
        } catch (err) { console.error(err); }
      } else {
        const t = findTemplate(params.get('template'));
        setTemplate(t);
        setGuestData({ nama: '[Nama Tamu Demo]' }); 
      }
      setLoading(false);
    }
    loadData();
  }, [slug, params]);

  useEffect(() => {
    const saved = localStorage.getItem('pride_wishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  const countdown = useCountdown(EVENT_DATE);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Nyalain musik
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Autoplay diblokir browser:", err));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Nama wajib diisi.'); return; }
    setError(''); setSending(true);
    try {
      const wish = { id: Date.now().toString(), name: form.name.trim(), message: form.message };
      const newWishes = [wish, ...wishes];
      setWishes(newWishes);
      localStorage.setItem('pride_wishes', JSON.stringify(newWishes)); 
      setForm((f) => ({ ...f, message: '' }));
      setSent(true);
    } catch (err) { setError(err.message); } finally { setSending(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Memuat...</div>;
  if (!template) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Template tidak ditemukan.</div>;

  const guestName = guestData?.nama || '[Nama Tamu]';
  const [first, second] = template.names.includes('&')
    ? template.names.split('&').map((s) => s.trim())
    : [template.names, null];

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex justify-center font-sans">
      
      {/* AUDIO BACKGROUND */}
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop 
      />

      {/* TOMBOL MUSIK (Melayang) */}
      {isOpen && (
        <button 
          onClick={toggleMusic} 
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] flex items-center justify-center border border-gray-200 shadow-xl transition-transform hover:scale-110"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      )}

      {/* CONTAINER UTAMA (Max Width HP) */}
      <div className="w-full max-w-[480px] bg-white shadow-2xl relative">
        
        {/* === 1. SAMPUL DEPAN (FIXED FULL SCREEN) === */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, y: "-100vh" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] flex flex-col justify-between items-center text-center p-8 bg-cover bg-center max-w-[480px] mx-auto"
              style={{ 
                backgroundColor: template.bg,
                backgroundImage: template.img ? `url(${template.img})` : 'none',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/90 z-0" />

              <div className="relative z-10 w-full pt-12 text-white">
                <div className="text-xs tracking-[0.3em] font-semibold mb-2 uppercase">{template.event}</div>
                <div className="w-12 h-[1px] bg-white/50 mx-auto" />
              </div>

              <div className="relative z-10 text-white">
                <div className="font-serif text-6xl mb-4 leading-none drop-shadow-lg">{first}</div>
                {second && (
                  <>
                    <div className="font-serif text-3xl italic text-[#A98B5A] my-2">&</div>
                    <div className="font-serif text-6xl mb-4 leading-none drop-shadow-lg">{second}</div>
                  </>
                )}
                <div className="text-sm tracking-[0.3em] mt-8 opacity-90">{template.date}</div>
              </div>

              <div className="relative z-10 w-full bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white">
                <p className="text-xs text-white/70 mb-1">Kepada Yth.</p>
                <p className="text-2xl font-semibold mb-6">{guestName}</p>
                <button 
                  onClick={handleOpenInvitation}
                  className="w-full py-3.5 bg-white text-black rounded-full font-bold text-sm tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  BUKA UNDANGAN
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === 2. ISI UNDANGAN === */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8, duration: 1 }}
            className="relative z-10"
          >
            {/* QUOTE & MEMPELAI */}
            <section className="py-20 px-8 text-center bg-[#FBF8F2]">
              <FadeInSection>
                <p className="text-sm italic text-gray-500 mb-8 max-w-xs mx-auto">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."</p>
                <div className="w-10 h-[1px] bg-[#A98B5A] mx-auto mb-16" />
              </FadeInSection>
              
              <div className="space-y-12">
                <FadeInSection delay={0.1}>
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Mempelai" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-serif text-3xl mb-1 text-gray-800">Nadia</h2>
                  <p className="text-xs text-gray-500">Putri dari Bapak & Ibu</p>
                </FadeInSection>
                
                <FadeInSection delay={0.2}>
                  <div className="font-serif text-4xl text-[#A98B5A]">&</div>
                </FadeInSection>

                <FadeInSection delay={0.3}>
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80" alt="Mempelai" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-serif text-3xl mb-1 text-gray-800">Raka</h2>
                  <p className="text-xs text-gray-500">Putra dari Bapak & Ibu</p>
                </FadeInSection>
              </div>
            </section>

            {/* ACARA & COUNTDOWN */}
            <section className="py-16 px-6 bg-white text-center">
              <FadeInSection>
                <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] mb-4">SAVE THE DATE</div>
                <div className="flex justify-center gap-3 md:gap-4 mb-10">
                  {countdown.map((c) => (
                    <div key={c.label} className="flex flex-col items-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FBF8F2] border border-gray-200 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold text-gray-800 mb-1">{c.value}</div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500">{c.label}</span>
                    </div>
                  ))}
                </div>
              </FadeInSection>

              <FadeInSection delay={0.2}>
                <div className="space-y-6 text-sm">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-serif text-2xl mb-2 text-gray-800">Akad Nikah</h3>
                    <p className="text-gray-600 mb-1">Sabtu, 12 Desember 2026</p>
                    <p className="font-semibold text-gray-800">08.00 - 10.00 WIB</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-serif text-2xl mb-2 text-gray-800">Resepsi</h3>
                    <p className="text-gray-600 mb-1">Sabtu, 12 Desember 2026</p>
                    <p className="font-semibold text-gray-800">11.00 - 14.00 WIB</p>
                  </div>
                </div>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-block mt-8 px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-sm font-medium">Petunjuk Lokasi</a>
              </FadeInSection>
            </section>

            {/* RSVP */}
            <section className="py-16 px-6 bg-[#FBF8F2]">
              <FadeInSection>
                <div className="text-center mb-8">
                  <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] mb-2">RSVP</div>
                  <h2 className="font-serif text-3xl text-gray-800">Konfirmasi Kehadiran</h2>
                </div>
                <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-3xl shadow-sm">
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Nama</label><input name="name" value={form.name} onChange={onChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]" /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Kehadiran</label><select name="attendance" value={form.attendance} onChange={onChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]"><option>Hadir</option><option>Tidak hadir</option></select></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Ucapan & Doa</label><textarea name="message" rows="3" value={form.message} onChange={onChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]" placeholder="Tulis pesanmu..." /></div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  {sent && <p className="text-green-600 text-xs">Terima kasih!</p>}
                  <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors">{sending ? 'Mengirim...' : 'Kirim Ucapan'}</button>
                </form>
              </FadeInSection>

              <FadeInSection delay={0.2}>
                <ul className="mt-8 space-y-3">
                  {wishes.map((w) => (
                    <li key={w.id} className="bg-white p-4 rounded-2xl shadow-sm"><strong className="block text-sm text-gray-800 mb-1">{w.name}</strong><span className="text-xs text-gray-500 leading-relaxed">{w.message}</span></li>
                  ))}
                </ul>
              </FadeInSection>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#1A1A1A] text-center py-12 px-6">
              <div className="font-serif text-3xl text-white mb-2">{template.names}</div>
              <p className="text-xs text-white/50 mb-6">Terima kasih atas doa dan kehadiran Anda.</p>
              <div className="text-[10px] tracking-widest text-[#A98B5A] uppercase">Made with Pride</div>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
}