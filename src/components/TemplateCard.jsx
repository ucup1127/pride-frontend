import { Link } from 'react-router-dom';
import Button from './Button';

// Sampul kecil template. Dipakai di katalog dan di bagian "Template pilihan".
export function TemplateCover({ template, height = 340, showTag = false }) {
  return (
    <div
      className="template-cover"
      style={{ background: template.bg, color: template.fg, height }}
    >
      <div className="template-cover__event">{template.event}</div>
      <div className="template-cover__names">{template.names}</div>
      <div className="template-cover__date">{template.date}</div>
      {showTag && <span className="template-cover__tag">{template.tag}</span>}
    </div>
  );
}

export default function TemplateCard({ template }) {
  return (
    <article className="template-card">
      <Link to={`/undangan?template=${template.id}`} aria-label={`Pratinjau template ${template.name}`}>
        <TemplateCover template={template} showTag />
      </Link>
      <div className="template-card__meta">
        <h3>{template.name}</h3>
        <span>{template.style}</span>
      </div>
      <div className="template-card__actions">
        <Button to={`/undangan?template=${template.id}`} size="sm" block>
          Pratinjau
        </Button>
        <Button to={`/masuk?template=${template.id}`} variant="primary" size="sm" block>
          Beli
        </Button>
      </div>
    </article>
  );
}
