/**
 * @omnicalc/desktop — Build Renderer Script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'dist/renderer');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy HTML and CSS
console.log('Copying renderer files...');
fs.copyFileSync(path.join(rootDir, 'renderer/index.html'), path.join(outDir, 'index.html'));
fs.copyFileSync(path.join(rootDir, 'renderer/styles.css'), path.join(outDir, 'styles.css'));

// Bundle renderer with esbuild
console.log('Bundling renderer...');
execSync(
  'npx esbuild renderer/index.ts --bundle --platform=browser --outfile=dist/renderer/index.js',
  {
    cwd: rootDir,
    stdio: 'inherit',
  },
);

console.log('Renderer build complete!');
