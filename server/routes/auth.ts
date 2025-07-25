import { RequestHandler } from "express";
import { AuthService } from "../services/auth";
import { LoginRequest, RegisterRequest } from "../../shared/auth.js";

// Inscription
export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const data: RegisterRequest = req.body;
    const authResponse = await AuthService.register(data);

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      data: authResponse,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(400).json({
      error: "Erreur d'inscription",
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du compte",
    });
  }
};

// Connexion
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const data: LoginRequest = req.body;
    const authResponse = await AuthService.login(data);

    res.json({
      success: true,
      message: "Connexion réussie",
      data: authResponse,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(401).json({
      error: "Erreur de connexion",
      message:
        error instanceof Error ? error.message : "Erreur lors de la connexion",
    });
  }
};

// Déconnexion
export const handleLogout: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      await AuthService.logout(token);
    }

    res.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    res.status(500).json({
      error: "Erreur de déconnexion",
      message: "Erreur lors de la déconnexion",
    });
  }
};

// Profil utilisateur
export const handleProfile: RequestHandler = async (req, res) => {
  try {
    // req.user est ajouté par le middleware d'authentification
    if (!req.user) {
      return res.status(401).json({
        error: "Non authentifié",
        message: "Token d'authentification requis",
      });
    }

    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Erreur lors de la récupération du profil",
    });
  }
};

// Rafraîchir le token
export const handleRefreshToken: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token manquant",
        message: "Token d'authentification requis",
      });
    }

    const authResponse = await AuthService.refreshToken(token);

    res.json({
      success: true,
      message: "Token rafraîchi avec succès",
      data: authResponse,
    });
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    res.status(401).json({
      error: "Erreur de rafraîchissement",
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors du rafraîchissement du token",
    });
  }
};

// Changer le mot de passe
export const handleChangePassword: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Non authentifié",
        message: "Token d'authentification requis",
      });
    }

    const { oldPassword, newPassword } = req.body;

    await AuthService.changePassword(req.user.id, oldPassword, newPassword);

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    res.status(400).json({
      error: "Erreur de changement de mot de passe",
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors du changement de mot de passe",
    });
  }
};
