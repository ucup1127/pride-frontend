import Layout from '../components/Layout';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { TIPS, TUTORIAL_STEPS } from '../data/content';
import { whatsappLink } from '../config';

export default function Tutorial() {
  return (
    <Layout>
      <section className="container page-head">
        <div className="eyebrow">Tutorial</div>
        <h1 className="display page-head__title page-head__title--narrow">
          Dari memilih template sampai undangan tersebar
        </h1>
        <p className="lead page-head__text">
          Ikuti enam langkah berikut. Seluruh prosesnya bisa dilakukan dari HP.
        </p>
      </section>

      <section className="container tutorial">
        <aside className="tutorial__side">
          <div className="tutorial__video" role="img" aria-label="Tempat video tutorial">
            <span className="tutorial__play" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M8 5 L19 12 L8 19 Z" fill="#FBF8F2" />
              </svg>
            </span>
            <span>[VIDEO TUTORIAL]</span>
          </div>
          <div className="panel panel--tint">
            <h2 className="display">Butuh bantuan?</h2>
            <p className="hint">Admin kami siap membantu lewat WhatsApp di jam kerja.</p>
            <Button href={whatsappLink('Halo Pride, saya butuh bantuan memakai website.')} variant="primary" size="sm">
              Chat admin via WhatsApp
            </Button>
          </div>
        </aside>

        <ol className="tutorial__steps">
          {TUTORIAL_STEPS.map((s) => (
            <li key={s.no}>
              <span className="tutorial__no" aria-hidden="true">
                {s.no}
              </span>
              <div className="stack gap-8">
                <h2 className="display">{s.title}</h2>
                <p>{s.text}</p>
                <Link to={s.to} className="link-gold link-gold--start link-gold--small">
                  {s.cta}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--tint">
        <div className="container stack gap-40">
          <h2 className="display section-heading__title">Tips agar undangan rapi</h2>
          <div className="grid grid--3">
            {TIPS.map((t) => (
              <article key={t.title} className="feature-card feature-card--plain">
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark cta-band">
        <div className="container stack center gap-20">
          <h2 className="display">Siap mencoba?</h2>
          <div className="row row--center gap-14">
            <Button to="/katalog" variant="light" size="lg">
              Pilih template
            </Button>
            <Button to="/masuk" variant="ghost-light" size="lg">
              Mulai lewat WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
