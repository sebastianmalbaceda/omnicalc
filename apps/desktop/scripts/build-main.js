/**
 * @omnicalc/desktop — Build Main Process Script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'dist/main');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Compile TypeScript
console.log('Building main process...');
execSync('npx tsc -p tsconfig.main.json', { cwd: rootDir, stdio: 'inherit' });

// Copy preload script (plain JS to avoid Node module bundling issues)
console.log('Copying preload...');
fs.copyFileSync(path.join(rootDir, 'preload.js'), path.join(outDir, 'preload.js'));

console.log('Main process build complete!');
