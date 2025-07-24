import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  UserPlus,
  Phone,
  Video,
  Paperclip
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'admin';
  content: string;
  timestamp: Date;
  sender: {
    name: string;
    id: string;
    avatar?: string;
  };
  suggestions?: string[];
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  priority?: 'normal' | 'urgent';
  handoffRequested?: boolean;
}

interface ChatSession {
  id: string;
  clientId: string;
  clientName: string;
  status: 'bot-handling' | 'waiting-admin' | 'admin-handling' | 'escalated' | 'resolved';
  priority: 'normal' | 'urgent';
  adminId?: string;
  adminName?: string;
  botActive: boolean;
  lastActivity: Date;
  tags: string[];
  summary?: string;
}

export const HybridChatSystem: React.FC = () => {
  const { isLoggedIn, currentUser, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [adminAvailable, setAdminAvailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Réponses intelligentes du bot hybride
  const hybridBotResponses = {
    greeting: [
      "Bonjour ! Je suis l'assistant intelligent de Mind Graphix. Je peux vous aider immédiatement ou vous mettre en contact avec notre équipe si nécessaire. 😊",
      "Salut ! Assistant IA à votre service ! Je peux répondre à vos questions ou faire appel à un conseiller humain selon vos besoins. Comment puis-je vous aider ?",
      "Hello ! Je suis là pour vous accompagner. Si ma réponse ne vous satisfait pas, je peux faire intervenir un expert humain. Que puis-je faire pour vous ?"
    ],
    adminUnavailable: [
      "Notre équipe est momentanément occupée, mais je peux vous aider efficacement ! Si c'est urgent, je peux prendre vos coordonnées pour un rappel prioritaire. 📞",
      "Les conseillers sont en réunion, mais ne vous inquiétez pas ! Je suis formé pour gérer la plupart des demandes. Sinon, je peux planifier un rendez-vous. 📅",
      "L'équipe traite d'autres clients, mais je reste à votre disposition ! Pour les cas complexes, je peux vous mettre en file d'attente prioritaire. ⏰"
    ],
    handoff: [
      "Je vais faire appel à un expert humain pour vous donner la meilleure réponse possible. Veuillez patienter quelques instants... 👨‍💼",
      "Votre demande mérite l'attention d'un spécialiste ! Je transfère votre conversation à notre équipe. Restez en ligne ! 🔄",
      "Je contacte immédiatement un conseiller pour vous offrir un service personnalisé. Un instant s'il vous plaît... ⚡"
    ]
  };

  useEffect(() => {
    if (isOpen && !currentSession) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Vérifier la disponibilité des admins
    checkAdminAvailability();
    const interval = setInterval(checkAdminAvailability, 10000);
    return () => clearInterval(interval);
  }, []);

  const initializeChat = () => {
    if (!isLoggedIn) return;

    const sessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: sessionId,
      clientId: currentUser?.email || 'anonymous',
      clientName: currentUser?.name || 'Client',
      status: 'bot-handling',
      priority: 'normal',
      botActive: true,
      lastActivity: new Date(),
      tags: ['nouveau']
    };

    setCurrentSession(newSession);
    
    // Message de bienvenue du bot
    addBotMessage(getRandomResponse('greeting'), [
      "J'ai une question technique",
      "Je veux un devis",
      "Parler à un conseiller",
      "Information sur vos services"
    ]);

    // Sauvegarder la session
    saveChatSession(newSession);
  };

  const checkAdminAvailability = () => {
    // Simuler la vérification de disponibilité admin
    const adminAuth = localStorage.getItem('adminAuth') || localStorage.getItem('supremeAuth');
    const lastAdminActivity = localStorage.getItem('lastAdminActivity');
    
    if (adminAuth && lastAdminActivity) {
      const lastActivity = parseInt(lastAdminActivity);
      const isRecent = Date.now() - lastActivity < 5 * 60 * 1000; // 5 minutes
      setAdminAvailable(isRecent);
    } else {
      setAdminAvailable(false);
    }
  };

  const getRandomResponse = (category: keyof typeof hybridBotResponses): string => {
    const responses = hybridBotResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addBotMessage = (content: string, suggestions?: string[]) => {
    setBotIsTyping(true);
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        sender: {
          name: 'Assistant IA',
          id: 'bot',
          avatar: '🤖'
        },
        suggestions
      };
      setMessages(prev => [...prev, newMessage]);
      setBotIsTyping(false);
    }, Math.random() * 1500 + 800);
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      sender: {
        name: currentUser?.name || 'Vous',
        id: currentUser?.email || 'user'
      }
    };
    setMessages(prev => [...prev, newMessage]);
    updateSessionActivity();
  };

  const addAdminMessage = (content: string, adminName: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'admin',
      content,
      timestamp: new Date(),
      sender: {
        name: adminName,
        id: 'admin',
        avatar: '👨‍💼'
      }
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !currentSession) return;

    addUserMessage(currentMessage);
    analyzeAndRespond(currentMessage);
    setCurrentMessage('');
  };

  const analyzeAndRespond = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Déterminer si il faut transférer à un admin
    const needsHumanHelp = shouldTransferToAdmin(lowerMessage);
    
    if (needsHumanHelp && adminAvailable) {
      requestAdminHandoff();
    } else if (needsHumanHelp && !adminAvailable) {
      handleAdminUnavailable();
    } else {
      provideBotResponse(lowerMessage);
    }
  };

  const shouldTransferToAdmin = (message: string): boolean => {
    const complexKeywords = [
      'problème urgent', 'bug', 'erreur', 'ne fonctionne pas', 'cassé',
      'remboursement', 'annuler', 'réclamation', 'insatisfait',
      'devis complexe', 'projet spécifique', 'cahier des charges',
      'parler à quelqu\'un', 'conseiller humain', 'responsable'
    ];

    return complexKeywords.some(keyword => message.includes(keyword));
  };

  const requestAdminHandoff = () => {
    if (!currentSession) return;

    // Mettre à jour le statut de la session
    const updatedSession = {
      ...currentSession,
      status: 'waiting-admin' as const,
      priority: 'urgent' as const
    };
    setCurrentSession(updatedSession);
    saveChatSession(updatedSession);

    addBotMessage(getRandomResponse('handoff'));

    // Notifier les admins
    notifyAdminsOfHandoff();

    // Simuler l'arrivée d'un admin (pour la démo)
    setTimeout(() => {
      if (Math.random() > 0.3) { // 70% de chance qu'un admin réponde
        handleAdminJoin();
      }
    }, 3000 + Math.random() * 5000);
  };

  const handleAdminUnavailable = () => {
    addBotMessage(getRandomResponse('adminUnavailable'), [
      "Laisser mes coordonnées",
      "Planifier un rendez-vous",
      "Continuer avec l'IA",
      "Marquer comme urgent"
    ]);
  };

  const handleAdminJoin = () => {
    if (!currentSession) return;

    const adminName = "Sarah (Conseillère)";
    const updatedSession = {
      ...currentSession,
      status: 'admin-handling' as const,
      adminId: 'admin1',
      adminName,
      botActive: false
    };
    setCurrentSession(updatedSession);
    saveChatSession(updatedSession);

    addAdminMessage(
      `Bonjour ! Je suis ${adminName} et je reprends votre conversation. L'IA m'a transmis votre demande. Comment puis-je vous aider plus spécifiquement ? 😊`,
      adminName
    );
  };

  const provideBotResponse = (message: string) => {
    // Analyse intelligente pour réponse bot
    if (message.includes('prix') || message.includes('tarif')) {
      addBotMessage(
        "Nos tarifs démarrent à 98.000 FCFA pour un logo et peuvent aller jusqu'à 787.000 FCFA pour un site e-commerce complet. Voulez-vous un devis personnalisé ?",
        ["Devis personnalisé", "Voir tous les tarifs", "Parler budget", "Options de paiement"]
      );
    } else if (message.includes('service') || message.includes('que faites')) {
      addBotMessage(
        "Nous excellons dans 6 domaines : Design Graphique, Développement Web, UI/UX, Motion Design, E-commerce et Marketing Digital. Quel domaine vous intéresse ?",
        ["Design graphique", "Site web", "Application", "Marketing", "Tout voir"]
      );
    } else if (message.includes('délai') || message.includes('combien de temps')) {
      addBotMessage(
        "Nos délais varient selon le projet : Logo (3-7 jours), Site web (2-6 semaines), App mobile (1-4 semaines). Voulez-vous plus de détails ?",
        ["Planning détaillé", "Urgence possible ?", "Étapes du projet"]
      );
    } else {
      // Réponse générale avec possibilité de transfert
      addBotMessage(
        "Je comprends votre demande. Je peux vous aider immédiatement ou vous mettre en contact avec un expert pour un accompagnement personnalisé. Que préférez-vous ?",
        ["Continuer avec l'IA", "Parler à un expert", "Plus d'infos", "Faire un devis"]
      );
    }
  };

  const notifyAdminsOfHandoff = () => {
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    adminNotifications.unshift({
      id: Date.now().toString(),
      type: 'chat_handoff',
      title: '🔔 Transfert de chat demandé',
      message: `${currentUser?.name || 'Un client'} souhaite parler à un conseiller`,
      timestamp: new Date().toISOString(),
      read: false,
      urgent: true,
      data: { sessionId: currentSession?.id, clientName: currentUser?.name }
    });
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
  };

  const saveChatSession = (session: ChatSession) => {
    const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const existingIndex = chatSessions.findIndex((s: ChatSession) => s.id === session.id);
    
    if (existingIndex >= 0) {
      chatSessions[existingIndex] = session;
    } else {
      chatSessions.unshift(session);
    }
    
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions.slice(0, 50)));
  };

  const updateSessionActivity = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        lastActivity: new Date()
      };
      setCurrentSession(updatedSession);
      saveChatSession(updatedSession);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusDisplay = () => {
    if (!currentSession) return { text: 'Déconnecté', color: 'text-gray-500' };
    
    switch (currentSession.status) {
      case 'bot-handling':
        return { text: 'Assistant IA actif', color: 'text-blue-600' };
      case 'waiting-admin':
        return { text: 'En attente d\'un conseiller...', color: 'text-orange-600' };
      case 'admin-handling':
        return { text: `Avec ${currentSession.adminName}`, color: 'text-green-600' };
      default:
        return { text: 'En ligne', color: 'text-green-600' };
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => alert('Veuillez vous connecter pour utiliser le chat')}
          className="bg-gray-400 text-white p-4 rounded-full shadow-lg"
          disabled
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 relative"
          >
            <MessageCircle size={24} />
            {currentSession?.status === 'waiting-admin' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock size={12} className="text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
          </button>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-start p-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {currentSession?.status === 'admin-handling' ? (
                      <Shield size={20} />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat Mind Graphix</h3>
                    <p className={`text-xs ${getStatusDisplay().color}`}>
                      {getStatusDisplay().text}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {adminAvailable && (
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Admin disponible" />
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.type === 'admin'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.type === 'admin' && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Shield size={12} className="text-green-600" />
                          <span className="text-xs font-medium text-green-600">
                            {message.sender.name}
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              addUserMessage(suggestion);
                              analyzeAndRespond(suggestion);
                            }}
                            className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    message.type === 'user' ? 'order-1 mr-2 bg-blue-500 text-white' : 
                    message.type === 'admin' ? 'order-2 ml-2 bg-green-500 text-white' :
                    'order-2 ml-2 bg-gray-200 text-gray-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={16} />
                    ) : message.type === 'admin' ? (
                      <Shield size={16} />
                    ) : (
                      <Bot size={16} />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicators */}
              {(isTyping || botIsTyping) && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {currentSession?.status === 'admin-handling' ? (
                        <Shield size={16} className="text-green-600" />
                      ) : (
                        <Bot size={16} className="text-gray-600" />
                      )}
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="rounded-full p-2"
                >
                  <Send size={16} />
                </Button>
              </div>
              
              {/* Quick actions */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {currentSession?.status === 'bot-handling' && (
                    <span className="flex items-center space-x-1">
                      <Bot size={12} />
                      <span>IA active • Transfert possible</span>
                    </span>
                  )}
                  {currentSession?.status === 'admin-handling' && (
                    <span className="flex items-center space-x-1">
                      <Shield size={12} />
                      <span>Conseiller humain connecté</span>
                    </span>
                  )}
                </div>
                
                {adminAvailable && currentSession?.status === 'bot-handling' && (
                  <button
                    onClick={requestAdminHandoff}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <UserPlus size={12} />
                    <span>Parler à un conseiller</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
