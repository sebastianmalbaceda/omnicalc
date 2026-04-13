/**
 * @omnicalc/desktop — Main Process
 *
 * Electron shell that loads the web SPA.
 */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import * as http from 'http';

const WEB_APP_URL = process.env.OMNICALC_URL || 'http://localhost:3002';
const MAX_RETRIES = 60;
const RETRY_DELAY = 500;

let mainWindow: BrowserWindow | null = null;

function waitForServer(url: string, retries: number, delay: number): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      const parsedUrl = new URL(url);
      const req = http.get(
        {
          hostname: parsedUrl.hostname,
          port: parseInt(parsedUrl.port || '3002', 10),
          path: '/',
          timeout: 2000,
        },
        (res) => {
          if (res.statusCode && res.statusCode < 400) resolve(true);
        },
      );
      req.on('error', () => {
        if (attempts >= retries) resolve(false);
        else setTimeout(check, delay);
      });
      req.on('timeout', () => {
        req.destroy();
        if (attempts >= retries) resolve(false);
        else setTimeout(check, delay);
      });
    };
    setTimeout(check, delay);
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 800,
    minWidth: 400,
    minHeight: 650,
    title: 'OmniCalc',
    backgroundColor: '#0A0A0F',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  waitForServer(WEB_APP_URL, MAX_RETRIES, RETRY_DELAY).then((available) => {
    if (available && mainWindow) {
      mainWindow.loadURL(WEB_APP_URL);
    } else if (mainWindow) {
      mainWindow.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head><title>OmniCalc</title></head>
        <body style="background:#0A0A0F;color:#e8e8f0;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:40px;">
          <div>
            <h1 style="color:#c3c0ff;font-size:24px;margin-bottom:16px;">OmniCalc</h1>
            <p style="color:#a0a0b8;font-size:14px;margin-bottom:24px;">Waiting for development server...</p>
            <p style="color:#666;font-size:12px;">Make sure the web app is running:<br/><code style="background:#1a1a2e;padding:4px 8px;border-radius:4px;">pnpm dev:web</code></p>
            <p style="color:#666;font-size:12px;margin-top:16px;">Expected at: ${WEB_APP_URL}</p>
          </div>
        </body>
        </html>
      `)}`,
      );
    }
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
