import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import Logo from './Logo';

const MENU = [
  { id: 'ringkasan', label: 'Ringkasan', number: '01', to: '/dashboard#ringkasan' },
  { id: 'daftar-tamu', label: 'Daftar tamu', number: '02', to: '/dashboard/tamu' },
  { id: 'undanganmu', label: 'Undangan saya', number: '03', to: '/dashboard#undanganmu' },
  { id: 'ucapan-rsvp', label: 'Ucapan & RSVP', number: '04', to: '/dashboard#ucapan-rsvp' },
];

export default function DashboardShell({ activeMenu, children, planName = 'Paket aktif' }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const cancelLogoutRef = useRef(null);
  useEffect(() => {
    if (!confirmLogout) return undefined;
    cancelLogoutRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setConfirmLogout(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [confirmLogout]);

  const logOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="dash">
      <aside className={`dash__side${menuOpen ? ' is-open' : ''}`}>
        <div className="dash__brand">
          <div className="dash__brand-copy">
            <Logo small />
            <span>AREA PELANGGAN</span>
          </div>
          <button
            type="button"
            className="dash__menu-toggle"
            aria-label={menuOpen ? 'Tutup menu dashboard' : 'Buka menu dashboard'}
            aria-expanded={menuOpen}
            aria-controls="dashboard-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`dash__menu-icon${menuOpen ? ' is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{menuOpen ? 'Tutup' : 'Menu'}</span>
          </button>
        </div>

        <div id="dashboard-menu" className="dash__side-menu">
          <nav className="dash__nav" aria-label="Menu dashboard">
            {MENU.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className={activeMenu === item.id ? 'is-active' : undefined}
                aria-current={activeMenu === item.id ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span>{item.number}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="dash__side-bottom">
            <div className="dash__plan">
              <span>PAKET AKTIF</span>
              <strong>{planName}</strong>
              <Link to="/paket" onClick={() => setMenuOpen(false)}>
                Lihat paket <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <button type="button" className="dash__logout" onClick={() => setConfirmLogout(true)}>
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <main className="dash__main">{children}</main>

      {confirmLogout && (
        <div
          className="dash__confirm-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmLogout(false);
          }}
        >
          <section
            className="dash__confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            aria-describedby="logout-confirm-description"
          >
            <div className="eyebrow">KONFIRMASI</div>
            <h2 id="logout-confirm-title" className="display">Yakin ingin keluar?</h2>
            <p id="logout-confirm-description">
              Sesi kamu akan diakhiri dan kamu akan kembali ke halaman utama.
            </p>
            <div className="dash__confirm-actions">
              <button
                ref={cancelLogoutRef}
                type="button"
                className="btn"
                onClick={() => setConfirmLogout(false)}
              >
                Batal
              </button>
              <button type="button" className="btn btn--danger" onClick={logOut}>
                Ya, keluar
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
