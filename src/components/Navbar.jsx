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
  const { pathname } = useLocation();
  const { session } = useAuth();

  // Fungsi buat nutup menu pas link diklik
  const handleLinkClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[#EAEAEA]">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />

        {/* --- DESKTOP MENU --- */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-[#A98B5A] ${
                pathname === l.to ? 'text-[#A98B5A]' : 'text-[#555]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            {session ? (
              <Link to="/dashboard" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/masuk" className="text-sm font-semibold text-[#1A1A1A] hover:text-[#A98B5A]">
                  Masuk
                </Link>
                <Link to="/masuk" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors">
                  Buat Undangan
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* --- TOMBOL BURGER (HP) --- */}
        <button 
          className="md:hidden p-2 text-2xl z-50 relative" 
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
        >
          {/* Animasi ganti ikon dari garis tiga ke silang */}
          <motion.div animate={{ rotate: open ? 90 : 0 }}>
            {open ? '✕' : '☰'}
          </motion.div>
        </button>
      </div>

      {/* --- MOBILE MENU DROPDOWN (ANIMASI) --- */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-20 left-0 w-full bg-[#FBF8F2] border-b border-[#EAEAEA] shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={l.to} 
                    onClick={handleLinkClick} 
                    className="block text-lg font-medium text-[#1A1A1A] py-2 hover:text-[#A98B5A]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              
              <hr className="border-[#EAEAEA] my-2" />
              
              <div className="flex flex-col gap-3">
                {session ? (
                  <Link to="/dashboard" onClick={handleLinkClick} className="bg-[#1A1A1A] text-white px-6 py-3.5 rounded-full text-center font-semibold">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/masuk" onClick={handleLinkClick} className="text-center font-semibold py-2 text-[#1A1A1A]">
                      Masuk
                    </Link>
                    <Link to="/masuk" onClick={handleLinkClick} className="bg-[#1A1A1A] text-white px-6 py-3.5 rounded-full text-center font-semibold">
                      Buat Undangan
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}