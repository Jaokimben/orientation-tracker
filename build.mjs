#!/usr/bin/env node
import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.chdir(__dirname);

function runCommand(cmd, description) {
  console.log(`\n🔨 ${description}...`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: __dirname });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    console.error(`Command: ${cmd}`);
    console.error(`Exit code: ${error.status}`);
    return false;
  }
}

function copyRecursive(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Step 1: Build frontend
if (!runCommand('npx vite build', 'Frontend build')) {
  process.exit(1);
}

// Step 2: Build backend to temporary location
if (!runCommand('npx esbuild server/routers.ts server/_core/context.ts --platform=node --packages=external --bundle --format=esm --outdir=.vercel-build-api --out-extension:.js=.js', 'Backend build')) {
  process.exit(1);
}

// Step 3: Database setup - create in /tmp for Vercel
const dbPath = '/tmp/database.db';
process.env.DATABASE_URL = dbPath;

console.log(`\n🔨 Database setup (${dbPath})...`);

// Step 4: Database migration
runCommand('node migrate.mjs', 'Database migration');

// Step 5: Initialize default user
runCommand('node init-default-user.mjs', 'User initialization');

// Step 6: Add actions data
runCommand('node init-actions.mjs', 'Actions data initialization');

// Step 7: Copy database to public folder
console.log('\n📦 Copying database to deployment...');
try {
  copyFileSync(dbPath, join(__dirname, 'public', 'database.db'));
  console.log('✅ Database copied to public/database.db');
} catch (error) {
  console.error('⚠️  Could not copy database:', error.message);
}

// Step 8: Setup API for Vercel serverless
console.log('\n📦 Setting up API for Vercel...');
const apiSrcDir = join(__dirname, 'api');
const apiDestDir = join(__dirname, 'public', 'api');

// Copy API handler
copyRecursive(apiSrcDir, apiDestDir);

// Copy compiled backend
copyRecursive(join(__dirname, '.vercel-build-api'), apiDestDir);

console.log('✅ API copied to public/api/');

console.log('\n🎉 Build completed successfully!');
