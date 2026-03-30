/**
 * @omnicalc/desktop — Preload Script
 *
 * Secure IPC bridge between main and renderer processes.
 */
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    getPlatform: () => ipcRenderer.invoke('get-platform'),
});
//# sourceMappingURL=preload.js.map