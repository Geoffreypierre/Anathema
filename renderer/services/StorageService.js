export class StorageService {
    static async saveHistory(history) {
        if (window.electronAPI) {
            return await window.electronAPI.setStorage('history', history);
        }
        localStorage.setItem('anathema_history', JSON.stringify(history));
    }

    static async loadHistory() {
        if (window.electronAPI) {
            return await window.electronAPI.getStorage('history');
        }
        const data = localStorage.getItem('anathema_history');
        return data ? JSON.parse(data) : [];
    }

    static async setHistory(historyArray) {
        if (window.electronAPI) {
            return await window.electronAPI.setStorage('history', historyArray);
        }
        localStorage.setItem('anathema_history', JSON.stringify(historyArray));
    }

    static async clearHistory() {
        if (window.electronAPI) {
            return await window.electronAPI.setStorage('history', []);
        }
        localStorage.removeItem('anathema_history');
    }

    static async saveCollections(collections) {
        if (window.electronAPI) {
            return await window.electronAPI.setStorage('collections', collections);
        }
        localStorage.setItem('anathema_collections', JSON.stringify(collections));
    }

    static async loadCollections() {
        if (window.electronAPI) {
            return await window.electronAPI.getStorage('collections');
        }
        const data = localStorage.getItem('anathema_collections');
        return data ? JSON.parse(data) : [];
    }

    static async saveEnvironments(environments) {
        if (window.electronAPI) {
            return await window.electronAPI.setStorage('environments', environments);
        }
        localStorage.setItem('anathema_environments', JSON.stringify(environments));
    }

    static async loadEnvironments() {
        if (window.electronAPI) {
            return await window.electronAPI.getStorage('environments');
        }
        const data = localStorage.getItem('anathema_environments');
        return data ? JSON.parse(data) : [];
    }

    static async exportData(type, data) {
        if (window.electronAPI) {
            const filename = `anathema_${type}_${new Date().toISOString().split('T')[0]}.json`;
            return await window.electronAPI.saveCollection({
                type,
                data,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            });
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anathema_${type}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    static async importData() {
        if (window.electronAPI) {
            return await window.electronAPI.loadCollection();
        }

        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            resolve({ success: true, data });
                        } catch (error) {
                            resolve({ success: false, error: error.message });
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });
    }
}