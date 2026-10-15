import { Link } from 'react-router-dom';

// Logo dibuat ulang: daun emas + tulisan "pride". Ganti dengan berkas logo asli bila sudah ada.
export function LeafIcon({ width = 22, height = 30 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 30" aria-hidden="true">
      <path d="M7 29 C10 22 11 15 10 7" fill="none" stroke="#A98B5A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 15 C4 14 2 8 3 3 C8 4 11 9 10 15Z" fill="#B08D57" />
      <path d="M10.5 18 C14 16 17 14 19 11 C19 16 16 19 10.5 18Z" fill="#A98B5A" />
    </svg>
  );
}

export default function Logo({ small = false }) {
  return (
    <Link to="/" className={`logo${small ? ' logo--small' : ''}`} aria-label="Pride – beranda">
      <LeafIcon width={small ? 20 : 22} height={small ? 28 : 30} />
      <span className="logo__text">pride</span>
    </Link>
  );
}
