export default function SectionHeading({ eyebrow, title, text, as: Tag = 'h2' }) {
  return (
    <div className="section-heading">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <Tag className="display section-heading__title">{title}</Tag>
      {text && <p className="lead section-heading__text">{text}</p>}
    </div>
  );
}
