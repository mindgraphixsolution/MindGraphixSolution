import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle,
  Info,
  Zap,
  Heart,
  Star,
  Coffee
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface BotMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  action?: {
    type: 'create-account' | 'submit-request' | 'contact-admin' | 'view-services';
    label: string;
    data?: any;
  };
}

interface NotificationData {
  id: string;
  type: 'new-request' | 'request-update' | 'system' | 'welcome';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  urgent?: boolean;
}

export const IntelligentBot: React.FC = () => {
  const { isLoggedIn, currentUser, loginUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Réponses intelligentes du bot
  const botResponses = {
    greeting: [
      "Salut ! Je suis votre assistant virtuel Mind Graphix. Comment puis-je vous aider aujourd'hui ? 😊",
      "Bonjour ! Bienvenue chez Mind Graphix Solution ! En quoi puis-je vous accompagner ?",
      "Hello ! Je suis là pour vous guider dans vos projets créatifs. Que puis-je faire pour vous ?"
    ],
    services: [
      "Nous proposons plusieurs services : Design Graphique, Développement Web, UI/UX Design, Motion Design, E-commerce et SEO/Marketing Digital. Quel domaine vous intéresse ?",
      "Notre expertise couvre le design, le développement et le marketing digital. Voulez-vous en savoir plus sur un service en particulier ?",
      "Nous excellons dans la création d'identités visuelles, sites web et stratégies digitales. Quel est votre projet ?"
    ],
    pricing: [
      "Nos tarifs varient selon la complexité du projet. Par exemple, un logo démarre à 98.000 FCFA, un site web à 525.000 FCFA. Voulez-vous un devis personnalisé ?",
      "Chaque projet est unique ! Pour vous donner un prix juste, j'aurais besoin de connaître vos besoins spécifiques. Puis-je vous aider à préparer une demande de devis ?",
      "Nos prix sont adaptés au marché burkinabé. Pour un devis précis, décrivez-moi votre projet et je vous orienterai vers la bonne solution !"
    ],
    contact: [
      "Vous pouvez nous joindre au +226 01 51 11 46 ou par email : mindgraphixsolution@gmail.com. Nous sommes basés à Bobo-Dioulasso, Sect N°4.",
      "Notre équipe est disponible pour échanger sur votre projet ! Téléphone : +226 01 51 11 46. Préférez-vous qu'on vous rappelle ?",
      "Contactez-nous facilement ! Tel: +226 01 51 11 46 - Email: mindgraphixsolution@gmail.com. On peut aussi planifier un rendez-vous !"
    ],
    account: [
      "Créer un compte vous permet de suivre vos demandes, recevoir des notifications et accéder à votre espace client. C'est gratuit et rapide !",
      "Avec un compte, vous pouvez gérer tous vos projets en un endroit, communiquer directement avec notre équipe et suivre l'avancement. Voulez-vous créer le vôtre ?",
      "Un compte client vous donne accès à des fonctionnalités exclusives : suivi de projet, chat direct, historique des devis. Puis-je vous aider à vous inscrire ?"
    ]
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(getRandomResponse('greeting'), [
        "Découvrir nos services",
        "Demander un devis",
        "Nous contacter",
        "Créer un compte"
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Vérifier les nouvelles demandes pour envoyer des notifications
    const checkNewRequests = () => {
      const requests = JSON.parse(localStorage.getItem('userRequests') || '[]');
      const lastCheck = localStorage.getItem('lastBotCheck');
      const now = Date.now();
      
      if (lastCheck) {
        const newRequests = requests.filter((req: any) => 
          new Date(req.timestamp).getTime() > parseInt(lastCheck)
        );
        
        newRequests.forEach((req: any) => {
          addNotification({
            type: 'new-request',
            title: 'Nouvelle demande re��ue !',
            message: `${req.userName} a soumis une demande : ${req.subject}`,
            urgent: true
          });
        });
      }
      
      localStorage.setItem('lastBotCheck', now.toString());
    };

    const interval = setInterval(checkNewRequests, 30000); // Vérifier toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRandomResponse = (category: keyof typeof botResponses): string => {
    const responses = botResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addBotMessage = (content: string, suggestions?: string[], action?: BotMessage['action']) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: BotMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        suggestions,
        action
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Simule le temps de réflexion
  };

  const addUserMessage = (content: string) => {
    const newMessage: BotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    addUserMessage(currentMessage);
    analyzeAndRespond(currentMessage);
    setCurrentMessage('');
  };

  const analyzeAndRespond = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Analyse intelligente du message
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût') || lowerMessage.includes('budget')) {
      addBotMessage(getRandomResponse('pricing'), [
        "Demander un devis",
        "Voir nos services",
        "Parler à un conseiller"
      ], {
        type: 'submit-request',
        label: 'Faire une demande de devis',
        data: { type: 'quote' }
      });
    } else if (lowerMessage.includes('service') || lowerMessage.includes('que faites') || lowerMessage.includes('spécialisé')) {
      addBotMessage(getRandomResponse('services'), [
        "Design graphique",
        "Développement web",
        "Marketing digital",
        "Demander un devis"
      ], {
        type: 'view-services',
        label: 'Découvrir tous nos services'
      });
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('email') || lowerMessage.includes('joindre')) {
      addBotMessage(getRandomResponse('contact'), [
        "Nous appeler maintenant",
        "Envoyer un email",
        "Chat avec un conseiller"
      ], {
        type: 'contact-admin',
        label: 'Contacter notre équipe'
      });
    } else if (lowerMessage.includes('compte') || lowerMessage.includes('inscription') || lowerMessage.includes('connecter')) {
      if (isLoggedIn) {
        addBotMessage(`Content de vous revoir ${currentUser?.name || 'cher client'} ! Comment puis-je vous aider aujourd'hui ?`, [
          "Suivre mes projets",
          "Nouvelle demande",
          "Contacter l'équipe"
        ]);
      } else {
        addBotMessage(getRandomResponse('account'), [
          "Créer un compte",
          "Se connecter",
          "En savoir plus"
        ], {
          type: 'create-account',
          label: 'Créer mon compte maintenant'
        });
      }
    } else if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      addBotMessage(getRandomResponse('greeting'), [
        "Découvrir nos services",
        "Demander un devis",
        "Nous contacter"
      ]);
    } else {
      // Réponse générale intelligente
      addBotMessage(
        "Je vois que vous vous intéressez à nos services ! Pour mieux vous aider, puis-je savoir quel type de projet vous avez en tête ? 🎨",
        [
          "Création de logo",
          "Site web",
          "Application mobile",
          "Marketing digital",
          "Autre projet"
        ],
        {
          type: 'submit-request',
          label: 'Décrire mon projet en détail'
        }
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addUserMessage(suggestion);
    analyzeAndRespond(suggestion);
  };

  const handleActionClick = (action: BotMessage['action']) => {
    if (!action) return;

    switch (action.type) {
      case 'create-account':
        if (!isLoggedIn) {
          // Simuler la création de compte
          const userData = {
            email: `user${Date.now()}@example.com`,
            name: 'Nouvel utilisateur'
          };
          loginUser(userData.email, 'password', userData.name);
          addBotMessage("Parfait ! Votre compte a été créé. Vous pouvez maintenant suivre vos projets et recevoir des notifications. 🎉", [
            "Faire ma première demande",
            "Découvrir mon espace",
            "Contacter l'équipe"
          ]);
        }
        break;
      case 'submit-request':
        addBotMessage("Excellent ! Je vous redirige vers notre formulaire de demande. Vous pourrez y décrire votre projet en détail. 📝", [
          "Merci !",
          "J'ai d'autres questions"
        ]);
        // Ici on pourrait ouvrir le formulaire de demande
        break;
      case 'contact-admin':
        addBotMessage("Notre équipe est disponible ! Vous pouvez nous joindre directement ou utiliser le chat en direct. 📞", [
          "Ouvrir le chat",
          "Voir les coordonnées",
          "Programmer un rendez-vous"
        ]);
        break;
      case 'view-services':
        addBotMessage("Voici nos domaines d'expertise. Chaque service est personnalisé selon vos besoins spécifiques. 🎯", [
          "En savoir plus",
          "Demander un devis",
          "Voir des exemples"
        ]);
        break;
    }
  };

  const addNotification = (notifData: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const notification: NotificationData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notifData
    };

    setNotifications(prev => [notification, ...prev].slice(0, 10)); // Garder max 10 notifications
    setHasUnreadNotifications(true);

    // Sauvegarder en localStorage
    const allNotifications = JSON.parse(localStorage.getItem('botNotifications') || '[]');
    allNotifications.unshift(notification);
    localStorage.setItem('botNotifications', JSON.stringify(allNotifications.slice(0, 50)));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasUnreadNotifications(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new-request': return <Star className="text-yellow-500" size={16} />;
      case 'request-update': return <CheckCircle className="text-green-500" size={16} />;
      case 'system': return <Info className="text-blue-500" size={16} />;
      case 'welcome': return <Heart className="text-pink-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  return (
    <>
      {/* Bot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 relative"
        >
          <MessageCircle size={24} />
          {hasUnreadNotifications && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{notifications.filter(n => !n.read).length}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-ping opacity-75"></div>
        </button>
      </div>

      {/* Bot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Assistant Mind Graphix</h3>
                    <p className="text-xs opacity-90">En ligne • Répond instantanément</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && hasUnreadNotifications && (
              <div className="bg-yellow-50 border-b border-yellow-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-yellow-600" size={16} />
                    <span className="text-sm font-medium text-yellow-800">
                      {notifications.filter(n => !n.read).length} nouvelle(s) notification(s)
                    </span>
                  </div>
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-xs text-yellow-600 hover:text-yellow-800"
                  >
                    Marquer comme lu
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  {notifications.filter(n => !n.read).slice(0, 2).map(notification => (
                    <div key={notification.id} className="flex items-start space-x-2 text-sm">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <p className="font-medium text-yellow-800">{notification.title}</p>
                        <p className="text-yellow-600">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action */}
                    {message.action && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleActionClick(message.action)}
                          className="text-xs bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
                        >
                          {message.action.label}
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'order-1 mr-2 bg-primary' : 'order-2 ml-2 bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-gray-600" />
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-gray-600" />
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
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="rounded-full p-2"
                >
                  <Send size={16} />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Coffee size={12} />
                  <span>Propulsé par Mind Graphix AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
