import { Link } from 'react-router-dom';
import Button from './Button';

export function TemplateCover({ template, height = 340, showTag = false }) {
  return (
    <div
      className="template-cover"
      style={{
        position: 'relative',
        background: `linear-gradient(160deg, ${template.bg} 0%, ${template.fg} 130%)`,
        color: '#FFF',
        height,
        overflow: 'hidden',
      }}
    >
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

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.80) 100%)',
        zIndex: 1,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
        padding: '20px 18px',
        textAlign: 'center',
        color: '#FFF',
      }}>
        <div style={{
          fontSize: '0.55rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '8px',
        }}>
          {template.event}
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontSize: '1.5rem',
          fontWeight: 500,
          lineHeight: 1.1,
          color: '#FFF',
          marginBottom: '6px',
        }}>
          {template.names}
        </div>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.85)',
        }}>
          {template.date}
        </div>
      </div>

      {showTag && (
        <span style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 3,
          padding: '4px 10px',
          background: 'rgba(255,255,255,0.95)',
          color: '#1A1A1A',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.06em',
          borderRadius: 100,
        }}>
          {template.tag}
        </span>
      )}
    </div>
  );
}

export default function TemplateCard({ template }) {
  return (
    <article className="template-card">
      <Link
        to={`/undangan?template=${template.id}`}
        className="template-card__preview"
        aria-label={`Lihat contoh template ${template.name}`}
      >
        <div className="phone-mockup">
          <div className="phone-mockup__notch" aria-hidden="true" />
          <div className="phone-mockup__screen">
            <TemplateCover template={template} height="100%" showTag />
          </div>
        </div>
      </Link>
      <h3 className="template-card__name">{template.name}</h3>
      <div className="template-card__actions">
        <Button to={`/undangan?template=${template.id}`} size="sm" block>
          Lihat contoh
        </Button>
        <Button to={`/editor?template=${template.id}`} variant="primary" size="sm" block>
          Pilih & edit
        </Button>
      </div>
    </article>
  );
}