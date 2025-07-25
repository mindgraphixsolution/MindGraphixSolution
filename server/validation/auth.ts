import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation pour l'inscription
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Nom d\'utilisateur: 3-30 caractères, lettres, chiffres et _ uniquement'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Mot de passe: minimum 8 caractères avec au moins 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial'),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('Prénom: 1-50 caractères'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .trim()
    .withMessage('Nom: 1-50 caractères'),
];

// Validation pour la connexion
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis'),
];

// Validation pour le changement de mot de passe
export const validatePasswordChange = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Ancien mot de passe requis'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Nouveau mot de passe: minimum 8 caractères avec au moins 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial'),
];

// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      message: 'Les données fournies ne sont pas valides',
      details: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg
      }))
    });
  }
  
  next();
};
