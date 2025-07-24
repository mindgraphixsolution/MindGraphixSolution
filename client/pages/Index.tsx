import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Portfolio } from "../components/Portfolio";
import { Team } from "../components/Team";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";
import { AdminPanel } from "../components/AdminPanel";

import { AdminNotifications } from "../components/AdminNotifications";
import { AdminViewSwitcher } from "../components/AdminViewSwitcher";
import { SuperAdminPanel } from "../components/SuperAdminPanel";
import { CustomStylesEditor } from "../components/CustomStylesEditor";
import { ThemeManager } from "../components/ThemeManager";
import { ContentManager } from "../components/ContentManager";
import { LayoutEditor } from "../components/LayoutEditor";
import { PriceManager } from "../components/PriceManager";
import { AdminManager } from "../components/AdminManager";
import { SafeAdminWrapper } from "../components/SafeAdminWrapper";
import { SupremeSecurityPanel } from "../components/SupremeSecurityPanel";
import { ImageManager } from "../components/ImageManager";
import { ContactForm } from "../components/ContactForm";
import { LiveChat } from "../components/LiveChat";

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
          element.scrollIntoView({ behavior: "smooth" });
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

        <section
          id="contact"
          className="py-20 bg-gradient-to-br from-primary to-secondary text-white"
        >
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
                <h3 className="text-2xl font-bold mb-6">
                  Travaillons ensemble
                </h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Que vous ayez un projet précis en tête ou que vous souhaitiez
                  simplement discuter des possibilités, nous sommes à votre
                  écoute.
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
                      <h4 className="font-semibold mb-1">T��léphone</h4>
                      <a
                        href="tel:+22601511146"
                        className="text-white/80 hover:text-accent transition-colors"
                      >
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
                      <a
                        href="mailto:mindgraphixsolution@gmail.com"
                        className="text-white/80 hover:text-accent transition-colors"
                      >
                        mindgraphixsolution@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <ContactForm
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
              />
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

      <SafeAdminWrapper>
        <AdminViewSwitcher />
        <AdminPanel />
        <AdminNotifications />
        <SuperAdminPanel />
        <CustomStylesEditor />
        <ThemeManager />
        <ContentManager />
        <LayoutEditor />
        <PriceManager />
        <AdminManager />
        <SupremeSecurityPanel />
      </SafeAdminWrapper>

      {/* Chat en direct pour les clients */}
      <LiveChat />
    </div>
  );
}
