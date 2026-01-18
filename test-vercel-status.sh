#!/bin/bash

# Script de test rapide pour vérifier l'état du site Vercel

echo "🔍 TEST DU SITE ORIENTATION TRACKER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SITE_URL="https://orientation-tracker.vercel.app"
API_URL="$SITE_URL/api/health"

echo "📍 URL testée : $SITE_URL"
echo ""

# Test 1 : Vérifier le type de contenu
echo "🧪 Test 1 : Vérification du type de contenu"
echo "─────────────────────────────────────────────────────────"

CONTENT_TYPE=$(curl -s -I "$SITE_URL" | grep -i "content-type" | awk '{print $2}')
echo "Content-Type : $CONTENT_TYPE"

if [[ $CONTENT_TYPE == *"text/html"* ]]; then
    echo "✅ Content-Type correct (HTML)"
else
    echo "❌ Content-Type incorrect (devrait être text/html)"
fi

echo ""

# Test 2 : Vérifier les premiers caractères
echo "🧪 Test 2 : Vérification des premiers caractères du site"
echo "─────────────────────────────────────────────────────────"

FIRST_LINE=$(curl -s "$SITE_URL" | head -1)
echo "Première ligne : $FIRST_LINE"

if [[ $FIRST_LINE == *"<!doctype"* ]] || [[ $FIRST_LINE == *"<!DOCTYPE"* ]]; then
    echo "✅ Le site affiche du HTML (correct)"
    echo "🎉 Le site fonctionne correctement !"
else
    echo "❌ Le site affiche du CODE JavaScript (incorrect)"
    echo "🚨 ACTION REQUISE : Redéploiement Vercel nécessaire"
fi

echo ""

# Test 3 : Test API Health
echo "🧪 Test 3 : Test API Health Check"
echo "─────────────────────────────────────────────────────────"

API_RESPONSE=$(curl -s "$API_URL")
echo "Réponse API : $API_RESPONSE"

if [[ $API_RESPONSE == *"status"* ]]; then
    echo "✅ API fonctionnelle"
else
    echo "⚠️ API ne répond pas correctement"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Déterminer le statut global
if [[ $FIRST_LINE == *"<!doctype"* ]] || [[ $FIRST_LINE == *"<!DOCTYPE"* ]]; then
    echo "✅ STATUT : Le site fonctionne correctement"
    echo ""
    echo "Vous pouvez accéder au site :"
    echo "👉 $SITE_URL"
else
    echo "❌ STATUT : Le site affiche toujours du code"
    echo ""
    echo "🔧 ACTIONS REQUISES :"
    echo "1. Aller sur https://vercel.com/dashboard"
    echo "2. Projet orientation-tracker → Deployments"
    echo "3. Cliquer '...' → Redeploy"
    echo "4. ⚠️ DÉCOCHER 'Use existing Build Cache'"
    echo "5. Confirmer et attendre 3-5 minutes"
    echo ""
    echo "📚 Documentation complète :"
    echo "→ Lire URGENT_VERCEL_ACTION.md"
    echo "→ Lire VERCEL_FIX.md"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
