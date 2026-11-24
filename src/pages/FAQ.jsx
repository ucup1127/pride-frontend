import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FAQS } from '../data/content';

export default function FAQ() {
  return (
    <Layout>
      <section className="container faq-page">
        <header className="faq-page__intro">
          <div className="eyebrow">PUSAT BANTUAN</div>
          <h1 className="display">Pertanyaan yang sering ditanyakan.</h1>
          <p>Temukan jawaban seputar cara memilih paket, membuat undangan, dan membagikannya.</p>
        </header>

        <div className="faq-page__list">
          {FAQS.map((item, index) => (
            <details className="faq-page__item" key={item.q}>
              <summary>
                <span className="faq-page__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-page__question">{item.q}</span>
                <span className="faq-page__toggle" aria-hidden="true" />
              </summary>
              <div className="faq-page__answer">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>

        <aside className="faq-page__contact">
          <div>
            <h2 className="display">Masih ada yang ingin ditanyakan?</h2>
            <p>Tim Pride siap membantu menjawab pertanyaanmu.</p>
          </div>
          <Link className="btn btn--primary" to="/bantuan">
            Hubungi Pride
          </Link>
        </aside>
      </section>
    </Layout>
  );
}
