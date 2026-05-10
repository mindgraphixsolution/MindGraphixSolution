import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { NeuralBackground } from '../NeuralBackground';
import { Magnetic } from '../Magnetic';

const AboutHero = ({ t }: { t: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

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
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-color)]"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    {t('about.hero_badge')}
                  </span>
                </div>
              </motion.div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[var(--text-main)] mb-10 leading-[0.75] tracking-tighter uppercase">
                À PROPOS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] via-[var(--text-main)] to-[var(--text-secondary)]">MIND GRAPHIX</span>
              </h1>

              <div className="text-xl md:text-2xl lg:text-3xl text-[var(--text-muted)] max-w-2xl mx-auto lg:mx-0 mb-16 leading-relaxed font-light space-y-2">      
                <p>{t('about.hero_subtitle1')}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                <Magnetic strength={30}>
                  <button className="btn-architect text-xl py-5 px-12 flex items-center justify-center gap-4 group">
                    {t('about.hero_cta')} <ArrowDown size={22} className="group-hover:translate-y-2 transition-transform" />
                  </button>
                </Magnetic>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <main className="bg-[var(--bg-primary)] overflow-hidden">
      <AboutHero t={t} />
      <section className="py-24 px-6 max-w-[1440px] mx-auto text-center">
         <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">{t('about.adn_title')}</h2>
         <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto font-light leading-relaxed">{t('about.adn_description')}</p>
      </section>
    </main>
  );
};

export default About;
