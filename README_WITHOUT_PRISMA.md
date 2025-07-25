# 🚀 MindGraphix Solution - Sans Prisma

## ✅ État actuel
Le projet fonctionne maintenant **sans aucune dépendance Prisma** !

## 🔄 Changements effectués

### Suppression de Prisma
- ❌ Suppression de `prisma` et `@prisma/client`
- ❌ Suppression du dossier `prisma/`
- ❌ Suppression des scripts de base de données
- ❌ Suppression des références dans la documentation

### Nouvelle base de données
- ✅ Base de données en mémoire (`server/services/database.ts`)
- ✅ Authentification JWT complète conservée
- ✅ Gestion des rôles (USER, MODERATOR, ADMIN, SUPER_ADMIN)
- ✅ Upload de fichiers sécurisé
- ✅ Administration des utilisateurs

## 🔧 Démarrage rapide

### 1. Installation
```bash
npm install
```

### 2. Variables d'environnement
Créez un fichier `.env` avec :
```bash
JWT_SECRET="votre-secret-jwt-ici"
PORT=8080
NODE_ENV="development"
MAX_FILE_SIZE=10485760
```

### 3. Démarrage
```bash
# Mode développement
npm run dev

# Build et production
npm run build
npm start
```

## 🎯 Accès rapide

### Super Admin par défaut
- **Email**: `superadmin@fusion.com`
- **Mot de passe**: `admin123`

### Endpoints principaux
- **POST** `/api/auth/register` - Inscription
- **POST** `/api/auth/login` - Connexion
- **POST** `/api/upload` - Upload d'image
- **GET** `/api/admin/users` - Liste des utilisateurs (admin)

## ⚠️ Limitations
- Les données sont stockées en mémoire et perdues au redémarrage
- Pour la production, envisagez une base de données persistante
- Les fichiers uploadés restent sur le disque dans `/public/uploads`

## 🛠️ Commandes disponibles
- `npm run dev` - Serveur de développement
- `npm run build` - Build complet
- `npm run typecheck` - Vérification TypeScript
- `npm run format.fix` - Formatage du code
