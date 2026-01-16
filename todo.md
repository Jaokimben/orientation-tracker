# TODO - Mise à niveau Full-Stack

## Phase 1: Configuration Base de Données
- [x] Créer le schéma de la table `actions` dans drizzle/schema.ts
- [x] Créer le schéma de la table `user_progress` dans drizzle/schema.ts
- [x] Exécuter `pnpm db:push` pour appliquer les migrations

## Phase 2: Backend API
- [x] Créer les fonctions de requête dans server/db.ts
- [x] Créer le router tRPC pour les actions dans server/routers.ts
- [x] Tester les endpoints avec vitest

## Phase 3: Frontend Integration
- [x] Remplacer localStorage par les appels tRPC
- [x] Ajouter l'authentification avec useAuth()
- [x] Implémenter les mutations optimistes pour les checkboxes
- [x] Gérer les états de chargement

## Phase 4: Tests et Vérification
- [x] Vérifier la persistance après rechargement
- [x] Tester la synchronisation multi-dispositifs
- [x] Vérifier les performances

## Phase 5: Déploiement
- [x] Créer un checkpoint final
- [ ] Publier le site

## Phase 6: Recherche et Intégration des Dates Réelles

- [x] Rechercher dates JPO et concours Celsa 2026
- [x] Rechercher dates JPO et concours ISCOM 2026
- [x] Rechercher dates JPO et concours Sup de Pub 2026
- [x] Rechercher dates Parcoursup 2026 (DN Made, BUT Info-Com, BTS Communication)
- [x] Mettre à jour le fichier data.ts avec les dates réelles
- [x] Pousser les nouvelles données en base de données
- [x] Vérifier l'affichage sur le site
- [x] Créer un checkpoint final avec dates réelles

## Phase 7: Mode Sans Connexion (Compte Lina par Défaut)

- [x] Créer un utilisateur "Lina" par défaut dans la base de données
- [x] Modifier le contexte d'authentification pour utiliser le compte Lina si non connecté
- [x] Adapter le frontend pour masquer les boutons de connexion/déconnexion en mode par défaut
- [x] Tester la persistance des données avec le compte par défaut
- [x] Vérifier que tous les tests passent avec le nouveau système
- [x] Créer un checkpoint final avec mode sans connexion

## Phase 8: Adoucir le Vocabulaire

- [x] Remplacer "Plan d'Action" par "Parcours" dans tous les textes
- [x] Remplacer "Actions" par "Étapes" ou "Rendez-vous"
- [x] Remplacer "Deadline" par "Date clé" ou "À faire avant le"
- [x] Remplacer "Urgent" par "Bientôt" ou "À venir"
- [x] Adoucir les descriptions des phases (ex: "Découverte" au lieu de "Phase 1")
- [x] Vérifier que le ton général est encourageant et positif
- [x] Créer un checkpoint avec le nouveau vocabulaire

## Phase 9: Enrichissement avec Parcoursup Officiel

- [x] Consulter le site Parcoursup officiel pour les détails 2026
- [x] Ajouter les actions détaillées basées sur Parcoursup
- [x] Vérifier les nouvelles actions sur le site
- [x] Créer un checkpoint avec actions enrichies

## Phase 10: Rendre le site générique (multi-utilisateurs)

- [x] Créer un formulaire de configuration au premier accès
- [x] Ajouter un champ pour le nom de l'étudiant
- [x] Sauvegarder le nom en localStorage et base de données
- [x] Adapter le header pour afficher le nom personnalisé
- [x] Ajouter un bouton "Changer de profil" ou "Réinitialiser"
- [x] Tester avec différents noms
- [x] Créer un checkpoint final générique
