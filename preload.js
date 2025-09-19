const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveCollection: (collection) => ipcRenderer.invoke('save-collection', collection),
    loadCollection: () => ipcRenderer.invoke('load-collection'),
    getStorage: (key) => ipcRenderer.invoke('get-storage', key),
    setStorage: (key, value) => ipcRenderer.invoke('set-storage', key, value),

    onMenuAction: (callback) => {
        ipcRenderer.on('menu-new-request', callback);
        ipcRenderer.on('menu-save-collection', callback);
        ipcRenderer.on('menu-load-collection', callback);
        ipcRenderer.on('menu-send-request', callback);
        ipcRenderer.on('menu-show-history', callback);
        ipcRenderer.on('menu-show-collections', callback);
    },

    removeAllListeners: () => {
        ipcRenderer.removeAllListeners('menu-new-request');
        ipcRenderer.removeAllListeners('menu-save-collection');
        ipcRenderer.removeAllListeners('menu-load-collection');
        ipcRenderer.removeAllListeners('menu-send-request');
        ipcRenderer.removeAllListeners('menu-show-history');
        ipcRenderer.removeAllListeners('menu-show-collections');
    }
});