import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface HealthCheckItem {
  name: string;
  status: 'checking' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export const AdminHealthCheck: React.FC = () => {
  const { isAdmin } = useAuth();
  const [checks, setChecks] = useState<HealthCheckItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  if (!isAdmin) return null;

  const healthChecks = [
    {
      name: 'Authentification Admin',
      test: () => {
        const adminAuth = localStorage.getItem('adminAuth');
        const superAuth = localStorage.getItem('superAdminAuth');
        return {
          success: adminAuth === 'true' || superAuth === 'true',
          message: adminAuth === 'true' || superAuth === 'true' ? 'Authentification active' : 'Non authentifié',
          details: `Admin: ${adminAuth}, Super: ${superAuth}`
        };
      }
    },
    {
      name: 'Stockage Local',
      test: () => {
        try {
          const testKey = 'healthcheck_test';
          localStorage.setItem(testKey, 'test');
          const retrieved = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          return {
            success: retrieved === 'test',
            message: retrieved === 'test' ? 'Stockage local fonctionnel' : 'Problème de stockage',
            details: `Capacité: ${Object.keys(localStorage).length} clés`
          };
        } catch (error) {
          return {
            success: false,
            message: 'Erreur d\'accès au stockage',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
          };
        }
      }
    },
    {
      name: 'Contenu du Site',
      test: () => {
        const siteContent = localStorage.getItem('siteContent');
        const hasContent = siteContent && JSON.parse(siteContent);
        const contentCount = hasContent ? Object.keys(JSON.parse(siteContent)).length : 0;
        return {
          success: contentCount > 0,
          message: contentCount > 0 ? `${contentCount} éléments de contenu` : 'Aucun contenu personnalisé',
          details: siteContent ? `Taille: ${siteContent.length} caractères` : 'Vide'
        };
      }
    },
    {
      name: 'Notifications Admin',
      test: () => {
        const notifications = localStorage.getItem('adminNotifications');
        const hasNotifications = notifications && JSON.parse(notifications);
        const notifCount = hasNotifications ? JSON.parse(notifications).length : 0;
        return {
          success: true, // Pas critique
          message: `${notifCount} notification(s)`,
          details: hasNotifications ? 'Système de notifications actif' : 'Aucune notification'
        };
      }
    },
    {
      name: 'Sessions de Chat',
      test: () => {
        const chatSessions = localStorage.getItem('chatSessions');
        const hasSessions = chatSessions && JSON.parse(chatSessions);
        const sessionCount = hasSessions ? JSON.parse(chatSessions).length : 0;
        return {
          success: true, // Pas critique
          message: `${sessionCount} session(s) de chat`,
          details: hasSessions ? 'Chat system actif' : 'Aucune session active'
        };
      }
    },
    {
      name: 'Demandes Utilisateurs',
      test: () => {
        const userRequests = localStorage.getItem('userRequests');
        const hasRequests = userRequests && JSON.parse(userRequests);
        const requestCount = hasRequests ? JSON.parse(userRequests).length : 0;
        return {
          success: true, // Pas critique
          message: `${requestCount} demande(s) client`,
          details: hasRequests ? 'Système de demandes actif' : 'Aucune demande'
        };
      }
    },
    {
      name: 'API Server',
      test: async () => {
        try {
          const response = await fetch('/api/ping');
          const data = await response.json();
          return {
            success: response.ok,
            message: response.ok ? 'Serveur API actif' : 'Serveur API non disponible',
            details: data.message || 'Pas de réponse'
          };
        } catch (error) {
          return {
            success: false,
            message: 'Erreur de connexion API',
            details: error instanceof Error ? error.message : 'Erreur réseau'
          };
        }
      }
    },
    {
      name: 'Upload System',
      test: async () => {
        try {
          const response = await fetch('/api/upload/images');
          if (response.ok) {
            const data = await response.json();
            return {
              success: true,
              message: 'Système d\'upload actif',
              details: `${data.images?.length || 0} image(s) stockée(s)`
            };
          } else {
            return {
              success: false,
              message: 'Système d\'upload non disponible',
              details: `Status: ${response.status}`
            };
          }
        } catch (error) {
          return {
            success: false,
            message: 'Upload service inaccessible',
            details: 'Utilisation locale disponible'
          };
        }
      }
    }
  ];

  const runHealthCheck = async () => {
    setIsRunning(true);
    const results: HealthCheckItem[] = [];

    for (const check of healthChecks) {
      // Marquer comme en cours
      results.push({
        name: check.name,
        status: 'checking',
        message: 'Vérification en cours...',
      });
      setChecks([...results]);

      try {
        const result = await check.test();
        // Mettre à jour le résultat
        results[results.length - 1] = {
          name: check.name,
          status: result.success ? 'success' : 'error',
          message: result.message,
          details: result.details,
        };
        setChecks([...results]);
      } catch (error) {
        results[results.length - 1] = {
          name: check.name,
          status: 'error',
          message: 'Erreur lors du test',
          details: error instanceof Error ? error.message : 'Erreur inconnue',
        };
        setChecks([...results]);
      }

      // Petit délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader size={16} className="text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getOverallStatus = () => {
    if (checks.length === 0) return 'unknown';
    if (checks.some(c => c.status === 'checking')) return 'checking';
    if (checks.every(c => c.status === 'success')) return 'success';
    if (checks.some(c => c.status === 'error')) return 'error';
    return 'warning';
  };

  useEffect(() => {
    // Auto-run health check on mount
    runHealthCheck();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          {getStatusIcon(getOverallStatus())}
          <span className="ml-2">État du Système Admin</span>
        </h3>
        <Button
          onClick={runHealthCheck}
          disabled={isRunning}
          size="sm"
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
          <span>Vérifier</span>
        </Button>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{check.name}</h4>
                  <p className="text-sm text-gray-600">{check.message}</p>
                  {check.details && (
                    <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {checks.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">Résumé:</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>✅ Succès: {checks.filter(c => c.status === 'success').length}</div>
              <div>❌ Erreurs: {checks.filter(c => c.status === 'error').length}</div>
              <div>⚠️ Avertissements: {checks.filter(c => c.status === 'warning').length}</div>
              <div>🔄 En cours: {checks.filter(c => c.status === 'checking').length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
