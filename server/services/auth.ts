import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  AuthUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Role,
} from "@shared/auth";

const prisma = new PrismaClient();

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

  // Inscription d'un nouvel utilisateur
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new Error("Ce nom d'utilisateur est déjà pris");
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: Role.USER, // Par défaut USER
      },
    });

    // Créer le token et la session
    return this.createAuthResponse(user);
  }

  // Connexion d'un utilisateur
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      throw new Error("Compte désactivé");
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
    await prisma.session.delete({
      where: { token },
    });
  }

  // Rafraîchir le token
  static async refreshToken(oldToken: string): Promise<AuthResponse> {
    const session = await prisma.session.findUnique({
      where: { token: oldToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new Error("Token invalide ou expiré");
    }

    // Supprimer l'ancienne session
    await prisma.session.delete({
      where: { token: oldToken },
    });

    // Créer une nouvelle session
    return this.createAuthResponse(session.user);
  }

  // Obtenir un utilisateur par token
  static async getUserByToken(token: string): Promise<AuthUser | null> {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role as Role,
    };
  }

  // Créer la réponse d'authentification avec token
  private static async createAuthResponse(user: any): Promise<AuthResponse> {
    // Créer le payload JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Générer le token JWT
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours par défaut

    // Sauvegarder la session en base
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role as Role,
      },
      token,
      expiresAt: expiresAt.toISOString(),
    };
  }

  // Nettoyer les sessions expirées
  static async cleanExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  // Changer le mot de passe
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

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
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Supprimer toutes les sessions existantes (forcer nouvelle connexion)
    await prisma.session.deleteMany({
      where: { userId },
    });
  }
}
