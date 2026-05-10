import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { NeuralBackground } from './NeuralBackground';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const yParallax = useTransform(scrollY, [0, 1000], [0, 100]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <section ref={containerRef} id="home" className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="absolute inset-0 z-0">
         <div className="bg-noise opacity-20"></div>
         <NeuralBackground />
         <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[var(--accent-glow)] opacity-[0.1] rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
           <motion.div style={{ opacity: opacityHero, y: yParallax }} className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--border-color)] shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Disponible pour nouveaux projets</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[var(--text-main)] mb-6 lg:mb-8 leading-[0.9] tracking-tighter uppercase">
                  Architecturer <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] via-[var(--text-main)] to-[var(--text-secondary)] animate-gradient-xy">L'EXCELLENCE.</span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                  Nous fusionnons design de haute précision et technologie de pointe pour créer les produits numériques de demain.
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Magnetic strength={40}>
                  <button className="w-full sm:w-auto btn-architect text-lg py-4 px-10 flex items-center justify-center gap-3 shadow-2xl shadow-[var(--accent-color)]/20">
                    Démarrer un projet <ArrowRight size={18} />
                  </button>
                </Magnetic>
                <Magnetic strength={20}>
                  <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-10 py-4 rounded-xl border border-[var(--border-color)] text-[var(--text-main)] font-semibold glass hover:bg-[var(--bg-accent)] transition-all">
                    Voir le Portfolio
                  </button>
                </Magnetic>
              </div>

              <div className="mt-12 lg:mt-16 flex justify-center lg:justify-start items-center gap-8 border-t border-[var(--border-color)] pt-8">
                 <div className="group">
                    <div className="text-3xl font-black text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors">100+</div>
                    <div className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Projets Livrés</div>
                 </div>
                 <div className="w-px h-10 bg-[var(--border-color)]"></div>
                 <div className="group">
                    <div className="text-3xl font-black text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors">99%</div>
                    <div className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">Satisfaction Client</div>
                 </div>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0 min-h-[300px] sm:min-h-[400px]">
              <div className="relative w-full perspective-1000 flex items-center justify-center lg:justify-end">
                 <motion.div
                   animate={{ y: [0, -15, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="relative w-full sm:w-[90%] lg:w-[110%] aspect-video rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-2xl z-10 bg-[var(--bg-secondary)] group"
                 >
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center overflow-hidden">
                       <div className="text-white/10 text-9xl font-black rotate-12">MGS</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/40 to-transparent"></div>
                 </motion.div>

                 <motion.div
                   animate={{ y: [0, 20, 0] }}
                   transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute -bottom-6 lg:bottom-10 -left-2 lg:-left-20 w-[240px] lg:w-72 glass border border-[var(--border-color)] p-4 lg:p-6 rounded-2xl shadow-2xl z-20 backdrop-blur-xl hidden sm:block"
                 >
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[#7c4dff] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-color)]/30"><Zap size={20} fill="currentColor"/></div>
                       <div>
                         <div className="text-sm font-bold text-[var(--text-main)]">Performance Core</div>
                         <div className="text-xs text-[var(--text-muted)]">Optimisation Maximale</div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="h-2 w-full bg-[var(--bg-accent)] rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-gradient-to-r from-[var(--accent-color)] to-[#7c4dff]"></motion.div>
                       </div>
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)]">
                         <span>Score</span>
                         <span className="text-[var(--accent-color)]">99/100</span>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px overflow-visible">
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-4xl h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-30 shadow-[0_0_20px_var(--accent-color)]"></div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-24 h-2 glass rounded-full border border-[var(--border-color)] opacity-50"></div>
      </div>
    </section>
  );
};

export default Hero;
