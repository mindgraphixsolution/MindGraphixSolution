import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Settings, 
  Eye, 
  Edit, 
  Users, 
  MessageSquare, 
  Palette, 
  Type, 
  Image, 
  BarChart3,
  Monitor,
  Smartphone,
  LogOut,
  Home,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import { AdminNotifications } from '../components/AdminNotifications';
import { LivePreview } from '../components/LivePreview';

export default function AdminDashboard() {
  const { isAdmin, logout, updateContent, getContent } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'content', label: 'Contenu', icon: Type },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'media', label: 'Médias', icon: Image },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const contentSections = [
    {
      category: 'Hero Section',
      items: [
        { key: 'hero.title', label: 'Titre Principal', type: 'text' },
        { key: 'hero.subtitle', label: 'Sous-titre', type: 'textarea' },
        { key: 'hero.cta1', label: 'Bouton CTA 1', type: 'text', defaultValue: 'Voir nos réalisations' },
        { key: 'hero.cta2', label: 'Bouton CTA 2', type: 'text', defaultValue: 'Discutons de votre projet' },
      ]
    },
    {
      category: 'À Propos',
      items: [
        { key: 'about.title', label: 'Titre Section', type: 'text' },
        { key: 'about.subtitle', label: 'Sous-titre', type: 'text' },
        { key: 'about.mainTitle', label: 'Titre Principal', type: 'text', defaultValue: 'Créativité & Technologie au Service de Votre Succès' },
        { key: 'about.description1', label: 'Description 1', type: 'textarea' },
        { key: 'about.description2', label: 'Description 2', type: 'textarea' },
      ]
    },
    {
      category: 'Services',
      items: [
        { key: 'services.title', label: 'Titre Section', type: 'text' },
        { key: 'services.subtitle', label: 'Sous-titre', type: 'text' },
      ]
    },
    {
      category: 'Contact',
      items: [
        { key: 'contact.title', label: 'Titre Section', type: 'text' },
        { key: 'contact.subtitle', label: 'Sous-titre', type: 'text' },
        { key: 'company.phone', label: 'Téléphone', type: 'text' },
        { key: 'company.email', label: 'Email', type: 'email' },
        { key: 'company.address', label: 'Adresse', type: 'text' },
      ]
    },
  ];

  const colorSettings = [
    { key: 'colors.primary', label: 'Couleur Primaire', defaultValue: '#5e35b1' },
    { key: 'colors.secondary', label: 'Couleur Secondaire', defaultValue: '#3949ab' },
    { key: 'colors.accent', label: 'Couleur Accent', defaultValue: '#ffab00' },
    { key: 'colors.background', label: 'Arrière-plan', defaultValue: '#ffffff' },
    { key: 'colors.text', label: 'Texte Principal', defaultValue: '#1a1a1a' },
  ];

  const handleSaveChanges = () => {
    // Force reload to apply changes
    window.location.reload();
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Administration Mind Graphix</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Preview Mode Buttons */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'}`}
                title="Vue Desktop"
              >
                <Monitor size={18} />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded-md transition-colors ${previewMode === 'tablet' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'}`}
                title="Vue Tablet"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'}`}
                title="Vue Mobile"
              >
                <Smartphone size={16} />
              </button>
            </div>

            {/* Action Buttons */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye size={16} />
              <span>Voir le site</span>
            </a>
            
            <button
              onClick={handleSaveChanges}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              <span>Appliquer</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex">
          {/* Content Panel */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Vue d'ensemble</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Site Web</h3>
                      <p className="text-blue-600 text-sm">Site en ligne et fonctionnel</p>
                      <div className="mt-2 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-600">Actif</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="font-semibold text-orange-800 mb-2">Demandes de Devis</h3>
                      <AdminNotifications />
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">Statistiques</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-600">Projets réalisés:</span>
                          <span className="font-medium">50+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Années d'expérience:</span>
                          <span className="font-medium">3+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Satisfaction client:</span>
                          <span className="font-medium">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Actions Rapides</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('content')}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Type size={16} />
                        <span>Modifier le contenu</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('design')}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Palette size={16} />
                        <span>Personnaliser le design</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MessageSquare size={16} />
                        <span>Voir les messages</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Gestion du Contenu</h2>
                  
                  {contentSections.map((section) => (
                    <div key={section.category} className="space-y-4">
                      <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        {section.category}
                      </h3>
                      {section.items.map((item) => (
                        <div key={item.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {item.label}
                          </label>
                          {item.type === 'textarea' ? (
                            <textarea
                              value={getContent(item.key, item.defaultValue || '')}
                              onChange={(e) => updateContent(item.key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              rows={3}
                            />
                          ) : (
                            <input
                              type={item.type}
                              value={getContent(item.key, item.defaultValue || '')}
                              onChange={(e) => updateContent(item.key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'design' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Personnalisation du Design</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Couleurs du Thème
                    </h3>
                    {colorSettings.map((setting) => (
                      <div key={setting.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {setting.label}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={getContent(setting.key, setting.defaultValue)}
                            onChange={(e) => updateContent(setting.key, e.target.value)}
                            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={getContent(setting.key, setting.defaultValue)}
                            onChange={(e) => updateContent(setting.key, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSaveChanges}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <RefreshCw size={16} />
                        <span>Appliquer les changements</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Les changements de couleurs nécessitent un rechargement
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Messages & Demandes</h2>
                  <AdminNotifications />
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1">
            <LivePreview url="/" />
          </div>
        </main>
      </div>
    </div>
  );
}
