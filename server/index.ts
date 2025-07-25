import express from "express";
import { handleDemo } from "./routes/demo";
import { handleImageUpload, handleGetImages, handleDeleteImage, handleLegacyImageUpload } from "./routes/upload";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleProfile,
  handleRefreshToken,
  handleChangePassword
} from "./routes/auth";
import {
  corsConfig,
  helmetConfig,
  apiLimiter,
  authLimiter,
  errorLogger,
  errorHandler
} from "./middleware/security";
import {
  authenticateToken,
  requireAdmin,
  requireSuperAdmin,
  requireModerator,
  optionalAuth
} from "./middleware/auth";
import {
  validateRegister,
  validateLogin,
  validatePasswordChange,
  handleValidationErrors
} from "./validation/auth";

export function createServer() {
  const app = express();

  // Middleware de sécurité globaux
  app.use(helmetConfig);
  app.use(corsConfig);
  app.use(apiLimiter);

  // Parsing des données
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Servir les fichiers statiques depuis public
  app.use(express.static('public'));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Fusion API v3.0 - Sécurisé avec JWT",
      timestamp: new Date().toISOString(),
      status: "healthy"
    });
  });

  // Routes d'authentification (avec rate limiting spécial)
  app.post("/api/auth/register", authLimiter, validateRegister, handleValidationErrors, handleRegister);
  app.post("/api/auth/login", authLimiter, validateLogin, handleValidationErrors, handleLogin);
  app.post("/api/auth/logout", authenticateToken, handleLogout);
  app.get("/api/auth/profile", authenticateToken, handleProfile);
  app.post("/api/auth/refresh-token", handleRefreshToken);
  app.post("/api/auth/change-password", authenticateToken, validatePasswordChange, handleValidationErrors, handleChangePassword);

  // Routes publiques
  app.get("/api/demo", optionalAuth, handleDemo);

  // Routes d'upload protégées
  app.post("/api/upload/image", authenticateToken, handleImageUpload);
  app.post("/api/upload/legacy", authenticateToken, handleLegacyImageUpload); // Compatibilité base64
  app.get("/api/upload/images", authenticateToken, handleGetImages);
  app.delete("/api/upload/image/:id", authenticateToken, handleDeleteImage);

  // Routes SUPER ADMIN uniquement (privilèges maximum)
  app.get("/api/superadmin/system", authenticateToken, requireSuperAdmin, (req, res) => {
    res.json({
      message: "Route SUPER ADMIN - Configuration système",
      user: req.user,
      privileges: "MAXIMUM - Accès à tout le système"
    });
  });

  app.get("/api/superadmin/all-users", authenticateToken, requireSuperAdmin, (req, res) => {
    res.json({
      message: "Route SUPER ADMIN - Tous les utilisateurs + admins",
      user: req.user,
      note: "Seul le super admin peut voir cette route"
    });
  });

  // Routes admin normaux et super admins
  app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
    res.json({
      message: "Route admin - Liste des utilisateurs",
      user: req.user,
      level: req.user?.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'
    });
  });

  // Routes modérateur, admin et super admin
  app.get("/api/moderator/reports", authenticateToken, requireModerator, (req, res) => {
    res.json({
      message: "Route modérateur - Rapports",
      user: req.user,
      level: req.user?.role
    });
  });

  // Middleware de gestion d'erreurs (à la fin)
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}
