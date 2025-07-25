import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "../services/database";
import { AuthUser } from "../services/auth";

type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Middleware pour vérifier le token JWT
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: "Token manquant",
        message: "Token d'authentification requis",
      });
    }

    // Vérifier si le token existe en base et n'est pas expiré
    const session = await db.findSessionByToken(token);

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        error: "Token invalide",
        message: "Token expiré ou invalide",
      });
    }

    // Vérifier le JWT
    const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Récupérer l'utilisateur
    const user = await db.findUserById(session.userId);
    if (!user) {
      return res.status(401).json({
        error: "Utilisateur non trouvé",
        message: "Utilisateur associé au token non trouvé",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(401).json({
      error: "Token invalide",
      message: "Token d'authentification invalide",
    });
  }
};

// Middleware pour vérifier les rôles
export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Non authentifié",
        message: "Authentification requise",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Accès refusé",
        message: "Privilèges insuffisants",
      });
    }

    next();
  };
};

// Middleware pour les admins normaux et super admins
export const requireAdmin = requireRole(["ADMIN", "SUPER_ADMIN"]);

// Middleware pour les super admins uniquement
export const requireSuperAdmin = requireRole(["SUPER_ADMIN"]);

// Middleware pour les admins et modérateurs
export const requireModerator = requireRole([
  "ADMIN",
  "SUPER_ADMIN",
  "MODERATOR",
]);

// Middleware optionnel d'authentification (n'échoue pas si pas de token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const session = await db.findSessionByToken(token);

      if (session && session.expiresAt > new Date()) {
        const user = await db.findUserById(session.userId);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          };
        }
      }
    }
  } catch (error) {
    console.error("Erreur d'authentification optionnelle:", error);
  }

  next();
};
