import { CONTACT } from '../config';

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
        <span>© {new Date().getFullYear()} Pride</span>
      </div>
    </footer>
  );
}
