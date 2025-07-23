import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  login: (email: string, phone: string, password: string, securityAnswer: string) => Promise<boolean>;
  logout: () => void;
  toggleEditMode: () => void;
  updateContent: (key: string, value: any) => void;
  getContent: (key: string, defaultValue?: any) => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});

  // Charger l'état d'authentification au démarrage
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const savedContent = localStorage.getItem('siteContent');
    
    if (savedAuth === 'true') {
      setIsAdmin(true);
    }
    
    if (savedContent) {
      try {
        setSiteContent(JSON.parse(savedContent));
      } catch (e) {
        console.error('Erreur lors du chargement du contenu:', e);
      }
    }
  }, []);

  const login = async (email: string, phone: string, password: string, securityAnswer: string): Promise<boolean> => {
    // Credentials d'administrateur
    const ADMIN_EMAIL = 'mindgraphixsolution@gmail.com';
    const ADMIN_PHONE = '+226 01 51 11 46';
    const ADMIN_PASSWORD = 'MINDSETGrapix2025';
    const SECURITY_ANSWER = 'Badiori';

    // Vérification des identifiants
    if (
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      phone === ADMIN_PHONE &&
      password === ADMIN_PASSWORD &&
      securityAnswer.toLowerCase() === SECURITY_ANSWER.toLowerCase()
    ) {
      setIsAdmin(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    localStorage.removeItem('adminAuth');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const updateContent = (key: string, value: any) => {
    const newContent = { ...siteContent, [key]: value };
    setSiteContent(newContent);
    localStorage.setItem('siteContent', JSON.stringify(newContent));
  };

  const getContent = (key: string, defaultValue: any = '') => {
    return siteContent[key] || defaultValue;
  };

  return (
    <AuthContext.Provider value={{
      isAdmin,
      isEditMode,
      login,
      logout,
      toggleEditMode,
      updateContent,
      getContent,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
