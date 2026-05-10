import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { NeuralBackground } from '../NeuralBackground';
import { Magnetic } from '../Magnetic';
import { PORTFOLIO_ITEMS } from '../../lib/constants';

const PortfolioHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0 z-0">
         <div className="bg-noise opacity-20"></div>
         <NeuralBackground />
         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent-glow)] opacity-[0.2] rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
           <motion.div style={{ opacity: opacityHero, y: yParallax }} className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-[var(--border-color)] shadow-2xl">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Vitrined'Excellence</span>
                </div>
              </motion.div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[var(--text-main)] mb-10 leading-[0.75] tracking-tighter uppercase">
                NOTRE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] via-[var(--text-main)] to-[var(--text-secondary)]">PORTFOLIO.</span>
              </h1>

              <div className="text-xl md:text-2xl lg:text-3xl text-[var(--text-main)] max-w-2xl mx-auto lg:mx-0 mb-16 leading-relaxed font-light">
                <p>Découvrez nos réalisations les plus marquantes.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                <Magnetic strength={30}>
                  <button onClick={() => document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' })} className="btn-architect text-xl py-5 px-12 flex items-center justify-center gap-4 group">
                    Explorer les Travaux <ArrowDown size={22} className="group-hover:translate-y-2 transition-transform" />
                  </button>
                </Magnetic>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

const Portfolio: React.FC = () => {
  return (
    <div className="bg-[var(--bg-primary)]">
      <PortfolioHero />
      <section id="portfolio-grid" className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[2.5rem] border border-[var(--border-color)] overflow-hidden group hover:border-[var(--accent-color)] transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={item.image} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-10">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)] mb-4">{item.category}</div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6 font-medium">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-[10px] font-bold text-[var(--text-muted)] uppercase">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
