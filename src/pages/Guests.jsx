import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listUndangan, addGuest, listGuests, bulkAddGuests } from '../services/api';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function Guests() {
  const navigate = useNavigate();
  
  const [undangan, setUndangan] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ nama: '', jumlah: 1 });
  const [notice, setNotice] = useState('');

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

  const flash = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 3000);
  };

  const onAdd = async (e) => {
    e.preventDefault();
    const nama = draft.nama.trim();
    if (!nama || !undangan) return;
    
    try {
      const created = await addGuest({ 
        undanganId: undangan.id, 
        nama, 
        jumlah: Number(draft.jumlah) || 1
      });
      setGuests((list) => [created, ...list]);
      setDraft({ nama: '', jumlah: 1 });
      setAdding(false);
      flash(`Tamu ${nama} berhasil ditambahkan!`);
    } catch (err) {
      flash(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile || !undangan) return;

    setNotice('Membaca file Excel...');
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (data.length === 0) throw new Error('File Excel kosong.');

        const guestsToImport = data.map((row) => ({
          nama: row.Nama || row.nama || row.NAMA,
          jumlah: row.Jumlah || row.jumlah || 1,
        })).filter(g => g.nama);

        if (guestsToImport.length === 0) throw new Error('Format kolom salah. Pastikan ada kolom "Nama".');

        await bulkAddGuests({ 
          undanganId: undangan.id, 
          guests: guestsToImport 
        });

        const guestsList = await listGuests(undangan.id);
        setGuests(guestsList);
        flash(`Berhasil import ${guestsToImport.length} tamu!`);
      } catch (err) {
        flash(err.message);
      } finally {
        e.target.value = null;
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const copyLink = async (guest) => {
    const link = `${window.location.origin}/u/${guest.slug}`;
    try {
      await navigator.clipboard.writeText(link);
      flash(`Tautan untuk ${guest.nama} disalin!`);
    } catch {
      flash(link);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat data tamu...</div>;
  if (!undangan) return <div className="text-center py-20 text-gray-500">Buat undangan dulu di Dashboard.</div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        
        {notice && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 text-sm">
            {notice}
          </motion.div>
        )}

        {/* Card Tabel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-800">Total: {guests.length} Tamu</h2>
            <div className="flex gap-2">
              <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="hidden md:inline">Import Excel</span>
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
              </label>
              
              <button 
                onClick={() => setAdding(!adding)}
                className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
              >
                + Tambah Tamu
              </button>
            </div>
          </div>

          {adding && (
            <form onSubmit={onAdd} className="p-4 md:p-6 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row gap-3 md:gap-4 md:items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Tamu</label>
                <input type="text" value={draft.nama} onChange={(e) => setDraft({...draft, nama: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#A98B5A]" placeholder="Contoh: Budi Santoso" autoFocus />
              </div>
              <div className="flex gap-3">
                <div className="w-24">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Jumlah</label>
                  <input type="number" min="1" value={draft.jumlah} onChange={(e) => setDraft({...draft, jumlah: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#A98B5A]" />
                </div>
                <button type="submit" className="bg-[#A98B5A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#8C7248] mt-auto">Simpan</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 md:px-6 md:py-4">Nama</th>
                  <th className="px-4 py-3 md:px-6 md:py-4">Status</th>
                  <th className="px-4 py-3 md:px-6 md:py-4">Jml</th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {guests.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">Belum ada tamu. Silakan tambah atau import.</td></tr>
                ) : (
                  guests.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 md:px-6 md:py-4 font-medium text-gray-800 text-sm">{g.nama}</td>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                          g.status === 'hadir' ? 'bg-green-100 text-green-700' : 
                          g.status === 'tidak_hadir' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {g.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 text-gray-600 text-sm">{g.jumlah}</td>
                      <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                        <button onClick={() => copyLink(g)} className="text-[#A98B5A] hover:text-[#8C7248] font-medium text-xs md:text-sm">Salin Link</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}