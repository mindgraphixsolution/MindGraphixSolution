import React, { useEffect, useState } from 'react';
import { ChevronDown, Sparkles, Zap, Palette } from 'lucide-react';
import { Button } from './ui/button';

export const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const FloatingIcon = ({ icon: Icon, className, delay }: { icon: any; className: string; delay: string }) => (
    <div className={`absolute ${className} animate-float opacity-20 hidden lg:block`} style={{ animationDelay: delay }}>
      <Icon size={40} className="text-white" />
    </div>
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-white/20 rotate-45 animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-48 right-1/4 w-10 h-10 bg-accent/20 rotate-45 animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Floating icons */}
      <FloatingIcon icon={Sparkles} className="top-32 right-32" delay="0s" />
      <FloatingIcon icon={Zap} className="bottom-40 left-32" delay="1s" />
      <FloatingIcon icon={Palette} className="top-48 left-1/4" delay="2s" />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-accent" />
              Créativité & Innovation Digitale
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Solutions{' '}
              <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
                Créatives
              </span>
              <br />
              pour Votre Présence{' '}
              <span className="relative">
                Digitale
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-accent to-orange-400 rounded-full"></div>
              </span>
            </h1>
            
            <p className={`text-xl text-white/90 mb-8 max-w-2xl leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Nous combinons design captivant et développement robuste pour créer des 
              <span className="text-accent font-semibold"> expériences digitales mémorables</span> qui 
              propulsent votre entreprise vers le succès.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button
                onClick={() => scrollToSection('#portfolio')}
                size="lg"
                className="bg-gradient-to-r from-accent to-orange-400 text-black font-semibold hover:from-orange-400 hover:to-accent transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-6 text-lg"
              >
                Voir nos réalisations
              </Button>
              <Button
                onClick={() => scrollToSection('#contact')}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary transform hover:scale-105 transition-all duration-300 px-8 py-6 text-lg backdrop-blur-sm"
              >
                Discutons de votre projet
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/70 text-sm">Projets Réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">3+</div>
                <div className="text-white/70 text-sm">Années d'Expérience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-white/70 text-sm">Satisfaction Client</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection('#about')}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce-gentle transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronDown size={32} />
      </button>

      {/* Modern gradient border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
