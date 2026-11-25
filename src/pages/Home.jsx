import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import TemplateCard from '../components/TemplateCard';
import PlanCard from '../components/PlanCard';
import { FEATURES, STEPS } from '../data/content';
import { PACKAGES } from '../data/packages';
import { FEATURED_IDS, TEMPLATES } from '../data/templates';

const MOMENT_DATA = {
  'Pernikahan': {
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&q=80',
    color: '#8B6F47',
  },
  'Ulang tahun': {
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop&q=80',
    color: '#D89B9B',
  },
  'Wisuda': {
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=800&fit=crop&q=80',
    color: '#6B8CA8',
  },
  'Sempro/Semhas': {
    img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop&q=80',
    color: '#7A7A7A',
  },
  'Bukber & Khitanan': {
    img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=800&fit=crop&q=80',
    color: '#7A9068',
  },
  'Acara kantor': {
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=800&fit=crop&q=80',
    color: '#9C8770',
  },
  'Aqiqah & Tasyakuran': {
    img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&h=800&fit=crop&q=80',
    color: '#B8956A',
  },
  'Anniversary & Reuni': {
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=800&fit=crop&q=80',
    color: '#9B7B8A',
  },
};

const MOMENT_LIST = [
  { title: 'Pernikahan', category: 'Pernikahan', text: 'Cerita cinta, acara, peta, dan RSVP dalam satu tautan.' },
  { title: 'Ulang tahun', category: 'Ulang tahun', text: 'Ajak teman dan keluarga merayakan dengan undangan penuh warna.' },
  { title: 'Wisuda', category: 'Wisuda', text: 'Bagikan kebahagiaan kelulusan dengan desain yang berkesan.' },
  { title: 'Sempro/Semhas', category: 'Sempro/Semhas', text: 'Informasikan jadwal dan lokasi sidang dengan tampilan formal.' },
  { title: 'Bukber & Khitanan', category: 'Bukber & Khitanan', text: 'Undang keluarga dan sahabat untuk momen kebersamaan.' },
  { title: 'Acara kantor', category: 'Acara kantor', text: 'Undangan profesional untuk gathering, seminar, dan acara tim.' },
  { title: 'Aqiqah & Tasyakuran', category: 'Aqiqah & Tasyakuran', text: 'Rayakan kelahiran buah hati dengan undangan hangat.' },
  { title: 'Anniversary & Reuni', category: 'Anniversary & Reuni', text: 'Kenang momen berharga bersama orang terdekat.' },
];

function PhoneMockup() {
  const weddingPhoto = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=1200&fit=crop&q=80';

  return (
    <div className="hero__visual">
      {/* Frame HP */}
      <div className="phone" style={{
        position: 'relative',
        width: 260,
        height: 520,
        background: '#1A1A1A',
        borderRadius: 40,
        padding: 9,
        boxShadow: '0 30px 60px rgba(0,0,0,0.25), 0 12px 24px rgba(0,0,0,0.15)',
        flexShrink: 0,
      }}>
        {/* Layar */}
        <div className="phone__screen" style={{
          position: 'absolute',
          inset: 9,
          borderRadius: 32,
          overflow: 'hidden',
          backgroundColor: '#1A1A1A',
        }}>
          {/* Foto */}
          <img
            src={weddingPhoto}
            alt=""
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Overlay gradient */}
          <div className="phone__shade" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.80) 100%)',
          }} />
          {/* Konten */}
          <div className="phone__content" style={{
            position: 'absolute',
            inset: 0,
            padding: '48px 20px 26px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#FFF',
            textAlign: 'center',
          }}>
            {/* Header */}
            <div className="phone__event" style={{
              fontSize: '0.55rem',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.95)',
              textTransform: 'uppercase',
            }}>
              The Wedding Of
            </div>

            {/* Footer: nama + tanggal + tombol */}
            <div className="phone__details">
              <div style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '1.9rem',
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}>
                Nadia
              </div>
              <div className="phone__date" style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: '#E8DCC0',
                margin: '2px 0',
              }}>
                &amp;
              </div>
              <div className="phone__button" style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '1.9rem',
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}>
                Raka
              </div>
              <div style={{
                fontSize: '0.6rem',
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.9)',
                margin: '14px 0 20px',
              }}>
                12 · 12 · 2026
              </div>
              <div style={{
                display: 'inline-block',
                padding: '10px 22px',
                background: 'rgba(255,255,255,0.95)',
                color: '#1A1A1A',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                borderRadius: 12,
                textTransform: 'uppercase',
              }}>
                Buka Undangan
              </div>
            </div>
          </div>
        </div>

        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 20,
          background: '#1A1A1A',
          borderRadius: '0 0 12px 12px',
          zIndex: 10,
        }} />
      </div>
    </div>
  );
}
export default function Home() {
  const featured = FEATURED_IDS.map((id) => TEMPLATES.find((t) => t.id === id));

  return (
    <Layout>
      <section className="container hero">
        <div className="hero__copy">
          <div className="eyebrow">Digital Invitation</div>
          <h1 className="display hero__title">
            Undangan digital yang dibuat <em>sepenuh hati.</em>
          </h1>
          <p className="lead hero__text">
            Pilih template, isi data acara, lalu bagikan lewat satu tautan. Pernikahan, ulang tahun,
            wisuda, ujian, bukber, hingga ucapan custom, semuanya bisa selesai dalam hitungan menit.
          </p>
          <div className="hero__cta">
            <Button to="/paket" variant="primary" size="lg">Lihat Template</Button>
            <Button to="/undangan" size="lg">Contoh Undangan</Button>
          </div>
          <ul className="hero__points">
            <li>Tanpa aplikasi tambahan</li>
            <li>Bisa dibuka di semua HP</li>
            <li>Pilih paket, bayar, lalu edit template sendiri</li>
          </ul>
        </div>
        <PhoneMockup />
      </section>

      <section id="momen" className="section">
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <SectionHeading eyebrow="Untuk setiap momen" title="Bukan hanya untuk pernikahan" />
          </div>
          <div className="moment-grid">
            {MOMENT_LIST.map((m) => {
              const data = MOMENT_DATA[m.title] || {};
              return (
                <Link
                  key={m.title}
                  to={`/katalog?kategori=${encodeURIComponent(m.category)}`}
                  className="moment-card"
                  style={{ backgroundColor: data.color || '#8B6F47' }}
                >
                  {data.img && (
                    <img
                      src={data.img}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      className="moment-card__image"
                    />
                  )}
                  <div className="moment-card__content">
                    <h3 className="moment-card__title">{m.title}</h3>
                    <p className="moment-card__desc">{m.text}</p>
                    <span className="moment-card__link">Lihat template <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="fitur" className="section section--tint">
        <div className="container stack gap-56">
          <SectionHeading eyebrow="Fitur" title="Semua yang dibutuhkan untuk hari istimewa" />
          <div className="feature-rail">
            {FEATURES.map((f) => (
              <article key={f.no} className="feature-card">
                <div className="feature-card__no">{f.no}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack gap-56">
          <div className="stack gap-14">
            <SectionHeading eyebrow="Cara kerja" title="Empat langkah, tanpa ribet" />
            <Link to="/tutorial" className="link-gold link-gold--start">Lihat tutorial lengkap</Link>
          </div>
          <div className="grid grid--4">
            {STEPS.map((s) => (
              <article key={s.no} className="step">
                <div className="eyebrow step__label">Langkah {s.no}</div>
                <h3 className="display">{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container stack gap-48">
          <div className="row row--between row--end">
            <h2 className="display section-heading__title">Template pilihan</h2>
            <Link to="/katalog" className="link-gold link-gold--ink">Lihat semua template</Link>
          </div>
          <div className="grid grid--3 grid--tall">
            {featured.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      <section id="harga" className="section">
        <div className="container stack gap-56">
          <SectionHeading
            eyebrow="Paket"
            title="Pilih paket yang sesuai"
            text="Pilih paket, selesaikan pembayaran, lalu lanjutkan ke editor template. Untuk bantuan, hubungi kami melalui Instagram @bypride.studio."
          />
          <div className="grid grid--3 grid--stretch">
            {PACKAGES.map((p) => (
              <PlanCard key={p.name} plan={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark cta-band">
        <div className="container stack center gap-24">
          <h2 className="display">Siap membuat undanganmu?</h2>
          <p>Mulai dari memilih template. Data bisa kamu ubah kapan saja sebelum undangan disebar.</p>
          <Button to="/masuk" variant="light" size="lg">Mulai buat undangan</Button>
        </div>
      </section>
    </Layout>
  );
}