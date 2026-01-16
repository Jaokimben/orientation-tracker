import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const DEFAULT_OPENID = 'student-default-openid';
const DEFAULT_USER = {
  openId: DEFAULT_OPENID,
  name: 'Étudiant',
  email: 'student@orientation2026.local',
};

console.log('Initialisation du compte étudiant par défaut...');

// Check if default user already exists
const existingUser = await db.select().from(users).where(eq(users.openId, DEFAULT_OPENID));

if (existingUser.length > 0) {
  console.log('✓ Le compte par défaut existe déjà');
  console.log('ID utilisateur Lina:', existingUser[0].id);
} else {
  // Create default user
  const result = await db.insert(users).values(DEFAULT_USER);
  console.log('✓ Compte par défaut créé avec succès');
  console.log('ID utilisateur Lina:', result[0].insertId);
}

console.log('✅ Initialisation terminée !');
process.exit(0);
