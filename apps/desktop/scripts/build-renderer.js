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

// Copy and combine CSS files
console.log('Building renderer CSS...');
const designSystemCss = fs.readFileSync(
  path.join(rootDir, '../../packages/ui/src/styles/design-system.css'),
  'utf8',
);
const rendererCss = fs.readFileSync(path.join(rootDir, 'renderer/styles.css'), 'utf8');
const combinedCss =
  designSystemCss +
  '\n\n/* Renderer-specific styles */\n' +
  rendererCss.replace(/@import.*design-system\.css.*;/g, '');
fs.writeFileSync(path.join(outDir, 'styles.css'), combinedCss);

// Copy HTML
console.log('Copying renderer files...');
const htmlContent = fs.readFileSync(path.join(rootDir, 'renderer/index.html'), 'utf8');
fs.writeFileSync(
  path.join(outDir, 'index.html'),
  htmlContent.replace('src="./index.ts"', 'src="./index.js"'),
);

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
