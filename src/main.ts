import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
  });

  // Load the React app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow) {
      mainWindow.show();
      if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
      }
    }
  });
}

// Handle folder analysis request
ipcMain.handle('analyze-folder', async (event, folderPath: string) => {
  return new Promise((resolve, reject) => {
    // Spawn a worker process to analyze the folder
    const worker = spawn(process.execPath, [
      path.join(__dirname, 'folder-analyzer-worker.js'),
      folderPath
    ]);

    let result = '';
    
    worker.stdout.on('data', (data) => {
      console.log(`[Worker] ${data}`);
      // Send progress updates to renderer
      event.sender.send('analysis-progress', data.toString());
    });

    worker.stderr.on('data', (data) => {
      console.error(`[Worker Error] ${data}`);
    });

    worker.on('close', (code) => {
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });

    // Send initial message
    event.sender.send('analysis-progress', '[Worker] Starting analysis...');
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});