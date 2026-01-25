#!/bin/bash

# Script de diagnostic du déploiement Vercel

echo "🔍 DIAGNOSTIC DÉPLOIEMENT VERCEL"
echo "================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier le dernier commit local
echo "📝 Dernier commit local:"
git log -1 --oneline
echo ""

# 2. Vérifier le dernier commit sur GitHub
echo "🌐 Dernier commit sur GitHub (origin/master):"
git ls-remote origin master | cut -f1 | cut -c1-8
echo ""

# 3. Tester le site principal
echo "🌍 Test du site principal..."
SITE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://orientation-tracker-new.vercel.app/ 2>&1)
if [ "$SITE_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Site accessible (HTTP 200)${NC}"
else
    echo -e "${RED}❌ Site non accessible (HTTP $SITE_STATUS)${NC}"
fi
echo ""

# 4. Vérifier si les actions sont chargées
echo "📦 Vérification du bundle JavaScript..."
if curl -s https://orientation-tracker-new.vercel.app/ | grep -q "index-.*\.js"; then
    BUNDLE_SIZE=$(curl -s https://orientation-tracker-new.vercel.app/ | grep -o "index-[^\"]*\.js" | head -1)
    echo -e "${GREEN}✅ Bundle JavaScript détecté: $BUNDLE_SIZE${NC}"
else
    echo -e "${RED}❌ Bundle JavaScript non trouvé${NC}"
fi
echo ""

# 5. Informations sur les commits récents
echo "📋 5 derniers commits:"
git log --oneline -5
echo ""

# 6. Vérifier si vercel.json existe
echo "⚙️  Configuration Vercel:"
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json trouvé${NC}"
    echo "Contenu:"
    cat vercel.json
else
    echo -e "${RED}❌ vercel.json non trouvé${NC}"
fi
echo ""

# 7. Statistiques du projet
echo "📊 Statistiques du projet:"
echo "- Fichiers actions embarquées:"
if [ -f "client/src/lib/staticActions.ts" ]; then
    ACTION_COUNT=$(grep -o '"id":' client/src/lib/staticActions.ts | wc -l)
    echo -e "  ${GREEN}✅ staticActions.ts trouvé ($ACTION_COUNT actions)${NC}"
else
    echo -e "  ${RED}❌ staticActions.ts non trouvé${NC}"
fi
echo ""

# 8. Instructions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 PROCHAINES ÉTAPES:"
echo ""
echo "1. Vérifiez le Dashboard Vercel:"
echo "   https://vercel.com/dashboard"
echo ""
echo "2. Allez dans le projet et vérifiez les Deployments:"
echo "   - Le dernier déploiement devrait afficher le commit:"
echo -e "     ${YELLOW}$(git rev-parse --short HEAD)${NC}"
echo ""
echo "3. Si le commit ne correspond pas, suivez:"
echo "   📄 VERCEL_AUTO_DEPLOY_FIX.md"
echo ""
echo "4. Pour forcer un nouveau déploiement:"
echo "   git commit --allow-empty -m 'deploy: force rebuild'"
echo "   git push origin master"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
