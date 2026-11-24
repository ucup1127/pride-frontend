import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import DashboardShell from '../components/DashboardShell';
import { TemplateCover } from '../components/TemplateCard';
import { findTemplate } from '../data/templates';
import { useAuth } from '../auth';
import { listGuests, listUndangan, listWishes } from '../services/api';

const ACCOUNT_PLAN = {
  basic: 'Basic',
  plus: 'Standard',
  standard: 'Standard',
  premium: 'Premium',
};

export default function Dashboard() {
  const { session } = useAuth();
  const [invitation, setInvitation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const paidPlan = localStorage.getItem('pride-paid-plan');
  const accountName =
    session?.user?.name ||
    session?.user?.email?.split('@')[0] ||
    session?.email?.split('@')[0] ||
    session?.phone ||
    'teman';

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        const invitations = await listUndangan();
        const currentInvitation = invitations[0] || null;
        if (!active) return;
        setInvitation(currentInvitation);

        if (currentInvitation) {
          const [guestList, wishList] = await Promise.all([
            listGuests(currentInvitation.id),
            listWishes(currentInvitation.id),
          ]);
          if (!active) return;
          setGuests(guestList);
          setWishes(wishList);
        }
      } catch (loadError) {
        if (active) setError(loadError.message || 'Data dashboard gagal dimuat.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total tamu', value: guests.length },
      { label: 'Sudah merespons', value: guests.filter((guest) => guest.status !== 'pending').length },
      { label: 'Konfirmasi hadir', value: guests.filter((guest) => guest.status === 'hadir').length },
      { label: 'Ucapan masuk', value: wishes.length },
    ],
    [guests, wishes],
  );

  const template = findTemplate(invitation?.templateId || 'aurelia');
  const planName = ACCOUNT_PLAN[paidPlan] || paidPlan || 'Paket aktif';

  return (
    <DashboardShell activeMenu="ringkasan">
      <header id="ringkasan" className="dash__top">
        <div>
          <div className="eyebrow">RUANG KERJA PRIDE · {planName}</div>
          <h1 className="display">Halo, {accountName}.</h1>
          <p>Kelola undangan, tamu, dan ucapan dalam satu tempat.</p>
        </div>
        <Button to="/katalog" variant="primary">
          Buat undangan <span aria-hidden="true">→</span>
        </Button>
      </header>

      {error && <div className="dash__message dash__message--error" role="alert">{error}</div>}

      <section className="dash__stats" aria-label="Ringkasan statistik">
        {stats.map((stat, index) => (
          <article key={stat.label} className="dash__stat">
            <span className="dash__stat-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="dash__stat-label">{stat.label}</span>
            <strong>{loading ? '—' : stat.value}</strong>
          </article>
        ))}
      </section>

      <div className="dash__content">
        <section id="daftar-tamu" className="dash__panel dash__guest-summary">
          <div className="eyebrow">KEHADIRAN</div>
          <h2 className="display">Daftar tamu</h2>
          <p>
            {loading
              ? 'Memuat data tamu…'
              : `${guests.length} tamu tercatat${invitation ? ` untuk ${invitation.judul || 'undanganmu'}` : ''}.`}
          </p>
          {invitation ? (
            <Button to="/dashboard/tamu" variant="primary" size="sm">
              Kelola daftar tamu <span aria-hidden="true">→</span>
            </Button>
          ) : (
            <div className="dash__empty">
              <h3>Belum ada undangan</h3>
              <p>Buat undangan terlebih dahulu untuk mulai mengelola daftar tamu.</p>
              <Button to="/katalog" variant="primary" size="sm">Pilih desain undangan</Button>
            </div>
          )}
        </section>

        <div className="dash__right">
          <section id="undanganmu" className="dash__panel dash__invitation">
            <div className="eyebrow">DESAIN PILIHAN</div>
            <h2 className="display">Undanganmu</h2>
            {template && <TemplateCover template={template} height={180} />}
            <div className="dash__template-info">
              <strong>{invitation?.judul || template?.name || 'Pilih desain undangan'}</strong>
              <span>{invitation ? 'Undangan aktif' : 'Belum ada undangan aktif'}</span>
            </div>
            <div className="dash__template-actions">
              <Button to={invitation ? `/undangan?template=${template?.id || 'aurelia'}` : '/katalog'} size="sm" block>
                Pratinjau
              </Button>
              <Button to="/editor" variant="primary" size="sm" block>
                Edit
              </Button>
            </div>
          </section>

          <section id="ucapan-rsvp" className="dash__panel dash__wishes">
            <div className="eyebrow">DARI PARA TAMU</div>
            <h2 className="display">Ucapan terbaru</h2>
            {wishes.length > 0 ? (
              <ul>
                {wishes.slice(0, 4).map((wish) => (
                  <li key={wish.id}>
                    <strong>{wish.nama || wish.name}</strong>
                    <span>{wish.ucapan || wish.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash__wishes-empty">
                {loading ? 'Memuat ucapan…' : 'Ucapan dari tamu akan muncul di sini.'}
              </p>
            )}
            {invitation && (
              <Link to={`/undangan?template=${template?.id || 'aurelia'}`} className="dash__text-link">
                Lihat undangan <span aria-hidden="true">→</span>
              </Link>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
