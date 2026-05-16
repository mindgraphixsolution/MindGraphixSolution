import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Zap, Shield, Cpu } from 'lucide-react';

const features = [
  {
    title: "UI/UX Architecture",
    description: "Des interfaces pensées pour l'utilisateur, alliant esthétique luxueuse et ergonomie sans faille.",
    span: "md:col-span-2 md:row-span-2",
    icon: <PenTool size={32} strokeWidth={1.5} />,
    bgClass: "bg-gradient-to-br from-[#121212] to-[#1a1a1a]"
  },
  {
    title: "Performance Core",
    description: "Optimisation maximale pour une fluidité sans compromis.",
    span: "md:col-span-1",
    icon: <Zap size={24} strokeWidth={1.5} className="text-[var(--accent-color)]" />,
    bgClass: "bg-[#0f0f0f]"
  },
  {
    title: "Sécurité Avancée",
    description: "Protection de vos données avec les standards les plus élevés.",
    span: "md:col-span-1",
    icon: <Shield size={24} strokeWidth={1.5} />,
    bgClass: "bg-[#0f0f0f]"
  },
  {
    title: "Intelligence IA",
    description: "Intégration d'intelligence artificielle pour des produits plus intelligents, capables d'anticiper les besoins.",
    span: "md:col-span-2",
    icon: <Cpu size={24} strokeWidth={1.5} />,
    bgClass: "bg-gradient-to-br from-[#1a1a1a] to-[#121212]"
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-32 px-6 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10 px-4 md:px-8">
        <div className="text-left max-w-2xl">
          <div className="text-[10px] font-medium uppercase tracking-[0.4em] text-[var(--accent-color)] mb-6 flex items-center gap-4">
            <span className="w-12 h-px bg-[var(--accent-color)]"></span>
            Notre Expertise
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-display leading-[0.9]">
            Concevoir le <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/20">Futur.</span>
          </h2>
        </div>
        <p className="text-[var(--text-muted)] text-lg max-w-sm font-light leading-relaxed">
          Nous couvrons tout le spectre de la création numérique avec une précision chirurgicale et une approche artisanale du code.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 md:px-8 auto-rows-[250px]">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`${f.bgClass} ${f.span} p-10 rounded-[2rem] border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors duration-500 overflow-hidden relative`}
          >
            {/* Hover subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tight font-display">{f.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-light">{f.description}</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
               <div className="h-[1px] w-0 bg-[var(--accent-color)] group-hover:w-12 transition-all duration-500 ease-out"></div>
               <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)] group-hover:text-white transition-colors duration-300 transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">Découvrir</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
