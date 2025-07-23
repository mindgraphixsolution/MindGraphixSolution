import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Code, Smartphone, Video, ShoppingCart, Search, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { QuoteRequest } from './QuoteRequest';

export const Services: React.FC = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const services = [
    {
      id: 'design',
      icon: Palette,
      title: 'Design Graphique',
      description: 'Création d\'identités visuelles percutantes, logos, supports print et éléments graphiques qui renforcent votre image de marque.',
      gradient: 'from-pink-500 to-purple-600',
      price: 'À partir de 800€',
      features: ['Logo & identité', 'Supports print', 'Charte graphique', 'Déclinaisons'],
      timeline: '2-4 semaines'
    },
    {
      id: 'web-dev',
      icon: Code,
      title: 'Développement Web',
      description: 'Sites web et applications sur mesure, performants et sécurisés, conçus avec les dernières technologies du marché.',
      gradient: 'from-blue-500 to-cyan-600',
      price: 'À partir de 2000€',
      features: ['Design responsive', 'CMS intégré', 'SEO optimisé', 'Sécurité renforcée'],
      timeline: '4-8 semaines'
    },
    {
      id: 'ui-ux',
      icon: Smartphone,
      title: 'UI/UX Design',
      description: 'Interfaces intuitives et expériences utilisateur optimisées pour maximiser l\'engagement et la conversion.',
      gradient: 'from-green-500 to-teal-600',
      price: 'À partir de 1500€',
      features: ['Wireframes', 'Prototypes', 'Tests utilisateurs', 'Design system'],
      timeline: '3-6 semaines'
    },
    {
      id: 'motion',
      icon: Video,
      title: 'Motion Design',
      description: 'Animations et vidéos captivantes pour dynamiser votre communication et renforcer votre storytelling.',
      gradient: 'from-orange-500 to-red-600',
      price: 'À partir de 1200€',
      features: ['Story-board', 'Animation 2D/3D', 'Sound design', 'Formats multiples'],
      timeline: '3-5 semaines'
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Solutions e-commerce complètes pour vendre en ligne avec une expérience client optimisée.',
      gradient: 'from-indigo-500 to-purple-600',
      price: 'À partir de 3500€',
      features: ['Catalogue produits', 'Paiement sécurisé', 'Gestion stock', 'Analytics'],
      timeline: '6-10 semaines'
    },
    {
      id: 'marketing',
      icon: Search,
      title: 'SEO & Marketing',
      description: 'Stratégies digitales pour améliorer votre visibilité en ligne et générer plus de leads qualifiés.',
      gradient: 'from-yellow-500 to-orange-600',
      price: 'À partir de 600€/mois',
      features: ['Audit SEO', 'Stratégie contenu', 'Campagnes pub', 'Reporting'],
      timeline: 'En continu'
    },
  ];

  const handleQuoteRequest = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowQuoteModal(true);
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 relative inline-block">
            Nos Services
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Une gamme complète de solutions digitales sur mesure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Background gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-95 transition-opacity duration-500 rounded-2xl`}></div>

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Header avec icon et prix */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-white/90 transition-colors">
                      {service.price}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-white/70 transition-colors">
                      {service.timeline}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-white/90 transition-colors duration-300 text-sm">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500 group-hover:text-white/80 transition-colors" />
                      <span className="text-sm text-gray-600 group-hover:text-white/80 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleQuoteRequest(service.id)}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white group-hover:bg-white group-hover:text-primary transition-all duration-300"
                  >
                    Demander un devis
                    <ArrowRight size={16} className="ml-2" />
                  </Button>

                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 group-hover:text-white/70 transition-colors">
                    <Star size={12} className="fill-current" />
                    <span>Devis gratuit sous 24h</span>
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-30 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action modernisé */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2 text-accent" />
                Processus optimisé et transparent
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Transformons votre vision en réalité
              </h3>

              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts vous accompagne de A à Z pour créer des solutions digitales
                qui dépassent vos attentes et boostent votre activité.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Analyse gratuite</h4>
                  <p className="text-white/80 text-sm">Étude de vos besoins et conseils personnalisés</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Devis détaillé</h4>
                  <p className="text-white/80 text-sm">Proposition transparente avec timeline claire</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Livraison</h4>
                  <p className="text-white/80 text-sm">Projet finalisé avec support et formation</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleQuoteRequest('')}
                  size="lg"
                  className="bg-accent text-black hover:bg-orange-400 font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                >
                  Obtenir un devis gratuit
                  <ArrowRight size={20} className="ml-2" />
                </Button>

                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300"
                >
                  Discuter du projet
                </Link>
              </div>

              <p className="text-white/70 text-sm mt-6">
                ⚡ Réponse garantie sous 24h • 🎯 Devis personnalisé • 🛡️ Sans engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
