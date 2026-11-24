import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PackageGate from '../components/PackageGate';
import { findTemplate } from '../data/templates';

// Contoh musik latar untuk preview. Untuk produksi, ganti URL dengan file audio
// yang telah dilisensikan/dimiliki Pride Studio dan disimpan di /public/music.
const MUSIC = [
  { id: 'piano-1', name: 'Piano Romantis', mood: 'Lembut · Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'classic-2', name: 'Classic Moments', mood: 'Klasik · Elegan', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'warm-3', name: 'Warm Memories', mood: 'Hangat · Akustik', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'celebrate-4', name: 'A Little Celebration', mood: 'Ceria · Modern', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'dream-5', name: 'Dreamy Evening', mood: 'Dreamy · Tenang', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'serene-6', name: 'Serene Garden', mood: 'Natural · Santai', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'modern-7', name: 'Modern Love', mood: 'Modern · Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'golden-8', name: 'Golden Hour', mood: 'Hangat · Cinematic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

export default function EditorTemplate() {
  const [params] = useSearchParams();
  const template = findTemplate(params.get('template'));
  const plan = localStorage.getItem('pride-paid-plan');
  const [form, setForm] = useState({ title: template.names, date: template.date, location: 'Nama lokasi acara', message: 'Dengan penuh kebahagiaan, kami mengundang Anda.' });
  const [color, setColor] = useState(template.bg);
  const [musicId, setMusicId] = useState(MUSIC[0].id);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const music = MUSIC.find((item) => item.id === musicId) || MUSIC[0];

  useEffect(() => {
    setSaved(false);
  }, [form, color, musicId, musicEnabled]);

  if (!plan) return <Layout><PackageGate eyebrow="MULAI DARI PAKET" title="Pilih paket untuk membuka editor." description="Tentukan paketmu dan selesaikan pembayaran sebelum mengatur detail undangan." /></Layout>;

  return <Layout>
    <section className="container page-head editor-page-head">
      <div className="eyebrow">PRIDE STUDIO · EDITOR</div>
      <h1 className="display page-head__title">Buat undangan yang terasa seperti kamu.</h1>
      <p className="lead page-head__text">Template {template.name} · Paket {plan}. Ubah detail, pilih musik, lalu lihat hasilnya secara langsung.</p>
      <div className="editor-top-actions"><Link className="text-link" to="/katalog">← Kembali ke semua template</Link><span className="editor-step-pill">01 Detail <i>—</i> 02 Musik <i>—</i> 03 Preview</span></div>
    </section>
    <section className="container editor-layout editor-layout--polished">
      <form className="editor-form editor-form--polished" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
        <div className="editor-form__intro"><span className="editor-section-icon">✦</span><div><h2 className="display">Personalisasi undangan</h2><p>Informasi ini akan ditampilkan di undanganmu.</p></div></div>
        <label className="field">Nama / judul acara<input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label className="field">Tanggal acara<input className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Contoh: Sabtu, 12 Desember 2026" /></label>
        <label className="field">Lokasi acara<input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
        <label className="field">Pesan undangan<textarea className="input" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
        <div className="field"><label htmlFor="editor-color">Warna utama</label><div className="color-control"><input id="editor-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} /><span>{color.toUpperCase()}</span><button type="button" className="text-link" onClick={() => setColor(template.bg)}>Reset warna</button></div></div>
        <div className="music-library">
          <div className="music-library__heading"><span className="editor-section-icon">♫</span><div><h2 className="display">Musik latar</h2><p>Pilih dan dengarkan musik sebelum digunakan.</p></div></div>
          <label className="music-toggle"><span><strong>Gunakan musik latar</strong><small>Musik pilihan akan menjadi backsound undangan.</small></span><input type="checkbox" checked={musicEnabled} onChange={(e) => setMusicEnabled(e.target.checked)} /></label>
          <div className="music-list">{MUSIC.map((item, index) => <button type="button" key={item.id} className={`music-track${musicId === item.id ? ' is-selected' : ''}`} onClick={() => { setMusicId(item.id); setMusicEnabled(true); }}><span className="music-track__number">{musicId === item.id ? '♫' : String(index + 1).padStart(2, '0')}</span><span className="music-track__text"><strong>{item.name}</strong><small>{item.mood}</small></span><span className="music-track__choose">{musicId === item.id ? 'Dipilih' : 'Pilih'}</span></button>)}</div>
          {musicEnabled && <div className="music-audio"><div><strong>Preview: {music.name}</strong><small>Jika audio tidak berjalan, coba pilih trek lain atau periksa koneksi internet.</small></div><audio key={music.url} controls preload="none" src={music.url}>Browser kamu tidak mendukung audio.</audio></div>}
          <p className="hint">Musik yang ditampilkan merupakan contoh preview audio online. Sebelum website dipublikasikan, gunakan file musik yang lisensinya telah dipastikan.</p>
        </div>
        <button className="btn btn--primary btn--block" type="submit">Simpan pengaturan</button>
        {saved && <p className="save-notice" role="status">Pengaturan tersimpan sementara di halaman ini. Penerbitan undangan permanen memerlukan backend.</p>}
      </form>
      <div className="editor-preview editor-preview--polished"><div className="editor-preview__top"><span><i className="preview-dot"/> LIVE PREVIEW</span><span>Mobile view</span></div><div className="template-cover editor-cover editor-cover--polished" style={{ background: `linear-gradient(145deg, ${color}, ${color}dd)`, color: template.fg }}><span className="cover-ornament cover-ornament--top">✳</span><div className="template-cover__event">{template.event}</div><div className="cover-divider"/><div className="template-cover__names">{form.title}</div><div className="template-cover__date">{form.date}</div><p className="editor-message">{form.message}</p><div className="cover-divider"/><p className="editor-preview__location">⌖ &nbsp;{form.location}</p><span className="cover-ornament cover-ornament--bottom">✳</span></div><div className="editor-preview__footer"><div><strong>{template.name}</strong><span>{template.category} · {template.style}</span></div><span className="preview-status">{musicEnabled ? '♫ Musik aktif' : 'Musik nonaktif'}</span></div><Link className="btn btn--primary btn--block" to={`/undangan?template=${template.id}`}>Buka preview undangan lengkap ↗</Link><p className="hint">Preview ini menampilkan perubahan teks dan warna. Penyimpanan lintas perangkat dan penerbitan link membutuhkan integrasi backend.</p></div>
    </section>
  </Layout>;
}
