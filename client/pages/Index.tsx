import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { Portfolio } from '../components/Portfolio';
import { Team } from '../components/Team';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { AdminPanel } from '../components/AdminPanel';

import { AdminNotifications } from '../components/AdminNotifications';
import { AdminViewSwitcher } from '../components/AdminViewSwitcher';
import { AdminUserGuide } from '../components/AdminUserGuide';

export default function Index() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();

  // Gérer le scroll vers les sections quand on arrive avec une ancre
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Petit délai pour s'assurer que le DOM est rendu
    }
  }, [location.hash]);

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
        <Portfolio />
        <Team />

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

      <Footer />

      {/* Auth Modals */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        defaultMode="login"
      />

      <AuthModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        defaultMode="register"
      />

      <AdminViewSwitcher />
      <AdminPanel />
      <AdminUserGuide />
      <AdminNotifications />
    </div>
  );
}
