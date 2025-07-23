import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';

export default function Index() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="min-h-screen">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
      />
      
      <main>
        <Hero />
        <About />
        <Services />
        
        {/* Placeholder sections pour maintenant */}
        <section id="portfolio" className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 border border-gray-200">
              <h2 className="text-4xl font-bold text-primary mb-6">Portfolio</h2>
              <p className="text-gray-600 mb-8">
                Cette section sera bientôt disponible avec nos dernières réalisations
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🚧 En construction - Contenus à venir
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6 text-center">
            <div className="bg-white rounded-2xl p-16 shadow-lg border border-gray-200">
              <h2 className="text-4xl font-bold text-primary mb-6">Notre Équipe</h2>
              <p className="text-gray-600 mb-8">
                Rencontrez bientôt les talents derrière Mind Graphix Solution
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-accent/10 text-gray-700 rounded-full text-sm font-medium">
                ⭐ Section en préparation
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
                Contactez-nous
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-accent rounded-full"></div>
              </h2>
              <p className="text-white/90 text-lg max-w-3xl mx-auto">
                Prêt à donner vie à votre projet ? Parlons-en !
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Travaillons ensemble</h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Que vous ayez un projet précis en tête ou que vous souhaitiez simplement 
                  discuter des possibilités, nous sommes à votre écoute.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Adresse</h4>
                      <p className="text-white/80">Bobo-Dioulasso, Sect N°4</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Téléphone</h4>
                      <a href="tel:+22601511146" className="text-white/80 hover:text-accent transition-colors">
                        +226 01 51 11 46
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">✉️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <a href="mailto:mindgraphixsolution@gmail.com" className="text-white/80 hover:text-accent transition-colors">
                        mindgraphixsolution@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <form className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Nom complet</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-accent transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Sujet</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-accent transition-colors"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-accent transition-colors resize-none"
                      placeholder="Décrivez votre projet..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-accent text-black font-semibold py-3 rounded-lg hover:bg-orange-400 transform hover:scale-105 transition-all duration-300"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <span className="text-xl font-bold">
                Mind <span className="text-accent">Graphix</span> Solution
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Spécialisée dans le design graphique et le développement web
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">
                © 2025 Mind Graphix Solution. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
