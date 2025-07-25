import { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration Multer avec sécurité
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join("public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique sécurisé
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.+/g, '.');
    
    const uniqueFilename = `${timestamp}_${randomId}_${sanitizedName}`;
    cb(null, uniqueFilename);
  }
});

// Filtres de sécurité pour les fichiers
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Types MIME autorisés
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // Extensions autorisées
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seules les images (JPEG, PNG, GIF, WebP) sont acceptées.'), false);
  }
};

// Configuration Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB par défaut
    files: 5 // Maximum 5 fichiers
  }
});

// Middleware d'upload avec gestion d'erreurs
export const uploadMiddleware = upload.array('images', 5);

// Handler pour l'upload d'images (nouvelle version sécurisée)
export const handleImageUpload: RequestHandler = async (req, res) => {
  try {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error("Erreur Multer:", err);
        return res.status(400).json({
          error: "Erreur d'upload",
          message: err.message
        });
      }

      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          error: "Aucun fichier fourni",
          message: "Veuillez sélectionner au moins un fichier à uploader"
        });
      }

      try {
        // Sauvegarder les informations en base de données
        const uploadedFiles = await Promise.all(
          files.map(async (file) => {
            const uploadRecord = await prisma.upload.create({
              data: {
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path,
                userId: req.user?.id || null
              }
            });

            return {
              id: uploadRecord.id,
              filename: file.filename,
              originalName: file.originalname,
              size: file.size,
              url: `/uploads/${file.filename}`,
              createdAt: uploadRecord.createdAt
            };
          })
        );

        res.json({
          success: true,
          message: `${uploadedFiles.length} fichier(s) uploadé(s) avec succès`,
          data: uploadedFiles
        });

      } catch (dbError) {
        console.error("Erreur base de données lors de l'upload:", dbError);
        
        // Supprimer les fichiers en cas d'erreur DB
        files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });

        res.status(500).json({
          error: "Erreur de sauvegarde",
          message: "Erreur lors de la sauvegarde en base de données"
        });
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Erreur interne lors de l'upload"
    });
  }
};

// Handler pour récupérer les images (version améliorée)
export const handleGetImages: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Récupérer uniquement les uploads de l'utilisateur connecté (ou tous si admin)
    const where = req.user?.role === 'ADMIN' 
      ? {} 
      : { userId: req.user?.id || null };

    const [uploads, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { username: true, email: true }
          }
        }
      }),
      prisma.upload.count({ where })
    ]);

    const images = uploads.map(upload => ({
      id: upload.id,
      filename: upload.filename,
      originalName: upload.originalName,
      size: upload.size,
      url: `/uploads/${upload.filename}`,
      createdAt: upload.createdAt,
      uploader: upload.user ? {
        username: upload.user.username,
        email: upload.user.email
      } : null
    }));

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Erreur lors de la récupération des images"
    });
  }
};

// Handler pour supprimer une image
export const handleDeleteImage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer l'upload
    const upload = await prisma.upload.findUnique({
      where: { id }
    });

    if (!upload) {
      return res.status(404).json({
        error: "Image non trouvée",
        message: "L'image demandée n'existe pas"
      });
    }

    // Vérifier les permissions (propriétaire ou admin)
    if (upload.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: "Accès refusé",
        message: "Vous ne pouvez supprimer que vos propres images"
      });
    }

    // Supprimer le fichier physique
    const filePath = path.join("public", "uploads", upload.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'enregistrement en base
    await prisma.upload.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Image supprimée avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({
      error: "Erreur serveur",
      message: "Erreur lors de la suppression de l'image"
    });
  }
};

// Handler pour l'upload legacy (base64) - maintenu pour compatibilité
export const handleLegacyImageUpload: RequestHandler = async (req, res) => {
  try {
    console.log("Upload legacy request received");

    const imageData = req.body.imageData;
    const fileName = req.body.fileName || `image_${Date.now()}.png`;

    if (!imageData) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    // Utiliser un chemin relatif plus simple
    const uploadsDir = "./public/uploads";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Décoder l'image base64
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Générer un nom unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(fileName);
    const uniqueFileName = `${timestamp}_${randomId}_${path.basename(fileName, ext)}${ext}`;

    // Sauvegarder le fichier
    const filePath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(filePath, imageBuffer);

    // Sauvegarder en base si utilisateur connecté
    let uploadRecord = null;
    if (req.user) {
      try {
        uploadRecord = await prisma.upload.create({
          data: {
            filename: uniqueFileName,
            originalName: fileName,
            mimetype: 'image/png', // Par défaut pour base64
            size: imageBuffer.length,
            path: filePath,
            userId: req.user.id
          }
        });
      } catch (dbError) {
        console.error("Erreur DB pour upload legacy:", dbError);
      }
    }

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/${uniqueFileName}`;

    console.log("Image uploaded successfully:", imageUrl);

    res.json({
      success: true,
      url: imageUrl,
      message: "Image uploadée avec succès",
      id: uploadRecord?.id
    });

  } catch (error) {
    console.error("Erreur upload legacy:", error);
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
};
