import React, { useState } from 'react';
import { Shield, Settings, Users, Database, Eye, Edit, Save, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const SuperAdminPanel: React.FC = () => {
  const { isSuperAdmin, isEditMode, toggleEditMode, updateContent, getContent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  if (!isSuperAdmin) return null;

  const exportSiteData = () => {
    const siteData = localStorage.getItem('siteContent');
    const blob = new Blob([siteData || '{}'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSiteData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          localStorage.setItem('siteContent', JSON.stringify(data));
          window.location.reload();
        } catch (error) {
          alert('Erreur lors de l\'importation des données');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetSiteData = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données du site ? Cette action est irréversible.')) {
      localStorage.removeItem('siteContent');
      window.location.reload();
    }
  };

  const clearAllData = () => {
    if (confirm('ATTENTION : Ceci va supprimer TOUTES les données locales (utilisateurs, contenu, etc.). Êtes-vous absolument sûr ?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Super Admin Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 animate-pulse"
        title="Super Admin Panel"
      >
        <Shield size={20} />
      </button>

      {/* Super Admin Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield size={24} />
                  <h2 className="text-2xl font-bold">Super Admin Panel</h2>
                  <span className="px-2 py-1 bg-red-800 rounded-full text-xs font-bold">ACCÈS TOTAL</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-800 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'general', label: 'Général', icon: Settings },
                  { id: 'content', label: 'Contenu', icon: Edit },
                  { id: 'users', label: 'Utilisateurs', icon: Users },
                  { id: 'data', label: 'Données', icon: Database },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Mode Super Admin Actif</h3>
                    <p className="text-red-600 text-sm">Vous avez un accès complet à toutes les fonctionnalités.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Eye size={16} className="mr-2" />
                        Mode Édition
                      </h4>
                      <Button
                        onClick={toggleEditMode}
                        className={`w-full ${
                          isEditMode 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isEditMode ? 'Désactiver l\'édition' : 'Activer l\'édition'}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        En tant que Super Admin, vous pouvez éditer même sans ce mode.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <RefreshCw size={16} className="mr-2" />
                        Actions Rapides
                      </h4>
                      <div className="space-y-2">
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="w-full"
                        >
                          Recharger la page
                        </Button>
                        <Button
                          onClick={() => window.open('/admin', '_blank')}
                          variant="outline"
                          className="w-full"
                        >
                          Ouvrir Admin Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Édition de Contenu</h3>
                    <p className="text-blue-600 text-sm">
                      Cliquez sur n'importe quel texte de la page pour l'éditer directement.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Actions de Contenu</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        <Button
                          onClick={() => {
                            const elements = document.querySelectorAll('[data-editable]');
                            elements.forEach(el => el.classList.add('animate-bounce'));
                            setTimeout(() => {
                              elements.forEach(el => el.classList.remove('animate-bounce'));
                            }, 2000);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          Montrer éléments éditables
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm('Réinitialiser tout le contenu personnalisé ?')) {
                              localStorage.removeItem('siteContent');
                              window.location.reload();
                            }
                          }}
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700"
                        >
                          Réinitialiser contenu
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Gestion des Utilisateurs</h3>
                    <p className="text-yellow-700 text-sm">
                      Contrôle total sur tous les comptes utilisateurs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Sessions Actives</h4>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between items-center p-2 bg-white rounded border">
                          <span>Admin Standard</span>
                          <Button
                            onClick={() => {
                              localStorage.removeItem('adminAuth');
                              alert('Session admin standard supprimée');
                            }}
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            Déconnecter
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
                          <span className="font-semibold">Super Admin (Vous)</span>
                          <span className="text-red-600 text-xs">ACTIF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Gestion des Données</h3>
                    <p className="text-purple-700 text-sm">
                      Import/Export et gestion complète des données système.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Download size={16} className="mr-2" />
                        Export
                      </h4>
                      <Button onClick={exportSiteData} className="w-full mb-2">
                        Exporter données site
                      </Button>
                      <p className="text-xs text-gray-600">
                        Télécharge un fichier JSON avec toutes les données.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Upload size={16} className="mr-2" />
                        Import
                      </h4>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSiteData}
                        className="w-full text-sm"
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Importe un fichier JSON de données.
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-red-800 flex items-center">
                      <Trash2 size={16} className="mr-2" />
                      Zone Dangereuse
                    </h4>
                    <div className="space-y-2">
                      <Button
                        onClick={resetSiteData}
                        variant="outline"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Réinitialiser contenu site
                      </Button>
                      <Button
                        onClick={clearAllData}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        SUPPRIMER TOUTES LES DONNÉES
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
