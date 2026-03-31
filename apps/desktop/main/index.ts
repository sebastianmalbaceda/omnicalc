/**
 * @omnicalc/desktop — Main Process
 *
 * Electron main process that loads the mobile Expo web app.
 * This ensures desktop uses the exact same code as mobile and web.
 */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

// URLs for different environments
const WEB_PROD_URL = 'http://localhost:3000';
const MOBILE_DEV_URL = 'http://localhost:8081';

console.log('[Electron] OmniCalc Desktop starting...');
console.log('[Electron] Will try:', WEB_PROD_URL, 'then', MOBILE_DEV_URL);

let mainWindow: BrowserWindow | null = null;

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

  // Try loading from web production server first
  mainWindow.loadURL(WEB_PROD_URL).catch(() => {
    console.log('[Electron] Web server not available, trying mobile dev');
    mainWindow?.loadURL(MOBILE_DEV_URL).catch((err) => {
      console.error('[Electron] Failed to load:', err.message);
    });
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error('[Electron] Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Electron] Page loaded successfully');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// IPC Handlers
ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('open-external', (_event, url: string) => {
  shell.openExternal(url);
});

ipcMain.handle('get-platform', () => process.platform);

// App lifecycle
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
