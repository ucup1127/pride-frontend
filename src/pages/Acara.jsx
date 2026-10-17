import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORY_COUNTS } from '../data/templates';

const blurbs = {
  'Pernikahan': 'Rayakan kisah kalian dengan undangan yang elegan.',
  'Ulang tahun': 'Undang orang tersayang untuk momen bertambah usia.',
  'Wisuda': 'Bagikan kabar kelulusan dengan desain yang berkesan.',
  'Sempro/Semhas': 'Undangan sidang proposal atau hasil yang rapi dan formal.',
  'Bukber & Khitanan': 'Kumpulkan keluarga dan sahabat dalam satu undangan.',
  'Acara kantor': 'Untuk gathering, seminar, meeting, dan acara perusahaan.',
  'Aqiqah & Tasyakuran': 'Rayakan kelahiran buah hati dengan undangan hangat.',
  'Anniversary & Reuni': 'Kenang momen berharga bersama orang terdekat.',
};

const CATEGORY_DATA = {
  'Pernikahan': { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&q=80', color: '#8B6F47' },
  'Ulang tahun': { img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=1000&fit=crop&q=80', color: '#D89B9B' },
  'Wisuda': { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=1000&fit=crop&q=80', color: '#6B8CA8' },
  'Sempro/Semhas': { img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=1000&fit=crop&q=80', color: '#7A7A7A' },
  'Bukber & Khitanan': { img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=1000&fit=crop&q=80', color: '#7A9068' },
  'Acara kantor': { img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=1000&fit=crop&q=80', color: '#9C8770' },
  'Aqiqah & Tasyakuran': { img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=1000&fit=crop&q=80', color: '#B8956A' },
  'Anniversary & Reuni': { img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1000&fit=crop&q=80', color: '#9B7B8A' },
};

export default function Acara() {
  return (
    <Layout>
      <section className="container page-head">
        <div className="eyebrow">UNTUK SETIAP MOMEN</div>
        <h1 className="display page-head__title">Acara spesialmu, dengan gaya yang kamu pilih.</h1>
        <p className="lead page-head__text">
          Pilih kategori acara untuk melihat koleksi template yang bisa kamu personalisasi.
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {Object.entries(CATEGORY_COUNTS).map(([name, count], i) => {
            const data = CATEGORY_DATA[name] || {};
            return (
              <Link
                key={name}
                to={`/katalog?kategori=${encodeURIComponent(name)}`}
                style={{
                  position: 'relative',
                  display: 'block',
                  minHeight: 280,
                  borderRadius: 20,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  backgroundColor: data.color || '#1A1A1A',
                }}
              >
                {data.img && (
                  <img
                    src={data.img}
                    alt=""
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0,
                    }}
                  />
                )}

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.78) 100%)',
                    zIndex: 1,
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 280,
                    padding: '24px 22px',
                    color: '#FFF',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        letterSpacing: '0.15em',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        color: '#FFF',
                        opacity: 0.85,
                      }}
                    >
                      ↗
                    </span>
                  </div>

                  <div>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                        fontSize: '1.85rem',
                        fontWeight: 500,
                        margin: '0 0 10px',
                        lineHeight: 1.1,
                        color: '#FFF',
                      }}
                    >
                      {name}
                    </h2>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        color: 'rgba(255,255,255,0.92)',
                        margin: '0 0 14px',
                      }}
                    >
                      {blurbs[name]}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '5px 12px',
                        background: 'rgba(255,255,255,0.18)',
                        border: '1px solid rgba(255,255,255,0.32)',
                        borderRadius: 100,
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        color: '#FFF',
                      }}
                    >
                      {count} template
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container feature-cta">
          <div>
            <div className="eyebrow">MULAI SEKARANG</div>
            <h2 className="display">Temukan desain yang paling kamu suka.</h2>
          </div>
          <Link className="btn btn--primary" to="/paket">
            Lihat paket →
          </Link>
        </div>
      </section>
    </Layout>
  );
}