import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "UI/UX Architecture",
    description: "Des interfaces pensées pour l'utilisateur, alliant esthétique et ergonomie.",
    span: "md:col-span-2",
    icon: "🎨"
  },
  {
    title: "Performance Core",
    description: "Optimisation maximale pour une fluidité sans compromis.",
    span: "md:col-span-1",
    icon: "⚡"
  },
  {
    title: "Sécurité Avancée",
    description: "Protection de vos données avec les standards les plus élevés.",
    span: "md:col-span-1",
    icon: "🛡️"
  },
  {
    title: "Intelligence IA",
    description: "Intégration d'intelligence artificielle pour des produits plus intelligents.",
    span: "md:col-span-2",
    icon: "🤖"
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto relative overflow-hidden">
      <div className="text-left mb-20 px-6">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-color)] mb-4">Notre Expertise</div>
        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
          Concevoir le <span className="outline-text text-transparent">Futur.</span>
        </h2>
        <p className="text-[var(--text-muted)] text-lg max-w-xl font-medium">Nous couvrons tout le spectre de la création numérique avec une précision chirurgicale.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass ${f.span} p-12 rounded-[2rem] border border-[var(--border-color)] flex flex-col justify-between group hover:shadow-2xl transition-all duration-500`}
          >
            <div>
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block duration-500">{f.icon}</div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{f.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">{f.description}</p>
            </div>
            <div className="mt-12 flex items-center gap-4">
               <div className="h-px flex-1 bg-[var(--border-color)] group-hover:bg-[var(--accent-color)] transition-colors"></div>
               <div className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity">En savoir plus</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
