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

  // Routes admin (exemple)
  app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
    res.json({
      message: "Route admin - Liste des utilisateurs",
      user: req.user
    });
  });

  // Routes modérateur (exemple)
  app.get("/api/moderator/reports", authenticateToken, requireModerator, (req, res) => {
    res.json({
      message: "Route modérateur - Rapports",
      user: req.user
    });
  });

  // Middleware de gestion d'erreurs (à la fin)
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}
