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
      {/* HEADER KATALOG */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 30px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', color: '#A98B5A', marginBottom: 12 }}>
          KATALOG
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 500, color: '#1A1A1A', margin: '0 0 16px 0', lineHeight: 1.1 }}>
          Temukan template yang paling cocok untukmu
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#666', maxWidth: 600, lineHeight: 1.6 }}>
          Semua template bisa diubah warna, font, foto, dan teksnya. Klik kartu untuk melihat pratinjau.
        </p>
      </section>

      {/* FILTER BAR */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
          {/* Tombol Kategori */}
          {CATEGORIES.map((c) => {
            const isActive = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => update('kategori', c)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #1A1A1A' : '1px solid #E5E7EB',
                  background: isActive ? '#1A1A1A' : '#FFF',
                  color: isActive ? '#FFF' : '#374151',
                  transition: 'all 0.2s ease',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="search"
            placeholder="Cari nama template atau gaya..."
            value={query}
            onChange={(e) => update('cari', e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '12px 20px',
              borderRadius: '100px',
              border: '1px solid #E5E7EB',
              fontSize: '0.95rem',
              outline: 'none',
              background: '#FAFAFA',
            }}
          />
        </div>
      </section>

      {/* GRID TEMPLATE */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        {visible.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '30px',
          }}>
            {visible.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Template tidak ditemukan</h2>
            <p style={{ color: '#666' }}>Coba kata kunci lain atau pilih jenis acara yang berbeda.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}