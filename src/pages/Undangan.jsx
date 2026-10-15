import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findTemplate } from '../data/templates';
import { listWishes, submitRsvp } from '../services/api';

// Tanggal acara contoh. Nanti diambil dari data undangan di back end.
const EVENT_DATE = new Date('2026-12-12T08:00:00+07:00');

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

const Placeholder = ({ children, className = '' }) => (
  <div className={`inv-photo ${className}`}>{children}</div>
);

export default function Undangan() {
  const [params] = useSearchParams();
  const template = findTemplate(params.get('template'));
  const guest = params.get('to') || '[Nama Tamu]';
  const [first, second] = template.names.includes('&')
    ? template.names.split('&').map((s) => s.trim())
    : [template.names, null];

  const countdown = useCountdown(EVENT_DATE);
  const [wishes, setWishes] = useState([]);
  const [form, setForm] = useState({ name: guest === '[Nama Tamu]' ? '' : guest, attendance: 'Hadir', message: '' });
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

  return (
    <div className="inv-stage">
      <div className="inv">
        {/* Sampul */}
        <section
          className="inv-cover"
          style={{ background: `linear-gradient(180deg, ${template.bg}, ${template.bg}cc)`, color: template.fg }}
        >
          <div className="inv-eyebrow" style={{ color: template.fg }}>{template.event}</div>
          <Placeholder>[FOTO]</Placeholder>
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
          <div className="inv-date">{template.date}</div>
          <div className="inv-to">
            <span>Kepada Yth.</span>
            <strong>{guest}</strong>
          </div>
          <a href="#acara" className="inv-open">
            BUKA UNDANGAN
          </a>
        </section>

        {/* Kutipan */}
        <section className="inv-quote">
          <p>[Kutipan ayat atau kata-kata pembuka dari mempelai]</p>
          <div className="inv-rule" />
        </section>

        {/* Mempelai */}
        <section className="inv-couple">
          <div className="inv-eyebrow">MEMPELAI</div>
          <div className="inv-person">
            <Placeholder className="inv-photo--arch" />
            <h2 className="display">Nadia [Nama Lengkap]</h2>
            <p>Putri dari Bapak [Nama] &amp; Ibu [Nama]</p>
          </div>
          <div className="inv-amp">&amp;</div>
          <div className="inv-person">
            <Placeholder className="inv-photo--arch" />
            <h2 className="display">Raka [Nama Lengkap]</h2>
            <p>Putra dari Bapak [Nama] &amp; Ibu [Nama]</p>
          </div>
        </section>

        {/* Acara */}
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
            <p>Sabtu, 12 Desember 2026 · 08.00 WIB</p>
          </div>
          <div className="inv-card">
            <h3 className="display">Resepsi</h3>
            <p>Sabtu, 12 Desember 2026 · 11.00 WIB</p>
            <p>[Nama Gedung], [Alamat lengkap]</p>
          </div>
          <div className="inv-map">[PETA LOKASI]</div>
          <a
            className="btn btn--sm"
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
          >
            Buka Google Maps
          </a>
        </section>

        {/* Galeri */}
        <section className="inv-gallery">
          <div className="inv-eyebrow">GALERI</div>
          <div className="inv-gallery__grid">
            <div /> <div /> <div /> <div />
          </div>
        </section>

        {/* RSVP */}
        <section className="inv-rsvp">
          <div className="inv-eyebrow">RSVP &amp; UCAPAN</div>
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="rsvp-nama">Nama</label>
              <input id="rsvp-nama" name="name" className="input" value={form.name} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="rsvp-hadir">Kehadiran</label>
              <select id="rsvp-hadir" name="attendance" className="input" value={form.attendance} onChange={onChange}>
                <option>Hadir</option>
                <option>Tidak hadir</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="rsvp-ucapan">Ucapan</label>
              <textarea
                id="rsvp-ucapan"
                name="message"
                rows="3"
                className="input"
                placeholder="Tulis ucapan dan doa"
                value={form.message}
                onChange={onChange}
              />
            </div>
            {error && <p className="error-text" role="alert">{error}</p>}
            {sent && !error && <p className="hint" role="status">Terima kasih, konfirmasimu sudah terkirim.</p>}
            <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
              {sending ? 'Mengirim…' : 'KIRIM'}
            </button>
          </form>

          <ul className="inv-wishes">
            {wishes.map((w) => (
              <li key={w.id}>
                <strong>{w.name}</strong>
                <span>{w.message}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Penutup */}
        <footer className="inv-footer">
          <div className="display">{template.names}</div>
          <p>Terima kasih atas doa dan kehadiran Anda.</p>
          <small>MADE WITH PRIDE</small>
        </footer>
      </div>
    </div>
  );
}
