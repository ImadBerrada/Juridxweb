# JuridX - Cabinet de Conseil Juridique International

Site web premium pour **Abderrahman Adel**, avocat international et consultant en stratégie d'entreprise, fondateur de JuridX. Ce projet combine expertise juridique, technologie avancée et design moderne pour offrir une présence en ligne exceptionnelle.

## 🎯 Profil d'Abderrahman Adel

- **Fondateur de JuridX** - Cabinet de conseil juridique international
- **Formation académique d'élite** :
  - LL.M. en Droit International des Affaires
  - MSc en Intelligence Artificielle et Science des Données  
  - Honours Bachelor of Engineering
  - Certificat en Relations Internationales (University of London)
- **10+ années d'expérience** académique et professionnelle à Londres
- **Expertise unique** : Droit international, structuration juridique multi-juridictionnelle, stratégie d'entreprise, IA & Data Science

## 🚀 Fonctionnalités

### Frontend
- **Design Premium** : Interface moderne avec thème noir et or
- **Animations Fluides** : Framer Motion pour une expérience utilisateur exceptionnelle
- **Responsive Design** : Optimisé pour tous les appareils
- **SEO Optimisé** : Métadonnées complètes et Open Graph
- **Performance** : Next.js 14 avec App Router pour des performances optimales

### Backend Complet
- **Base de Données** : SQLite avec Prisma ORM
- **Authentification** : JWT avec cookies sécurisés
- **API RESTful** : Endpoints complets pour toutes les fonctionnalités
- **Gestion de Contenu** : CRUD pour services, témoignages, blog
- **Email Automatisé** : Intégration Resend pour notifications
- **Dashboard Admin** : Statistiques et gestion complète

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router) + TypeScript
- **Styling** : Tailwind CSS v4 avec thème personnalisé
- **Composants** : shadcn/ui pour une interface cohérente
- **Animations** : Framer Motion 11
- **Icônes** : lucide-react
- **Formulaires** : React Hook Form + Zod validation
- **Base de Données** : SQLite + Prisma ORM
- **Authentification** : JWT + bcryptjs
- **Email** : Resend pour notifications automatisées
- **Fonts** : Geist Sans/Mono

## 📊 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/logout` - Déconnexion

### Contacts
- `POST /api/contact` - Créer une demande de contact
- `GET /api/contact` - Lister les contacts (admin)

### Consultations
- `POST /api/consultations` - Demander une consultation
- `GET /api/consultations` - Lister les consultations

### Services
- `GET /api/services` - Lister les services
- `POST /api/services` - Créer un service (admin)

### Témoignages
- `GET /api/testimonials` - Lister les témoignages approuvés
- `POST /api/testimonials` - Soumettre un témoignage
- `PATCH /api/testimonials` - Approuver/modifier (admin)

### Blog
- `GET /api/blog` - Lister les articles
- `POST /api/blog` - Créer un article (admin)

### Newsletter
- `POST /api/newsletter` - S'abonner à la newsletter
- `DELETE /api/newsletter` - Se désabonner

### Administration
- `GET /api/admin/dashboard` - Statistiques du dashboard

## 🗄️ Modèle de Base de Données

### Modèles Principaux
- **User** : Utilisateurs et administrateurs
- **Contact** : Demandes de contact
- **Service** : Services juridiques proposés
- **Testimonial** : Témoignages clients
- **Consultation** : Demandes de consultation
- **BlogPost** : Articles de blog
- **Newsletter** : Abonnements newsletter
- **Settings** : Configuration du site

## 🚀 Installation et Démarrage

```bash
# Cloner le projet
git clone [repository-url]
cd juridxwe

# Installer les dépendances
npm install

# Configurer l'environnement
cp env.example .env
# Modifier .env avec vos clés API

# Initialiser la base de données
npm run db:push
npm run db:seed

# Démarrer en développement
npm run dev
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run start        # Démarrage production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript

# Scripts base de données
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma
npm run db:migrate   # Créer une migration
npm run db:seed      # Peupler la base de données
npm run db:studio    # Interface Prisma Studio
npm run db:reset     # Réinitialiser la base
```

## 🔐 Variables d'Environnement

```env
# Base de données
DATABASE_URL="file:./dev.db"

# Authentification
JWT_SECRET="your-jwt-secret-here"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key-here"

# Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin par défaut
ADMIN_EMAIL="admin@juridx.com"
ADMIN_PASSWORD="admin123"
```

## 🎨 Thème et Design

Le site utilise un thème premium noir et or qui reflète le prestige et l'expertise d'Abderrahman Adel :

- **Couleurs principales** : Noir (#0a0a0a) et Or (#d4af37)
- **Typography** : Geist Sans pour une lisibilité optimale
- **Animations** : Transitions fluides avec Framer Motion
- **Responsive** : Design adaptatif pour tous les écrans

## 📧 Fonctionnalités Email

- **Notifications automatiques** pour les nouvelles demandes
- **Emails de confirmation** pour les clients
- **Templates HTML** personnalisés avec branding JuridX
- **Gestion des erreurs** et fallback gracieux

## 🔒 Sécurité

- **Authentification JWT** avec cookies HttpOnly
- **Validation Zod** pour toutes les entrées
- **Hachage bcrypt** pour les mots de passe
- **Protection CSRF** et headers sécurisés
- **Validation côté serveur** pour toutes les API

## 📈 Fonctionnalités Admin

- **Dashboard complet** avec statistiques en temps réel
- **Gestion des contacts** et consultations
- **Modération des témoignages**
- **Gestion du blog** et contenu
- **Analytics** et rapports mensuels

## 🌐 Déploiement

Le projet est optimisé pour le déploiement sur :
- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **Railway** ou **PlanetScale** pour la base de données

## 📞 Contact

**Abderrahman Adel**  
Fondateur - JuridX  
📧 contact@juridx.com  
📱 +44 (0) 20 7123 4567  
🏢 London Business District, Londres, Royaume-Uni

---

*Développé avec ❤️ pour l'excellence juridique internationale*
