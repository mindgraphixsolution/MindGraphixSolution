import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, User } from "./database";

// Types pour les interfaces
interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
}

interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

  // Inscription d'un nouvel utilisateur
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Vérifier si l'email existe déjà
    const existingEmail = await db.findUserByEmail(data.email);

    if (existingEmail) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await db.findUserByUsername(data.username);

    if (existingUsername) {
      throw new Error("Ce nom d'utilisateur est déjà pris");
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Créer l'utilisateur
    const user = await db.createUser({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: "USER", // Par défaut USER
    });

    // Créer le token et la session
    return this.createAuthResponse(user);
  }

  // Connexion d'un utilisateur
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Trouver l'utilisateur par email
    const user = await db.findUserByEmail(data.email);

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Créer le token et la session
    return this.createAuthResponse(user);
  }

  // Déconnexion (supprimer la session)
  static async logout(token: string): Promise<void> {
    const session = await db.findSessionByToken(token);
    if (session) {
      await db.deleteSession(session.id);
    }
  }

  // Rafraîchir le token
  static async refreshToken(oldToken: string): Promise<AuthResponse> {
    const session = await db.findSessionByToken(oldToken);

    if (!session || session.expiresAt < new Date()) {
      throw new Error("Token invalide ou expiré");
    }

    const user = await db.findUserById(session.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Supprimer l'ancienne session
    await db.deleteSession(session.id);

    // Créer une nouvelle session
    return this.createAuthResponse(user);
  }

  // Obtenir un utilisateur par token
  static async getUserByToken(token: string): Promise<AuthUser | null> {
    const session = await db.findSessionByToken(token);

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const user = await db.findUserById(session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  // Créer la réponse d'authentification avec token
  private static async createAuthResponse(user: User): Promise<AuthResponse> {
    // Créer le payload JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Générer le token JWT
    const token = jwt.sign(payload, AuthService.JWT_SECRET as string, {
      expiresIn: AuthService.JWT_EXPIRES_IN as string,
    });

    // Calculer la date d'expiration (en accord avec JWT_EXPIRES_IN si possible)
    let expiresAt: Date;
    if (typeof AuthService.JWT_EXPIRES_IN === "string" && AuthService.JWT_EXPIRES_IN.endsWith("d")) {
      const days = parseInt(AuthService.JWT_EXPIRES_IN);
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (isNaN(days) ? 7 : days));
    } else {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    // Sauvegarder la session en base
    await db.createSession({
      userId: user.id,
      token,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
      expiresAt: expiresAt.toISOString(),
    };
  }

  // Nettoyer les sessions expirées
  static async cleanExpiredSessions(): Promise<void> {
    // Cette méthode est déjà implémentée automatiquement dans database.ts
    db.cleanExpiredSessions();
  }

  // Changer le mot de passe
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await db.findUserById(userId);

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier l'ancien mot de passe
    const validPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validPassword) {
      throw new Error("Ancien mot de passe incorrect");
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Mettre à jour le mot de passe
    await db.updateUser(userId, { password: hashedPassword });

    // Supprimer toutes les sessions existantes (forcer nouvelle connexion)
    await db.deleteSessionsByUserId(userId);
  }
}

// Exporter les types pour les autres modules
export type { RegisterRequest, LoginRequest, AuthUser, AuthResponse };
