import Button from './Button';

export default function PlanCard({ plan }) {
  return (
    <article className={`plan-card${plan.featured ? ' plan-card--featured' : ''}`}>
      <div>
        <div className="plan-card__name">{plan.name}</div>
        <div className="plan-card__price">{plan.price}</div>
      </div>
      <ul className="plan-card__items">
        {plan.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button
        to={`/masuk?paket=${plan.name}`}
        variant={plan.featured ? 'light' : 'outline'}
        block
      >
        Pilih paket &amp; masuk via WhatsApp
      </Button>
    </article>
  );
}
