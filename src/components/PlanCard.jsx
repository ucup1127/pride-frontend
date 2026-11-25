import Button from './Button';

export default function PlanCard({ plan }) {
  return (
    <article className={`plan-card${plan.featured ? ' plan-card--featured' : ''}`}>
      <div>
        <div className="plan-card__name">{plan.name}</div>
        <div className="plan-card__price">{new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(plan.price)}</div>
      </div>
      <ul className="plan-card__items">
        {plan.features.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button
        to={`/paket?paket=${plan.id}`}
        variant={plan.featured ? 'light' : 'outline'}
        block
      >
        Lihat paket
      </Button>
    </article>
  );
}
