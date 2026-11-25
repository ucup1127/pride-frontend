import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import { formatPackagePrice, getPackage, PACKAGES } from '../data/packages';

export default function Paket() {
  const [params, setParams] = useSearchParams();
  const { session } = useAuth();
  const initialPackage = getPackage(params.get('paket') || localStorage.getItem('pride-plan')) || PACKAGES[0];
  const [chosen, setChosen] = useState(initialPackage.id);
  const selectedPackage = getPackage(chosen) || PACKAGES[0];
  const checkoutPath = session
    ? `/checkout?paket=${selectedPackage.id}`
    : `/masuk?paket=${selectedPackage.id}`;

  const selectPackage = (id) => {
    setChosen(id);
    localStorage.setItem('pride-plan', id);
    const next = new URLSearchParams(params);
    next.set('paket', id);
    setParams(next, { replace: true });
  };

  return (
    <Layout>
      <section className="container page-head">
        <div className="eyebrow">PAKET PRIDE</div>
        <h1 className="display page-head__title">Pilih paket untuk undanganmu.</h1>
        <p className="lead page-head__text">
          Klik kartu paket yang kamu inginkan. Pembayaran dilakukan sebelum membuat undangan.
        </p>
      </section>

      <fieldset className="container plan-grid">
        <legend className="sr-only">Pilih paket Pride</legend>
        {PACKAGES.map((plan) => (
          <label
            className={`plan-card${chosen === plan.id ? ' plan-card--selected' : ''}${plan.featured ? ' plan-card--popular' : ''}`}
            key={plan.id}
          >
            <input
              className="plan-card__radio"
              type="radio"
              name="package"
              value={plan.id}
              checked={chosen === plan.id}
              onChange={() => selectPackage(plan.id)}
            />
            {plan.featured && <span className="plan-ribbon">Pilihan populer</span>}
            <span className="eyebrow">PAKET {plan.name.toUpperCase()}</span>
            <span className="display plan-card__title">{plan.name}</span>
            <span className="plan-card__description">{plan.description}</span>
            <span className="plan-price">
              {formatPackagePrice(plan.price)}
              <small> / paket</small>
            </span>
            <ul>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <span className="plan-card__selection" aria-hidden="true">
              {chosen === plan.id ? 'Paket dipilih' : 'Klik untuk memilih'}
            </span>
          </label>
        ))}
      </fieldset>

      <section className="container checkout-strip">
        <div>
          <h2 className="display">Lanjut ke pembayaran</h2>
          <p>
            Paket terpilih: <strong>{selectedPackage.name}</strong> · {formatPackagePrice(selectedPackage.price)}.
            {' '}Admin akan memverifikasi transfer sebelum paket diaktifkan.
          </p>
        </div>
        <Link className="btn btn--primary" to={checkoutPath}>
          Lanjut pembayaran <span aria-hidden="true">→</span>
        </Link>
      </section>
    </Layout>
  );
}
