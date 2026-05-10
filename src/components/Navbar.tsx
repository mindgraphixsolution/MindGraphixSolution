import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 glass border-b' : 'py-8 bg-transparent'
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 bg-gradient-to-br from-[var(--accent-color)] to-[var(--primary-color)] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">M</div>
          <div className="flex flex-col leading-none">
            <div className="text-xl font-black tracking-tighter text-[var(--text-main)]">MIND GRAPHIX</div>
            <div className="text-[8px] font-bold tracking-[0.4em] uppercase text-[var(--accent-color)]">Architects</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-12">
          {[
            { label: 'Accueil', path: '/' },
            { label: 'Services', path: '/services' },
            { label: 'Portfolio', path: '/portfolio' },
            { label: 'À propos', path: '/about' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[var(--accent-color)] transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:block text-[11px] font-black uppercase tracking-[0.25em] text-[var(--text-main)] hover:text-[var(--accent-color)] transition-colors">
            Login
          </button>
          <button className="btn-architect text-[10px] uppercase tracking-widest px-8 py-3">
            Contact Us
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
