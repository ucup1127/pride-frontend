import { Link } from 'react-router-dom';
import Button from './Button';

export function TemplateCover({ template, height = 340, showTag = false }) {
  return (
    <div
      style={{
        position: 'relative',
        background: template.img ? '#EAEAEA' : `linear-gradient(160deg, ${template.bg} 0%, ${template.fg} 130%)`,
        color: '#FFF',
        height,
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Gambar Background */}
      {template.img && (
        <img
          src={template.img}
          alt=""
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

      {/* Overlay Gradient Gelap biar teks kebaca */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)',
        zIndex: 1,
      }} />

      {/* Teks di dalam Gambar */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '24px 20px',
        textAlign: 'center',
        color: '#FFF',
      }}>
        <div style={{
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px',
          fontWeight: 600,
        }}>
          {template.event}
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontSize: '1.8rem',
          fontWeight: 500,
          lineHeight: 1.1,
          color: '#FFF',
          marginBottom: '8px',
        }}>
          {template.names}
        </div>
        <div style={{
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.9)',
        }}>
          {template.date}
        </div>
      </div>

      {/* Tag (Populer, Baru, dll) */}
      {showTag && template.tag && (
        <span style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 3,
          padding: '4px 12px',
          background: 'rgba(255,255,255,0.95)',
          color: '#1A1A1A',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          borderRadius: 100,
        }}>
          {template.tag}
        </span>
      )}
    </div>
  );
}

export default function TemplateCard({ template, actionPath }) {
  return (
    <article style={{
      background: '#FFF',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}
    >
      <Link
        to={`/undangan?template=${template.id}`}
        aria-label={`Lihat contoh template ${template.name}`}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        {/* Ganti tinggi jadi 350px biar proporsional */}
        <TemplateCover template={template} height={350} showTag />
      </Link>
      
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0', color: '#1A1A1A', textAlign: 'center' }}>
          {template.name}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link 
            to={`/undangan?template=${template.id}`} 
            style={{ 
              flex: 1, padding: '8px 12px', borderRadius: '8px', textAlign: 'center', 
              fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', 
              background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB'
            }}
          >
            Lihat
          </Link>
          <Link 
            to={actionPath || `/masuk?template=${template.id}`} 
            style={{ 
              flex: 1, padding: '8px 12px', borderRadius: '8px', textAlign: 'center', 
              fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', 
              background: '#1A1A1A', color: '#FFF', border: '1px solid #1A1A1A'
            }}
          >
            Pilih
          </Link>
        </div>
      </div>
    </article>
  );
}