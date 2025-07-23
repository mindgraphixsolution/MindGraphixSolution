import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  isLoggedIn: boolean;
  currentUser: { email: string; name?: string } | null;
  isEditMode: boolean;
  login: (email: string, phone: string, password: string, securityAnswer: string) => Promise<boolean>;
  loginUser: (email: string, password: string, name?: string) => Promise<boolean>;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});

  // Charger l'état d'authentification au démarrage
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const savedUser = localStorage.getItem('currentUser');
    const savedContent = localStorage.getItem('siteContent');

    if (savedAuth === 'true') {
      setIsAdmin(true);
      setIsLoggedIn(true);
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Erreur lors du chargement de l\'utilisateur:', e);
      }
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

    console.log('Tentative de connexion admin:', {
      email: email.toLowerCase(),
      phone,
      password,
      securityAnswer: securityAnswer.toLowerCase()
    });

    console.log('Valeurs attendues:', {
      expectedEmail: ADMIN_EMAIL.toLowerCase(),
      expectedPhone: ADMIN_PHONE,
      expectedPassword: ADMIN_PASSWORD,
      expectedAnswer: SECURITY_ANSWER.toLowerCase()
    });

    // Vérification des identifiants
    if (
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      phone === ADMIN_PHONE &&
      password === ADMIN_PASSWORD &&
      securityAnswer.toLowerCase() === SECURITY_ANSWER.toLowerCase()
    ) {
      console.log('Connexion admin réussie !');
      setIsAdmin(true);
      setIsLoggedIn(true);
      setCurrentUser({ email, name: 'Administrateur' });
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ email, name: 'Administrateur' }));
      return true;
    }

    console.log('Connexion admin échouée');
    return false;
  };

  const loginUser = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Simulation de connexion utilisateur normal
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Pour la démo, accepter toute combinaison email/password
    if (email && password) {
      const user = { email, name: name || email.split('@')[0] };
      setIsLoggedIn(true);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsEditMode(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('currentUser');
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
