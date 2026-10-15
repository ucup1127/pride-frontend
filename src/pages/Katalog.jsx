import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TemplateCard from '../components/TemplateCard';
import { CATEGORIES, TEMPLATES } from '../data/templates';

export default function Katalog() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('kategori');
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : 'Semua';
  const query = params.get('cari') || '';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && !(key === 'kategori' && value === 'Semua')) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (t) =>
        (category === 'Semua' || t.category === category) &&
        (!q || t.name.toLowerCase().includes(q) || t.style.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <Layout>
      <section className="container page-head">
        <div className="eyebrow">Katalog</div>
        <h1 className="display page-head__title">Temukan template yang paling cocok untukmu</h1>
        <p className="lead page-head__text">
          Semua template bisa diubah warna, font, foto, dan teksnya. Klik kartu untuk melihat
          pratinjau.
        </p>
      </section>

      <section className="container filter-bar">
        <div className="filter-bar__chips" role="group" aria-label="Filter jenis acara">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${c === category ? ' is-active' : ''}`}
              aria-pressed={c === category}
              onClick={() => update('kategori', c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-bar__search">
          <label htmlFor="cari">Cari</label>
          <input
            id="cari"
            type="search"
            className="input input--pill"
            placeholder="Nama template"
            value={query}
            onChange={(e) => update('cari', e.target.value)}
          />
        </div>
      </section>

      <section className="container catalog">
        {visible.length > 0 ? (
          <div className="grid grid--4 grid--tall">
            {visible.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="display">Template tidak ditemukan</p>
            <p className="hint">Coba kata kunci lain atau pilih jenis acara yang berbeda.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
