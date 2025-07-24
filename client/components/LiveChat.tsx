import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Minimize2, Maximize2, X, User, Online } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  sender: 'client' | 'admin';
  senderName: string;
}

interface ChatSession {
  id: string;
  clientId: string;
  clientName: string;
  messages: ChatMessage[];
  status: 'active' | 'waiting' | 'closed';
  lastActivity: string;
}

export const LiveChat: React.FC = () => {
  const { isLoggedIn, currentUser, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ne pas afficher pour les admins
  if (isAdmin) return null;

  useEffect(() => {
    if (isLoggedIn && currentUser?.email) {
      loadOrCreateChatSession();
      // Simulation de vérification de nouvelles messages toutes les 3 secondes
      const interval = setInterval(checkForNewMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, currentUser?.email]);

  useEffect(() => {
    scrollToBottom();
  }, [chatSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadOrCreateChatSession = () => {
    if (!currentUser?.email) return;

    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    let session = savedSessions.find((s: ChatSession) => s.clientId === currentUser.email);

    if (!session) {
      session = {
        id: Date.now().toString(),
        clientId: currentUser.email,
        clientName: currentUser.name || currentUser.email,
        messages: [{
          id: Date.now().toString(),
          message: 'Bonjour ! Comment pouvons-nous vous aider aujourd\'hui ?',
          timestamp: new Date().toISOString(),
          sender: 'admin',
          senderName: 'Assistant Mind Graphix'
        }],
        status: 'waiting',
        lastActivity: new Date().toISOString()
      };

      savedSessions.push(session);
      localStorage.setItem('chatSessions', JSON.stringify(savedSessions));
    }

    setChatSession(session);
    setIsConnected(true);
  };

  const checkForNewMessages = () => {
    if (!chatSession) return;

    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const updatedSession = savedSessions.find((s: ChatSession) => s.id === chatSession.id);

    if (updatedSession && updatedSession.messages.length > chatSession.messages.length) {
      setChatSession(updatedSession);
      
      // Afficher notification si chat fermé
      if (!isOpen) {
        // Ici on pourrait ajouter une notification push
      }
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !chatSession) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      timestamp: new Date().toISOString(),
      sender: 'client',
      senderName: currentUser?.name || 'Client'
    };

    const updatedSession = {
      ...chatSession,
      messages: [...chatSession.messages, newMessage],
      status: 'active' as const,
      lastActivity: new Date().toISOString()
    };

    setChatSession(updatedSession);

    // Sauvegarder dans localStorage
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const sessionIndex = savedSessions.findIndex((s: ChatSession) => s.id === chatSession.id);
    if (sessionIndex !== -1) {
      savedSessions[sessionIndex] = updatedSession;
    } else {
      savedSessions.push(updatedSession);
    }
    localStorage.setItem('chatSessions', JSON.stringify(savedSessions));

    // Notifier les admins
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    adminNotifications.unshift({
      id: Date.now().toString(),
      type: 'new_chat_message',
      title: 'Nouveau message chat',
      message: `${updatedSession.clientName}: ${currentMessage.substring(0, 50)}${currentMessage.length > 50 ? '...' : ''}`,
      timestamp: new Date().toISOString(),
      read: false,
      data: updatedSession
    });
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));

    setCurrentMessage('');

    // Simulation de réponse automatique après 2-5 secondes
    if (Math.random() > 0.3) {
      setTimeout(() => {
        simulateAdminResponse();
      }, Math.random() * 3000 + 2000);
    }
  };

  const simulateAdminResponse = () => {
    if (!chatSession) return;

    const responses = [
      'Merci pour votre message. Un de nos experts va vous répondre sous peu.',
      'Nous avons bien reçu votre demande. Nous analysons votre besoin.',
      'Je transmets votre demande à notre équipe technique.',
      'Parfait ! Nous préparons une réponse détaillée pour vous.',
      'Excellente question ! Laissez-nous quelques minutes pour vous répondre.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const adminMessage: ChatMessage = {
      id: Date.now().toString() + '_admin',
      message: randomResponse,
      timestamp: new Date().toISOString(),
      sender: 'admin',
      senderName: 'Équipe Mind Graphix'
    };

    const updatedSession = {
      ...chatSession,
      messages: [...chatSession.messages, adminMessage],
      lastActivity: new Date().toISOString()
    };

    setChatSession(updatedSession);

    // Sauvegarder
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const sessionIndex = savedSessions.findIndex((s: ChatSession) => s.id === chatSession.id);
    if (sessionIndex !== -1) {
      savedSessions[sessionIndex] = updatedSession;
      localStorage.setItem('chatSessions', JSON.stringify(savedSessions));
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Bouton Chat flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle size={24} />
          {chatSession && chatSession.messages.some(m => 
            m.sender === 'admin' && 
            new Date(m.timestamp).getTime() > Date.now() - 300000 // 5 minutes
          ) && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className={`fixed bottom-6 left-6 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'w-80 h-14' : 'w-80 h-96'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-semibold">Chat en direct</span>
              {isConnected && (
                <span className="text-xs opacity-75">En ligne</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatSession?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'client'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'client' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.senderName} • {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim()}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
