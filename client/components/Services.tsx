import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Code, Smartphone, Video, ShoppingCart, Search, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { QuoteRequest } from './QuoteRequest';

export const Services: React.FC = () => {
  const services = [
    {
      icon: Palette,
      title: 'Design Graphique',
      description: 'Création d\'identités visuelles percutantes, logos, supports print et éléments graphiques qui renforcent votre image de marque.',
      gradient: 'from-pink-500 to-purple-600',
    },
    {
      icon: Code,
      title: 'Développement Web',
      description: 'Sites web et applications sur mesure, performants et sécurisés, conçus avec les dernières technologies du marché.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Smartphone,
      title: 'UI/UX Design',
      description: 'Interfaces intuitives et expériences utilisateur optimisées pour maximiser l\'engagement et la conversion.',
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: Video,
      title: 'Motion Design',
      description: 'Animations et vidéos captivantes pour dynamiser votre communication et renforcer votre storytelling.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Solutions e-commerce complètes pour vendre en ligne avec une expérience client optimisée.',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Search,
      title: 'SEO & Marketing',
      description: 'Stratégies digitales pour améliorer votre visibilité en ligne et générer plus de leads qualifiés.',
      gradient: 'from-yellow-500 to-orange-600',
    },
  ];

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
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Background gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-95 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-50 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Prêt à donner vie à votre projet ?
            </h3>
            <p className="text-gray-600 mb-6">
              Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé
            </p>
            <Link
              to="/#contact"
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Démarrer un projet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
