#!/usr/bin/env node
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

// Step 1: Build frontend
if (!runCommand('npx vite build', 'Frontend build')) {
  process.exit(1);
}

// Step 2: Build backend
if (!runCommand('npx esbuild server/routers.ts server/_core/context.ts --platform=node --packages=external --bundle --format=esm --outdir=api --out-extension:.js=.js', 'Backend build')) {
  process.exit(1);
}

// Step 3: Database migration (non-critical)
runCommand('node migrate.mjs', 'Database migration');

// Step 4: Initialize default user (non-critical)
runCommand('node init-default-user.mjs', 'User initialization');

console.log('\n🎉 Build completed successfully!');
