/**
 * @omnicalc/desktop — Build All Script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'dist');

// Clean
console.log('Cleaning dist directory...');
const distExists = fs.existsSync(outDir);
if (distExists) {
  fs.rmSync(outDir, { recursive: true });
}

// Build main
console.log('\nBuilding main process...');
execSync('node scripts/build-main.js', { cwd: rootDir, stdio: 'inherit' });

// Build renderer
console.log('\nBuilding renderer...');
execSync('node scripts/build-renderer.js', { cwd: rootDir, stdio: 'inherit' });

console.log('\nBuild complete!');
