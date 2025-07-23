import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoggedIn: boolean;
  currentUser: { email: string; name?: string } | null;
  isEditMode: boolean;
  login: (
    email: string,
    phone: string,
    password: string,
    securityAnswer: string,
  ) => Promise<boolean>;
  loginUser: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<boolean>;
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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name?: string;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, any>>({});

  // Charger l'état d'authentification au démarrage
  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    const savedSuperAuth = localStorage.getItem("superAdminAuth");
    const savedUser = localStorage.getItem("currentUser");
    const savedContent = localStorage.getItem("siteContent");

    if (savedSuperAuth === "true") {
      setIsSuperAdmin(true);
      setIsAdmin(true);
      setIsLoggedIn(true);
    } else if (savedAuth === "true") {
      setIsAdmin(true);
      setIsLoggedIn(true);
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Erreur lors du chargement de l'utilisateur:", e);
      }
    }

    if (savedContent) {
      try {
        setSiteContent(JSON.parse(savedContent));
      } catch (e) {
        console.error("Erreur lors du chargement du contenu:", e);
      }
    }
  }, []);

  const login = async (
    email: string,
    phone: string,
    password: string,
    securityAnswer: string,
  ): Promise<boolean> => {
    console.log("Tentative de connexion admin:", {
      email: email.toLowerCase(),
      phone,
      password,
      securityAnswer: securityAnswer.toLowerCase(),
    });

    console.log("Administrateurs disponibles:", allAdmins.map(admin => ({
      email: admin.email,
      phone: admin.phone,
      normalizedPhone: normalizePhone(admin.phone),
      isActive: admin.isActive
    })));

    // Charger les administrateurs depuis le stockage
    const savedAdmins = JSON.parse(localStorage.getItem("siteContent") || "{}");
    const systemAdmins = savedAdmins["system.admins"] || [];

    // Administrateurs par défaut (toujours présents)
    const defaultAdmins = [
      {
        email: "mindgraphixsolution@gmail.com",
        phone: "+226 01 51 11 46",
        password: "MINDSETGrapix2025",
        securityAnswer: "Badiori",
        name: "Administrateur Principal",
        role: "admin",
        isActive: true,
      },
      {
        email: "philippefaizsanon@gmail.com",
        phone: "+226 54191605",
        password: "Philius24648",
        securityAnswer: "Lil Nas X",
        name: "Super Administrateur",
        role: "super_admin",
        isActive: true,
      },
    ];

    // Fusionner avec les administrateurs créés dynamiquement
    const allAdmins = [...defaultAdmins];
    systemAdmins.forEach((admin: any) => {
      if (
        !defaultAdmins.find(
          (def) => def.email.toLowerCase() === admin.email.toLowerCase(),
        )
      ) {
        allAdmins.push(admin);
      }
    });

    // Normaliser le numéro de téléphone (supprimer espaces et caractères spéciaux)
    const normalizePhone = (phoneNumber: string): string => {
      return phoneNumber.replace(/[\s\-\(\)]/g, '').trim();
    };

    // Rechercher l'administrateur correspondant
    const matchingAdmin = allAdmins.find(
      (admin) =>
        admin.email.toLowerCase() === email.toLowerCase() &&
        normalizePhone(admin.phone) === normalizePhone(phone) &&
        admin.password === password &&
        admin.securityAnswer.toLowerCase() === securityAnswer.toLowerCase() &&
        admin.isActive,
    );

    if (matchingAdmin) {
      console.log("Connexion admin réussie !", matchingAdmin);

      if (matchingAdmin.role === "super_admin") {
        setIsSuperAdmin(true);
        setIsAdmin(true);
        localStorage.setItem("superAdminAuth", "true");
      } else {
        setIsAdmin(true);
        localStorage.setItem("adminAuth", "true");
      }

      setIsLoggedIn(true);
      setCurrentUser({ email, name: matchingAdmin.name });
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ email, name: matchingAdmin.name }),
      );
      return true;
    }

    console.log("Connexion admin échouée");
    return false;
  };

  const loginUser = async (
    email: string,
    password: string,
    name?: string,
  ): Promise<boolean> => {
    // Simulation de connexion utilisateur normal
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Pour la démo, accepter toute combinaison email/password
    if (email && password) {
      const user = { email, name: name || email.split("@")[0] };
      setIsLoggedIn(true);
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsEditMode(false);
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("currentUser");
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const updateContent = (key: string, value: any) => {
    const newContent = { ...siteContent, [key]: value };
    setSiteContent(newContent);
    localStorage.setItem("siteContent", JSON.stringify(newContent));
  };

  const getContent = (key: string, defaultValue: any = "") => {
    return siteContent[key] || defaultValue;
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isSuperAdmin,
        isLoggedIn,
        currentUser,
        isEditMode,
        login,
        loginUser,
        logout,
        toggleEditMode,
        updateContent,
        getContent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
