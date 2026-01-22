import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_URL || './database.db';
const sqlite = new Database(dbPath);

// Actions enrichies
const newActions = [
  // PHASE 0
  { id: '0.1', title: 'Préparer mon projet d\'orientation', description: 'Consulter Avenirs.onisep.fr et Parcoursup.gouv.fr pour réfléchir à ton projet.', deadline: '2025-12-01', phase: 'phase0', link: 'https://avenirs.onisep.fr' },
  { id: '0.2', title: 'Échanger avec mon professeur principal', description: 'Discuter de ton projet d\'orientation avec ton professeur principal et les personnels d\'orientation.', deadline: '2025-12-05', phase: 'phase0', link: null },
  { id: '0.3', title: 'Participer à la 1re semaine d\'orientation', description: 'Assister aux réunions d\'orientation au lycée pour affiner ton projet.', deadline: '2025-12-10', phase: 'phase0', link: null },
  { id: '0.4', title: 'Renseigner la fiche de dialogue', description: 'Compléter ta fiche de dialogue avant le 1er conseil de classe (début décembre).', deadline: '2025-12-05', phase: 'phase0', link: null },
  { id: '0.5', title: 'Appeler le numéro vert Parcoursup', description: 'Poser tes questions sur ton projet d\'orientation. Numéro : 0 800 400 070 (lun-ven 10h-16h).', deadline: '2025-12-15', phase: 'phase0', link: 'https://www.parcoursup.gouv.fr' },
  // PHASE 1
  { id: '1.11', title: 'Découvrir la carte des formations', description: 'À partir du 17 décembre, consulter la carte des formations Parcoursup 2026.', deadline: '2025-12-17', phase: 'phase1', link: 'https://www.parcoursup.gouv.fr' },
  { id: '1.12', title: 'Lire les fiches de formation détaillées', description: 'Pour chaque école (Celsa, ISCOM, Sup de pub, DN Made, BUT, BTS), consulter les critères d\'admission, frais, débouchés.', deadline: '2025-12-20', phase: 'phase1', link: 'https://www.parcoursup.gouv.fr' },
  { id: '1.13', title: 'Consulter le profil des candidats admis', description: 'Vérifier les données sur le profil des candidats admis les années précédentes (série bac, niveau scolaire).', deadline: '2025-12-22', phase: 'phase1', link: null },
  { id: '1.14', title: 'Vérifier les frais de scolarité et aides', description: 'Vérifier les frais de scolarité, éligibilité aux bourses sur critères sociaux pour chaque formation.', deadline: '2025-12-25', phase: 'phase1', link: null },
  { id: '1.15', title: 'Participer aux salons d\'orientation', description: 'Assister aux salons d\'orientation pour rencontrer des écoles et des étudiants ambassadeurs.', deadline: '2026-01-31', phase: 'phase1', link: null },
  { id: '1.16', title: 'Participer à la 2e semaine d\'orientation', description: 'Assister aux réunions d\'orientation au lycée (2e trimestre) pour affiner ton projet.', deadline: '2026-02-28', phase: 'phase1', link: null },
  { id: '1.17', title: 'Échanger avec des professionnels', description: 'Contacter des chargés de com ou chefs de projet événementiel (LinkedIn, famille) pour discuter des métiers.', deadline: '2026-01-31', phase: 'phase1', link: null },
  // PHASE 2
  { id: '2.9', title: 'Ouvrir mon compte Parcoursup', description: 'À partir du 19 janvier, créer ton compte et remplir ton profil sur Parcoursup.', deadline: '2026-01-19', phase: 'phase2', link: 'https://www.parcoursup.fr' },
  { id: '2.10', title: 'Télécharger les documents nécessaires', description: 'Préparer : photo d\'identité, numéro INE, informations parents, adresse mail valide.', deadline: '2026-01-20', phase: 'phase2', link: null },
  { id: '2.11', title: 'Identifier mes favoris sur Parcoursup', description: 'Ajouter tes formations favorites pour les comparer et préparer progressivement tes vœux.', deadline: '2026-01-25', phase: 'phase2', link: 'https://www.parcoursup.fr' },
  { id: '2.12', title: 'Réfléchir à mon ordre de préférence', description: 'Classer tes écoles : 1. Celsa, 2. ISCOM, 3. Sup de pub, 4. DN Made, 5. BUT Info-Com, 6. BTS Communication.', deadline: '2026-01-30', phase: 'phase2', link: null },
  { id: '2.13', title: 'Formuler mes 10 vœux', description: 'Ajouter tes 10 vœux principaux sur Parcoursup (sans obligation de les classer).', deadline: '2026-02-28', phase: 'phase2', link: 'https://www.parcoursup.fr' },
  { id: '2.14', title: 'Ajouter des sous-vœux si disponibles', description: 'Pour certaines formations, ajouter des sous-vœux pour augmenter tes chances.', deadline: '2026-03-05', phase: 'phase2', link: null }
];

try {
  console.log('Ajout des nouvelles actions enrichies...');
  
  const insertStmt = sqlite.prepare(`
    INSERT OR IGNORE INTO actions (id, title, description, deadline, phase, link, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  
  for (const action of newActions) {
    insertStmt.run(
      action.id,
      action.title,
      action.description,
      action.deadline,
      action.phase,
      action.link
    );
  }
  
  console.log(`✅ ${newActions.length} nouvelles actions ajoutées avec succès !`);
} catch (error) {
  console.error('❌ Erreur lors de l\'ajout des actions:', error);
  process.exit(1);
} finally {
  sqlite.close();
}
