#!/bin/bash

echo "🚀 Déploiement manuel vers Vercel..."
echo ""
echo "⚠️  IMPORTANT : Ce script va déployer directement vers Vercel"
echo "    sans passer par GitHub."
echo ""
echo "📦 Fichiers à déployer :"
echo "   - public/index.html (360KB) ✅"
echo "   - public/assets/*.js (641KB avec 45 actions embarquées) ✅"
echo "   - public/assets/*.css"
echo "   - public/images/"
echo ""
echo "🔑 Vous devrez vous authentifier avec Vercel CLI"
echo ""

read -p "Continuer ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Déploiement annulé"
    exit 1
fi

echo ""
echo "🔧 Lancement du déploiement..."
echo ""

# Deploy to production
npx vercel --prod --yes

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🌐 Votre site devrait être disponible dans quelques secondes"
echo "   avec les 45 actions complètes !"
