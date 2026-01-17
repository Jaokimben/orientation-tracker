# Orientation Tracker 2026

Application web de suivi d'orientation pour les études supérieures, spécialement conçue pour accompagner les lycéens dans leur parcours Parcoursup 2026.

## 🎯 Fonctionnalités

- ✅ Suivi des étapes d'orientation (JPO, dossiers, concours)
- 📊 Visualisation de la progression
- 📅 Calendrier des dates importantes
- 🎨 Interface moderne Neo-Brutalism
- 💾 Sauvegarde automatique des progrès

## 🚀 Déploiement sur Vercel

### Prérequis
- Un compte [Vercel](https://vercel.com)
- Repository GitHub connecté

### Configuration

1. **Variables d'environnement sur Vercel** :
   ```
   DATABASE_URL=file:/tmp/database.db
   JWT_SECRET=votre-secret-jwt-fort
   NODE_ENV=production
   ```

2. **Build Command** : `npm run build`

3. **Output Directory** : `dist`

4. **Install Command** : `npm install`

### ⚠️ Note sur SQLite et Vercel

SQLite n'est pas idéal pour Vercel en production car le système de fichiers est éphémère. Pour une solution de production robuste, considérez :

- **Option 1 (Recommandée)** : [Turso](https://turso.tech/) - Base SQLite distribuée
- **Option 2** : [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- **Option 3** : [PlanetScale](https://planetscale.com/) - MySQL serverless

### Migration vers Turso (Recommandé pour production)

```bash
# Installer Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Créer une base de données
turso db create orientation-tracker

# Obtenir l'URL de connexion
turso db show orientation-tracker --url

# Ajouter sur Vercel
DATABASE_URL=libsql://[votre-url].turso.io
```

## 💻 Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Le site sera accessible sur http://localhost:3000
```

## 📦 Build de Production

```bash
# Compiler l'application
npm run build

# Lancer en mode production
npm start
```

## 🗄️ Base de Données

### Initialisation locale

```bash
# Générer les migrations
npx drizzle-kit generate

# Appliquer les migrations
node migrate.mjs

# Créer l'utilisateur par défaut
node init-default-user.mjs
```

## 🛠️ Technologies

- **Frontend** : React 19, Vite, TailwindCSS, Radix UI
- **Backend** : Node.js, Express, tRPC
- **Base de données** : SQLite (dev), Drizzle ORM
- **Déploiement** : Vercel

## 📝 Scripts Disponibles

- `npm run dev` - Développement avec hot reload
- `npm run build` - Build de production
- `npm start` - Lancer en production
- `npm run check` - Vérifier TypeScript
- `npm run format` - Formatter le code
- `npm test` - Lancer les tests

## 🎨 Design

Interface inspirée du mouvement **Neo-Brutalisme** avec :
- Couleurs vives et énergiques
- Bordures épaisses et ombres portées
- Typographie impactante
- Interactions satisfaisantes

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Fait avec ❤️ pour accompagner les futurs étudiants dans leur orientation
