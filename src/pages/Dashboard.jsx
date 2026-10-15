import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { TemplateCover } from '../components/TemplateCard';
import { findTemplate } from '../data/templates';
import { useAuth } from '../auth';
import { addGuest, listGuests, listWishes } from '../services/api';

const MENU = ['Ringkasan', 'Undangan saya', 'Daftar tamu', 'RSVP & ucapan', 'Pengaturan'];

const STATUS_CLASS = {
  Hadir: 'status--yes',
  'Tidak hadir': 'status--no',
  'Belum konfirmasi': 'status--wait',
};

export default function Dashboard() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', count: 1 });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([listGuests(), listWishes()]).then(([g, w]) => {
      if (!active) return;
      setGuests(g);
      setWishes(w);
    });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total tamu', value: guests.length },
      { label: 'Sudah membuka', value: guests.filter((g) => g.status !== 'Belum konfirmasi').length },
      { label: 'Konfirmasi hadir', value: guests.filter((g) => g.status === 'Hadir').length },
      { label: 'Ucapan masuk', value: wishes.length },
    ],
    [guests, wishes],
  );

  const flash = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 2500);
  };

  const onAdd = async (e) => {
    e.preventDefault();
    const name = draft.name.trim();
    if (!name) return;
    const created = await addGuest({ name, count: Number(draft.count) || 1, status: 'Belum konfirmasi' });
    setGuests((list) => [...list, created]);
    setDraft({ name: '', count: 1 });
    setAdding(false);
    flash(`${name} ditambahkan.`);
  };

  const copyLink = async (guest) => {
    const link = `${window.location.origin}/undangan?to=${encodeURIComponent(guest.name)}`;
    try {
      await navigator.clipboard.writeText(link);
      flash(`Tautan untuk ${guest.name} disalin.`);
    } catch {
      flash(link);
    }
  };

  const template = findTemplate('aurelia');

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
            onClick={() => {
              signOut();
              navigate('/');
            }}
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

        {notice && (
          <div className="toast" role="status">
            {notice}
          </div>
        )}

        <div className="grid grid--4 dash__stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>

        <div className="dash__cols">
          <section className="panel dash__guests">
            <div className="row row--between">
              <h2 className="display">Daftar tamu</h2>
              <div className="row gap-10">
                <Button size="sm" onClick={() => flash('Impor tamu segera hadir.')}>
                  Impor tamu
                </Button>
                <Button variant="primary" size="sm" onClick={() => setAdding((v) => !v)}>
                  Tambah tamu
                </Button>
              </div>
            </div>

            {adding && (
              <form className="dash__add" onSubmit={onAdd}>
                <div className="field">
                  <label htmlFor="tamu-nama">Nama tamu</label>
                  <input
                    id="tamu-nama"
                    className="input"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="field dash__add-count">
                  <label htmlFor="tamu-jumlah">Jumlah</label>
                  <input
                    id="tamu-jumlah"
                    type="number"
                    min="1"
                    className="input"
                    value={draft.count}
                    onChange={(e) => setDraft({ ...draft, count: e.target.value })}
                  />
                </div>
                <Button variant="primary" size="sm" type="submit">
                  Simpan
                </Button>
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
                  {guests.map((g) => (
                    <tr key={g.id}>
                      <td>{g.name}</td>
                      <td>
                        <span className={`status ${STATUS_CLASS[g.status]}`}>{g.status}</span>
                      </td>
                      <td>{g.count}</td>
                      <td>
                        <button type="button" className="link-button" onClick={() => copyLink(g)}>
                          Salin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="dash__right">
            <section className="panel">
              <h2 className="display">Undanganmu</h2>
              <TemplateCover template={template} height={150} />
              <div className="row gap-10">
                <Button to="/undangan" size="sm" block>
                  Lihat
                </Button>
                <Button variant="primary" size="sm" block onClick={() => flash('Penyuntingan segera hadir.')}>
                  Sunting
                </Button>
              </div>
            </section>

            <section className="panel">
              <h2 className="display">Ucapan terbaru</h2>
              <ul className="inv-wishes inv-wishes--plain">
                {wishes.slice(0, 4).map((w) => (
                  <li key={w.id}>
                    <strong>{w.name}</strong>
                    <span>{w.message}</span>
                  </li>
                ))}
              </ul>
              <Link to="/undangan" className="link-gold link-gold--start">
                Lihat semua ucapan
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
