#!/usr/bin/env node
// Generate static JSON API file from actions data
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allActions = [
  // Phase 0 - PRÉPARATION
  { id: '1', title: 'PRÉPARER MON PROJET D\'ORIENTATION', description: 'Consulter Avenirs.onisep.fr et Parcoursup.gouv.fr pour réfléchir à ton projet.', deadline: '2025-12-01', phase: 'phase0', link: 'https://avenirs.onisep.fr/' },
  { id: '2', title: 'ÉCHANGER AVEC MON PROFESSEUR PRINCIPAL', description: 'Discuter de ton projet d\'orientation avec ton professeur principal.', deadline: '2025-12-05', phase: 'phase0', link: null },
  { id: '3', title: 'PARTICIPER À LA 1RE SEMAINE D\'ORIENTATION', description: 'Participer aux activités de la première semaine d\'orientation organisée par ton lycée.', deadline: '2025-12-10', phase: 'phase0', link: null },
  { id: '4', title: 'RENSEIGNER LA FICHE DE DIALOGUE', description: 'Remplir et soumettre la fiche de dialogue avec tes intentions d\'orientation.', deadline: '2025-12-05', phase: 'phase0', link: null },
  { id: '5', title: 'APPELER LE NUMÉRO VERT PARCOURSUP', description: 'Numéro vert Parcoursup : 0 800 400 070 pour toute question.', deadline: '2025-12-15', phase: 'phase0', link: 'https://www.parcoursup.gouv.fr/' },
  
  // Phase 1 - DÉCOUVERTE (13 tâches)
  { id: '6', title: 'RECHERCHE DES ÉCOLES', description: 'Consulter les sites officiels : Celsa, ISCOM, Sup de pub, DN Made, BUT Info-Com.', deadline: '2026-01-05', phase: 'phase1', link: 'https://www.celsa.fr/' },
  { id: '7', title: 'DÉCOUVRIR LA CARTE DES FORMATIONS', description: 'Explorer la carte interactive des formations disponibles sur Parcoursup.', deadline: '2025-12-17', phase: 'phase1', link: 'https://www.parcoursup.gouv.fr/' },
  { id: '8', title: 'LIRE LES FICHES DE FORMATION DÉTAILLÉES', description: 'Consulter les fiches détaillées de chaque formation qui t\'intéresse.', deadline: '2025-12-20', phase: 'phase1', link: 'https://www.parcoursup.gouv.fr/' },
  { id: '9', title: 'CONSULTER LE PROFIL DES CANDIDATS ADMIS', description: 'Analyser le profil des candidats admis dans les formations visées.', deadline: '2025-12-22', phase: 'phase1', link: null },
  { id: '10', title: 'VÉRIFIER LES FRAIS DE SCOLARITÉ ET AIDES', description: 'Vérifier les coûts de scolarité et les aides financières disponibles.', deadline: '2025-12-25', phase: 'phase1', link: null },
  { id: '11', title: 'PARTICIPER AUX SALONS D\'ORIENTATION', description: 'Assister aux salons et forums d\'orientation pour rencontrer les établissements.', deadline: '2026-01-31', phase: 'phase1', link: null },
  { id: '12', title: 'PARTICIPER À LA 2E SEMAINE D\'ORIENTATION', description: 'Participer aux activités de la deuxième semaine d\'orientation.', deadline: '2026-02-28', phase: 'phase1', link: null },
  { id: '13', title: 'ÉCHANGER AVEC DES PROFESSIONNELS', description: 'Contacter des professionnels (LinkedIn, famille) : Chargé de com, Chef de projet événementiel.', deadline: '2026-01-31', phase: 'phase1', link: null },
  { id: '14', title: 'JPO CELSA - SAMEDI 10 JANVIER', description: 'Journée Portes Ouvertes Celsa : 10h-18h à Neuilly-sur-Seine (77 rue de Villiers). Présentiel + Distanciel.', deadline: '2026-01-10', phase: 'phase1', link: 'https://www.celsa.fr/evenement/journee-portes-ouvertes-du-celsa/' },
  { id: '15', title: 'JPO ISCOM - SAMEDI 17 JANVIER', description: 'Journées Portes Ouvertes ISCOM Lyon (10h-16h) et Bordeaux (10h-15h30).', deadline: '2026-01-17', phase: 'phase1', link: 'https://www.iscom.fr/fr/iscom-lyon/informations-pratiques/prochains-rendez-vous-a-lyon' },
  { id: '16', title: 'JPO SUP DE PUB - SAMEDI 24 JANVIER', description: 'Journées Portes Ouvertes Sup de Pub : Lyon (10h-13h), Marseille (10h-16h).', deadline: '2026-01-24', phase: 'phase1', link: 'https://www.supdepub.com/event/lyon-portes-ouvertes-sur-le-campus/' },
  { id: '17', title: 'JPO ISCOM PARIS - SAMEDI 24 JANVIER', description: 'Journée Portes Ouvertes ISCOM Paris : 10h-13h.', deadline: '2026-01-24', phase: 'phase1', link: 'https://www.iscom.fr/fr/iscom-paris/informations-pratiques/prochains-rendez-vous-a-paris' },
  { id: '18', title: 'RENCONTRES PROFESSIONNELLES', description: 'Organiser des rencontres avec des professionnels du secteur visé.', deadline: '2026-01-31', phase: 'phase1', link: null },
  
  // Phase 2 - PARCOURSUP (9 tâches)
  { id: '19', title: 'CRÉATION COMPTE PARCOURSUP', description: 'Créer compte, remplir profil, télécharger documents. Plateforme ouverte depuis le 17 décembre 2025.', deadline: '2026-01-19', phase: 'phase2', link: 'https://www.parcoursup.fr/' },
  { id: '20', title: 'TÉLÉCHARGER LES DOCUMENTS NÉCESSAIRES', description: 'Préparer tous les documents requis pour les inscriptions (bulletins, certificats, etc.).', deadline: '2026-01-20', phase: 'phase2', link: null },
  { id: '21', title: 'IDENTIFIER MES FAVORIS SUR PARCOURSUP', description: 'Ajouter formations en favoris sur Parcoursup, noter dates limites.', deadline: '2026-01-25', phase: 'phase2', link: 'https://www.parcoursup.fr/' },
  { id: '22', title: 'RÉFLÉCHIR À MON ORDRE DE PRÉFÉRENCE', description: 'Établir un ordre de préférence pour tes formations : 1. Celsa, 2. ISCOM, 3. Sup de pub, etc.', deadline: '2026-01-30', phase: 'phase2', link: null },
  { id: '23', title: 'FORMULER MES 10 VŒUX', description: 'Formuler jusqu\'à 10 vœux de formation sur Parcoursup.', deadline: '2026-02-28', phase: 'phase2', link: 'https://www.parcoursup.fr/' },
  { id: '24', title: 'AJOUTER DES SOUS-VŒUX SI DISPONIBLES', description: 'Si applicable, ajouter des sous-vœux (jusqu\'à 20 pour les formations avec plusieurs campus).', deadline: '2026-03-05', phase: 'phase2', link: null },
  { id: '25', title: 'ORDRE DE PRIORITÉ', description: 'Finaliser l\'ordre de priorité de tes vœux.', deadline: '2026-01-25', phase: 'phase2', link: null },
  { id: '26', title: 'MISE EN FAVORIS PARCOURSUP', description: 'Mettre en favoris toutes les formations qui t\'intéressent.', deadline: '2026-02-01', phase: 'phase2', link: 'https://www.parcoursup.fr/' },
  { id: '27', title: 'OUVRIR MON COMPTE PARCOURSUP', description: 'Créer et activer ton compte Parcoursup pour démarrer tes démarches.', deadline: '2026-01-19', phase: 'phase2', link: 'https://www.parcoursup.fr/' },
  
  // Phase 3 - DOSSIERS (5 tâches)
  { id: '28', title: 'LETTRE DE MOTIVATION GÉNÉRALE', description: 'Rédiger brouillon : passion com/événementiel, qualités, projet professionnel.', deadline: '2026-02-05', phase: 'phase3', link: null },
  { id: '29', title: 'ADAPTER LETTRES PAR ÉCOLE', description: 'Personnaliser pour Celsa, ISCOM, Sup de pub, etc. Mettre en avant spécificités de chaque école.', deadline: '2026-02-15', phase: 'phase3', link: null },
  { id: '30', title: 'PRÉPARER CV', description: 'CV 1 page : expériences, compétences communication, activités extrascolaires.', deadline: '2026-02-10', phase: 'phase3', link: null },
  { id: '31', title: 'RASSEMBLER DOCUMENTS', description: 'Notes, certificats stage, recommandations, portfolio créatif si applicable.', deadline: '2026-02-20', phase: 'phase3', link: null },
  { id: '32', title: 'INSCRIPTION CONCOURS ISCOM', description: 'S\'inscrire aux épreuves d\'admission ISCOM (sessions mensuelles d\'octobre 2025 à août 2026).', deadline: '2026-02-28', phase: 'phase3', link: 'https://www.iscom.fr/fr/iscom/prochains-rendez-vous/%C3%A9preuve-d\'admission-ecole-communication' },
  
  // Phase 4 - SUIVI (3 tâches)
  { id: '33', title: 'RENCONTRER PROFESSEURS', description: 'Expliquer projet, demander soutien pour Fiche Avenir avant le 1er mars.', deadline: '2026-03-01', phase: 'phase4', link: null },
  { id: '34', title: 'VÉRIFIER FICHE AVENIR', description: 'Vérifier avis positifs et cohérence sur Parcoursup.', deadline: '2026-03-05', phase: 'phase4', link: null },
  { id: '35', title: 'PRÉPARER ENTRETIENS', description: 'Simulations, questions types (pourquoi cette école ? projet pro ? qualités ?).', deadline: '2026-03-10', phase: 'phase4', link: null },
  
  // Phase 5 - FINALISATION (4 tâches)
  { id: '36', title: 'VÉRIFIER VŒUX', description: 'Revoir ordre, documents, absence d\'erreurs avant la date limite.', deadline: '2026-03-10', phase: 'phase5', link: null },
  { id: '37', title: 'FORMULER VŒUX DÉFINITIFS - DEADLINE', description: 'Soumettre vœux finaux sur Parcoursup (jusqu\'à 10 vœux). DERNIER JOUR : 12 MARS 2026 !', deadline: '2026-03-12', phase: 'phase5', link: 'https://www.parcoursup.fr/' },
  { id: '38', title: 'COMPLÉTER DOSSIER PARCOURSUP', description: 'Finaliser tous les documents, lettres de motivation. DEADLINE : 1er AVRIL 2026.', deadline: '2026-04-01', phase: 'phase5', link: 'https://www.parcoursup.fr/' },
  { id: '39', title: 'CONFIRMATION SOUMISSION', description: 'Vérifier soumission complète, télécharger confirmation.', deadline: '2026-04-01', phase: 'phase5', link: null },
  
  // Phase 6 - RÉSULTATS (4 tâches)
  { id: '40', title: 'CONSULTER RÉSULTATS - 2 JUIN', description: 'Vérifier réponses Parcoursup, analyser propositions (Oui/Oui-si), listes d\'attente.', deadline: '2026-06-02', phase: 'phase6', link: 'https://www.parcoursup.fr/' },
  { id: '41', title: 'CLASSER VŒUX EN ATTENTE - 5-8 JUIN', description: 'Classer par ordre de préférence les vœux en attente (du 5 au 8 juin 2026).', deadline: '2026-06-08', phase: 'phase6', link: 'https://www.parcoursup.fr/' },
  { id: '42', title: 'RÉPONDRE AUX PROPOSITIONS', description: 'Accepter/refuser dans les délais (réponse obligatoire pour chaque proposition reçue).', deadline: '2026-06-10', phase: 'phase6', link: null },
  { id: '43', title: 'PHASE COMPLÉMENTAIRE - 11 juin au 10 septembre', description: 'Formuler jusqu\'à 10 nouveaux vœux pour formations ayant des places (du 11 juin au 10 septembre).', deadline: '2026-06-11', phase: 'phase6', link: 'https://www.parcoursup.fr/' },
  
  // Phase 7 - INSCRIPTION (2 tâches)
  { id: '44', title: 'FINALISER INSCRIPTION ÉCOLE', description: 'Formalités administratives, frais d\'inscription, codes accès.', deadline: '2026-06-30', phase: 'phase7', link: null },
  { id: '45', title: 'PRÉPARER RENTRÉE', description: 'Fournitures, logement étudiant, documents administratifs, transport.', deadline: '2026-08-30', phase: 'phase7', link: null }
];

const data = {
  actions: allActions
};

const outputPath = join(__dirname, 'public', 'api-data.json');
writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✅ Generated ${outputPath} with ${allActions.length} actions`);
