import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-20 relative overflow-hidden">
      <div className="bg-noise opacity-10"></div>
      <div className="mx-auto max-w-[1440px] px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-8 bg-gradient-to-br from-[var(--accent-color)] to-[var(--primary-color)] rounded-lg flex items-center justify-center text-white font-black text-lg">M</div>
              <div className="text-xl font-black tracking-tighter text-[var(--text-main)] uppercase">MIND GRAPHIX</div>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              Nous architecturons l'avenir numérique avec une précision chirurgicale et une passion pour l'excellence.
            </p>
          </div>
          
          <div>
            <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-[var(--accent-color)]">Expertise</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
              <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Branding</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-[var(--accent-color)]">Studio</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
              <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Notre ADN</a></li>
              <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-[var(--text-main)] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-8 uppercase text-[10px] tracking-[0.4em] text-[var(--accent-color)]">Réseaux</h4>
            <div className="flex gap-4">
              {['IG', 'BE', 'DR', 'TW'].map(s => (
                <a key={s} href="#" className="h-10 w-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[10px] font-black text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--text-main)] transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-[var(--text-muted)] font-black tracking-[0.3em] uppercase opacity-60">
            © 2026 MIND GRAPHIX SOLUTION. TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
