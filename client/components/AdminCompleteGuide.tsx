import React, { useState } from 'react';
import { Book, ChevronRight, ChevronDown, CheckCircle, Play, Settings, Users, MessageSquare, Image, Database, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface GuideSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  steps: GuideStep[];
}

interface GuideStep {
  id: string;
  title: string;
  description: string;
  action?: () => void;
  isCompleted?: boolean;
}

export const AdminCompleteGuide: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  if (!isAdmin) return null;

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Premiers Pas',
      icon: Play,
      description: 'Configuration initiale et découverte de l\'interface',
      steps: [
        {
          id: 'verify-access',
          title: 'Vérifier votre niveau d\'accès',
          description: 'Confirmez que vous êtes bien connecté en tant qu\'administrateur. Regardez en haut à droite de la page.',
          action: () => {
            alert(`Vous êtes connecté en tant que: ${isSuperAdmin ? 'Administrateur Suprême' : 'Administrateur Standard'}`);
            markStepCompleted('verify-access');
          }
        },
        {
          id: 'explore-tabs',
          title: 'Explorer les onglets du SuperAdminPanel',
          description: 'Familiarisez-vous avec les différents onglets : Général, Demandes, Chat, Contenu, Images, etc.',
        },
        {
          id: 'run-health-check',
          title: 'Exécuter la vérification système',
          description: 'Utilisez l\'onglet "Général" pour vérifier que tous les systèmes fonctionnent correctement.',
        }
      ]
    },
    {
      id: 'requests-management',
      title: 'Gestion des Demandes Clients',
      icon: MessageSquare,
      description: 'Comment traiter et répondre aux demandes des clients',
      steps: [
        {
          id: 'view-requests',
          title: 'Consulter les demandes',
          description: 'Allez dans l\'onglet "Demandes" pour voir toutes les demandes clients en attente.',
        },
        {
          id: 'respond-request',
          title: 'Répondre à une demande',
          description: 'Sélectionnez une demande, tapez votre réponse dans la zone de texte et cliquez sur "Envoyer la Réponse".',
        },
        {
          id: 'change-status',
          title: 'Modifier le statut',
          description: 'Utilisez le menu déroulant pour changer le statut : En attente → En cours → Résolu → Fermé.',
        },
        {
          id: 'test-request-system',
          title: 'Tester le système',
          description: 'Utilisez le testeur dans l\'onglet Chat pour créer des demandes de test.',
        }
      ]
    },
    {
      id: 'chat-management',
      title: 'Système de Chat en Direct',
      icon: MessageSquare,
      description: 'Gérer les conversations en temps réel avec les clients',
      steps: [
        {
          id: 'view-chat-sessions',
          title: 'Voir les sessions de chat',
          description: 'Dans l\'onglet "Chat", consultez toutes les conversations actives et en attente.',
        },
        {
          id: 'respond-chat',
          title: 'Répondre en chat',
          description: 'Sélectionnez une session, tapez votre message et appuyez sur Entrée ou cliquez "Envoyer".',
        },
        {
          id: 'manage-chat-status',
          title: 'Gérer les statuts de chat',
          description: 'Changez le statut des conversations : Actif, En attente, Fermé.',
        },
        {
          id: 'test-chat-system',
          title: 'Tester le chat',
          description: 'Créez des sessions de test pour vérifier le bon fonctionnement.',
        }
      ]
    },
    {
      id: 'content-management',
      title: 'Gestion du Contenu',
      icon: Settings,
      description: 'Modifier les textes et contenus du site',
      steps: [
        {
          id: 'edit-content',
          title: 'Modifier les textes',
          description: 'Utilisez l\'onglet "Contenu" pour changer les titres, descriptions et autres textes du site.',
        },
        {
          id: 'save-changes',
          title: 'Sauvegarder les modifications',
          description: 'Les changements sont automatiquement sauvegardés. Utilisez "Appliquer" pour voir les modifications.',
        },
        {
          id: 'backup-content',
          title: 'Sauvegarder le contenu',
          description: 'Exportez régulièrement le contenu via les paramètres pour éviter les pertes.',
        }
      ]
    },
    {
      id: 'media-management',
      title: 'Gestion des Médias et Images',
      icon: Image,
      description: 'Upload et gestion des fichiers multimédias',
      steps: [
        {
          id: 'upload-images',
          title: 'Uploader des images',
          description: 'Dans l\'onglet "Images", utilisez le gestionnaire d\'upload pour ajouter des images.',
        },
        {
          id: 'manage-files',
          title: 'Gérer les fichiers',
          description: 'Organisez, renommez et supprimez les fichiers uploadés selon vos besoins.',
        },
        {
          id: 'copy-urls',
          title: 'Copier les URLs',
          description: 'Utilisez le bouton "Copier" pour obtenir l\'URL d\'une image et l\'utiliser ailleurs.',
        }
      ]
    },
    {
      id: 'user-management',
      title: 'Gestion des Utilisateurs',
      icon: Users,
      description: 'Administrer les comptes et permissions',
      steps: [
        {
          id: 'view-users',
          title: 'Consulter les utilisateurs',
          description: 'Voyez la liste des utilisateurs connectés et leurs statuts.',
        },
        {
          id: 'manage-permissions',
          title: 'Gérer les permissions',
          description: 'Modifiez les droits d\'accès selon les besoins (Suprême uniquement).',
        },
        {
          id: 'monitor-activity',
          title: 'Surveiller l\'activité',
          description: 'Consultez les logs et activités des utilisateurs.',
        }
      ]
    }
  ];

  if (isSuperAdmin) {
    guideSections.push({
      id: 'supreme-features',
      title: 'Fonctionnalités Suprêmes',
      icon: Shield,
      description: 'Outils avancés réservés à l\'administrateur suprême',
      steps: [
        {
          id: 'security-console',
          title: 'Console de sécurité',
          description: 'Accédez à la console de sécurité suprême via le bouton rouge dans l\'onglet Général.',
        },
        {
          id: 'system-commands',
          title: 'Commandes système',
          description: 'Utilisez les commandes avancées : vider cache, export complet, mode furtif.',
        },
        {
          id: 'data-management',
          title: 'Gestion des données',
          description: 'Import/export complet, réinitialisation système, gestion des backups.',
        },
        {
          id: 'advanced-monitoring',
          title: 'Surveillance avancée',
          description: 'Consultez les métriques système et les informations de session détaillées.',
        }
      ]
    });
  }

  const getProgressPercentage = () => {
    const totalSteps = guideSections.reduce((acc, section) => acc + section.steps.length, 0);
    return Math.round((completedSteps.length / totalSteps) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Book size={20} className="mr-2" />
          Guide Complet d'Administration
        </h3>
        <div className="text-sm text-gray-500">
          Progression: {getProgressPercentage()}% ({completedSteps.length} étapes complétées)
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Statut de l'utilisateur */}
      <div className={`mb-6 p-4 rounded-lg border ${isSuperAdmin ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-center space-x-2">
          {isSuperAdmin ? <Shield size={20} className="text-red-600" /> : <Settings size={20} className="text-blue-600" />}
          <div>
            <h4 className={`font-semibold ${isSuperAdmin ? 'text-red-800' : 'text-blue-800'}`}>
              {isSuperAdmin ? 'Accès Administrateur Suprême' : 'Accès Administrateur Standard'}
            </h4>
            <p className={`text-sm ${isSuperAdmin ? 'text-red-600' : 'text-blue-600'}`}>
              {isSuperAdmin 
                ? 'Vous avez accès à toutes les fonctionnalités avancées et outils de sécurité.'
                : 'Vous avez accès aux fonctionnalités standard d\'administration.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Sections du guide */}
      <div className="space-y-4">
        {guideSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const completedInSection = section.steps.filter(step => completedSteps.includes(step.id)).length;
          const Icon = section.icon;

          return (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {completedInSection}/{section.steps.length}
                  </span>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 bg-white">
                  <div className="space-y-3">
                    {section.steps.map((step, index) => {
                      const isCompleted = completedSteps.includes(step.id);
                      
                      return (
                        <div
                          key={step.id}
                          className={`p-3 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-xs font-bold">
                                {isCompleted ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                                  {step.title}
                                </h5>
                                <p className={`text-sm mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            {step.action && !isCompleted && (
                              <Button
                                onClick={step.action}
                                size="sm"
                                className="ml-3"
                              >
                                Tester
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Actions Rapides</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <button
            onClick={() => markStepCompleted('quick-backup')}
            className="text-left p-2 hover:bg-yellow-100 rounded transition-colors"
          >
            📁 Faire une sauvegarde complète
          </button>
          <button
            onClick={() => markStepCompleted('quick-health')}
            className="text-left p-2 hover:bg-yellow-100 rounded transition-colors"
          >
            🔍 Vérifier l'état du système
          </button>
          <button
            onClick={() => markStepCompleted('quick-test')}
            className="text-left p-2 hover:bg-yellow-100 rounded transition-colors"
          >
            🧪 Créer des données de test
          </button>
          <button
            onClick={() => markStepCompleted('quick-clean')}
            className="text-left p-2 hover:bg-yellow-100 rounded transition-colors"
          >
            🧹 Nettoyer les données test
          </button>
        </div>
      </div>
    </div>
  );
};
