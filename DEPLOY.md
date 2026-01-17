# 🚀 Instructions de Déploiement Vercel

## ✅ Ce qui a été fait

1. ✅ Migration de MySQL vers SQLite
2. ✅ Configuration Vercel créée (`vercel.json`)
3. ✅ Fichier `.env.example` ajouté
4. ✅ README.md complet avec instructions
5. ✅ Scripts de build mis à jour
6. ✅ Commits poussés vers GitHub

## 📋 Étapes pour Déployer sur Vercel

### 1. Connecter le Repository à Vercel

1. Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquer sur "Add New Project"
3. Sélectionner le repository **Jaokimben/orientation-tracker**
4. Cliquer sur "Import"

### 2. Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajouter :

```
DATABASE_URL=/tmp/database.db
JWT_SECRET=super-secret-key-change-this-in-production
NODE_ENV=production
```

**⚠️ IMPORTANT** : Pour une solution de production robuste avec SQLite sur Vercel, considérez **Turso** (base SQLite distribuée).

### 3. Configuration du Build

Vercel devrait détecter automatiquement :
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

### 4. Déployer

1. Cliquer sur "Deploy"
2. Attendre la fin du build (~2-3 minutes)
3. Vercel assignera automatiquement une URL : `https://orientation-tracker.vercel.app`

## ⚠️ Note Importante sur SQLite

SQLite sur Vercel a une limitation : **le système de fichiers est éphémère**. 

Les données seront **réinitialisées** à chaque déploiement.

### Solutions Recommandées pour Production

#### Option 1 : Turso (Recommandé) 🌟

[Turso](https://turso.tech/) est une base SQLite distribuée, parfaite pour Vercel :

```bash
# Installation
curl -sSfL https://get.tur.so/install.sh | bash

# Créer une base
turso db create orientation-tracker

# Obtenir l'URL
turso db show orientation-tracker --url

# Obtenir le token
turso db tokens create orientation-tracker
```

Puis dans Vercel :
```
DATABASE_URL=libsql://[votre-url].turso.io
TURSO_AUTH_TOKEN=votre-token
```

Modifier `server/db.ts` pour utiliser le client Turso.

#### Option 2 : Vercel Postgres

```bash
# Créer une base Vercel Postgres depuis le dashboard
# Les variables seront ajoutées automatiquement
```

#### Option 3 : PlanetScale (MySQL)

Compatible avec l'ancien code MySQL.

## 🔄 Redéployer après Changements

Vercel redéploie automatiquement à chaque push sur la branche `master`.

```bash
# Faire des changements
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin master

# Vercel détecte automatiquement et redéploie
```

## 🐛 Debugging

Si le déploiement échoue :

1. Vérifier les logs de build dans Vercel Dashboard
2. Vérifier que toutes les dépendances sont dans `package.json`
3. S'assurer que `better-sqlite3` compile correctement
4. Vérifier les variables d'environnement

## 📊 Status Actuel

- ✅ Code migré vers SQLite
- ✅ Configuration Vercel prête
- ✅ Repository GitHub à jour
- ⏳ En attente du déploiement Vercel manuel

## 🎯 Prochaines Étapes

1. Aller sur Vercel Dashboard
2. Importer le projet depuis GitHub
3. Configurer les variables d'environnement
4. Déployer
5. (Optionnel) Migrer vers Turso pour persistance des données

---

**URL du Repository** : https://github.com/Jaokimben/orientation-tracker
**URL Vercel (après déploiement)** : https://orientation-tracker.vercel.app
