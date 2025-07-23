import React, { useState } from "react";
import { HelpCircle, User, Phone, Lock, ShieldCheck, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

export const AdminLoginHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const adminCredentials = [
    {
      role: "Administrateur Principal",
      email: "mindgraphixsolution@gmail.com",
      password: "MINDSETGrapix2025",
      phone: "+226 01 51 11 46",
      securityQuestion: "Qui est le plus bête dans l'équipe ?",
      securityAnswer: "Badiori"
    },
    {
      role: "Super Administrateur",
      email: "philippefaizsanon@gmail.com",
      password: "Philius24648",
      phone: "+226 54191605",
      securityQuestion: "Qui est ton artiste préféré ?",
      securityAnswer: "Lil Nas X"
    }
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const steps = [
    {
      number: 1,
      title: "Cliquer sur 'Connexion'",
      description: "Dans le header du site, cliquez sur le bouton 'Connexion'"
    },
    {
      number: 2,
      title: "Saisir l'email admin",
      description: "Entrez l'un des emails administrateur ci-dessous"
    },
    {
      number: 3,
      title: "Saisir le mot de passe",
      description: "Entrez le mot de passe correspondant à l'email"
    },
    {
      number: 4,
      title: "Continuer vers l'authentification admin",
      description: "Le système détecte automatiquement que c'est un email admin"
    },
    {
      number: 5,
      title: "Compléter l'authentification",
      description: "Saisir le numéro de téléphone et répondre à la question de sécurité"
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 animate-pulse"
        title="Aide connexion admin"
      >
        <HelpCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle size={32} />
              <div>
                <h2 className="text-2xl font-bold">Guide de Connexion Administrateur</h2>
                <p className="text-blue-100">Résolution des problèmes de connexion admin</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Identifiants Admin */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ShieldCheck className="mr-2 text-red-600" size={24} />
              Identifiants Administrateur
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {adminCredentials.map((admin, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">{admin.role}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                          {admin.email}
                        </code>
                        <button
                          onClick={() => copyToClipboard(admin.email, `email-${index}`)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title="Copier"
                        >
                          {copiedField === `email-${index}` ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                          {admin.password}
                        </code>
                        <button
                          onClick={() => copyToClipboard(admin.password, `password-${index}`)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title="Copier"
                        >
                          {copiedField === `password-${index}` ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                          {admin.phone}
                        </code>
                        <button
                          onClick={() => copyToClipboard(admin.phone, `phone-${index}`)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title="Copier"
                        >
                          {copiedField === `phone-${index}` ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question de sécurité</label>
                      <p className="text-sm text-gray-600 italic mb-1">{admin.securityQuestion}</p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm">
                          {admin.securityAnswer}
                        </code>
                        <button
                          onClick={() => copyToClipboard(admin.securityAnswer, `answer-${index}`)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title="Copier"
                        >
                          {copiedField === `answer-${index}` ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Étapes de connexion */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="mr-2 text-blue-600" size={24} />
              Processus de Connexion
            </h3>
            
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Points d'attention */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lock className="mr-2 text-yellow-600" size={24} />
              Points d'Attention
            </h3>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800">🔑 Format du téléphone</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  Le numéro doit être saisi exactement comme indiqué : <code>+226 01 51 11 46</code>
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800">❗ Sensibilité à la casse</h4>
                <p className="text-red-700 text-sm mt-1">
                  La réponse à la question de sécurité est sensible à la casse. Respectez majuscules/minuscules.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800">✅ Vérification console</h4>
                <p className="text-green-700 text-sm mt-1">
                  Ouvrez la console du navigateur (F12) pour voir les détails des tentatives de connexion.
                </p>
              </div>
            </div>
          </section>

          <div className="flex justify-center">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              Fermer l'aide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
