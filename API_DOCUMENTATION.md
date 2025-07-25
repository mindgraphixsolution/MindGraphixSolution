# 🚀 API Fusion - Documentation Complète

## Vue d'ensemble

Votre API Fusion est maintenant équipée d'une stack backend complète et sécurisée :

- **🔐 Authentification JWT** avec sessions en base
- **🛡️ Sécurité renforcée** (Helmet, CORS, Rate Limiting)
- **👥 Gestion des rôles** (USER, MODERATOR, ADMIN)
- **📁 Upload sécurisé** avec Multer + validation
- **💾 Base de données** PostgreSQL via Prisma ORM
- **✅ Validation** des données avec express-validator

## 🔧 Configuration

### Variables d'environnement (.env)

```bash
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/fusiondb?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=8080
NODE_ENV="development"

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./public/uploads"
```

### Commandes disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement

# Base de données
npm run db:generate      # Générer le client Prisma
npm run db:push          # Pousser le schéma vers la DB
npm run db:migrate       # Créer une migration
npm run db:studio        # Interface graphique Prisma
npm run db:seed          # Créer les données de test

# Build & production
npm run build            # Build complet
npm run start            # Démarrer en production
```

## 🔐 Authentification

### Endpoints d'authentification

| Méthode | Endpoint | Description | Rate Limit |
|---------|----------|-------------|------------|
| POST | `/api/auth/register` | Inscription | 5/15min |
| POST | `/api/auth/login` | Connexion | 5/15min |
| POST | `/api/auth/logout` | Déconnexion | - |
| GET | `/api/auth/profile` | Profil utilisateur | - |
| POST | `/api/auth/refresh-token` | Rafraîchir le token | - |
| POST | `/api/auth/change-password` | Changer mot de passe | - |

### Exemple d'inscription

```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'myusername',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const data = await response.json();
// { success: true, data: { user, token, expiresAt } }
```

### Exemple de connexion

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();
// { success: true, data: { user, token, expiresAt } }
```

### Utilisation du token

```javascript
const token = localStorage.getItem('authToken');

const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 👥 Gestion des rôles

### Rôles disponibles

- **USER** : Utilisateur standard
- **MODERATOR** : Modérateur avec privilèges étendus
- **ADMIN** : Administrateur normal - Gestion des utilisateurs
- **SUPER_ADMIN** : Administrateur suprême - Privilèges maximum

### Middleware de protection

```javascript
// Routes protégées par authentification
app.get('/api/protected', authenticateToken, handler);

// Routes admin uniquement
app.get('/api/admin/*', authenticateToken, requireAdmin, handler);

// Routes admin + modérateur
app.get('/api/moderator/*', authenticateToken, requireModerator, handler);

// Authentification optionnelle
app.get('/api/public', optionalAuth, handler);
```

## 📁 Upload de fichiers

### Endpoints d'upload

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/upload/image` | Upload multiple (Multer) | ✅ |
| POST | `/api/upload/legacy` | Upload base64 (compatibilité) | ✅ |
| GET | `/api/upload/images` | Liste des images | ✅ |
| DELETE | `/api/upload/image/:id` | Supprimer une image | ✅ |

### Upload avec formulaire (recommandé)

```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);

const response = await fetch('/api/upload/image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Upload base64 (legacy)

```javascript
const response = await fetch('/api/upload/legacy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...',
    fileName: 'my-image.png'
  })
});
```

## 🛡️ Sécurité

### Mesures de sécurité implémentées

- **Helmet** : Protection contre les attaques XSS, CSRF, etc.
- **CORS** : Configuration stricte des origines autorisées
- **Rate Limiting** : 100 req/15min (API), 5 req/15min (auth)
- **Validation** : Validation stricte des entrées utilisateur
- **Hash bcrypt** : Mots de passe hashés avec salt (12 rounds)
- **JWT sécurisés** : Tokens avec expiration + sessions en base
- **Upload sécurisé** : Validation MIME type + extensions

### Exemples de validation

```javascript
// Mot de passe fort requis
// - Minimum 8 caractères
// - Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial

// Username
// - 3-30 caractères
// - Lettres, chiffres et underscore uniquement

// Email
// - Format email valide
// - Normalisé automatiquement
```

## 📊 Base de données

### Modèles Prisma

```typescript
// User
{
  id: string
  email: string (unique)
  username: string (unique)
  password: string (hashed)
  role: Role (USER | MODERATOR | ADMIN)
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}

// Session
{
  id: string
  token: string (unique)
  userId: string
  expiresAt: DateTime
  createdAt: DateTime
}

// Upload
{
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  path: string
  userId?: string
  createdAt: DateTime
}
```

## 🚀 Déploiement

### Pour la production

1. **Configurez les variables d'environnement** :
   ```bash
   DATABASE_URL="your-production-db-url"
   JWT_SECRET="your-super-secure-jwt-secret"
   NODE_ENV="production"
   ```

2. **Configurez CORS** pour votre domaine :
   ```javascript
   origin: ['https://your-domain.com']
   ```

3. **Générez et poussez la base** :
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Build et démarrage** :
   ```bash
   npm run build
   npm start
   ```

## 🧪 Tests et développement

### Comptes de test (après seeding)

```
Admin:
- Email: admin@fusion.dev
- Password: Admin123!

User:
- Email: user@test.com  
- Password: User123!

Moderator:
- Email: moderator@test.com
- Password: Mod123!
```

### Prisma Studio

```bash
npm run db:studio
```
Interface graphique pour visualiser et modifier la base de données.

## 📚 Types TypeScript partagés

Vos types sont définis dans `shared/auth.ts` et peuvent être utilisés côté client et serveur :

```typescript
import { User, AuthResponse, LoginRequest } from '@shared/auth';
```

## 🔧 Extensibilité

Votre API est maintenant prête pour :
- ✅ Intégration mobile (React Native/Flutter)
- ✅ Dashboard admin React
- ✅ Paiements (Stripe, Orange Money)
- ✅ Notifications en temps réel
- ✅ Statistiques et monitoring
- ✅ Stockage cloud (Cloudinary, S3)

---

**🎉 Votre stack backend est maintenant production-ready avec toutes les meilleures pratiques de sécurité !**
