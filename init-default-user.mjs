import Database from "better-sqlite3";

const sqlite = new Database(process.env.DATABASE_URL || "./database.db");

const DEFAULT_OPENID = 'student-default-openid';
const DEFAULT_USER = {
  openId: DEFAULT_OPENID,
  name: 'Étudiant',
  email: 'student@orientation2026.local',
  role: 'user',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastSignedIn: Date.now(),
};

console.log('Initialisation du compte étudiant par défaut...');

try {
  // Check if default user already exists
  const existingUser = sqlite.prepare('SELECT * FROM users WHERE openId = ?').get(DEFAULT_OPENID);

  if (existingUser) {
    console.log('✓ Le compte par défaut existe déjà');
    console.log('ID utilisateur:', existingUser.id);
  } else {
    // Create default user
    const stmt = sqlite.prepare(`
      INSERT INTO users (openId, name, email, role, createdAt, updatedAt, lastSignedIn)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      DEFAULT_USER.openId,
      DEFAULT_USER.name,
      DEFAULT_USER.email,
      DEFAULT_USER.role,
      DEFAULT_USER.createdAt,
      DEFAULT_USER.updatedAt,
      DEFAULT_USER.lastSignedIn
    );
    
    console.log('✓ Compte par défaut créé avec succès');
    console.log('ID utilisateur:', result.lastInsertRowid);
  }

  console.log('✅ Initialisation terminée !');
  sqlite.close();
  process.exit(0);
} catch (error) {
  console.error('❌ Erreur:', error);
  sqlite.close();
  process.exit(1);
}
