import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TemplateCover } from '../components/TemplateCard';
import { findTemplate } from '../data/templates';
import { listUndangan, createUndangan, listGuests } from '../services/api';

export default function Dashboard() {
  const [undangan, setUndangan] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const list = await listUndangan();
        let currentUndangan = list[0];

        if (!currentUndangan) {
          const templateId = new URLSearchParams(window.location.search).get('template') || 'aurelia';
          const t = findTemplate(templateId);
          
          currentUndangan = await createUndangan({
            judul: `Undangan ${t.names}`,
            templateId: t.id,
            isPublic: true,
            status: 'published'
          });
        }

        setUndangan(currentUndangan);
        const guestsList = await listGuests(currentUndangan.id);
        setGuests(guestsList);
      } catch (err) {
        console.error("Gagal load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Menyiapkan ringkasan...</div>;

  const template = undangan ? findTemplate(undangan.templateId) : findTemplate('aurelia');

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">Total Tamu</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{guests.length}</h3>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">Hadir</p>
          <h3 className="text-2xl md:text-3xl font-bold text-green-600">{guests.filter(g => g.status === 'hadir').length}</h3>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">Tidak Hadir</p>
          <h3 className="text-2xl md:text-3xl font-bold text-red-500">{guests.filter(g => g.status === 'tidak_hadir').length}</h3>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs md:text-sm text-gray-500 mb-1">Ucapan</p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#A98B5A]">0</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Ringkasan Tamu Terbaru */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Tamu Terbaru</h2>
              <Link to="/dashboard/guests" className="text-sm font-semibold text-[#A98B5A] hover:underline">Kelola Semua →</Link>
            </div>
            
            {guests.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-4">Belum ada tamu yang ditambahkan.</p>
                <Link to="/dashboard/guests" className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg text-sm font-medium">Mulai Tambah Tamu</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {guests.slice(0, 5).map(g => (
                  <div key={g.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{g.nama}</p>
                      <p className="text-xs text-gray-500">{g.jumlah} orang</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                      g.status === 'hadir' ? 'bg-green-100 text-green-700' : 
                      g.status === 'tidak_hadir' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {g.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Undangan */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Link Undangan</h2>
            <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
              <TemplateCover template={template} height={160} />
            </div>
            <button onClick={() => window.open(`/u/${undangan?.slug || 'demo'}`, '_blank')} className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-semibold text-sm hover:bg-black transition-colors">Buka Link Undangan</button>
          </div>
        </div>

      </div>
    </div>
  );
}