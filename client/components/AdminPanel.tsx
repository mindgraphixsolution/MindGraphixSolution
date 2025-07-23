import React, { useState } from 'react';
import { Settings, Edit, Save, X, Eye, EyeOff, LogOut, Palette, Type, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export const AdminPanel: React.FC = () => {
  const { isAdmin, isEditMode, toggleEditMode, logout, updateContent, getContent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  if (!isAdmin) return null;

  const handleContentUpdate = (key: string, value: string) => {
    updateContent(key, value);
  };

  const contentSections = [
    {
      key: 'hero.title',
      label: 'Titre Principal Hero',
      defaultValue: 'Solutions Créatives pour Votre Présence Digitale',
      type: 'text'
    },
    {
      key: 'hero.subtitle',
      label: 'Sous-titre Hero',
      defaultValue: 'Nous combinons design captivant et développement robuste pour créer des expériences digitales mémorables qui propulsent votre entreprise vers le succès.',
      type: 'textarea'
    },
    {
      key: 'about.title',
      label: 'Titre Section À Propos',
      defaultValue: 'À Propos de Nous',
      type: 'text'
    },
    {
      key: 'about.subtitle',
      label: 'Sous-titre À Propos',
      defaultValue: 'Découvrez l\'esprit innovant derrière Mind Graphix Solution',
      type: 'text'
    },
    {
      key: 'services.title',
      label: 'Titre Section Services',
      defaultValue: 'Nos Services',
      type: 'text'
    },
    {
      key: 'contact.title',
      label: 'Titre Section Contact',
      defaultValue: 'Contactez-nous',
      type: 'text'
    },
    {
      key: 'contact.subtitle',
      label: 'Sous-titre Contact',
      defaultValue: 'Prêt à donner vie à votre projet ? Parlons-en !',
      type: 'text'
    },
    {
      key: 'company.phone',
      label: 'Téléphone',
      defaultValue: '+226 01 51 11 46',
      type: 'text'
    },
    {
      key: 'company.email',
      label: 'Email',
      defaultValue: 'mindgraphixsolution@gmail.com',
      type: 'email'
    },
    {
      key: 'company.address',
      label: 'Adresse',
      defaultValue: 'Bobo-Dioulasso, Sect N°4',
      type: 'text'
    },
  ];

  const colorSettings = [
    {
      key: 'colors.primary',
      label: 'Couleur Primaire',
      defaultValue: '#5e35b1',
      type: 'color'
    },
    {
      key: 'colors.secondary',
      label: 'Couleur Secondaire',
      defaultValue: '#3949ab',
      type: 'color'
    },
    {
      key: 'colors.accent',
      label: 'Couleur Accent',
      defaultValue: '#ffab00',
      type: 'color'
    },
  ];

  return (
    <>
      {/* Floating Admin Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3 items-end">
          {isOpen && (
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary">Administration</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'content'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Type size={16} className="inline mr-1" />
                  Contenu
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'design'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Palette size={16} className="inline mr-1" />
                  Design
                </button>
              </div>

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {contentSections.map((section) => (
                    <div key={section.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {section.label}
                      </label>
                      {section.type === 'textarea' ? (
                        <textarea
                          value={getContent(section.key, section.defaultValue)}
                          onChange={(e) => handleContentUpdate(section.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={section.type}
                          value={getContent(section.key, section.defaultValue)}
                          onChange={(e) => handleContentUpdate(section.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && (
                <div className="space-y-4">
                  {colorSettings.map((setting) => (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.label}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={getContent(setting.key, setting.defaultValue)}
                          onChange={(e) => handleContentUpdate(setting.key, e.target.value)}
                          className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={getContent(setting.key, setting.defaultValue)}
                          onChange={(e) => handleContentUpdate(setting.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                      Note: Les changements de couleurs nécessitent un rechargement de la page pour être appliqués.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                      Appliquer les couleurs
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={toggleEditMode}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isEditMode
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isEditMode ? <Save size={16} /> : <Edit size={16} />}
                  {isEditMode ? 'Sauvegarder' : 'Mode Édition'}
                </button>
                
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isOpen ? <X size={20} /> : <Settings size={20} />}
          </button>
        </div>
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed top-20 left-6 z-40 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Edit size={16} />
            <span className="font-medium">Mode Édition Actif</span>
          </div>
        </div>
      )}
    </>
  );
};
