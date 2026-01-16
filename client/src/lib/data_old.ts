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
  { id: 'phase1', title: 'Étape 1 : Découverte', color: 'bg-blue-200' },
  { id: 'phase2', title: 'Étape 2 : Parcoursup', color: 'bg-pink-200' },
  { id: 'phase3', title: 'Étape 3 : Dossiers', color: 'bg-yellow-200' },
  { id: 'phase4', title: 'Étape 4 : Suivi', color: 'bg-green-200' },
  { id: 'phase5', title: 'Étape 5 : Finalisation', color: 'bg-purple-200' },
  { id: 'phase6', title: 'Étape 6 : Résultats', color: 'bg-orange-200' },
  { id: 'phase7', title: 'Étape 7 : Inscription', color: 'bg-red-200' },
];

export const initialActions: Action[] = [
  // PHASE 1: DÉCOUVERTE (Décembre 2025 - Janvier 2026)
  {
    id: '1.1',
    title: 'Explorer les écoles',
    description: 'Découvrir les sites officiels : Celsa, ISCOM, Sup de pub, DN Made, BUT Info-Com.',
    deadline: '2026-01-05',
    status: 'pending',
    phase: 'phase1',
    link: 'https://www.celsa.fr'
  },
  {
    id: '1.2',
    title: 'JPO Celsa - Samedi 10 janvier',
    description: 'Journée Portes Ouvertes Celsa : 10h-18h à Neuilly-sur-Seine (77 rue de Villiers). Présentiel + Distanciel.',
    deadline: '2026-01-10',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.celsa.fr/evenement/journee-portes-ouvertes-du-celsa/'
  },
  {
    id: '1.3',
    title: 'JPO ISCOM - Samedi 17 janvier',
    description: 'Journées Portes Ouvertes ISCOM Lyon (10h-16h) et Bordeaux (10h-15h30).',
    deadline: '2026-01-17',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.iscom.fr/fr/iscom-lyon/informations-pratiques/prochains-rendez-vous-a-lyon'
  },
  {
    id: '1.4',
    title: 'JPO Sup de Pub - Samedi 24 janvier',
    description: 'Journées Portes Ouvertes Sup de Pub : Lyon (10h-13h), Marseille (10h-16h).',
    deadline: '2026-01-24',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.supdepub.com/event/lyon-portes-ouvertes-sur-le-campus/'
  },
  {
    id: '1.5',
    title: 'JPO ISCOM Paris - Samedi 24 janvier',
    description: 'Journée Portes Ouvertes ISCOM Paris : 10h-13h.',
    deadline: '2026-01-24',
    status: 'urgent',
    phase: 'phase1',
    link: 'https://www.iscom.fr/fr/iscom-paris/informations-pratiques/prochains-rendez-vous-a-paris'
  },
  {
    id: '1.6',
    title: 'Échanges avec des professionnels',
    description: 'Échanger avec des pros (LinkedIn, famille) : Chargé de com, Chef de projet événementiel.',
    deadline: '2026-01-31',
    status: 'pending',
    phase: 'phase1'
  },

  // PHASE 2: PARCOURSUP (Janvier - Mars 2026)
  {
    id: '2.1',
    title: 'Ouvrir mon compte Parcoursup',
    description: 'Créer ton compte, remplir ton profil, ajouter tes documents. Plateforme ouverte depuis le 17 décembre 2025.',
    deadline: '2026-01-19',
    status: 'urgent',
    phase: 'phase2',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '2.2',
    title: 'Mes préférences',
    description: 'Réfléchir à ton ordre de préférence : 1. Celsa, 2. ISCOM, 3. Sup de pub, 4. DN Made, 5. BUT Info-Com, 6. BTS Communication.',
    deadline: '2026-01-25',
    status: 'pending',
    phase: 'phase2'
  },
  {
    id: '2.3',
    title: 'Ajouter mes favoris',
    description: 'Ajouter tes formations favorites sur Parcoursup, noter les dates clés. Jusqu\'au 10 vœux + 20 sous-vœux.',
    deadline: '2026-02-01',
    status: 'pending',
    phase: 'phase2',
    link: 'https://www.parcoursup.fr'
  },

  // PHASE 3: DOSSIERS (Février 2026)
  {
    id: '3.1',
    title: 'Ma lettre de motivation',
    description: 'Commencer ton brouillon : ta passion pour la com/l\'événementiel, tes qualités, ton projet.',
    deadline: '2026-02-05',
    status: 'pending',
    phase: 'phase3'
  },
  {
    id: '3.2',
    title: 'Personnaliser mes lettres',
    description: 'Adapter ta lettre pour chaque école : Celsa, ISCOM, Sup de pub. Montrer ce qui te plaît dans chacune.',
    deadline: '2026-02-15',
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
    deadline: '2026-02-20',
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

  // PHASE 4: SUIVI (Mars 2026)
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
    description: 'Vérifier les avis et la cohérence sur Parcoursup.',
    deadline: '2026-03-05',
    status: 'pending',
    phase: 'phase4'
  },
  {
    id: '4.3',
    title: 'M’entraîner pour les entretiens',
    description: 'Faire des simulations, réfléchir aux questions classiques (pourquoi cette école ? ton projet ? tes qualités ?).',
    deadline: '2026-03-10',
    status: 'pending',
    phase: 'phase4'
  },

  // PHASE 5: FINALISATION (Mars 2026)
  {
    id: '5.1',
    title: 'Relire mes vœux',
    description: 'Revoir l\'ordre, vérifier les documents, corriger les petites erreurs.',
    deadline: '2026-03-10',
    status: 'pending',
    phase: 'phase5'
  },
  {
    id: '5.2',
    title: 'Valider mes vœux',
    description: 'Soumettre tes vœux finaux sur Parcoursup (jusqu\'au 10 vœux). Date clé : 12 mars 2026.',
    deadline: '2026-03-12',
    status: 'urgent',
    phase: 'phase5',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '5.3',
    title: 'Finaliser mon dossier',
    description: 'Compléter tous les documents, lettres de motivation. Date clé : 1er avril 2026.',
    deadline: '2026-04-01',
    status: 'urgent',
    phase: 'phase5',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '5.4',
    title: 'Confirmer l\'envoi',
    description: 'Vérifier que tout est envoyé, télécharger la confirmation.',
    deadline: '2026-04-01',
    status: 'pending',
    phase: 'phase5'
  },

  // PHASE 6: RÉSULTATS (Mai - Juin 2026)
  {
    id: '6.1',
    title: 'Découvrir les résultats',
    description: 'Consulter les réponses Parcoursup, voir les propositions (Oui/Oui-si), listes d\'attente.',
    deadline: '2026-06-02',
    status: 'pending',
    phase: 'phase6',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '6.2',
    title: 'Organiser mes vœux en attente',
    description: 'Classer par ordre de préférence tes vœux en attente (du 5 au 8 juin 2026).',
    deadline: '2026-06-08',
    status: 'urgent',
    phase: 'phase6',
    link: 'https://www.parcoursup.fr'
  },
  {
    id: '6.3',
    title: 'Répondre aux propositions',
    description: 'Accepter ou refuser les propositions dans les délais (pense à répondre pour chaque proposition).',
    deadline: '2026-06-10',
    status: 'urgent',
    phase: 'phase6'
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

  // PHASE 7: INSCRIPTION (Juin - Août 2026)
  {
    id: '7.1',
    title: 'Finaliser mon inscription',
    description: 'Compléter les formalités administratives, régler les frais d\'inscription, récupérer tes codes d\'accès.',
    deadline: '2026-06-30',
    status: 'pending',
    phase: 'phase7'
  },
  {
    id: '7.2',
    title: 'Préparer la rentrée',
    description: 'Organiser : fournitures, logement étudiant, documents administratifs, transport.',
    deadline: '2026-08-30',
    status: 'pending',
    phase: 'phase7'
  }
];
