import { RequestHandler } from 'express';
import { AdminService } from '../services/admin';

// Obtenir la hiérarchie des privilèges
export const getPrivilegeHierarchy: RequestHandler = async (req, res) => {
  try {
    const hierarchy = AdminService.getPrivilegeHierarchy();
    
    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la hiérarchie:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Erreur lors de la récupération de la hiérarchie'
    });
  }
};

// Lister tous les admins (super admin uniquement)
export const getAllAdmins: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Token d\'authentification requis'
      });
    }

    const admins = await AdminService.getAllAdmins(req.user.id);
    
    res.json({
      success: true,
      data: admins,
      message: `${admins.length} administrateur(s) trouvé(s)`
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des admins:', error);
    res.status(403).json({
      error: 'Accès refusé',
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération des admins'
    });
  }
};

// Promouvoir un utilisateur à admin
export const promoteToAdmin: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Token d\'authentification requis'
      });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'ID utilisateur requis'
      });
    }

    await AdminService.promoteToAdmin(userId, req.user.id);
    
    res.json({
      success: true,
      message: 'Utilisateur promu admin avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la promotion:', error);
    res.status(403).json({
      error: 'Erreur de promotion',
      message: error instanceof Error ? error.message : 'Erreur lors de la promotion'
    });
  }
};

// Promouvoir un admin à super admin
export const promoteToSuperAdmin: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Token d\'authentification requis'
      });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'ID utilisateur requis'
      });
    }

    await AdminService.promoteToSuperAdmin(userId, req.user.id);
    
    res.json({
      success: true,
      message: 'Admin promu super admin avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la promotion super admin:', error);
    res.status(403).json({
      error: 'Erreur de promotion',
      message: error instanceof Error ? error.message : 'Erreur lors de la promotion super admin'
    });
  }
};

// Rétrograder un admin
export const demoteAdmin: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Token d\'authentification requis'
      });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'ID utilisateur requis'
      });
    }

    await AdminService.demoteAdmin(userId, req.user.id);
    
    res.json({
      success: true,
      message: 'Admin rétrogradé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la rétrogradation:', error);
    res.status(403).json({
      error: 'Erreur de rétrogradation',
      message: error instanceof Error ? error.message : 'Erreur lors de la rétrogradation'
    });
  }
};

// Créer un admin directement
export const createAdmin: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Token d\'authentification requis'
      });
    }

    const { email, username, password, firstName, lastName, role } = req.body;
    
    if (!email || !username || !password || !role) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'Email, username, password et role sont requis'
      });
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({
        error: 'Rôle invalide',
        message: 'Le rôle doit être ADMIN ou SUPER_ADMIN'
      });
    }

    const newAdmin = await AdminService.createAdmin({
      email,
      username,
      password,
      firstName,
      lastName,
      role
    }, req.user.id);
    
    res.status(201).json({
      success: true,
      message: `${role} créé avec succès`,
      data: newAdmin
    });
  } catch (error) {
    console.error('Erreur lors de la création admin:', error);
    res.status(400).json({
      error: 'Erreur de création',
      message: error instanceof Error ? error.message : 'Erreur lors de la création de l\'admin'
    });
  }
};
