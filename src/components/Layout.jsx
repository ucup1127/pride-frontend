import Navbar from './Navbar';
import Footer from './Footer';

// Kerangka halaman publik: navbar di atas, footer di bawah.
export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  );
}
