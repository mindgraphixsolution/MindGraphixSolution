import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { NeuralBackground } from './NeuralBackground';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const yParallax = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section ref={containerRef} id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-transparent">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-noise"></div>
        <NeuralBackground />
        {/* Soft elegant glow instead of intense pulse */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent-glow)] rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-8 md:px-12 relative z-10 pt-10">
        <motion.div 
          style={{ opacity: opacityHero, y: yParallax }} 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col h-full justify-center"
        >
          {/* Status Badge */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-color)]"></span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">Disponible pour nouveaux projets</span>
            </div>
          </motion.div>

          {/* Massive Typography */}
          <div className="max-w-[1200px]">
            <motion.h1 variants={fadeInUp} className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase font-display">
              Digital
            </motion.h1>
            <motion.h1 variants={fadeInUp} className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase font-display flex flex-wrap items-center gap-4 md:gap-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 outline-text-hover transition-all duration-500">Excellence</span>
            </motion.h1>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-end">
            <motion.div variants={fadeInUp} className="md:col-span-5">
              <p className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed font-light max-w-md">
                Nous fusionnons design de haute précision et technologie de pointe pour concevoir les expériences numériques de demain.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="md:col-span-7 flex flex-col sm:flex-row items-center sm:justify-end gap-6 w-full">
              <Magnetic strength={30}>
                <button className="w-full sm:w-auto btn-architect text-sm py-4 px-10 flex items-center justify-center gap-3">
                  Découvrir l'Agence <ArrowUpRight size={18} />
                </button>
              </Magnetic>
              <Magnetic strength={15}>
                <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-all text-sm uppercase tracking-wider">
                  Voir nos travaux
                </button>
              </Magnetic>
            </motion.div>
          </div>

          {/* Abstract geometric element */}
          <motion.div 
            variants={fadeInUp}
            className="absolute right-8 md:right-12 top-1/4 hidden lg:flex flex-col items-end gap-2 opacity-30 pointer-events-none"
          >
            <div className="w-32 h-[1px] bg-white"></div>
            <div className="w-24 h-[1px] bg-white"></div>
            <div className="w-16 h-[1px] bg-[var(--accent-color)]"></div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
