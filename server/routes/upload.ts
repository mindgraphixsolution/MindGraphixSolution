import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleImageUpload: RequestHandler = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un super admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('SuperAdmin ')) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(__dirname, "../../public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const imageData = req.body.imageData;
    const fileName = req.body.fileName || `image_${Date.now()}.png`;

    if (!imageData) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    // Décoder l'image base64
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Sauvegarder le fichier
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, imageBuffer);

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/${fileName}`;
    
    res.json({ 
      success: true, 
      url: imageUrl,
      message: "Image uploadée avec succès"
    });

  } catch (error) {
    console.error("Erreur upload:", error);
    res.status(500).json({ error: "Erreur lors de l'upload" });
  }
};

export const handleGetImages: RequestHandler = (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, "../../public/uploads");
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ images: [] });
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        name: file,
        url: `/uploads/${file}`,
        size: fs.statSync(path.join(uploadsDir, file)).size
      }));

    res.json({ images });
  } catch (error) {
    console.error("Erreur lors de la récupération des images:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
