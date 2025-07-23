import React, { useState } from 'react';
import { HelpCircle, X, User, Lock, Phone, ShieldCheck } from 'lucide-react';

export const AdminGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Guide Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        title="Guide d'administration"
      >
        <HelpCircle size={20} />
      </button>

      {/* Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold">Guide d'Administration</h2>
              <p className="text-blue-100 mt-2">Instructions pour gérer le site Mind Graphix Solution</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Connexion Admin */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Connexion Administrateur
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Identifiants requis :</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      <strong>Email :</strong> mindgraphixsolution@gmail.com
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <strong>Téléphone :</strong> +226 01 51 11 46
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-blue-600" />
                      <strong>Mot de passe :</strong> MINDSETGrapix2025
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
                      <strong>Question de sécurité :</strong> Badiori
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Note :</strong> L'email mindgraphixsolution@gmail.com déclenche automatiquement 
                    l'authentification admin. Les autres emails fonctionnent en mode utilisateur normal.
                  </p>
                </div>
              </section>

              {/* Panneau d'administration */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Panneau d'Administration</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎛️ Accès au panneau</h4>
                    <p className="text-gray-600 text-sm">
                      Une fois connecté, un bouton flottant apparaît en bas à droite de l'écran. 
                      Cliquez dessus pour ouvrir le panneau d'administration.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📝 Onglet Contenu</h4>
                    <p className="text-gray-600 text-sm">
                      Modifiez tous les textes du site : titres, sous-titres, descriptions, 
                      informations de contact. Les changements sont sauvegardés automatiquement.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎨 Onglet Design</h4>
                    <p className="text-gray-600 text-sm">
                      Personnalisez les couleurs du site (primaire, secondaire, accent). 
                      Cliquez sur "Appliquer les couleurs" pour voir les changements.
                    </p>
                  </div>
                </div>
              </section>

              {/* Mode Édition */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mode Édition</h3>
                <div className="space-y-4">
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold mb-2 text-green-800">✏️ Activation</h4>
                    <p className="text-green-700 text-sm">
                      Cliquez sur "Mode Édition" dans le panneau pour activer l'édition en ligne. 
                      Un indicateur vert apparaîtra en haut à gauche.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold mb-2 text-green-800">🖱️ Édition en ligne</h4>
                    <p className="text-green-700 text-sm">
                      En mode édition, survolez les textes pour voir les zones éditables. 
                      Cliquez directement sur un texte pour le modifier sur place.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold mb-2 text-green-800">⌨️ Raccourcis clavier</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• <strong>Entrée :</strong> Sauvegarder (texte simple)</li>
                      <li>• <strong>Ctrl+Entrée :</strong> Sauvegarder (texte multiligne)</li>
                      <li>• <strong>Échap :</strong> Annuler les modifications</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Persistance */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sauvegarde</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>💾 Sauvegarde automatique :</strong> Toutes les modifications sont 
                    automatiquement sauvegardées dans le navigateur. Elles persistent même 
                    après déconnexion et rechargement de la page.
                  </p>
                </div>
              </section>

              {/* Sécurité */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sécurité</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    <strong>🔒 Important :</strong> Utilisez le bouton "Déconnexion" pour 
                    fermer votre session admin de manière sécurisée, surtout sur un ordinateur partagé.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
