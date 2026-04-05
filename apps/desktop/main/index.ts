/**
 * @omnicalc/desktop — Main Process
 *
 * Electron shell that loads the mobile web build served by the unified Hono server.
 */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

const WEB_URL = process.env.OMNICALC_URL || 'http://localhost:3000';

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
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(WEB_URL);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('open-external', (_event, url: string) => shell.openExternal(url));
ipcMain.handle('get-platform', () => process.platform);

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
