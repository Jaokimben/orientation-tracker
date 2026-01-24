#!/usr/bin/env node
import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
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

// Step 1.5: Generate static API JSON file
if (!runCommand('node generate-api-json.mjs', 'Generate API JSON')) {
  process.exit(1);
}

// Step 2: Build backend API (skip on Vercel - use pre-compiled files)
const isVercel = process.env.VERCEL === '1';
if (!isVercel) {
  if (!runCommand('npx esbuild server/routers.ts server/_core/context.ts --platform=node --packages=external --bundle --format=esm --outdir=.api-build --out-extension:.js=.js', 'Backend API build')) {
    process.exit(1);
  }
} else {
  console.log('\n✅ Running on Vercel - skipping API rebuild (using pre-compiled files)');
}

// Step 3: Database setup
const dbPath = '/tmp/database.db';
process.env.DATABASE_URL = dbPath;

console.log(`\n🔨 Database setup...`);

runCommand('node migrate.mjs', 'Database migration');
runCommand('node init-default-user.mjs', 'User initialization');
runCommand('node init-actions.mjs', 'Actions data initialization');

// Step 4: Copy database to public folder
console.log('\n📦 Packaging database...');
copyFileSync(dbPath, join(__dirname, 'public', 'database.db'));
console.log('✅ Database ready');

// Step 5: Create Vercel API handler (skip on Vercel - use pre-existing files)
if (!isVercel) {
  console.log('\n📦 Creating Vercel API handler...');
  
  // Copy the handler template
  const apiDir = join(__dirname, 'api');
  if (!existsSync(apiDir)) {
    mkdirSync(apiDir, { recursive: true });
  }
  
  // Copy compiled routers and context
  copyRecursive(join(__dirname, '.api-build'), apiDir);
  
  // Create the Vercel-compatible handler
  const handlerContent = `// Vercel Serverless Function Handler
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC middleware
app.use("/api/trpc", createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export for Vercel
export default app;
`;
  
  writeFileSync(join(apiDir, 'index.js'), handlerContent);
  console.log('✅ API handler created at /api/index.js');
} else {
  console.log('\n✅ Running on Vercel - using pre-existing API files');
}

console.log('\n🎉 Build completed successfully!');
