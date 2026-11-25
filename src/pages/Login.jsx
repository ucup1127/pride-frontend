import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { DEMO_MODE, GOOGLE_CLIENT_ID } from '../config';
import { getPackage } from '../data/packages';
import { googleLogin, login, register } from '../services/api';

let googleScriptPromise;

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        googleScriptPromise = null;
        reject(new Error('Layanan Google gagal dimuat. Coba lagi.'));
      };
      document.head.appendChild(script);
    });
  }
  return googleScriptPromise;
}

function getDestination(from, plan) {
  if (from) return from;
  if (!plan) return '/dashboard';

  return `/checkout?paket=${encodeURIComponent(plan.toLowerCase())}`;
}

export default function Login() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signIn } = useAuth();
  const plan = params.get('paket');
  const planName = getPackage(plan)?.name || plan;
  const isRegistering = params.get('daftar') === '1';
  const destination = getDestination(location.state?.from, plan);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const googleButtonRef = useRef(null);
  const googleLoginEnabled = !DEMO_MODE && Boolean(GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (session) navigate(destination, { replace: true });
  }, [session, destination, navigate]);

  useEffect(() => {
    if (!googleLoginEnabled) return undefined;
    let active = true;

    const handleGoogleCredential = async ({ credential }) => {
      if (!credential) {
        setError('Google tidak mengirimkan kredensial akun.');
        return;
      }

      setError('');
      setBusy(true);
      try {
        const result = await googleLogin(credential);
        if (!active) return;
        signIn(result);
        navigate(destination, { replace: true });
      } catch (loginError) {
        if (active) setError(loginError.message || 'Login dengan Google gagal.');
      } finally {
        if (active) setBusy(false);
      }
    };

    loadGoogleIdentityServices()
      .then(() => {
        if (!active || !googleButtonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        googleButtonRef.current.replaceChildren();
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: Math.min(googleButtonRef.current.clientWidth, 400),
          locale: 'en',
        });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Layanan Google gagal dimuat.');
      });

    return () => {
      active = false;
    };
  }, [googleLoginEnabled, destination, navigate, signIn]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const result = isRegistering
        ? await register({ name: name.trim(), email: email.trim(), password })
        : await login({ email: email.trim(), password });
      signIn(result);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <section className="container auth-login">
        <div className="auth-login__intro">
          <div className="eyebrow">AKUN PRIDE</div>
          <h1 className="display">{isRegistering ? 'Mulai dengan Pride.' : 'Senang bertemu lagi.'}</h1>
          <p>{isRegistering ? 'Buat akun untuk memesan paket dan mengelola undanganmu.' : 'Masuk untuk mengelola undangan dan melanjutkan proses pesananmu.'}</p>
        </div>

        <div className="auth-login__card">
          <div className="auth-login__heading">
            <h2 className="display">{isRegistering ? 'Buat akun' : 'Masuk ke akun'}</h2>
            <p>{isRegistering ? 'Isi data untuk membuat akun Pride.' : 'Masuk dengan Google atau gunakan email dan kata sandi.'}</p>
          </div>

          {plan && (
            <div className="auth-login__plan">
              <span>LANJUTKAN PESANAN</span>
              <strong>Paket {planName}</strong>
            </div>
          )}

          <form className="auth-login__form" onSubmit={onSubmit}>
            {isRegistering && (
              <div className="field">
                <label htmlFor="register-name">Nama</label>
                <input
                  id="register-name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="auth-login__password-label">
                <label htmlFor="login-password">Kata sandi</label>
                <Link to="/bantuan">Lupa kata sandi?</Link>
              </div>
              <input
                id="login-password"
                className="input"
                type="password"
                name="password"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={isRegistering ? 6 : undefined}
              />
            </div>

            {DEMO_MODE && (
              <p className="auth-login__demo" role="note">
                Mode demo aktif: gunakan email dan kata sandi apa saja. Login Google aktif setelah konfigurasi Client ID dan mode demo dinonaktifkan.
              </p>
            )}

            <Button type="submit" variant="primary" block disabled={busy}>
              {busy ? 'Memproses…' : isRegistering ? 'Buat akun & lanjutkan' : plan ? 'Masuk & lanjutkan' : 'Masuk'}
            </Button>
          </form>

          {error && <p className="error-text" role="alert">{error}</p>}

          {googleLoginEnabled && (
            <div className="auth-login__google">
              <div className="auth-login__divider"><span>or</span></div>
              <div
                ref={googleButtonRef}
                className="auth-login__google-button"
                aria-busy={busy}
              />
            </div>
          )}

          {!googleLoginEnabled && !DEMO_MODE && (
            <p className="auth-login__google-note" role="note">
              Login Google belum dikonfigurasi. Isi Client ID Google untuk mengaktifkannya.
            </p>
          )}

          <p className="auth-login__help">
            {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <Link to={`${isRegistering ? '/masuk' : '/masuk?daftar=1'}${plan ? `${isRegistering ? '?' : '&'}paket=${encodeURIComponent(plan)}` : ''}`}>
              {isRegistering ? 'Masuk' : 'Buat akun'}
            </Link>
            {' · '}<Link to="/bantuan">Hubungi Bantuan</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
