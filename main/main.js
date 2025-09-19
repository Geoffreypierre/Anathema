const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMenu } = require('./menu');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload.js')
        }
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
    }

    createMenu(mainWindow);
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('save-collection', async (event, collection) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        filters: [{ name: 'JSON', extensions: ['json'] }]
    });

    if (!result.canceled) {
        fs.writeFileSync(result.filePath, JSON.stringify(collection, null, 2));
        return { success: true, path: result.filePath };
    }
    return { success: false };
});

ipcMain.handle('load-collection', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        filters: [{ name: 'JSON', extensions: ['json'] }],
        properties: ['openFile']
    });

    if (!result.canceled) {
        const data = fs.readFileSync(result.filePaths[0], 'utf8');
        return { success: true, data: JSON.parse(data) };
    }
    return { success: false };
});

ipcMain.handle('get-storage', (event, key) => {
    const dataPath = path.join(app.getPath('userData'), 'storage.json');
    if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return data[key];
    }
    return null;
});

ipcMain.handle('set-storage', (event, key, value) => {
    const dataPath = path.join(app.getPath('userData'), 'storage.json');
    let data = {};
    if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    data[key] = value;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
});