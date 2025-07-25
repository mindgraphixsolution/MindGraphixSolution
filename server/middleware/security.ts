import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Configuration CORS sécurisée
export const corsConfig = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Remplacer par votre domaine en production
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Configuration Helmet pour la sécurité
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par IP
  message: {
    error: 'Trop de requêtes',
    message: 'Trop de requêtes de cette IP, réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limite de 5 tentatives de connexion par IP
  message: {
    error: 'Trop de tentatives de connexion',
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware pour logger les erreurs
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next(error);
};

// Middleware pour gérer les erreurs
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: isDevelopment ? error.message : 'Une erreur est survenue',
    ...(isDevelopment && { stack: error.stack })
  });
};
