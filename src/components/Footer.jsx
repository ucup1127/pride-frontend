import { CONTACT } from '../config';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">
          pride <span className="footer__tagline">DIGITAL INVITATION</span>
        </span>
        <span>
          Instagram {CONTACT.instagram} · TikTok {CONTACT.tiktok}
        </span>
        <nav className="footer__support" aria-label="Pusat bantuan">
          <Link to="/faq">FAQ</Link>
          <Link to="/bantuan">Bantuan</Link>
        </nav>
        <span>© {new Date().getFullYear()} Pride</span>
      </div>
    </footer>
  );
}
