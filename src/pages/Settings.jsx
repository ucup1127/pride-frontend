import { useAuth } from '../auth';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function Settings() {
  const { session } = useAuth();

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola profil dan preferensi akunmu di sini.</p>
        </div>

        {/* Card Profil */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-[#A98B5A] rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase">
              {session?.user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{session?.user?.name || 'Pengguna Pride'}</h2>
              <p className="text-gray-500">{session?.user?.email || 'email@pride.com'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <input type="text" defaultValue={session?.user?.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]" disabled />
              <p className="text-xs text-gray-400 mt-1">Fitur ubah nama segera hadir.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Email</label>
              <input type="email" defaultValue={session?.user?.email} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A98B5A]" disabled />
            </div>
          </div>
        </motion.div>

        {/* Card Paket */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-[#1A1A1A] to-[#333] rounded-2xl shadow-lg p-6 md:p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-xs font-bold tracking-widest text-[#A98B5A] uppercase mb-2">Paket Aktif</div>
              <h2 className="text-3xl font-bold mb-1">Standard</h2>
              <p className="text-white/60 text-sm">Berlaku hingga 31 Desember 2026</p>
            </div>
            <button className="bg-white text-[#1A1A1A] px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
              Upgrade Paket
            </button>
          </div>
          {/* Ornamen background */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#A98B5A]/20 rounded-full blur-3xl" />
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-50 rounded-2xl border border-red-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-red-800 mb-2">Hapus Akun</h3>
          <p className="text-red-600/80 text-sm mb-4">Setelah akun dihapus, semua data undangan dan tamu tidak dapat dikembalikan.</p>
          <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors">
            Hapus Akun Saya
          </button>
        </motion.div>

      </div>
    </PageTransition>
  );
}