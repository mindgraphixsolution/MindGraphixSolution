import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthUser, Role } from '@shared/auth';

const prisma = new PrismaClient();

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Middleware pour vérifier le token JWT
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token manquant',
        message: 'Token d\'authentification requis'
      });
    }

    // Vérifier si le token existe en base et n'est pas expiré
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        error: 'Token invalide',
        message: 'Token expiré ou invalide'
      });
    }

    // Vérifier le JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Vérifier que l'utilisateur est toujours actif
    if (!session.user.isActive) {
      return res.status(401).json({
        error: 'Compte désactivé',
        message: 'Votre compte a été désactivé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role as Role
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      error: 'Token invalide',
      message: 'Token d\'authentification invalide'
    });
  }
};

// Middleware pour vérifier les rôles
export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'Privilèges insuffisants'
      });
    }

    next();
  };
};

// Middleware pour les admins uniquement
export const requireAdmin = requireRole([Role.ADMIN]);

// Middleware pour les admins et modérateurs
export const requireModerator = requireRole([Role.ADMIN, Role.MODERATOR]);

// Middleware optionnel d'authentification (n'échoue pas si pas de token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true }
      });

      if (session && session.expiresAt > new Date() && session.user.isActive) {
        req.user = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          role: session.user.role as Role
        };
      }
    }
  } catch (error) {
    console.error('Erreur d\'authentification optionnelle:', error);
  }
  
  next();
};
