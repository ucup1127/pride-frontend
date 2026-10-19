import { CONTACT } from '../config';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/70 py-16 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl text-white tracking-wide">pride</span>
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#A98B5A] mt-1">Digital Invitation</span>
        </div>
        
        <div className="flex gap-6">
          <a href={CONTACT.instagram} className="hover:text-white transition-colors">Instagram</a>
          <a href={CONTACT.tiktok} className="hover:text-white transition-colors">TikTok</a>
        </div>
        
        <span>© {new Date().getFullYear()} Pride Studio. All rights reserved.</span>
      </div>
    </footer>
  );
}