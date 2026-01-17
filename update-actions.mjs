import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { actions } from "./drizzle/schema.ts";

const sqlite = new Database(process.env.DATABASE_URL || "./database.db");
const db = drizzle(sqlite);

const newActions = [
  { id: '1.1', title: 'Recherche des écoles', description: 'Consulter les sites officiels : Celsa, ISCOM, Sup de pub, DN Made, BUT Info-Com.', deadline: '2026-01-05', phase: 'phase1', link: 'https://www.celsa.fr' },
  { id: '1.2', title: 'JPO Celsa - Samedi 10 janvier', description: 'Journée Portes Ouvertes Celsa : 10h-18h à Neuilly-sur-Seine (77 rue de Villiers). Présentiel + Distanciel.', deadline: '2026-01-10', phase: 'phase1', link: 'https://www.celsa.fr/evenement/journee-portes-ouvertes-du-celsa/' },
  { id: '1.3', title: 'JPO ISCOM - Samedi 17 janvier', description: 'Journées Portes Ouvertes ISCOM Lyon (10h-16h) et Bordeaux (10h-15h30).', deadline: '2026-01-17', phase: 'phase1', link: 'https://www.iscom.fr/fr/iscom-lyon/informations-pratiques/prochains-rendez-vous-a-lyon' },
  { id: '1.4', title: 'JPO Sup de Pub - Samedi 24 janvier', description: 'Journées Portes Ouvertes Sup de Pub : Lyon (10h-13h), Marseille (10h-16h).', deadline: '2026-01-24', phase: 'phase1', link: 'https://www.supdepub.com/event/lyon-portes-ouvertes-sur-le-campus/' },
  { id: '1.5', title: 'JPO ISCOM Paris - Samedi 24 janvier', description: 'Journée Portes Ouvertes ISCOM Paris : 10h-13h.', deadline: '2026-01-24', phase: 'phase1', link: 'https://www.iscom.fr/fr/iscom-paris/informations-pratiques/prochains-rendez-vous-a-paris' },
  { id: '1.6', title: 'Rencontres Professionnelles', description: 'Contacter des pros (LinkedIn, famille) : Chargé de com, Chef de projet événementiel.', deadline: '2026-01-31', phase: 'phase1', link: null },
  { id: '2.1', title: 'Création Compte Parcoursup', description: 'Créer compte, remplir profil, télécharger documents. Plateforme ouverte depuis le 17 décembre 2025.', deadline: '2026-01-19', phase: 'phase2', link: 'https://www.parcoursup.fr' },
  { id: '2.2', title: 'Ordre de Priorité', description: 'Classer : 1. Celsa, 2. ISCOM, 3. Sup de pub, 4. DN Made, 5. BUT Info-Com, 6. BTS Communication.', deadline: '2026-01-25', phase: 'phase2', link: null },
  { id: '2.3', title: 'Mise en Favoris Parcoursup', description: 'Ajouter formations en favoris sur Parcoursup, noter dates limites. Jusqu\'à 10 vœux + 20 sous-vœux.', deadline: '2026-02-01', phase: 'phase2', link: 'https://www.parcoursup.fr' },
  { id: '3.1', title: 'Lettre de Motivation Générale', description: 'Rédiger brouillon : passion com/événementiel, qualités, projet professionnel.', deadline: '2026-02-05', phase: 'phase3', link: null },
  { id: '3.2', title: 'Adapter Lettres par École', description: 'Personnaliser pour Celsa, ISCOM, Sup de pub, etc. Mettre en avant spécificités de chaque école.', deadline: '2026-02-15', phase: 'phase3', link: null },
  { id: '3.3', title: 'Préparer CV', description: 'CV 1 page : expériences, compétences communication, activités extrascolaires.', deadline: '2026-02-10', phase: 'phase3', link: null },
  { id: '3.4', title: 'Rassembler Documents', description: 'Notes, certificats stage, recommandations, portfolio créatif si applicable.', deadline: '2026-02-20', phase: 'phase3', link: null },
  { id: '3.5', title: 'Inscription Concours ISCOM', description: 'S\'inscrire aux épreuves d\'admission ISCOM (sessions mensuelles d\'octobre 2025 à août 2026).', deadline: '2026-02-28', phase: 'phase3', link: 'https://www.iscom.fr/fr/iscom/prochains-rendez-vous/épreuve-d\'admission-ecole-communication' },
  { id: '4.1', title: 'Rencontrer Professeurs', description: 'Expliquer projet, demander soutien pour Fiche Avenir avant le 1er mars.', deadline: '2026-03-01', phase: 'phase4', link: null },
  { id: '4.2', title: 'Vérifier Fiche Avenir', description: 'Vérifier avis positifs et cohérence sur Parcoursup.', deadline: '2026-03-05', phase: 'phase4', link: null },
  { id: '4.3', title: 'Préparer Entretiens', description: 'Simulations, questions types (pourquoi cette école ? projet pro ? qualités ?).', deadline: '2026-03-10', phase: 'phase4', link: null },
  { id: '5.1', title: 'Vérifier Vœux', description: 'Revoir ordre, documents, absence d\'erreurs avant la date limite.', deadline: '2026-03-10', phase: 'phase5', link: null },
  { id: '5.2', title: 'Formuler Vœux Définitifs - DEADLINE', description: 'Soumettre vœux finaux sur Parcoursup (jusqu\'à 10 vœux). DERNIER JOUR : 12 MARS 2026 !', deadline: '2026-03-12', phase: 'phase5', link: 'https://www.parcoursup.fr' },
  { id: '5.3', title: 'Compléter Dossier Parcoursup', description: 'Finaliser tous les documents, lettres de motivation. DEADLINE : 1er AVRIL 2026.', deadline: '2026-04-01', phase: 'phase5', link: 'https://www.parcoursup.fr' },
  { id: '5.4', title: 'Confirmation Soumission', description: 'Vérifier soumission complète, télécharger confirmation.', deadline: '2026-04-01', phase: 'phase5', link: null },
  { id: '6.1', title: 'Consulter Résultats - 2 juin', description: 'Vérifier réponses Parcoursup, analyser propositions (Oui/Oui-si), listes d\'attente.', deadline: '2026-06-02', phase: 'phase6', link: 'https://www.parcoursup.fr' },
  { id: '6.2', title: 'Classer Vœux en Attente - 5-8 juin', description: 'Classer par ordre de préférence les vœux en attente (du 5 au 8 juin 2026).', deadline: '2026-06-08', phase: 'phase6', link: 'https://www.parcoursup.fr' },
  { id: '6.3', title: 'Répondre aux Propositions', description: 'Accepter/refuser dans les délais (réponse obligatoire pour chaque proposition reçue).', deadline: '2026-06-10', phase: 'phase6', link: null },
  { id: '6.4', title: 'Phase Complémentaire (si besoin)', description: 'Formuler jusqu\'à 10 nouveaux vœux pour formations ayant des places (du 11 juin au 10 septembre).', deadline: '2026-06-11', phase: 'phase6', link: 'https://www.parcoursup.fr' },
  { id: '7.1', title: 'Finaliser Inscription École', description: 'Formalités administratives, frais d\'inscription, codes accès.', deadline: '2026-06-30', phase: 'phase7', link: null },
  { id: '7.2', title: 'Préparer Rentrée', description: 'Fournitures, logement étudiant, documents administratifs, transport.', deadline: '2026-08-30', phase: 'phase7', link: null }
];

console.log('Mise à jour de la base de données avec les nouvelles actions...');

// Delete old actions first
await db.delete(actions);
console.log('✓ Anciennes actions supprimées');

// Insert new actions
await db.insert(actions).values(newActions);
console.log('✓ Nouvelles actions insérées (' + newActions.length + ' actions)');

console.log('✅ Base de données mise à jour avec succès !');
process.exit(0);
