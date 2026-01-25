#!/usr/bin/env node
/**
 * Vercel Build Script - Ultra Simplified
 * This script builds the project for Vercel by using the standard vite.config.ts
 * but ensuring all dependencies are available
 */

import { execSync } from 'child_process';

function log(message) {
  console.log(`\n🔨 ${message}...`);
}

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${cmd}`);
    console.error(`Exit code: ${error.status}`);
    process.exit(1);
  }
}

log('Starting Vercel build');

// Build with the standard config which works
runCommand('npx vite build --config vite.config.ts');

log('Build completed successfully');
console.log('\n🎉 Vercel build finished!');
