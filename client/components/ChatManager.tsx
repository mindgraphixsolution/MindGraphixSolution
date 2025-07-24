import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Clock, Circle } from 'lucide-react';
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

export const ChatManager: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isAdmin) return null;

  useEffect(() => {
    loadChatSessions();
    // Actualiser toutes les 5 secondes
    const interval = setInterval(loadChatSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = () => {
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    setSessions(savedSessions.sort((a: ChatSession, b: ChatSession) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    ));
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !selectedSession) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      timestamp: new Date().toISOString(),
      sender: 'admin',
      senderName: currentUser?.name || 'Administrateur'
    };

    const updatedSession = {
      ...selectedSession,
      messages: [...selectedSession.messages, newMessage],
      status: 'active' as const,
      lastActivity: new Date().toISOString()
    };

    // Mettre à jour dans la liste
    const updatedSessions = sessions.map(s => 
      s.id === selectedSession.id ? updatedSession : s
    );
    setSessions(updatedSessions);
    setSelectedSession(updatedSession);

    // Sauvegarder
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));

    // Notifier le client
    const clientNotifications = JSON.parse(
      localStorage.getItem(`notifications_${selectedSession.clientId}`) || '[]'
    );
    clientNotifications.unshift({
      id: Date.now().toString(),
      type: 'admin_chat_reply',
      title: 'Nouveau message chat',
      message: `${newMessage.senderName}: ${currentMessage.substring(0, 50)}${currentMessage.length > 50 ? '...' : ''}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem(
      `notifications_${selectedSession.clientId}`, 
      JSON.stringify(clientNotifications)
    );

    setCurrentMessage('');
  };

  const updateSessionStatus = (sessionId: string, newStatus: ChatSession['status']) => {
    const updatedSessions = sessions.map(s => 
      s.id === sessionId ? { ...s, status: newStatus } : s
    );
    setSessions(updatedSessions);
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    
    if (selectedSession?.id === sessionId) {
      setSelectedSession({ ...selectedSession, status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'waiting': return 'text-yellow-500';
      case 'closed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'waiting': return 'En attente';
      case 'closed': return 'Fermé';
      default: return 'Inconnu';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const getUnreadCount = (session: ChatSession) => {
    return session.messages.filter(m => 
      m.sender === 'client' && 
      new Date(m.timestamp).getTime() > Date.now() - 300000 // 5 minutes
    ).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <MessageCircle size={20} className="mr-2" />
          Chat en Direct ({filteredSessions.length})
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Toutes</option>
            <option value="active">Actives</option>
            <option value="waiting">En attente</option>
          </select>
          <Button onClick={loadChatSessions} size="sm" variant="outline">
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des sessions */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucune session de chat</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const unreadCount = getUnreadCount(session);
              const lastMessage = session.messages[session.messages.length - 1];
              
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedSession?.id === session.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-600" />
                      <h4 className="font-semibold text-gray-800">
                        {session.clientName}
                      </h4>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Circle size={8} className={`fill-current ${getStatusColor(session.status)}`} />
                      <span className={`text-xs ${getStatusColor(session.status)}`}>
                        {getStatusLabel(session.status)}
                      </span>
                    </div>
                  </div>
                  
                  {lastMessage && (
                    <p className="text-sm text-gray-600 truncate mb-2">
                      <span className="font-medium">
                        {lastMessage.sender === 'admin' ? 'Vous: ' : 'Client: '}
                      </span>
                      {lastMessage.message}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatTime(session.lastActivity)}
                    </span>
                    <span>{session.messages.length} message(s)</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Zone de chat */}
        <div>
          {selectedSession ? (
            <div className="border border-gray-200 rounded-lg flex flex-col h-96">
              {/* Header de la session */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span className="font-semibold">{selectedSession.clientName}</span>
                  </div>
                  <select
                    value={selectedSession.status}
                    onChange={(e) => updateSessionStatus(selectedSession.id, e.target.value as any)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="active">Actif</option>
                    <option value="waiting">En attente</option>
                    <option value="closed">Fermé</option>
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.senderName} • {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
                    placeholder="Tapez votre réponse..."
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
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500 h-96 flex items-center justify-center">
              <div>
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une session pour commencer à chatter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
