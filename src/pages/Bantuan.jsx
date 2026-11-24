import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CONTACT, instagramChatLink } from '../config';

const CONTACT_OPTIONS = [
  {
    title: 'Instagram',
    detail: `Kirim pesan ke ${CONTACT.instagram}`,
    href: instagramChatLink,
    action: 'Buka Instagram',
    icon: 'ig',
  },
  {
    title: 'WhatsApp',
    detail: 'Hubungi tim Pride untuk bantuan langsung.',
    href: `https://wa.me/${CONTACT.whatsapp}`,
    action: 'Buka WhatsApp',
    icon: 'wa',
  },
  {
    title: 'Email',
    detail: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    action: 'Kirim email',
    icon: '@',
  },
];

export default function Bantuan() {
  return (
    <Layout>
      <section className="container help-page">
        <header className="help-page__intro">
          <div className="eyebrow">PUSAT BANTUAN</div>
          <h1 className="display">Kami siap bantu.</h1>
          <p>
            Ada kendala masuk, pertanyaan tentang paket, atau butuh bantuan mengatur undangan?
            Pilih cara menghubungi tim Pride yang paling nyaman.
          </p>
        </header>

        <div className="help-page__cards">
          {CONTACT_OPTIONS.map((option) => (
            <a
              className="help-card"
              href={option.href}
              key={option.title}
              target={option.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={option.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              <span className="help-card__icon" aria-hidden="true">{option.icon}</span>
              <span className="help-card__body">
                <strong>{option.title}</strong>
                <span>{option.detail}</span>
                <span className="help-card__action">{option.action} <span aria-hidden="true">↗</span></span>
              </span>
            </a>
          ))}
        </div>

        <aside className="help-page__faq">
          <div>
            <span className="eyebrow">JAWABAN CEPAT</span>
            <h2 className="display">Mungkin jawabannya sudah ada di FAQ.</h2>
          </div>
          <Link className="btn btn--primary" to="/faq">Buka FAQ</Link>
        </aside>
      </section>
    </Layout>
  );
}
