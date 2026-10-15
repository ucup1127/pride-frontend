import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import TemplateCard from '../components/TemplateCard';
import PlanCard from '../components/PlanCard';
import { FAQS, FEATURES, MOMENTS, PLANS, STEPS } from '../data/content';
import { FEATURED_IDS, TEMPLATES } from '../data/templates';

function PhoneMockup() {
  return (
    <div className="hero__visual">
      <div className="hero__circle" aria-hidden="true" />
      <div className="phone" aria-hidden="true">
        <div className="phone__event">THE WEDDING OF</div>
        <div className="phone__photo">[FOTO MEMPELAI]</div>
        <div className="phone__names">
          Nadia <em>&amp;</em> Raka
        </div>
        <div className="phone__date">12 DESEMBER 2026</div>
        <div className="phone__button">BUKA UNDANGAN</div>
      </div>
    </div>
  );
}

export default function Home() {
  const featured = FEATURED_IDS.map((id) => TEMPLATES.find((t) => t.id === id));

  return (
    <Layout>
      {/* Hero */}
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
            <Button to="/katalog" variant="primary" size="lg">
              Lihat Template
            </Button>
            <Button to="/undangan" size="lg">
              Contoh Undangan
            </Button>
          </div>
          <ul className="hero__points">
            <li>Tanpa aplikasi tambahan</li>
            <li>Bisa dibuka di semua HP</li>
            <li>Beli &amp; masuk lewat WhatsApp</li>
          </ul>
        </div>
        <PhoneMockup />
      </section>

      {/* Untuk setiap momen */}
      <section id="momen" className="section">
        <div className="container stack gap-48">
          <SectionHeading eyebrow="Untuk setiap momen" title="Bukan hanya untuk pernikahan" />
          <div className="grid grid--3">
            {MOMENTS.map((m) => (
              <Link
                key={m.title}
                to={`/katalog?kategori=${encodeURIComponent(m.category)}`}
                className="moment-card"
                style={{ background: m.bg, color: m.fg }}
              >
                <div>
                  <h3 className="display">{m.title}</h3>
                  <p>{m.text}</p>
                </div>
                <span>Lihat template →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="section section--tint">
        <div className="container stack gap-56">
          <SectionHeading eyebrow="Fitur" title="Semua yang dibutuhkan untuk hari istimewa" />
          <div className="grid grid--3">
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

      {/* Cara kerja */}
      <section className="section">
        <div className="container stack gap-56">
          <div className="stack gap-14">
            <SectionHeading eyebrow="Cara kerja" title="Empat langkah, tanpa ribet" />
            <Link to="/tutorial" className="link-gold link-gold--start">
              Lihat tutorial lengkap
            </Link>
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

      {/* Template pilihan */}
      <section className="section section--tint">
        <div className="container stack gap-48">
          <div className="row row--between row--end">
            <h2 className="display section-heading__title">Template pilihan</h2>
            <Link to="/katalog" className="link-gold link-gold--ink">
              Lihat semua template
            </Link>
          </div>
          <div className="grid grid--3 grid--tall">
            {featured.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Harga */}
      <section id="harga" className="section">
        <div className="container stack gap-56">
          <SectionHeading
            eyebrow="Paket"
            title="Pilih paket yang sesuai"
            text="Setelah memilih paket, kamu langsung masuk dengan nomor WhatsApp. Tidak perlu membuat akun baru."
          />
          <div className="grid grid--3 grid--stretch">
            {PLANS.map((p) => (
              <PlanCard key={p.name} plan={p} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section--tint">
        <div className="container faq">
          <SectionHeading eyebrow="FAQ" title="Pertanyaan yang sering muncul" />
          <div className="faq__list">
            {FAQS.map((f) => (
              <div key={f.q} className="faq__item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ajakan akhir */}
      <section className="section section--dark cta-band">
        <div className="container stack center gap-24">
          <h2 className="display">Siap membuat undanganmu?</h2>
          <p>Mulai dari memilih template. Data bisa kamu ubah kapan saja sebelum undangan disebar.</p>
          <Button to="/masuk" variant="light" size="lg">
            Mulai lewat WhatsApp
          </Button>
        </div>
      </section>
    </Layout>
  );
}
