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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled ? 'py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5' : 'py-8 bg-transparent'
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-8 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-black font-black text-xl overflow-hidden relative">
            <span className="relative z-10 group-hover:scale-110 transition-transform duration-500 font-display">M</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col leading-none">
            <div className="text-xl font-black tracking-tight text-white font-display uppercase">Mind Graphix</div>
            <div className="text-[9px] font-medium tracking-[0.3em] uppercase text-[var(--text-muted)] mt-1">Studio</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {[
            { label: 'Accueil', path: '/' },
            { label: 'Services', path: '/services' },
            { label: 'Portfolio', path: '/portfolio' },
            { label: 'À propos', path: '/about' }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--text-muted)] hover:text-white transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:block text-xs font-medium uppercase tracking-[0.1em] text-white hover:text-[var(--accent-color)] transition-colors">
            Login
          </button>
          <button className="btn-architect text-xs uppercase tracking-widest px-6 py-2.5 !rounded-full">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
