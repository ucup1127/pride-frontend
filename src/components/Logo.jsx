import { Link } from 'react-router-dom';

export function LeafIcon({ width = 22, height = 30 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 30" aria-hidden="true" className="shrink-0">
      <path d="M7 29 C10 22 11 15 10 7" fill="none" stroke="#A98B5A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 15 C4 14 2 8 3 3 C8 4 11 9 10 15Z" fill="#B08D57" />
      <path d="M10.5 18 C14 16 17 14 19 11 C19 16 16 19 10.5 18Z" fill="#A98B5A" />
    </svg>
  );
}

export default function Logo({ small = false }) {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 md:gap-3 group" // <-- INI KUNCINYA: flex & items-center
      aria-label="Pride – beranda"
    >
      <div className="transition-transform group-hover:-translate-y-1">
        <LeafIcon width={small ? 20 : 26} height={small ? 28 : 36} />
      </div>
      <span 
        className="font-serif text-[#1A1A1A] tracking-tight leading-none"
        style={{ 
          fontSize: small ? '1.5rem' : '2rem', 
          fontWeight: 500,
          marginTop: '2px' // Biar teks pas di tengah-tengah ikon
        }}
      >
        pride
      </span>
    </Link>
  );
}