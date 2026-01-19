import Database from 'better-sqlite3';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_URL || './database.db';
console.log(`Initializing database at: ${dbPath}`);

const db = new Database(dbPath);

// Check if database is already initialized
const tablesExist = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='actions'").get();

if (tablesExist) {
  console.log('✅ Database already initialized, skipping migration.');
  db.close();
  process.exit(0);
}

// Read and execute migration
const migrationSQL = readFileSync(join(__dirname, 'drizzle/0000_hard_scalphunter.sql'), 'utf-8');
const statements = migrationSQL.split(/--> statement-breakpoint/g);

try {
  db.exec('BEGIN TRANSACTION');
  
  for (const statement of statements) {
    const cleanStatement = statement.trim();
    if (cleanStatement) {
      db.exec(cleanStatement);
    }
  }
  
  db.exec('COMMIT');
  console.log('✅ Migration applied successfully!');
} catch (error) {
  db.exec('ROLLBACK');
  console.error('❌ Migration failed:', error);
  process.exit(1);
}

db.close();
