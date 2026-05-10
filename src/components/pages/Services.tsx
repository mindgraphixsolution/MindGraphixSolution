import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { NeuralBackground } from '../NeuralBackground';
import { Magnetic } from '../Magnetic';
import { SERVICES } from '../../lib/constants';

const ServicesHero = ({ t }: { t: any }) => {
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
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Solutions Digitales</span>
                </div>
              </motion.div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[var(--text-main)] mb-10 leading-[0.75] tracking-tighter uppercase">
                NOS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] via-[var(--text-main)] to-[var(--text-secondary)]">SERVICES.</span>
              </h1>

              <div className="text-xl md:text-2xl lg:text-3xl text-[var(--text-main)] max-w-2xl mx-auto lg:mx-0 mb-16 leading-relaxed font-light">
                <p>{t('services.subtitle')}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                <Magnetic strength={30}>
                  <button onClick={() => document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth' })} className="btn-architect text-xl py-5 px-12 flex items-center justify-center gap-4 group">
                    Explorer <ArrowDown size={22} className="group-hover:translate-y-2 transition-transform" />
                  </button>
                </Magnetic>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-[var(--bg-primary)]">
      <ServicesHero t={t} />
      <section id="services-list" className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-12 rounded-[2.5rem] border border-[var(--border-color)] group hover:border-[var(--accent-color)] transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-8 shadow-xl`}>
                {service.icon && <service.icon size={32} />}
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-[var(--text-muted)] text-lg mb-8 font-medium">{service.description}</p>
              <div className="space-y-3 mb-10">
                {service.features?.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-bold text-[var(--text-main)]/70">
                    <Check size={16} className="text-[var(--accent-color)]" /> {f}
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-[var(--border-color)] flex justify-between items-center">
                <div className="text-xl font-black text-[var(--text-main)]">{service.pricing}</div>
                <div className="text-sm font-bold text-[var(--text-muted)]">{service.duration}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
