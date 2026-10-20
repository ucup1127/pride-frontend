import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequireAuth } from './auth';

// Import Halaman
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import Undangan from './pages/Undangan';
import Login from './pages/Login';
import Register from './pages/Register';
import Tutorial from './pages/Tutorial';
import Acara from './pages/Acara';
import NotFound from './pages/NotFound';
import Editor from './pages/Editor';
import Wishes from './pages/Wishes';
import Settings from './pages/Settings';

// Import Dashboard & Layout-nya
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';

// Gulir ke atas saat pindah halaman
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
        {/* Halaman Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/acara" element={<Acara />} />
        <Route path="/katalog" element={<Katalog />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/masuk" element={<Login />} />
        <Route path="/daftar" element={<Register />} />
        
        {/* Undangan Demo & Undangan Personal */}
        <Route path="/undangan" element={<Undangan />} />
        <Route path="/u/:slug" element={<Undangan />} />

        {/* Halaman Editor (Bikin Undangan) */}
        <Route path="/editor" element={<RequireAuth><Editor /></RequireAuth>} />

        {/* =========================================
            DASHBOARD (Pakai Layout Persisten)
            Sidebar & Navbar cuma dirender sekali di sini
            ========================================= */}
        <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="guests" element={<Guests />} />
          <Route path="wishes" element={<Wishes />} />        {/* <-- Tambahan */}
          <Route path="settings" element={<Settings />} />    {/* <-- Tambahan */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}