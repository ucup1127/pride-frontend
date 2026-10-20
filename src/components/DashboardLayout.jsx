import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../auth';

const MENU = [
  { label: 'Ringkasan', to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Daftar Tamu', to: '/dashboard/guests', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { label: 'Ucapan', to: '/dashboard/wishes', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Pengaturan', to: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

export default function DashboardLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Buat ngecek lagi di halaman mana

  const userInitial = session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'P';
  const pageTitle = MENU.find(m => m.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans pb-16 md:pb-0">
      
      {/* --- SIDEBAR KIRI (Desktop) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Logo />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link 
                key={item.label} 
                to={item.to} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#F0EAE1] text-[#A98B5A]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={() => { signOut(); navigate('/'); }} className="w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="md:hidden"><Logo small /></div>
          <div className="hidden md:block"><h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1></div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{session?.user?.name || 'Pengguna'}</p>
              <p className="text-xs text-gray-500">{session?.user?.email || 'email@pride.com'}</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-[#A98B5A] rounded-full flex items-center justify-center text-white font-bold uppercase text-sm md:text-base">
              {userInitial}
            </div>
          </div>
        </header>

        {/* INI KUNCI NYA: Konten halaman bakal dimasukin ke sini */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* --- BOTTOM NAVIGATION BAR (Mobile) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2 pb-safe">
        {MENU.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.label} 
              to={item.to} 
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                isActive ? 'text-[#A98B5A]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? "2" : "1.5"}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span> {/* Ambil kata pertama aja biar muat */}
            </Link>
          );
        })}
        <button onClick={() => { signOut(); navigate('/'); }} className="flex flex-col items-center justify-center w-full h-full gap-1 text-red-500 hover:text-red-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </nav>

    </div>
  );
}