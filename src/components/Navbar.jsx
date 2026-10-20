import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useAuth } from '../auth';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Acara', to: '/acara' },
  { label: 'Katalog', to: '/katalog' },
  { label: 'Tutorial', to: '/tutorial' },
  { label: 'Harga', to: '/#harga' },
  { label: 'FAQ', to: '/#faq' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const { session } = useAuth();

  const handleLinkClick = () => setOpen(false);

  const isActive = (path) => {
    if (path === '/') return pathname === '/' && !hash;
    if (path.includes('#')) return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#FBF8F2]/80 backdrop-blur-xl border-b border-[#EAEAEA]/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />

          {/* --- DESKTOP MENU --- */}
          <nav className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => {
              const active = isActive(l.to);
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={`relative text-sm font-medium transition-colors hover:text-[#A98B5A] ${
                    active ? 'text-[#1A1A1A]' : 'text-[#666]'
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#A98B5A] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            
            <div className="w-px h-6 bg-[#EAEAEA] mx-2" />

            {session ? (
              <Link to="/dashboard" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black hover:shadow-lg transition-all">
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/masuk" className="text-sm font-semibold text-[#1A1A1A] hover:text-[#A98B5A] transition-colors">
                  Masuk
                </Link>
                <Link to="/masuk" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Buat Undangan
                </Link>
              </div>
            )}
          </nav>

          {/* --- TOMBOL BURGER ASLI (Saat menu TERTUTUP) --- */}
          {!open && (
            <button 
              className="lg:hidden p-2 text-[#1A1A1A] relative z-50"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className="w-full h-0.5 bg-current" />
                <span className="w-full h-0.5 bg-current" />
                <span className="w-full h-0.5 bg-current" />
              </div>
            </button>
          )}
        </div>
      </header>

      {/* --- MOBILE MENU (FULL SCREEN OVERLAY) --- */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#FBF8F2] flex flex-col lg:hidden"
          >
            {/* HEADER KHUSUS MENU MOBILE (Nyatu sama Logo) */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-[#EAEAEA]/50">
              <Logo />
              <button 
                onClick={() => setOpen(false)}
                className="p-2 text-[#1A1A1A] hover:text-[#A98B5A] transition-colors"
                aria-label="Tutup menu"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* LIST MENU */}
            <div className="flex flex-col px-6 mt-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  <Link 
                    to={l.to} 
                    onClick={handleLinkClick} 
                    className="block text-3xl font-serif text-[#1A1A1A] py-5 border-b border-[#EAEAEA]/50 hover:text-[#A98B5A] transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* TOMBOL AKSI DI BAWAH */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="mt-auto pb-12 px-6 flex flex-col gap-4"
            >
              {session ? (
                <Link to="/dashboard" onClick={handleLinkClick} className="bg-[#1A1A1A] text-white px-6 py-4 rounded-full text-center font-semibold text-lg shadow-xl">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/masuk" onClick={handleLinkClick} className="bg-transparent border border-[#EAEAEA] text-[#1A1A1A] px-6 py-4 rounded-full text-center font-semibold text-lg hover:bg-white transition-colors">
                    Masuk
                  </Link>
                  <Link to="/masuk" onClick={handleLinkClick} className="bg-[#1A1A1A] text-white px-6 py-4 rounded-full text-center font-semibold text-lg shadow-xl">
                    Buat Undangan
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}