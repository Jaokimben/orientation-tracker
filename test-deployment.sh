#!/bin/bash

echo "🧪 Test du Déploiement - orientation-tracker.vercel.app"
echo "=================================================="
echo ""

# Test 1: Site principal
echo "✅ Test 1: Site principal (HTML)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://orientation-tracker.vercel.app/)
CONTENT_TYPE=$(curl -s -I https://orientation-tracker.vercel.app/ | grep -i "content-type" | cut -d' ' -f2-)
echo "   Status: $STATUS"
echo "   Content-Type: $CONTENT_TYPE"

if [ "$STATUS" = "200" ] && [[ "$CONTENT_TYPE" == *"text/html"* ]]; then
  echo "   ✅ SUCCÈS - Site accessible"
else
  echo "   ❌ ÉCHEC - Site non accessible ou mauvais content-type"
fi
echo ""

# Test 2: API Health
echo "✅ Test 2: API Health Endpoint"
HEALTH_RESPONSE=$(curl -s https://orientation-tracker.vercel.app/api/health)
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://orientation-tracker.vercel.app/api/health)
echo "   Status: $HEALTH_STATUS"
echo "   Response: $HEALTH_RESPONSE"

if [ "$HEALTH_STATUS" = "200" ]; then
  echo "   ✅ SUCCÈS - API Health fonctionne"
else
  echo "   ❌ ÉCHEC - API Health ne répond pas"
fi
echo ""

# Test 3: API Actions List (tRPC)
echo "✅ Test 3: API Actions List (tRPC)"
ACTIONS_RESPONSE=$(curl -s "https://orientation-tracker.vercel.app/api/trpc/action.list")
ACTIONS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://orientation-tracker.vercel.app/api/trpc/action.list")
echo "   Status: $ACTIONS_STATUS"
echo "   Response (first 200 chars): ${ACTIONS_RESPONSE:0:200}"

if [ "$ACTIONS_STATUS" = "200" ]; then
  echo "   ✅ SUCCÈS - API Actions fonctionne"
  
  # Count actions
  ACTION_COUNT=$(echo "$ACTIONS_RESPONSE" | grep -o '"id":' | wc -l)
  echo "   📊 Nombre d'actions détectées: $ACTION_COUNT / 45"
else
  echo "   ❌ ÉCHEC - API Actions ne répond pas"
fi
echo ""

echo "=================================================="
echo "🏁 Tests terminés"
