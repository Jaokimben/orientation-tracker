# 🔧 Troubleshooting Vercel - Corrections Urgentes

## 🐛 Problème: Le site affiche du code au lieu de l'interface

### Diagnostics Effectués

**Symptôme**: Le site `https://orientation-tracker.vercel.app/` affiche:
```javascript
// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
...
```

### ✅ Corrections Appliquées (Commits)

1. **28d5f752** - Renommé `api/serverless.js` → `api/index.js` (standard Vercel)
2. **8811f25d** - Format handler Vercel correct `(req, res) => app(req, res)`  
3. **258d2b43** - Configuration initiale Vercel Serverless
4. **941b7181** - Documentation déploiement

### 🔍 Vérifications à Faire sur Vercel Dashboard

#### 1. Vérifier les Logs de Build

1. Aller sur https://vercel.com/dashboard
2. Sélectionner projet **orientation-tracker**
3. Cliquer sur "Deployments"
4. Cliquer sur le dernier déploiement
5. Vérifier les logs de build

**Ce qu'on doit voir:**
```
✓ Building...
✓ npm run vercel-build
✓ vite build
✓ Building dist/public
✓ Build completed
```

**Erreurs possibles:**
- `Module not found: better-sqlite3` → Installer dans dependencies
- `Cannot find module 'dist/routers.js'` → Build server failed
- `esbuild failed` → Problème de compilation

#### 2. Vérifier la Structure des Fichiers

Dans l'onglet "Functions" du déploiement:
- ✅ Doit voir: `/api/index.js` (Serverless Function)
- ❌ Ne doit PAS voir: Code source TypeScript

Dans l'onglet "Static Files":
- ✅ Doit voir: `dist/public/index.html`
- ✅ Doit voir: `dist/public/assets/`

#### 3. Vérifier les Variables d'Environnement

Settings → Environment Variables:
```
DATABASE_URL=/tmp/database.db
JWT_SECRET=votre-secret-genere
NODE_ENV=production
```

### 🚨 Solutions si le Problème Persiste

#### Solution A: Clear Cache et Redéployer

1. Aller dans Settings → General
2. Scroller jusqu'à "Deployment Protection"
3. Activer "Clear Build Cache"
4. Aller dans Deployments
5. Cliquer sur "..." du dernier déploiement
6. Cliquer "Redeploy"
7. ✅ Cocher "Use existing Build Cache" = OFF

#### Solution B: Supprimer et Réimporter le Projet

Si cache persist:

1. **Sur Vercel:**
   - Settings → General → Delete Project
   - Confirmer la suppression

2. **Réimporter:**
   - Dashboard → Add New Project
   - Import depuis GitHub: `Jaokimben/orientation-tracker`
   - Framework Preset: **Other**
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Configurer Variables:**
   ```
   DATABASE_URL=/tmp/database.db
   JWT_SECRET=new-super-secret-key-here
   NODE_ENV=production
   ```

4. **Deploy**

#### Solution C: Vérifier le Routing

Si le problème persiste, c'est peut-être un problème de routing. 

**Test manuel:**
```bash
# Tester l'API directement
curl https://orientation-tracker.vercel.app/api/health

# Devrait retourner:
{"status":"ok","timestamp":"...","env":"production"}

# Si ça retourne du code, l'API handler ne fonctionne pas
```

**Fix du routing:**
Si `/api/health` retourne du code, le problème est dans `api/index.js`.

Vérifier que l'export est:
```javascript
export default (req, res) => {
  return app(req, res);
};
```

PAS:
```javascript
export default app; // ❌ Ne fonctionne pas
```

### 📋 Checklist de Debug

- [ ] Les commits sont bien sur GitHub (`git log --oneline -5`)
- [ ] Vercel a détecté les commits (Dashboard → Deployments)
- [ ] Le build Vercel a réussi (Status: Ready)
- [ ] Les variables d'environnement sont configurées
- [ ] Le cache a été clearé
- [ ] `/api/health` retourne JSON (pas du code)
- [ ] `/` retourne HTML (pas du code)

### 🎯 Cas d'Urgence: Rollback

Si tout échoue, rollback vers un déploiement précédent:

1. Deployments
2. Trouver un déploiement "Ready" ancien
3. Cliquer "..." → "Promote to Production"

### 💡 Alternative: Build Local et Deploy Manuel

Si Vercel ne builde pas correctement:

```bash
# Local
cd /home/user/webapp
npm run build
npm run build:server

# Vérifier
ls -la dist/
ls -la dist/public/
ls -la api/

# Upload manuel
vercel --prod

# Ou créer un .tar.gz et upload via dashboard
```

### 📞 Support Contact

Si rien ne fonctionne:
- Vercel Support: https://vercel.com/support
- Vérifier Vercel Status: https://www.vercelstatus.com/

---

**Prochaine étape**: Attendre 2-3 minutes que Vercel rebuild avec le dernier commit (28d5f752), puis vérifier le site.

Si le problème persiste après 5 minutes, exécuter **Solution A** (Clear Cache).
