import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  analyzeFolder: (folderPath: string) => ipcRenderer.invoke('analyze-folder', folderPath),
  onAnalysisProgress: (callback: (progress: string) => void) => {
    ipcRenderer.on('analysis-progress', (event, progress) => callback(progress));
  },
  openFolderDialog: () => {
    return ipcRenderer.invoke('open-folder-dialog');
  }
});