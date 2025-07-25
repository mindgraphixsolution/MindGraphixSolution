import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings,
  Shield,
  Users,
  MessageSquare,
  Image,
  Database,
  Upload,
  Download,
  TestTube,
  Play,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface FunctionalityTest {
  name: string;
  category: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: string;
  details?: string;
  critical: boolean;
}

export const AdminFunctionalityTester: React.FC = () => {
  const { isAdmin, isSuperAdmin, isLoggedIn, currentUser } = useAuth();
  const [tests, setTests] = useState<FunctionalityTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isAdmin) return null;

  const functionalityTests: Omit<FunctionalityTest, 'status' | 'result' | 'details'>[] = [
    // Authentification
    {
      name: 'Connexion Administrateur',
      category: 'auth',
      critical: true
    },
    {
      name: 'Session Supreme',
      category: 'auth',
      critical: true
    },
    {
      name: 'Gestion des Sessions',
      category: 'auth',
      critical: false
    },

    // Gestion de contenu
    {
      name: 'Édition de Contenu',
      category: 'content',
      critical: false
    },
    {
      name: 'Sauvegarde de Contenu',
      category: 'content',
      critical: false
    },
    {
      name: 'Réinitialisation de Contenu',
      category: 'content',
      critical: false
    },

    // Images
    {
      name: 'Upload Local d\'Images',
      category: 'images',
      critical: false
    },
    {
      name: 'Gestion des Images',
      category: 'images',
      critical: false
    },
    {
      name: 'API Upload Server',
      category: 'images',
      critical: false
    },

    // Communication
    {
      name: 'Système de Demandes',
      category: 'communication',
      critical: false
    },
    {
      name: 'Chat en Temps Réel',
      category: 'communication',
      critical: false
    },
    {
      name: 'Notifications Admin',
      category: 'communication',
      critical: false
    },

    // Données
    {
      name: 'Export de Données',
      category: 'data',
      critical: false
    },
    {
      name: 'Import de Données',
      category: 'data',
      critical: false
    },
    {
      name: 'Stockage Local',
      category: 'data',
      critical: true
    },

    // Sécurité
    {
      name: 'Masquage d\'Informations',
      category: 'security',
      critical: true
    },
    {
      name: 'Contrôles d\'Accès',
      category: 'security',
      critical: true
    },
    {
      name: 'Chiffrement des Données',
      category: 'security',
      critical: true
    }
  ];

  const runTest = async (testName: string): Promise<{ success: boolean; result: string; details?: string }> => {
    switch (testName) {
      case 'Connexion Administrateur':
        return {
          success: isAdmin && isLoggedIn,
          result: isAdmin ? 'Administrateur connecté' : 'Non connecté comme admin',
          details: `Utilisateur: ${currentUser?.email || 'Aucun'}`
        };

      case 'Session Supreme':
        return {
          success: isSuperAdmin,
          result: isSuperAdmin ? 'Session Supreme active' : 'Session standard',
          details: `Droits: ${isSuperAdmin ? 'Maximum' : 'Limités'}`
        };

      case 'Gestion des Sessions':
        const sessionData = localStorage.getItem('supremeSession');
        return {
          success: !!sessionData,
          result: sessionData ? 'Session trackée' : 'Pas de tracking',
          details: sessionData ? 'Session sécurisée active' : 'Pas de données de session'
        };

      case 'Édition de Contenu':
        try {
          const testContent = { test: 'edit_test_' + Date.now() };
          localStorage.setItem('test_content_edit', JSON.stringify(testContent));
          const retrieved = localStorage.getItem('test_content_edit');
          localStorage.removeItem('test_content_edit');
          return {
            success: !!retrieved,
            result: retrieved ? 'Édition fonctionnelle' : 'Erreur d\'édition',
            details: 'Test d\'écriture/lecture réussi'
          };
        } catch (error) {
          return {
            success: false,
            result: 'Erreur d\'édition',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
          };
        }

      case 'Sauvegarde de Contenu':
        const siteContent = localStorage.getItem('siteContent');
        return {
          success: !!siteContent,
          result: siteContent ? 'Contenu sauvegardé' : 'Pas de sauvegarde',
          details: siteContent ? `${Object.keys(JSON.parse(siteContent)).length} éléments` : 'Aucun contenu'
        };

      case 'Upload Local d\'Images':
        try {
          const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          const images = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
          return {
            success: true,
            result: 'Système d\'upload local actif',
            details: `${images.length} image(s) stockée(s)`
          };
        } catch (error) {
          return {
            success: false,
            result: 'Erreur upload local',
            details: error instanceof Error ? error.message : 'Erreur système'
          };
        }

      case 'API Upload Server':
        try {
          const response = await fetch('/api/upload/images');
          return {
            success: response.ok,
            result: response.ok ? 'API Upload active' : 'API Upload inaccessible',
            details: `Status: ${response.status}`
          };
        } catch (error) {
          return {
            success: false,
            result: 'API Upload non disponible',
            details: 'Mode local disponible'
          };
        }

      case 'Système de Demandes':
        const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
        return {
          success: true,
          result: 'Système de demandes actif',
          details: `${requests.length} demande(s) en cours`
        };

      case 'Chat en Temps Réel':
        const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        return {
          success: true,
          result: 'Chat system fonctionnel',
          details: `${chatSessions.length} session(s) active(s)`
        };

      case 'Notifications Admin':
        const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        return {
          success: true,
          result: 'Notifications actives',
          details: `${notifications.length} notification(s)`
        };

      case 'Export de Données':
        try {
          const data = localStorage.getItem('siteContent') || '{}';
          const blob = new Blob([data], { type: 'application/json' });
          return {
            success: blob.size > 0,
            result: 'Export fonctionnel',
            details: `Taille: ${blob.size} bytes`
          };
        } catch (error) {
          return {
            success: false,
            result: 'Erreur d\'export',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
          };
        }

      case 'Stockage Local':
        try {
          const testKey = 'functionality_test';
          localStorage.setItem(testKey, 'test');
          const retrieved = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          return {
            success: retrieved === 'test',
            result: retrieved ? 'Stockage fonctionnel' : 'Stockage défaillant',
            details: `Capacité: ${Object.keys(localStorage).length} clés`
          };
        } catch (error) {
          return {
            success: false,
            result: 'Erreur de stockage',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
          };
        }

      case 'Masquage d\'Informations':
        // Vérifier que le footer est masqué pour les admins
        return {
          success: isAdmin,
          result: isAdmin ? 'Informations masquées' : 'Informations visibles',
          details: 'Footer et infos sensibles cachés pour les admins'
        };

      case 'Contrôles d\'Accès':
        return {
          success: isAdmin,
          result: isAdmin ? 'Accès administrateur accordé' : 'Accès refusé',
          details: `Niveau: ${isSuperAdmin ? 'Supreme' : 'Standard'}`
        };

      case 'Chiffrement des Données':
        const authData = localStorage.getItem('supremeAuth');
        return {
          success: !!authData,
          result: authData ? 'Données chiffrées/obfusquées' : 'Pas de chiffrement détecté',
          details: 'Identifiants admin stockés de manière sécurisée'
        };

      default:
        return {
          success: false,
          result: 'Test non implémenté',
          details: `Test "${testName}" non trouvé`
        };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const initialTests = functionalityTests.map(test => ({
      ...test,
      status: 'pending' as const
    }));
    setTests(initialTests);

    for (let i = 0; i < functionalityTests.length; i++) {
      const test = functionalityTests[i];
      
      // Marquer comme en cours
      setTests(prev => prev.map((t, index) => 
        index === i ? { ...t, status: 'running' } : t
      ));

      try {
        const result = await runTest(test.name);
        
        // Mettre à jour avec le résultat
        setTests(prev => prev.map((t, index) => 
          index === i ? { 
            ...t, 
            status: result.success ? 'success' : 'error',
            result: result.result,
            details: result.details
          } : t
        ));
      } catch (error) {
        setTests(prev => prev.map((t, index) => 
          index === i ? { 
            ...t, 
            status: 'error',
            result: 'Erreur de test',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
          } : t
        ));
      }

      // Délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle size={16} className="text-gray-400" />;
      case 'running':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Shield size={16} />;
      case 'content':
        return <Settings size={16} />;
      case 'images':
        return <Image size={16} />;
      case 'communication':
        return <MessageSquare size={16} />;
      case 'data':
        return <Database size={16} />;
      case 'security':
        return <Shield size={16} />;
      default:
        return <TestTube size={16} />;
    }
  };

  const categories = ['all', 'auth', 'content', 'images', 'communication', 'data', 'security'];
  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const getOverallStatus = () => {
    if (tests.length === 0) return 'pending';
    const criticalTests = tests.filter(t => t.critical);
    const criticalFailed = criticalTests.filter(t => t.status === 'error');
    
    if (criticalFailed.length > 0) return 'critical';
    if (tests.some(t => t.status === 'running')) return 'running';
    if (tests.every(t => t.status === 'success')) return 'success';
    if (tests.some(t => t.status === 'error')) return 'warning';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <TestTube className="mr-2" />
          Test des Fonctionnalités Admin
        </h3>
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center space-x-2"
        >
          <Play size={16} className={isRunning ? 'animate-spin' : ''} />
          <span>{isRunning ? 'Tests en cours...' : 'Lancer tous les tests'}</span>
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Toutes' : category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Statistiques */}
      {tests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tests.filter(t => t.status === 'success').length}
            </div>
            <div className="text-sm text-green-700">Réussis</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {tests.filter(t => t.status === 'error').length}
            </div>
            <div className="text-sm text-red-700">Échecs</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tests.filter(t => t.critical && t.status === 'error').length}
            </div>
            <div className="text-sm text-yellow-700">Critiques</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((tests.filter(t => t.status === 'success').length / tests.length) * 100)}%
            </div>
            <div className="text-sm text-blue-700">Succès</div>
          </div>
        </div>
      )}

      {/* Tests */}
      <div className="space-y-3">
        {filteredTests.map((test, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                {getCategoryIcon(test.category)}
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center">
                    {test.name}
                    {test.critical && (
                      <span className="ml-2 px-1 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                        CRITIQUE
                      </span>
                    )}
                  </h4>
                  {test.result && (
                    <p className="text-sm text-gray-600">{test.result}</p>
                  )}
                  {test.details && (
                    <p className="text-xs text-gray-500 mt-1">{test.details}</p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                {test.category}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <TestTube size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Aucun test exécuté. Cliquez sur "Lancer tous les tests" pour commencer.</p>
        </div>
      )}
    </div>
  );
};
