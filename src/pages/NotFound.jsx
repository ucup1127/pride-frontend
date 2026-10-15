import Layout from '../components/Layout';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <Layout>
      <section className="container empty empty--page">
        <div className="eyebrow">404</div>
        <h1 className="display">Halaman tidak ditemukan</h1>
        <p className="lead">Tautan yang kamu buka tidak ada atau sudah dipindahkan.</p>
        <Button to="/" variant="primary">
          Kembali ke Home
        </Button>
      </section>
    </Layout>
  );
}
