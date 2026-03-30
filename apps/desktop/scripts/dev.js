/**
 * @omnicalc/desktop — Development Script
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Start main process with dev mode
console.log('Starting desktop app in development mode...');
const electron = require('electron');

// Wait for main process to be built, then start Electron
console.log('Build main process...');
require('./build-main');

// Start Electron with devtools
const proc = spawn(electron, ['.'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
});

proc.on('close', (code) => {
  process.exit(code);
});
