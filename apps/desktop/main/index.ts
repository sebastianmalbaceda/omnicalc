/**
 * @omnicalc/desktop — Main Process
 *
 * Electron main process that loads the mobile Expo web app.
 * Tries loading from:
 * 1. Local file (mobile/dist) - works standalone
 * 2. localhost:3000 (web server)
 * 3. localhost:8081 (expo dev)
 */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

// Paths
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..', '..');
const LOCAL_INDEX = path.join(PROJECT_ROOT, 'mobile', 'dist', 'index.html');
const WEB_URL = 'http://localhost:3000';
const EXPO_URL = 'http://localhost:8081';

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

  console.log('[Electron] Local file:', LOCAL_INDEX);

  // Try loading from local file first (standalone)
  mainWindow
    .loadFile(LOCAL_INDEX)
    .then(() => {
      console.log('[Electron] Loaded from local file');
    })
    .catch(() => {
      console.log('[Electron] Local file failed, trying web server:', WEB_URL);
      mainWindow
        ?.loadURL(WEB_URL)
        .then(() => {
          console.log('[Electron] Loaded from web server');
        })
        .catch(() => {
          console.log('[Electron] Web server failed, trying Expo dev:', EXPO_URL);
          mainWindow?.loadURL(EXPO_URL).catch((err) => {
            console.error('[Electron] All sources failed:', err.message);
          });
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
