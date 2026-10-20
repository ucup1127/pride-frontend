import { useEffect, useState } from 'react';
import { listUndangan, listGuests } from '../services/api';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Wishes() {
  const [undangan, setUndangan] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulasi data ucapan (karena endpoint backend belum dibikin)
  // Nanti kalau backend udah siap, tinggal ganti pakai API
  const dummyWishes = [
    { id: '1', nama: 'Budi Santoso', kehadiran: 'hadir', ucapan: 'Selamat ya! Semoga lancar sampai hari H.' },
    { id: '2', nama: 'Siti Aminah', kehadiran: 'hadir', ucapan: 'Barakallahu lakuma wa baraka alaikuma. Selamat menempuh hidup baru!' },
    { id: '3', nama: 'Keluarga Ahmad', kehadiran: 'tidak_hadir', ucapan: 'Maaf belum bisa hadir, doa terbaik dari jauh.' },
  ];

  useEffect(() => {
    async function init() {
      try {
        const list = await listUndangan();
        if (list.length > 0) {
          setUndangan(list[0]);
          const guestsList = await listGuests(list[0].id);
          setGuests(guestsList);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat ucapan...</div>;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ucapan & Doa</h1>
            <p className="text-gray-500 text-sm mt-1">Pesan dari tamu yang sudah membuka undanganmu.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-600">Total: {dummyWishes.length} Ucapan</span>
          </div>
        </div>

        {/* List Ucapan */}
        <div className="space-y-4">
          {dummyWishes.map((wish, i) => (
            <motion.div 
              key={wish.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4"
            >
              {/* Avatar Inisial */}
              <div className="w-12 h-12 rounded-full bg-[#F0EAE1] text-[#A98B5A] flex items-center justify-center font-bold text-lg shrink-0">
                {wish.nama.charAt(0)}
              </div>
              
              {/* Isi Ucapan */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{wish.nama}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    wish.kehadiran === 'hadir' ? 'bg-green-100 text-green-700' : 
                    wish.kehadiran === 'tidak_hadir' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {wish.kehadiran === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mt-2">
                  "{wish.ucapan}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-xs text-gray-400">Ucapan akan otomatis masuk ketika tamu mengisi form di link undangan.</p>
        </div>
      </div>
    </PageTransition>
  );
}