import { Link } from 'react-router-dom';
import Button from './Button';

export function TemplateCover({ template, height = 340, showTag = false }) {
  const design = template.design || 'editorial';

  return (
    <div
      className={`template-cover template-cover--preview template-cover--${design}`}
      style={{
        '--template-bg': template.bg,
        '--template-fg': template.fg,
        height,
      }}
    >
      {template.img && (
        <img
          className="template-cover__image"
          src={template.img}
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      <div className="template-cover__overlay" />
      <span className="template-cover__ornament" aria-hidden="true">✦</span>

      <div className="template-cover__content">
        <div className="template-cover__event">
          {template.event}
        </div>
        <div className="template-cover__names">
          {template.names}
        </div>
        <div className="template-cover__date">
          {template.date}
        </div>
      </div>

      {showTag && (
        <span className="template-cover__tag">
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