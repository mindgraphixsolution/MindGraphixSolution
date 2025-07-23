import React from 'react';
import { Lightbulb, Code, TrendingUp, Headphones } from 'lucide-react';
import { EditableText } from './EditableText';

export const About: React.FC = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'Design Innovant',
      description: 'Des concepts uniques qui captivent votre audience',
    },
    {
      icon: Code,
      title: 'Développement Solide',
      description: 'Des solutions techniques robustes et évolutives',
    },
    {
      icon: TrendingUp,
      title: 'Stratégie Digitale',
      description: 'Une approche orientée résultats pour votre business',
    },
    {
      icon: Headphones,
      title: 'Support Premium',
      description: 'Un accompagnement personnalisé à chaque étape',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <EditableText
            contentKey="about.title"
            defaultValue="À Propos de Nous"
            as="h2"
            className="text-4xl md:text-5xl font-bold text-primary mb-6 relative inline-block"
          />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-accent rounded-full"></div>
          <EditableText
            contentKey="about.subtitle"
            defaultValue="Découvrez l'esprit innovant derrière Mind Graphix Solution"
            as="p"
            className="text-gray-600 text-lg max-w-3xl mx-auto"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl transform group-hover:-translate-y-2 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Notre équipe"
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg animate-float">
              <span className="text-2xl font-bold text-black">3+</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">
                Créativité & Technologie au Service de Votre Succès
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Mind Graphix Solution est spécialisée dans la{' '}
                  <span className="text-primary font-semibold">création graphique</span> et le{' '}
                  <span className="text-primary font-semibold">développement web</span> sur mesure. 
                  Notre mission est de transformer vos idées en solutions digitales impactantes.
                </p>
                <p>
                  Nous croyons en une approche holistique qui combine esthétique, fonctionnalité 
                  et expérience utilisateur pour créer des produits qui non seulement impressionnent 
                  visuellement mais qui délivrent également des{' '}
                  <span className="text-accent font-semibold">résultats concrets</span>.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
