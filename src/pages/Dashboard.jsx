import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { TemplateCover } from '../components/TemplateCard';
import { findTemplate } from '../data/templates';
import { useAuth } from '../auth';
import { 
  listUndangan, 
  createUndangan, 
  addGuest, 
  listGuests 
} from '../services/api';

const MENU = ['Ringkasan', 'Undangan saya', 'Daftar tamu', 'RSVP & ucapan', 'Pengaturan'];

export default function Dashboard() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [undangan, setUndangan] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ nama: '', jumlah: 1 });
  const [notice, setNotice] = useState('');

  // 1. Inisialisasi: Cek undangan user, kalau belum ada, bikin baru
  useEffect(() => {
    async function init() {
      try {
        const list = await listUndangan();
        let currentUndangan = list[0]; // Ambil undangan pertama

        if (!currentUndangan) {
          // Kalau belum punya, bikin baru (default pake template 'aurelia')
          // Nanti bisa diganti ngambil dari query params ?template=...
          const templateId = new URLSearchParams(window.location.search).get('template') || 'aurelia';
          const t = findTemplate(templateId);
          
          currentUndangan = await createUndangan({
            judul: `Undangan ${t.names}`,
            templateId: t.id,
            slug: `undangan-${Date.now()}`, // Slug unik
            isPublic: true,
            status: 'published'
          });
        }

        setUndangan(currentUndangan);
        
        // Setelah dapet ID undangan, baru ambil daftar tamunya
        const guestsList = await listGuests(currentUndangan.id);
        setGuests(guestsList);
      } catch (err) {
        console.error("Gagal load dashboard:", err);
        setNotice(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const flash = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 2500);
  };

  // 2. Fungsi Tambah Tamu
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
      setGuests((list) => [...list, created]);
      setDraft({ nama: '', jumlah: 1 });
      setAdding(false);
      flash(`Tamu ${nama} berhasil ditambahkan!`);
    } catch (err) {
      flash(err.message);
    }
  };

  // 3. Fungsi Copy Link Tamu
  const copyLink = async (guest) => {
    // Link pakai slug tamu, arahin ke halaman undangan
    const link = `${window.location.origin}/u/${guest.slug}`;
    try {
      await navigator.clipboard.writeText(link);
      flash(`Tautan untuk ${guest.nama} disalin!`);
    } catch {
      flash(link); // Fallback kalau browser gak izinin clipboard
    }
  };

  if (loading) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Menyiapkan Dashboard...</div>;
  }

  const template = undangan ? findTemplate(undangan.templateId) : findTemplate('aurelia');

  return (
    <div className="dash">
      <aside className="dash__side">
        <Logo small />
        <nav aria-label="Menu dashboard">
          {MENU.map((label, i) => (
            <a key={label} href="#konten" className={i === 0 ? 'is-active' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="dash__plan">
          <strong>Paket Standard</strong>
          <span>Aktif hingga [TANGGAL]</span>
          <button
            type="button"
            className="dash__logout"
            onClick={() => { signOut(); navigate('/'); }}
          >
            Keluar
          </button>
        </div>
      </aside>

      <main id="konten" className="dash__main">
        <div className="row row--between dash__top">
          <div className="stack gap-4">
            <h1 className="display">Halo!</h1>
            <span className="hint">
              Ringkasan undanganmu hari ini. Masuk via WhatsApp +62 {session?.phone || '[NOMOR]'}.
            </span>
          </div>
          <Button to="/katalog" variant="primary" size="sm">
            + Undangan baru
          </Button>
        </div>

        {notice && <div className="toast" role="status">{notice}</div>}

        {/* Stats */}
        <div className="grid grid--4 dash__stats">
          <div className="stat"><span>Total tamu</span><strong>{guests.length}</strong></div>
          <div className="stat"><span>Sudah membuka</span><strong>0</strong></div>
          <div className="stat"><span>Konfirmasi hadir</span><strong>{guests.filter(g => g.status === 'hadir').length}</strong></div>
          <div className="stat"><span>Ucapan masuk</span><strong>0</strong></div>
        </div>

        <div className="dash__cols">
          {/* Panel KIRI: Daftar Tamu */}
          <section className="panel dash__guests">
            <div className="row row--between">
              <h2 className="display">Daftar tamu</h2>
              <div className="row gap-10">
                <Button variant="primary" size="sm" onClick={() => setAdding((v) => !v)}>
                  Tambah tamu
                </Button>
              </div>
            </div>

            {adding && (
              <form className="dash__add" onSubmit={onAdd} style={{ display: 'flex', gap: 10, marginTop: 15, marginBottom: 15 }}>
                <div className="field" style={{ flex: 1 }}>
                  <input
                    className="input"
                    placeholder="Nama tamu"
                    value={draft.nama}
                    onChange={(e) => setDraft({ ...draft, nama: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="field" style={{ width: 80 }}>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    placeholder="Jml"
                    value={draft.jumlah}
                    onChange={(e) => setDraft({ ...draft, jumlah: e.target.value })}
                  />
                </div>
                <Button variant="primary" size="sm" type="submit">Simpan</Button>
              </form>
            )}

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Nama</th>
                    <th scope="col">Status</th>
                    <th scope="col">Jumlah</th>
                    <th scope="col">Tautan</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>Belum ada tamu.</td></tr>
                  ) : (
                    guests.map((g) => (
                      <tr key={g.id}>
                        <td>{g.nama}</td>
                        <td><span className="status status--wait">{g.status}</span></td>
                        <td>{g.jumlah}</td>
                        <td>
                          <button type="button" className="link-button" onClick={() => copyLink(g)}>
                            Salin
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Panel KANAN: Info Undangan */}
          <div className="dash__right">
            <section className="panel">
              <h2 className="display">Undanganmu</h2>
              <TemplateCover template={template} height={150} />
              <div className="row gap-10" style={{ marginTop: 15 }}>
                <Button to={`/undangan?template=${template.id}`} size="sm" block>Lihat Demo</Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  block 
                  onClick={() => window.open(`/u/${undangan?.slug || 'demo'}`, '_blank')}
                >
                  Buka Link
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}