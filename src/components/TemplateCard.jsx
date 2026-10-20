import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function TemplateCover({ template, height = "100%", showTag = false }) {
  return (
    <div
      style={{
        position: 'relative',
        background: `linear-gradient(160deg, ${template.bg} 0%, ${template.fg} 130%)`,
        color: '#FFF',
        height,
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {template.img && (
        <img
          src={template.img}
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90" />

      <div className="relative z-10 p-4 md:p-6 text-center">
        <div className="text-[0.6rem] tracking-[0.2em] uppercase text-white/80 mb-1 font-semibold">
          {template.event}
        </div>
        <div className="font-serif text-xl md:text-2xl text-white leading-tight mb-1">
          {template.names}
        </div>
        <div className="text-[0.65rem] md:text-xs tracking-widest text-white/70">
          {template.date}
        </div>
      </div>

      {showTag && template.tag && (
        <span className="absolute top-3 left-3 z-20 bg-white/95 text-[#1A1A1A] px-2 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-wider">
          {template.tag}
        </span>
      )}
    </div>
  );
}

export default function TemplateCard({ template }) {
  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden border border-[#EAEAEA] hover:shadow-2xl hover:border-[#A98B5A]/30 transition-all duration-300">
      <Link 
        to={`/undangan?template=${template.id}`} 
        className="block aspect-[3/4] relative"
      >
        <TemplateCover template={template} showTag />
        
        {/* Overlay Tombol (Muncul pas di-hover) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-30 backdrop-blur-[2px]">
          <Link 
            to={`/undangan?template=${template.id}`}
            className="bg-white text-[#1A1A1A] px-6 py-2.5 rounded-full text-xs font-bold tracking-wide hover:scale-105 transition-transform"
          >
            LIHAT
          </Link>
          <Link 
            to={`/editor?template=${template.id}`}
            className="bg-[#A98B5A] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-wide hover:scale-105 transition-transform"
          >
            PILIH
          </Link>
        </div>
      </Link>
      
      <div className="p-3 text-center border-t border-[#EAEAEA]">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">{template.name}</h3>
        <p className="text-[0.65rem] text-gray-500 uppercase tracking-widest">{template.style}</p>
      </div>
    </article>
  );
}