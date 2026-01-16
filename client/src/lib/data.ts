export interface Action {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'urgent';
  phase: string;
  link?: string | null;
}

export const phases = [
  { id: 'phase0', title: 'Étape 0 : Préparation', color: 'bg-indigo-200' },
  { id: 'phase1', title: 'Étape 1 : Découverte', color: 'bg-blue-200' },
  { id: 'phase2', title: 'Étape 2 : Parcoursup', color: 'bg-pink-200' },
  { id: 'phase3', title: 'Étape 3 : Dossiers', color: 'bg-yellow-200' },
  { id: 'phase4', title: 'Étape 4 : Suivi', color: 'bg-green-200' },
  { id: 'phase5', title: 'Étape 5 : Finalisation', color: 'bg-purple-200' },
  { id: 'phase6', title: 'Étape 6 : Résultats', color: 'bg-orange-200' },
  { id: 'phase7', title: 'Étape 7 : Inscription', color: 'bg-red-200' },
];

export const initialActions: Action[] = [
  // PHASE 0: PRÉPARATION (Octobre - Décembre 2025)
  {
    id: '0.1',
    title: 'Préparer mon projet d\'orientation',
    description: 'Consulter Avenirs.onisep.fr et Parcoursup.gouv.fr pour réfléchir à ton projet.',
    deadline: '2025-12-01',
    status: 'pending',
    phase: 'phase0',
    link: 'https://avenirs.onisep.fr'
  },
  {
    id: '0.2',
    title: 'Échanger avec mon professeur principal',
    description: 'Discuter de ton projet d\'orientation avec ton professeur principal et les personnels d\'orientation.',
    deadline: '2025-12-05',
    status: 'pending',
    phase: 'phase0'
  },
  {
    id: '0.3',
    title: 'Participer à la 1re semaine d\'orientation',
    description: 'Assister aux réunions d\'orientation au lycée pour affiner ton projet.',
    deadline: '2025-12-10',
    status: 'pending',
    phase: 'phase0'
  },
  {
    id: '0.4',
    title: 'Renseigner la fiche de dialogue',
    description: 'Compléter ta fiche de dialogue avant le 1er conseil de classe (début décembre).',
    deadline: '2025-12-05',
    status: 'pending',
    phase: 'phase0'
  },
  {
    id: '0.5',
    title: 'Appeler le numéro vert Parcoursup',
    description: 'Poser tes questions sur ton projet d\'orientation. Numéro : 0 800 400 070 (lun-ven 10h-16h).',
    deadline: '2025-12-15',
    status: 'pending',
    phase: 'phase0',
    link: 'https://www.parcoursup.gouv.fr'
  },

  // PHASE 1: DÉCOUVERTE (Décembre 2025 - Janvier 2026)
  {
    id: '1.1',
    title: 'Découvrir la carte des formations',
    description: 'À partir du 17 décembre, consulter la carte des formations Parcoursup 2026.',
    deadline: '2025-12-17',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.parcoursup.gouv.fr'
  },
  {
    id: '1.2',
    title: 'Lire les fiches de formation détaillées',
    description: 'Pour chaque école (Celsa, ISCOM, Sup de pub, DN Made, BUT, BTS), consulter les critères d\'admission, frais, débouchés.',
    deadline: '2025-12-20',
    status: 'pending',
    phase: 'phase1',
    link: 'https://www.parcoursup.gouv.fr'
  },
  {
    id: '1.3',
    title: 'Consulter le profil des candidats admis',
    description: 'Vérifier les données sur le profil des candidats admis les années précédentes (série bac, niveau scolaire).',
    deadline: '2025-12-22',
    status: 'pending',
    phase: 'phase1'
  },
  {
    id: '1.4',
    title: 'Vérifier les frais de scolarité et aides',
    description: 'Vérifier les frais de scolarité, éligibilité aux bourses sur critères sociaux pour chaque formation.',
    deadline: '2025-12-25',
    status: 'pending',
    phase: 'phase1'
  },
  {
    id: '1.5',
    title: 'JPO Celsa - Samedi 10 janvier',
    description: 'Journée Portes Ouvertes Celsa : 10h-18h à Neuilly-sur-Seine (77 rue de Villiers). Présentiel + Distanciel.',
    deadline: '2026-01-10',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.celsa.fr/evenement/journee-portes-ouvertes-du-celsa/'
  },
  {
    id: '1.6',
    title: 'JPO ISCOM - Samedi 17 janvier',
    description: 'Journées Portes Ouvertes ISCOM Lyon (10h-16h) et Bordeaux (10h-15h30).',
    deadline: '2026-01-17',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.iscom.fr/fr/iscom-lyon/informations-pratiques/prochains-rendez-vous-a-lyon'
  },
  {
    id: '1.7',
    title: 'JPO Sup de Pub - Samedi 17-24 janvier',
    description: 'Journées Portes Ouvertes Sup de Pub à Paris et régions. Consulter les dates précises sur le site.',
    deadline: '2026-01-24',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.supdepub.com'
  },
  {
    id: '1.8',
    title: 'Participer aux salons d\'orientation',
    description: 'Assister aux salons d\'orientation pour rencontrer des écoles et des étudiants ambassadeurs.',
    deadline: '2026-01-31',
    status: 'pending',
    phase: 'phase1'
  },
  {
    id: '1.9',
    title: 'Participer à la 2e semaine d\'orientation',
    description: 'Assister aux réunions d\'orientation au lycée (2e trimestre) pour affiner ton projet.',
    deadline: '2026-02-28',
    status: 'pending',
    phase: 'phase1'
  },
  {
    id: '1.10',
    title: 'Échanger avec des professionnels',
    description: 'Contacter des chargés de com ou chefs de projet événementiel (LinkedIn, famille) pour discuter des métiers.',
    deadline: '2026-01-31',
    status: 'pending',
    phase: 'phase1'
  },

  // PHASE 2: PARCOURSUP (Janvier - Mars 2026)
  {
    id: '2.1',
    title: 'Ouvrir mon compte Parcoursup',
    description: 'À partir du 19 janvier, créer ton compte et remplir ton profil sur Parcoursup.',
    deadline: '2026-01-19',
    status: 'urgent',
    phase: 'phase2',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '2.2',
    title: 'Télécharger les documents nécessaires',
    description: 'Préparer : photo d\'identité, numéro INE, informations parents, adresse mail valide.',
    deadline: '2026-01-20',
    status: 'pending',
    phase: 'phase2'
  },
  {
    id: '2.3',
    title: 'Identifier mes favoris sur Parcoursup',
    description: 'Ajouter tes formations favorites pour les comparer et préparer progressivement tes vœux.',
    deadline: '2026-01-25',
    status: 'pending',
    phase: 'phase2',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '2.4',
    title: 'Réfléchir à mon ordre de préférence',
    description: 'Classer tes écoles : 1. Celsa, 2. ISCOM, 3. Sup de pub, 4. DN Made, 5. BUT Info-Com, 6. BTS Communication.',
    deadline: '2026-01-30',
    status: 'pending',
    phase: 'phase2'
  },
  {
    id: '2.5',
    title: 'Formuler mes 10 vœux',
    description: 'Ajouter tes 10 vœux principaux sur Parcoursup (sans obligation de les classer).',
    deadline: '2026-02-28',
    status: 'pending',
    phase: 'phase2',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '2.6',
    title: 'Ajouter des sous-vœux si disponibles',
    description: 'Pour certaines formations, ajouter des sous-vœux pour augmenter tes chances.',
    deadline: '2026-03-05',
    status: 'pending',
    phase: 'phase2'
  },
  {
    id: '2.7',
    title: 'Formuler des vœux en apprentissage (optionnel)',
    description: 'Ajouter jusqu\'à 10 vœux supplémentaires pour des formations en apprentissage si intéressée.',
    deadline: '2026-03-10',
    status: 'pending',
    phase: 'phase2'
  },
  {
    id: '2.8',
    title: 'Valider mes vœux - DEADLINE 12 mars',
    description: 'Dernier jour pour ajouter de nouveaux vœux. Après cette date, tu ne peux que modifier tes vœux existants.',
    deadline: '2026-03-12',
    status: 'urgent',
    phase: 'phase2',
    link: 'https://www.parcoursup.fr'
  },

  // PHASE 3: DOSSIERS (Février - Avril 2026)
  {
    id: '3.1',
    title: 'Rédiger ma lettre de motivation générale',
    description: 'Écrire un brouillon : ta passion pour la com/l\'événementiel, tes qualités, ton projet professionnel.',
    deadline: '2026-02-05',
    status: 'pending',
    phase: 'phase3'
  },
  {
    id: '3.2',
    title: 'Personnaliser mes lettres par école',
    description: 'Adapter ta lettre pour chaque école (Celsa, ISCOM, Sup de pub) : montrer ce qui te plaît dans chacune.',
    deadline: '2026-02-20',
    status: 'pending',
    phase: 'phase3'
  },
  {
    id: '3.3',
    title: 'Créer mon CV',
    description: 'CV 1 page : tes expériences, compétences en communication, activités qui te passionnent.',
    deadline: '2026-02-10',
    status: 'pending',
    phase: 'phase3'
  },
  {
    id: '3.4',
    title: 'Préparer mes documents',
    description: 'Rassembler : notes, certificats de stage, recommandations, portfolio créatif si tu en as un.',
    deadline: '2026-02-25',
    status: 'pending',
    phase: 'phase3'
  },
  {
    id: '3.5',
    title: 'M\'inscrire au concours ISCOM',
    description: 'S\'inscrire aux épreuves d\'admission ISCOM (plusieurs sessions disponibles d\'octobre 2025 à août 2026).',
    deadline: '2026-02-28',
    status: 'pending',
    phase: 'phase3',
    link: 'https://www.iscom.fr/fr/iscom/prochains-rendez-vous/épreuve-d\'admission-ecole-communication'
  },
  {
    id: '3.6',
    title: 'Compléter mon dossier Parcoursup',
    description: 'Ajouter tous les documents demandés : lettres, CV, documents supplémentaires pour chaque vœu.',
    deadline: '2026-03-20',
    status: 'pending',
    phase: 'phase3',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '3.7',
    title: 'Confirmer mes vœux - DEADLINE 1er avril',
    description: 'Dernier jour pour finaliser ton dossier et confirmer chacun de tes vœux.',
    deadline: '2026-04-01',
    status: 'urgent',
    phase: 'phase3',
    link: 'https://www.parcoursup.fr'
  },

  // PHASE 4: SUIVI (Mars - Mai 2026)
  {
    id: '4.1',
    title: 'Échanger avec mes professeurs',
    description: 'Partager ton projet, demander leur soutien pour la Fiche Avenir avant le 1er mars.',
    deadline: '2026-03-01',
    status: 'urgent',
    phase: 'phase4'
  },
  {
    id: '4.2',
    title: 'Consulter ma Fiche Avenir',
    description: 'Vérifier les avis et la cohérence sur Parcoursup après que les professeurs l\'aient complétée.',
    deadline: '2026-03-10',
    status: 'pending',
    phase: 'phase4'
  },
  {
    id: '4.3',
    title: 'M\'entraîner pour les entretiens',
    description: 'Faire des simulations, réfléchir aux questions classiques (pourquoi cette école ? ton projet ? tes qualités ?).',
    deadline: '2026-03-15',
    status: 'pending',
    phase: 'phase4'
  },
  {
    id: '4.4',
    title: 'Préparer les épreuves des concours',
    description: 'Réviser pour les concours des écoles (ISCOM, Celsa, Sup de pub) selon leurs calendriers.',
    deadline: '2026-04-30',
    status: 'pending',
    phase: 'phase4'
  },

  // PHASE 5: FINALISATION (Mai - Juin 2026)
  {
    id: '5.1',
    title: 'Relire mes vœux',
    description: 'Revoir l\'ordre, vérifier les documents, corriger les petites erreurs avant la fin de la procédure.',
    deadline: '2026-05-25',
    status: 'pending',
    phase: 'phase5'
  },
  {
    id: '5.2',
    title: 'Préparer ma réponse aux propositions',
    description: 'Réfléchir à ta stratégie : quelles propositions accepter, refuser, mettre en attente.',
    deadline: '2026-05-30',
    status: 'pending',
    phase: 'phase5'
  },

  // PHASE 6: RÉSULTATS (Juin 2026)
  {
    id: '6.1',
    title: 'Découvrir les résultats - 2 juin',
    description: 'Consulter les réponses Parcoursup, voir les propositions (Oui/Oui-si), listes d\'attente.',
    deadline: '2026-06-02',
    status: 'urgent',
    phase: 'phase6',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '6.2',
    title: 'Répondre aux propositions',
    description: 'Accepter ou refuser les propositions dans les délais (pense à répondre pour chaque proposition).',
    deadline: '2026-06-10',
    status: 'urgent',
    phase: 'phase6'
  },
  {
    id: '6.3',
    title: 'Organiser mes vœux en attente - 5-8 juin',
    description: 'Classer par ordre de préférence tes vœux en attente (du 5 au 8 juin 2026).',
    deadline: '2026-06-08',
    status: 'urgent',
    phase: 'phase6',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '6.4',
    title: 'Phase complémentaire (si nécessaire)',
    description: 'Si besoin, formuler jusqu\'au 10 nouveaux vœux pour formations ayant des places (du 11 juin au 10 septembre).',
    deadline: '2026-06-11',
    status: 'pending',
    phase: 'phase6',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '6.5',
    title: 'Me concentrer sur les épreuves du bac',
    description: 'Les délais de réponse sont suspendus du 12 au 19 juin pour te permettre de te concentrer sur le bac.',
    deadline: '2026-06-19',
    status: 'pending',
    phase: 'phase6'
  },

  // PHASE 7: INSCRIPTION (Juillet - Septembre 2026)
  {
    id: '7.1',
    title: 'M\'inscrire après les résultats du bac',
    description: 'Après les résultats du bac (7 juillet), effectuer ton inscription administrative dans l\'établissement choisi.',
    deadline: '2026-07-07',
    status: 'urgent',
    phase: 'phase7'
  },
  {
    id: '7.2',
    title: 'Finaliser mon inscription',
    description: 'Compléter les formalités administratives, régler les frais d\'inscription, récupérer tes codes d\'accès.',
    deadline: '2026-07-15',
    status: 'pending',
    phase: 'phase7'
  },
  {
    id: '7.3',
    title: 'Chercher un logement étudiant',
    description: 'Commencer les recherches de logement (Crous, agences, colocation). Demander les aides si éligible.',
    deadline: '2026-07-31',
    status: 'pending',
    phase: 'phase7'
  },
  {
    id: '7.4',
    title: 'Demander les aides financières',
    description: 'Demander les bourses, logement Crous, aide à la mobilité si tu y es éligible.',
    deadline: '2026-08-15',
    status: 'pending',
    phase: 'phase7'
  },
  {
    id: '7.5',
    title: 'Préparer la rentrée',
    description: 'Organiser : fournitures, logement étudiant, documents administratifs, transport.',
    deadline: '2026-08-30',
    status: 'pending',
    phase: 'phase7'
  },
  {
    id: '7.6',
    title: 'Participer aux journées d\'intégration',
    description: 'Assister aux journées d\'intégration de l\'école pour rencontrer tes futurs camarades.',
    deadline: '2026-09-15',
    status: 'pending',
    phase: 'phase7'
  }
];
