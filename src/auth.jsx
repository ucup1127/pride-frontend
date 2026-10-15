import { createContext, useContext, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { setToken } from './services/api';

const KEY = 'pride_session';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) window.localStorage.setItem(KEY, JSON.stringify(session));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Penyimpanan browser bisa diblokir; sesi tetap hidup selama tab terbuka.
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const value = useMemo(
    () => ({
      session,
      signIn(next) {
        if (next?.token) setToken(next.token);
        writeSession(next);
        setSession(next);
      },
      signOut() {
        setToken(null);
        writeSession(null);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function RequireAuth({ children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/masuk" replace state={{ from: location.pathname }} />;
  return children;
}