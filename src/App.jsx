import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequireAuth } from './auth';
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import Undangan from './pages/Undangan';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tutorial from './pages/Tutorial';
import Acara from './pages/Acara'; // <-- File baru dari temenmu
import NotFound from './pages/NotFound';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acara" element={<Acara />} /> {/* <-- Tambahan */}
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/masuk" element={<Login />} />
        
        {/* Rute lama & Rute baru untuk tamu (slug) */}
        <Route path="/undangan" element={<Undangan />} />
        <Route path="/u/:slug" element={<Undangan />} />

        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}