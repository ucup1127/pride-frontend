import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { findTemplate } from '../data/templates';
import { listWishes, submitRsvp } from '../services/api';

const DEFAULT_BANNER = 'https://githubusercontent.com';

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const pad = (n) => String(n).padStart(2, '0');
  return [
    { label: 'Hari', value: pad(Math.floor(diff / 86400000)) },
    { label: 'Jam', value: pad(Math.floor((diff / 3600000) % 24)) },
    { label: 'Menit', value: pad(Math.floor((diff / 60000) % 60)) },
    { label: 'Detik', value: pad(Math.floor((diff / 1000) % 60)) },
  ];
}

const Placeholder = ({ children, className = '', src }) => (
  <div className={`inv-photo ${className}`}>
    {src && (
      <img
        className="inv-photo__image"
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    )}
    {children}
  </div>
);

export default function Undangan() {
  const [params] = useSearchParams();
  const template = findTemplate(params.get('template'));
  const plan = localStorage.getItem('pride-paid-plan') || 'standard';
  const guest = params.get('to') || 'Tamu Undangan';

  const draft = (() => {
    try {
      return JSON.parse(localStorage.getItem(`pride-draft-${template.id}`)) || {};
    } catch {
      return {};
    }
  })();

  const titleText = draft.title || template.names;
  const [first, second] = titleText.includes('&')
    ? titleText.split('&').map((s) => s.trim())
    : [titleText, null];

  const eventDate = draft.eventIso ? new Date(draft.eventIso) : new Date('2026-12-12T08:00:00+07:00');
  const countdown = useCountdown(Number.isNaN(eventDate.getTime()) ? new Date('2026-12-12T08:00:00+07:00') : eventDate);

  const coverPhoto = draft.photos?.cover || DEFAULT_BANNER;
  const bridePhoto = draft.photos?.bride || '';
  const groomPhoto = draft.photos?.groom || '';
  const galleryPhotos = draft.photos?.gallery || [];

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const [wishes, setWishes] = useState([]);
  const [form, setForm] = useState({ name: guest === 'Tamu Undangan' ? '' : guest, attendance: 'Hadir', message: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let active = true;
    listWishes().then((data) => active && setWishes(data));
    return () => {
      active = false;
    };
  }, []);

  const handleOpenInvitation = () => {
    if (draft.musicEnabled !== false && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleCopyBank = () => {
    const rekening = draft.bankAccount || '1234567890';
    navigator.clipboard?.writeText(rekening);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    setError('');
    setSending(true);
    try {
      const wish = await submitRsvp({ ...form, name: form.name.trim() });
      setWishes((list) => [wish, ...list]);
      setForm((f) => ({ ...f, message: '' }));
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const design = template.design || 'editorial';
  const themeBg = draft.color || template.bg;

  return (
    <div className="inv-stage">
      <Link to={`/editor?template=${template.id}`} className="inv-back">← Kembali ke Editor</Link>

      {draft.musicEnabled !== false && (
        <>
          <audio
            ref={audioRef}
            loop
            src={draft.musicUrl || 'https://soundhelix.com'}
          />
          <button
            type="button"
            onClick={toggleMusic}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 50,
              borderRadius: '999px',
              padding: '10px 16px',
              background: '#111827',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {playing ? '⏸ Jeda Musik' : '♫ Putar Musik'}
          </button>
        </>
      )}

      <div className={`inv inv--${design}`}>
        <section
          className={`inv-cover inv-cover--${design}`}
          style={{
            '--invitation-bg': themeBg,
            '--invitation-fg': '#ffffff',
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.85)), url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',
          }}
        >
          <div className="inv-eyebrow" style={{ color: '#f8fafc' }}>{template.event}</div>
          <Placeholder className="inv-photo--cover" src={coverPhoto} />
          <div className="inv-names">
            {first}
            {second && (
              <>
                <br />
                <em>&amp;</em>
                <br />
                {second}
              </>
            )}
          </div>
          <div className="inv-date">{draft.date || template.date}</div>
          <div className="inv-to">
            <span>Kepada Yth. Bapak/Ibu/Saudara/i</span>
            <strong>{guest}</strong>
          </div>
          <a href="#acara" className="inv-open" onClick={handleOpenInvitation}>
            BUKA UNDANGAN
          </a>
        </section>

        <section className="inv-quote">
          <p>{draft.quote || '“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.”'}</p>
          <div className="inv-rule" />
        </section>

        <section className="inv-couple">
          <div className="inv-eyebrow">MEMPELAI</div>
          <div className="inv-person">
            <Placeholder className="inv-photo--arch" src={bridePhoto} />
            <h2 className="display">{draft.brideName || first || 'Nadia Putri'}</h2>
            <p>{draft.brideParents || 'Putri dari Bapak Hendra & Ibu Sari'}</p>
          </div>
          <div className="inv-amp">&amp;</div>
          <div className="inv-person">
            <Placeholder className="inv-photo--arch" src={groomPhoto} />
            <h2 className="display">{draft.groomName || second || 'Raka Pratama'}</h2>
            <p>{draft.groomParents || 'Putra dari Bapak Ahmad & Ibu Dewi'}</p>
          </div>
        </section>

        <section id="acara" className="inv-event">
          <div className="inv-eyebrow">SAVE THE DATE</div>
          <div className="inv-countdown" role="timer" aria-label="Hitung mundur menuju acara">
            {countdown.map((c) => (
              <div key={c.label}>
                <strong>{c.value}</strong>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
          <div className="inv-card">
            <h3 className="display">Akad Nikah</h3>
            <p>{draft.date || template.date}</p>
            <p>Pukul {draft.akadTime || '08.00 - 10.00 WIB'}</p>
          </div>
          <div className="inv-card">
            <h3 className="display">Resepsi</h3>
            <p>{draft.date || template.date}</p>
            <p>Pukul {draft.resepsiTime || '11.00 - 14.00 WIB'}</p>
            <p>{draft.location || 'Gedung Grand Ballroom, Jakarta'}</p>
          </div>
          <a
            className="btn btn--sm"
            href={draft.mapsUrl || 'https://maps.google.com'}
            target="_blank"
            rel="noreferrer"
          >
            Buka Google Maps
          </a>
        </section>

        <section className="inv-gallery">
          <div className="inv-eyebrow">GALERI MOMEN</div>
          <div className="inv-gallery__grid">
            {galleryPhotos.length > 0 ? (
              galleryPhotos.map((src, i) => (
                <div key={i} style={{ overflow: 'hidden', borderRadius: '12px' }}>
                  <img src={src} alt={`Galeri ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))
            ) : (
              <>
                <div style={{ backgroundImage: `url(${coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div />
                <div />
                <div />
              </>
            )}
          </div>
        </section>

                    <section className="inv-event" style={{ paddingTop: 0 }}>
          <div className="inv-eyebrow">LOVE GIFT · AMPLOP DIGITAL</div>
          <div className="inv-card">
            <h3 className="display">{draft.bankName || 'BCA'}</h3>
            <p style={{ fontSize: '1.15rem', fontWeight: 'bold', letterSpacing: '1px', margin: '0.5rem 0' }}>
              {draft.bankAccount || '1234567890'}
            </p>
            <p>a.n. {draft.bankHolder || first || 'Mempelai'}</p>
            <button type="button" className="btn btn--sm" style={{ marginTop: '0.75rem' }} onClick={handleCopyBank}>
              {copied ? '✓ Nomor Rekening Tersalin' : 'Salin Nomor Rekening'}
            </button>
          </div>
        </section>

        {plan !== 'basic' ? (
          <section className="inv-rsvp">
            <div className="inv-eyebrow">RSVP &amp; UCAPAN DOA</div>
            <form onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="rsvp-nama">Nama Tamu</label>
                <input id="rsvp-nama" name="name" className="input" value={form.name} onChange={onChange} />
              </div>
              <div className="field">
                <label htmlFor="rsvp-hadir">Konfirmasi Kehadiran</label>
                <select id="rsvp-hadir" name="attendance" className="input" value={form.attendance} onChange={onChange}>
                  <option>Hadir</option>
                  <option>Tidak hadir</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="rsvp-ucapan">Ucapan &amp; Doa</label>
                <textarea
                  id="rsvp-ucapan"
                  name="message"
                  rows="3"
                  className="input"
                  placeholder="Tulis ucapan dan doa untuk mempelai"
                  value={form.message}
                  onChange={onChange}
                />
              </div>
              {error && <p className="error-text" role="alert">{error}</p>}
              {sent && !error && <p className="hint" role="status">Terima kasih, konfirmasi &amp; ucapanmu sudah terkirim.</p>}
              <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
                {sending ? 'Mengirim…' : 'KIRIM UCAPAN'}
              </button>
            </form>

            <ul className="inv-wishes">
              {wishes.map((w) => (
                <li key={w.id}>
                  <strong>{w.name} ({w.attendance || 'Hadir'})</strong>
                  <span>{w.message}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer className="inv-footer">
          <div className="display">{titleText}</div>
          <p>Terima kasih atas doa restu dan kehadiran Anda.</p>
          <small>MADE WITH PRIDE</small>
        </footer>
      </div>
    </div>
  );
}
