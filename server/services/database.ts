// Base de données en mémoire pour remplacer Prisma
import bcrypt from "bcrypt";

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  userId: string;
  createdAt: Date;
}

class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private uploads: Map<string, Upload> = new Map();
  private userIdCounter = 1;
  private sessionIdCounter = 1;
  private uploadIdCounter = 1;

  constructor() {
    this.initializeDefaultUsers();
  }

  private async initializeDefaultUsers() {
    // Créer un super admin par défaut
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const superAdmin: User = {
      id: "1",
      email: "superadmin@fusion.com",
      username: "superadmin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set("1", superAdmin);
    this.userIdCounter = 2;
  }

  // Méthodes pour les utilisateurs
  async createUser(data: {
    email: string;
    username: string;
    password: string;
    role?: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  }): Promise<User> {
    const id = this.userIdCounter.toString();
    this.userIdCounter++;

    const user: User = {
      id,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role || "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async findManyUsers(where?: { role?: string }): Promise<User[]> {
    const users = Array.from(this.users.values());
    if (where?.role) {
      return users.filter(user => user.role === where.role);
    }
    return users;
  }

  // Méthodes pour les sessions
  async createSession(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<Session> {
    const id = this.sessionIdCounter.toString();
    this.sessionIdCounter++;

    const session: Session = {
      id,
      userId: data.userId,
      token: data.token,
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    };

    this.sessions.set(id, session);
    return session;
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    for (const session of this.sessions.values()) {
      if (session.token === token) {
        return session;
      }
    }
    return null;
  }

  async deleteSession(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  async deleteSessionsByUserId(userId: string): Promise<void> {
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(id);
      }
    }
  }

  // Méthodes pour les uploads
  async createUpload(data: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    userId: string;
  }): Promise<Upload> {
    const id = this.uploadIdCounter.toString();
    this.uploadIdCounter++;

    const upload: Upload = {
      id,
      filename: data.filename,
      originalName: data.originalName,
      mimetype: data.mimetype,
      size: data.size,
      path: data.path,
      userId: data.userId,
      createdAt: new Date(),
    };

    this.uploads.set(id, upload);
    return upload;
  }

  async findManyUploads(options?: {
    where?: { userId?: string };
    skip?: number;
    take?: number;
  }): Promise<Upload[]> {
    let uploads = Array.from(this.uploads.values());

    if (options?.where?.userId) {
      uploads = uploads.filter(upload => upload.userId === options.where!.userId);
    }

    // Trier par date de création (plus récent en premier)
    uploads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.skip) {
      uploads = uploads.slice(options.skip);
    }

    if (options?.take) {
      uploads = uploads.slice(0, options.take);
    }

    return uploads;
  }

  async countUploads(where?: { userId?: string }): Promise<number> {
    let uploads = Array.from(this.uploads.values());

    if (where?.userId) {
      uploads = uploads.filter(upload => upload.userId === where.userId);
    }

    return uploads.length;
  }

  async findUploadById(id: string): Promise<Upload | null> {
    return this.uploads.get(id) || null;
  }

  async deleteUpload(id: string): Promise<void> {
    this.uploads.delete(id);
  }

  // Méthode utilitaire pour nettoyer les sessions expirées
  cleanExpiredSessions(): void {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(id);
      }
    }
  }
}

// Instance singleton de la base de données
export const db = new InMemoryDatabase();

// Nettoyer les sessions expirées toutes les heures
setInterval(() => {
  db.cleanExpiredSessions();
}, 60 * 60 * 1000);
