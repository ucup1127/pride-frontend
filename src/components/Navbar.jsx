import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import { useAuth } from '../auth';
const LINKS=[{label:'Home',to:'/'},{label:'Acara',to:'/acara'},{label:'Fitur',to:'/fitur'},{label:'Paket',to:'/paket'},{label:'Template',to:'/katalog'}];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { session } = useAuth();
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />
        <button
          type="button"
          className="navbar__toggle"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="menu-utama"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
        <nav id="menu-utama" className={`navbar__nav${open ? ' is-open' : ''}`} aria-label="Menu utama">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={pathname === link.to ? 'is-active' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session?.user?.role === 'admin' && (
            <>
              <Link to="/admin" onClick={() => setOpen(false)}>Dashboard pemilik</Link>
              <Link to="/admin/payments" onClick={() => setOpen(false)}>Verifikasi pembayaran</Link>
            </>
          )}
          <div className="navbar__actions">
            {session ? (
              <Button to="/dashboard" variant="primary" size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/masuk" className="navbar__login" onClick={() => setOpen(false)}>Masuk</Link>
                <Button to="/paket" variant="primary" size="sm" onClick={() => setOpen(false)}>
                  Buat Undangan
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
