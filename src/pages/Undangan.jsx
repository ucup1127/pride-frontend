import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { findTemplate } from '../data/templates';
import { getGuestBySlug } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_DATE = new Date('2026-12-12T08:00:00+07:00');

// ==========================================
// KOMPONEN PENDUKUNG
// ==========================================
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

// ==========================================
// KOMPONEN RSVP (Dipakai di semua layout kecuali Timeless)
// ==========================================
const RsvpSection = ({ wishes, form, onChange, onSubmit, error, sent, sending, minimalist }) => (
  <section className={`py-20 px-6 ${minimalist ? 'bg-[#FBF8F2]' : 'bg-white'}`}>
    <FadeInSection>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl mb-2">RSVP</h2>
          <p className="text-sm text-gray-500">Konfirmasi kehadiran & beri ucapan</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={onChange} placeholder="Nama Kamu" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]" />
          <select name="attendance" value={form.attendance} onChange={onChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]">
            <option>Hadir</option>
            <option>Tidak hadir</option>
          </select>
          <textarea name="message" rows="3" value={form.message} onChange={onChange} placeholder="Tulis doa & ucapan..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]" />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {sent && <p className="text-green-600 text-xs text-center">Terima kasih atas konfirmasinya!</p>}
          <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors">
            {sending ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
        {wishes.length > 0 && (
          <div className="mt-12 space-y-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Ucapan Terbaru</h3>
            {wishes.map((w) => (
              <div key={w.id} className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="block text-sm text-gray-800 mb-1">{w.name}</strong>
                <span className="text-xs text-gray-500">{w.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FadeInSection>
  </section>
);


// ==========================================
// LAYOUT 1: THE CLASSIC (FULL SCREEN)
// ==========================================
const TemplateClassic = ({ template, guestName, first, second, countdown, wishes, form, onChange, onSubmit, error, sent, sending }) => (
  <>
    <section className="relative h-screen flex flex-col justify-between items-center text-center p-8 bg-cover bg-center" style={{ backgroundColor: template.bg, backgroundImage: template.img ? `url(${template.img})` : 'none' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/90 z-0" />
      <div className="relative z-10 w-full pt-12 text-white">
        <div className="text-xs tracking-[0.3em] font-semibold mb-2 uppercase">{template.event}</div>
        <div className="w-12 h-[1px] bg-white/50 mx-auto" />
      </div>
      <div className="relative z-10 text-white">
        <div className="font-serif text-6xl mb-4 leading-none drop-shadow-lg">{first}</div>
        {second && (<><div className="font-serif text-3xl italic text-[#A98B5A] my-2">&</div><div className="font-serif text-6xl mb-4 leading-none drop-shadow-lg">{second}</div></>)}
        <div className="text-sm tracking-[0.3em] mt-8 opacity-90">{template.date}</div>
      </div>
      <div className="relative z-10 w-full bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white max-w-sm mx-auto">
        <p className="text-xs text-white/70 mb-1">Kepada Yth.</p>
        <p className="text-2xl font-semibold mb-6">{guestName}</p>
        <a href="#acara" className="block w-full py-3 bg-white text-black rounded-full font-bold text-sm">BUKA UNDANGAN</a>
      </div>
    </section>
    <section className="py-20 px-8 text-center bg-white">
      <FadeInSection>
        <p className="text-sm italic text-gray-500 mb-8 max-w-xs mx-auto">"Dan di antara tanda-tanda kekuasaan-Nya..."</p>
        <div className="w-10 h-[1px] bg-[#A98B5A] mx-auto mb-12" />
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-gray-100"><img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Mempelai" className="w-full h-full object-cover" /></div>
            <h2 className="font-serif text-3xl mb-1 text-gray-800">{first}</h2>
            <p className="text-xs text-gray-500">Putra/Putri dari Bapak & Ibu</p>
          </div>
          <div className="font-serif text-3xl text-[#A98B5A]">&</div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-gray-100"><img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80" alt="Mempelai" className="w-full h-full object-cover" /></div>
            <h2 className="font-serif text-3xl mb-1 text-gray-800">{second}</h2>
            <p className="text-xs text-gray-500">Putra/Putri dari Bapak & Ibu</p>
          </div>
        </div>
      </FadeInSection>
    </section>
    <section id="acara" className="py-16 px-6 bg-[#FBF8F2] text-center">
      <FadeInSection>
        <div className="text-xs font-bold tracking-[0.2em] text-[#A98B5A] mb-4">SAVE THE DATE</div>
        <div className="flex justify-center gap-3 md:gap-4 mb-10">
          {countdown.map((c) => (<div key={c.label} className="flex flex-col items-center"><div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xl font-bold text-gray-800 mb-1">{c.value}</div><span className="text-[10px] uppercase tracking-wider text-gray-500">{c.label}</span></div>))}
        </div>
        <div className="space-y-4 text-sm max-w-sm mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><h3 className="font-serif text-2xl mb-2 text-gray-800">Akad Nikah</h3><p className="text-gray-500 mb-1">12 Desember 2026</p><p className="font-semibold text-gray-800">08.00 - 10.00 WIB</p></div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><h3 className="font-serif text-2xl mb-2 text-gray-800">Resepsi</h3><p className="text-gray-500 mb-1">12 Desember 2026</p><p className="font-semibold text-gray-800">11.00 - 14.00 WIB</p></div>
        </div>
        <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-block mt-8 px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-sm font-medium">Petunjuk Lokasi</a>
      </FadeInSection>
    </section>
    <RsvpSection wishes={wishes} form={form} onChange={onChange} onSubmit={onSubmit} error={error} sent={sent} sending={sending} />
  </>
);

// ==========================================
// LAYOUT 2: THE EDITORIAL (SPLIT)
// ==========================================
const TemplateEditorial = ({ template, guestName, first, second, countdown, wishes, form, onChange, onSubmit, error, sent, sending }) => (
  <div className="bg-[#F4F4F4]">
    <section className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative">
        <img src={template.img} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-8 md:p-16 bg-white relative">
        <div className="text-xs font-bold tracking-[0.3em] text-[#A98B5A] uppercase mb-6">{template.event}</div>
        <h1 className="font-serif text-6xl md:text-7xl text-[#1A1A1A] leading-none mb-4">{first}</h1>
        <div className="text-2xl text-[#A98B5A] font-serif italic mb-4">&</div>
        <h1 className="font-serif text-6xl md:text-7xl text-[#1A1A1A] leading-none mb-8">{second}</h1>
        <div className="w-16 h-[1px] bg-[#1A1A1A] mb-8" />
        <p className="text-gray-500 tracking-widest text-sm mb-12">{template.date}</p>
        <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Kepada Yth.</p>
          <p className="text-xl font-bold text-[#1A1A1A] mb-6">{guestName}</p>
          <a href="#acara" className="block w-full py-3 bg-[#1A1A1A] text-white rounded-full font-bold text-sm">BUKA UNDANGAN</a>
        </div>
      </div>
    </section>
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <FadeInSection>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-[#1A1A1A] mb-4">The Happy Couple</h2>
          <p className="text-gray-500">Dengan penuh rasa syukur, kami mengundang Anda untuk berbagi kebahagiaan di hari istimewa kami.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl text-center shadow-sm"><div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4"><img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Mempelai" className="w-full h-full object-cover" /></div><h3 className="font-serif text-2xl mb-1">{first}</h3><p className="text-sm text-gray-500">Putra dari Bapak & Ibu</p></div>
          <div className="bg-white p-8 rounded-3xl text-center shadow-sm"><div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4"><img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80" alt="Mempelai" className="w-full h-full object-cover" /></div><h3 className="font-serif text-2xl mb-1">{second}</h3><p className="text-sm text-gray-500">Putri dari Bapak & Ibu</p></div>
        </div>
      </FadeInSection>
    </section>
    <section id="acara" className="py-20 px-6 bg-[#1A1A1A] text-white">
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-10">Save The Date</h2>
          <div className="flex justify-center gap-4 mb-12">
            {countdown.map((c) => (<div key={c.label} className="flex flex-col items-center"><div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-bold mb-2">{c.value}</div><span className="text-xs uppercase tracking-widest text-white/50">{c.label}</span></div>))}
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="bg-white/5 p-8 rounded-3xl flex-1 border border-white/10"><h3 className="font-serif text-2xl mb-2">Akad Nikah</h3><p className="text-white/60 mb-1">12 Desember 2026</p><p className="font-bold">08.00 - 10.00 WIB</p></div>
            <div className="bg-white/5 p-8 rounded-3xl flex-1 border border-white/10"><h3 className="font-serif text-2xl mb-2">Resepsi</h3><p className="text-white/60 mb-1">12 Desember 2026</p><p className="font-bold">11.00 - 14.00 WIB</p></div>
          </div>
        </div>
      </FadeInSection>
    </section>
    <RsvpSection wishes={wishes} form={form} onChange={onChange} onSubmit={onSubmit} error={error} sent={sent} sending={sending} />
  </div>
);

// ==========================================
// LAYOUT 3: THE MINIMALIST
// ==========================================
const TemplateMinimalist = ({ template, guestName, first, second, countdown, wishes, form, onChange, onSubmit, error, sent, sending }) => (
  <div className="bg-[#FBF8F2] min-h-screen text-[#1A1A1A]">
    <section className="h-screen flex flex-col justify-center items-center text-center p-8 relative border-b border-gray-200">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="relative z-10">
        <div className="text-[0.65rem] font-bold tracking-[0.4em] text-[#A98B5A] uppercase mb-8">{template.event}</div>
        <h1 className="font-serif text-7xl md:text-8xl leading-tight mb-6">{first}</h1>
        <div className="text-3xl text-[#A98B5A] font-serif italic mb-6">&</div>
        <h1 className="font-serif text-7xl md:text-8xl leading-tight mb-12">{second}</h1>
        <div className="w-px h-16 bg-gray-300 mx-auto mb-6" />
        <p className="tracking-[0.3em] text-sm text-gray-500 mb-16">{template.date}</p>
        <div className="bg-white p-8 rounded-none border border-gray-200 shadow-xl max-w-sm mx-auto">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Dear</p>
          <p className="text-2xl font-semibold mb-8">{guestName}</p>
          <a href="#acara" className="block w-full py-3 bg-[#1A1A1A] text-white text-sm tracking-widest uppercase">Open Invitation</a>
        </div>
      </div>
    </section>
    <section className="py-24 px-6 max-w-2xl mx-auto text-center">
      <FadeInSection>
        <p className="font-serif text-2xl italic leading-relaxed text-gray-600 mb-16">"Dan di antara tanda-tanda kekuasaan-Nya..."</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div><h2 className="font-serif text-3xl mb-2">{first}</h2><p className="text-sm text-gray-500">Putra dari Bapak & Ibu</p></div>
          <div><h2 className="font-serif text-3xl mb-2">{second}</h2><p className="text-sm text-gray-500">Putri dari Bapak & Ibu</p></div>
        </div>
      </FadeInSection>
    </section>
    <section id="acara" className="py-24 px-6 bg-white border-y border-gray-200">
      <FadeInSection>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-12 uppercase tracking-widest">The Event</h2>
          <div className="flex justify-center gap-6 mb-16">
            {countdown.map((c) => (<div key={c.label} className="flex flex-col items-center"><span className="text-3xl font-serif mb-1">{c.value}</span><span className="text-[10px] uppercase tracking-widest text-gray-400">{c.label}</span></div>))}
          </div>
          <div className="space-y-8">
            <div><h3 className="text-xl font-bold uppercase tracking-widest mb-2">Akad Nikah</h3><p className="text-gray-500">12 Desember 2026 · 08.00 WIB</p></div>
            <div className="w-8 h-[1px] bg-gray-300 mx-auto" />
            <div><h3 className="text-xl font-bold uppercase tracking-widest mb-2">Resepsi</h3><p className="text-gray-500">12 Desember 2026 · 11.00 WIB</p></div>
          </div>
        </div>
      </FadeInSection>
    </section>
    <RsvpSection wishes={wishes} form={form} onChange={onChange} onSubmit={onSubmit} error={error} sent={sent} sending={sending} minimalist />
  </div>
);

// ==========================================
// LAYOUT 4: THE TIMELESS (STORYTELLER / KLIK SATU-SATU)
// ==========================================
const TemplateTimeless = ({ template, guestName, first, second, countdown, wishes, form, onChange, onSubmit, error, sent, sending }) => {
  const [step, setStep] = useState(0);
  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Warna Rose Gold
  const bgColor = "#D9C3B0"; // Warna kertas vintage
  const textColor = "#5A4A3F"; // Warna tulisan

  return (
    <div style={{ backgroundColor: bgColor, color: textColor }} className="min-h-screen font-serif relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Ornamen Garis di Pinggir */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 0% 0%, transparent 20%, #8A705D 20%, transparent 21%), radial-gradient(circle at 100% 100%, transparent 20%, #8A705D 20%, transparent 21%)`,
        backgroundSize: '200px 200px',
        backgroundPosition: '0 0, 100% 100%',
        backgroundRepeat: 'no-repeat'
      }} />

      <div className="w-full max-w-md h-[85vh] relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 0: COVER DEPAN */}
          {step === 0 && (
            <motion.div 
              key="slide-0" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center w-full px-6"
            >
              <p className="text-xs tracking-[0.4em] uppercase mb-12">The Wedding Of</p>
              
              <h1 className="text-7xl md:text-8xl leading-[1.2] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{first}</h1>
              <p className="text-2xl italic opacity-80 mb-4">&</p>
              <h1 className="text-7xl md:text-8xl leading-[1.2] mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{second}</h1>
              
              <div className="border-t border-b border-[#8A705D] py-6 mb-12 inline-block px-8">
                <p className="text-sm tracking-widest uppercase mb-1">Diselenggarakan pada</p>
                <p className="text-xl">{template.date}</p>
              </div>
              
              <div>
                <p className="text-xs opacity-70 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="text-2xl font-semibold mb-8">{guestName}</p>
                <button onClick={nextStep} className="px-10 py-4 border border-[#5A4A3F] text-sm tracking-widest uppercase hover:bg-[#5A4A3F] hover:text-[#D9C3B0] transition-colors duration-500">
                  Buka Undangan
                </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: MEMPELAI */}
          {step === 1 && (
            <motion.div 
              key="slide-1" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8 } }} 
              transition={{ duration: 1 }}
              className="text-center w-full px-6"
            >
              <p className="text-xs tracking-[0.4em] uppercase mb-10">Mempelai</p>
              
              <div className="space-y-12">
                <div>
                  <h1 className="text-5xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{first}</h1>
                  <p className="text-sm opacity-80">Putra dari Bapak & Ibu</p>
                </div>
                
                <div className="text-3xl italic opacity-50">&</div>
                
                <div>
                  <h1 className="text-5xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{second}</h1>
                  <p className="text-sm opacity-80">Putri dari Bapak & Ibu</p>
                </div>
              </div>
              
              <button onClick={nextStep} className="mt-16 text-xs tracking-widest uppercase border-b border-[#5A4A3F] pb-1">Lanjut →</button>
            </motion.div>
          )}

          {/* SLIDE 2: TANGGAL & COUNTDOWN */}
          {step === 2 && (
            <motion.div 
              key="slide-2" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }} 
              transition={{ duration: 1 }}
              className="text-center w-full px-6"
            >
              <p className="text-xs tracking-[0.4em] uppercase mb-10">Save The Date</p>
              
              <div className="mb-12">
                <p className="text-2xl mb-2">Sabtu</p>
                <p className="text-8xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12</p>
                <p className="text-2xl">Desember 2026</p>
              </div>
              
              <div className="flex justify-center gap-4 mb-16">
                {countdown.map((c) => (
                  <div key={c.label} className="flex flex-col items-center">
                    <div className="w-12 h-12 border border-[#5A4A3F] rounded-full flex items-center justify-center text-lg mb-2">{c.value}</div>
                    <span className="text-[10px] uppercase tracking-widest opacity-70">{c.label}</span>
                  </div>
                ))}
              </div>
              
              <button onClick={nextStep} className="text-xs tracking-widest uppercase border-b border-[#5A4A3F] pb-1">Lihat Lokasi →</button>
            </motion.div>
          )}

          {/* SLIDE 3: LOKASI */}
          {step === 3 && (
            <motion.div 
              key="slide-3" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }} 
              transition={{ duration: 1 }}
              className="text-center w-full px-6"
            >
              <p className="text-xs tracking-[0.4em] uppercase mb-10">Lokasi Acara</p>
              
              <div className="space-y-10 mb-12">
                <div>
                  <h3 className="text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Akad Nikah</h3>
                  <p className="text-sm opacity-80 mb-4">Pukul 08.00 WIB</p>
                  <p className="text-sm leading-relaxed">Gedung Pernikahan<br/>Jl. Contoh Alamat No. 123, Jakarta</p>
                </div>
                <div className="w-8 h-[1px] bg-[#5A4A3F] mx-auto opacity-50" />
                <div>
                  <h3 className="text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Resepsi</h3>
                  <p className="text-sm opacity-80 mb-4">Pukul 11.00 WIB</p>
                  <p className="text-sm leading-relaxed">Gedung Pernikahan<br/>Jl. Contoh Alamat No. 123, Jakarta</p>
                </div>
              </div>

              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-block px-8 py-3 border border-[#5A4A3F] text-xs tracking-widest uppercase mb-12 hover:bg-[#5A4A3F] hover:text-[#D9C3B0] transition-colors">
                Buka Google Maps
              </a>
              
              <br/>
              <button onClick={nextStep} className="text-xs tracking-widest uppercase border-b border-[#5A4A3F] pb-1">Kirim Ucapan →</button>
            </motion.div>
          )}

          {/* SLIDE 4: RSVP */}
          {step === 4 && (
            <motion.div 
              key="slide-4" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }} 
              transition={{ duration: 1 }}
              className="w-full px-6"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-center mb-10">RSVP & Ucapan</p>
              
              <form onSubmit={onSubmit} className="space-y-4 mb-8">
                <input name="name" value={form.name} onChange={onChange} placeholder="Nama" className="w-full bg-transparent border-b border-[#5A4A3F] px-2 py-3 text-sm focus:outline-none placeholder-[#5A4A3F]/50" />
                <select name="attendance" value={form.attendance} onChange={onChange} className="w-full bg-transparent border-b border-[#5A4A3F] px-2 py-3 text-sm focus:outline-none">
                  <option>Hadir</option>
                  <option>Tidak hadir</option>
                </select>
                <textarea name="message" rows="2" value={form.message} onChange={onChange} placeholder="Ucapan..." className="w-full bg-transparent border-b border-[#5A4A3F] px-2 py-3 text-sm focus:outline-none placeholder-[#5A4A3F]/50" />
                {error && <p className="text-red-600 text-xs">{error}</p>}
                {sent && <p className="text-green-700 text-xs">Terkirim!</p>}
                <button type="submit" disabled={sending} className="w-full py-3 border border-[#5A4A3F] text-xs tracking-widest uppercase hover:bg-[#5A4A3F] hover:text-[#D9C3B0] transition-colors mt-4">
                  {sending ? 'Mengirim...' : 'Kirim'}
                </button>
              </form>
              
              <div className="mt-8 max-h-32 overflow-y-auto space-y-4">
                {wishes.map((w) => (
                  <div key={w.id} className="text-center text-sm border-b border-[#5A4A3F]/20 pb-2">
                    <strong className="block mb-1">{w.name}</strong>
                    <span className="opacity-80 italic">"{w.message}"</span>
                  </div>
                ))}
              </div>
              
              <button onClick={() => setStep(0)} className="mt-8 w-full text-[10px] tracking-widest uppercase opacity-50 hover:opacity-100">Kembali ke awal</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigasi Bawah */}
      <div className="absolute bottom-6 flex gap-6 z-50">
        {step > 0 && (<button onClick={prevStep} className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100">← Kembali</button>)}
      </div>
    </div>
  );
};


// ==========================================
// KOMPONEN UTAMA (CONTROLLER)
// ==========================================
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

  useEffect(() => {
    if (!isOpen) document.body.style.overflow = 'hidden';
    else { document.body.style.overflow = 'unset'; window.scrollTo(0, 0); }
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
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
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

  // Tentukan Layout berdasarkan ID template
  let layoutType = 'classic';
  if (['verdant', 'blush', 'gala', 'iftar'].includes(template.id)) layoutType = 'editorial';
  if (['noir', 'sage', 'forum', 'sidang'].includes(template.id)) layoutType = 'minimalist';
  if (['aurelia', 'toga'].includes(template.id)) layoutType = 'timeless'; // <-- Layout Baru

  const commonProps = { template, guestName, first, second, countdown, wishes, form, onChange, onSubmit, error, sent, sending };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex justify-center font-sans">
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop />

      {isOpen && layoutType !== 'timeless' && (
        <button onClick={toggleMusic} className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] flex items-center justify-center shadow-xl border border-gray-200">
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      )}

      <div className="w-full max-w-[480px] bg-white shadow-2xl relative">
        
        {/* SAMPUL DEPAN */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, y: "-100vh" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="fixed inset-0 z-[100] flex flex-col justify-between items-center text-center p-8 bg-cover bg-center max-w-[480px] mx-auto"
              style={{ backgroundColor: template.bg, backgroundImage: template.img ? `url(${template.img})` : 'none' }}
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
                <button onClick={handleOpenInvitation} className="w-full py-3.5 bg-white text-black rounded-full font-bold text-sm tracking-wide hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  BUKA UNDANGAN
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RENDER LAYOUT */}
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {layoutType === 'classic' && <TemplateClassic {...commonProps} />}
            {layoutType === 'editorial' && <TemplateEditorial {...commonProps} />}
            {layoutType === 'minimalist' && <TemplateMinimalist {...commonProps} />}
            {layoutType === 'timeless' && <TemplateTimeless {...commonProps} />}
          </motion.div>
        )}

        {/* FOOTER BAWAH (Kecuali Timeless) */}
        {isOpen && layoutType !== 'timeless' && (
          <footer className="bg-[#1A1A1A] text-center py-12 px-6 border-t border-white/10">
            <div className="font-serif text-3xl text-white mb-2">{template.names}</div>
            <p className="text-xs text-white/50 mb-6">Terima kasih atas doa dan kehadiran Anda.</p>
            <div className="text-[10px] tracking-widest text-[#A98B5A] uppercase">Made with Pride</div>
          </footer>
        )}
      </div>
    </div>
  );
}