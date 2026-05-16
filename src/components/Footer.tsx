import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] pt-32 pb-10 relative overflow-hidden border-t border-white/5">
      <div className="bg-noise opacity-[0.02]"></div>
      <div className="mx-auto max-w-[1440px] px-8 md:px-12 relative z-10">
        
        {/* Massive Footer Typography */}
        <div className="mb-24 md:mb-32">
          <h2 className="text-[12vw] leading-[0.8] font-black uppercase font-display text-transparent outline-text opacity-30 select-none">
            Mind Graphix
          </h2>
          <h2 className="text-[12vw] leading-[0.8] font-black uppercase font-display select-none -mt-[4vw]">
            Studio.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 border-t border-white/10 pt-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-black font-black text-xl">M</div>
              <div className="text-xl font-black tracking-tight text-white uppercase font-display">Mind Graphix</div>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light max-w-xs">
              Nous architecturons l'avenir numérique avec une précision chirurgicale et une passion pour l'excellence minimaliste.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-8 uppercase text-[10px] tracking-[0.3em] text-[var(--text-muted)]">Expertise</h4>
            <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-white/80">
              <li><a href="#" className="hover:text-[var(--accent-color)] transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-[var(--accent-color)] transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-[var(--accent-color)] transition-colors">Branding & Identité</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-8 uppercase text-[10px] tracking-[0.3em] text-[var(--text-muted)]">Studio</h4>
            <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-white/80">
              <li><a href="#" className="hover:text-[var(--accent-color)] transition-colors">Notre ADN</a></li>
              <li><a href="#" className="hover:text-[var(--accent-color)] transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-[var(--accent-color)] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-8 uppercase text-[10px] tracking-[0.3em] text-[var(--text-muted)]">Réseaux</h4>
            <div className="flex gap-4">
              {['IG', 'BE', 'DR', 'LI'].map(s => (
                <a key={s} href="#" className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-medium text-white/80 hover:bg-white hover:text-black transition-all duration-300">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-[var(--text-muted)] font-medium tracking-[0.2em] uppercase">
            © 2026 MIND GRAPHIX STUDIO. TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex gap-8 text-[9px] font-medium text-[var(--text-muted)] uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
