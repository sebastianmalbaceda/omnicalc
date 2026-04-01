/**
 * @omnicalc/desktop — Main Process
 *
 * Electron main process that loads the OmniCalc app.
 *
 * Loading priority:
 * 1. http://localhost:3000 (Unified server - serves mobile dist + API)
 * 2. http://localhost:8081 (Expo dev server)
 * 3. file:// local fallback (limited functionality)
 */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

const WEB_URL = 'http://localhost:3000';
const EXPO_URL = 'http://localhost:8081';
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..');
const LOCAL_INDEX = path.join(PROJECT_ROOT, 'mobile', 'dist', 'index.html');

let mainWindow: BrowserWindow | null = null;

function log(...args: Parameters<typeof console.log>) {
  console.log('[Electron]', ...args);
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 750,
    minWidth: 360,
    minHeight: 600,
    title: 'OmniCalc',
    backgroundColor: '#0A0A0F',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  log('Starting app...');
  log('Project root:', PROJECT_ROOT);
  log('Local index:', LOCAL_INDEX);

  let loaded = false;

  async function tryLoad(url: string, label: string): Promise<boolean> {
    try {
      log(`Trying ${label}: ${url}`);
      await mainWindow!.loadURL(url);
      log(`Loaded from ${label}`);
      loaded = true;
      return true;
    } catch (err) {
      log(`${label} failed:`, (err as Error).message);
      return false;
    }
  }

  async function loadSequentially() {
    // 1. First try unified server on port 3000
    if (await tryLoad(WEB_URL, 'Web Server')) return;

    // 2. Fallback to Expo dev server
    if (await tryLoad(EXPO_URL, 'Expo Dev')) return;

    // 3. Last resort: local file (assets won't load but app shell will show)
    log('Falling back to local file...');
    try {
      await mainWindow!.loadFile(LOCAL_INDEX);
      log('Loaded local file (assets may not work)');
    } catch (err) {
      log('All sources failed:', (err as Error).message);
    }
  }

  loadSequentially();

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    log('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    log('Page loaded successfully');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('open-external', (_event, url: string) => {
  shell.openExternal(url);
});

ipcMain.handle('get-platform', () => process.platform);

app.whenReady().then(() => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
  }
});
