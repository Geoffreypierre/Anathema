import { create } from 'zustand';
import { StorageService } from '../services/StorageService';

export const useAppStore = create((set, get) => ({
    currentView: 'newRequest',
    history: [],
    collections: [],
    environments: [],

    setCurrentView: (view) => set({ currentView: view }),

    addToHistory: (request) => {
        const { history } = get();
        const newHistory = [request, ...history.slice(0, 99)];
        set({ history: newHistory });
        StorageService.saveHistory(newHistory);
    },

    clearHistory: () => {
        set({ history: [] });
        StorageService.clearHistory();
    },

    clearSingleHistory: (identifier) => {
        set((state) => {
            const history = Array.isArray(state.history) ? state.history : [];
            let updatedHistory;
            updatedHistory = history.filter(h => h !== identifier);
            StorageService.setHistory(updatedHistory);

            return { history: updatedHistory };
        });
    },

    saveCollection: (name, request) => {
        const { collections } = get();
        const existingCollection = collections.find(c => c.name === name);

        if (existingCollection) {
            existingCollection.requests.push(request);
        } else {
            collections.push({
                name,
                requests: [request],
                createdAt: new Date().toISOString()
            });
        }

        set({ collections: [...collections] });
        StorageService.saveCollections(collections);
    },

    deleteCollection: (name) => {
        const { collections } = get();
        const filtered = collections.filter(c => c.name !== name);
        set({ collections: filtered });
        StorageService.saveCollections(filtered);
    },

    loadData: async () => {
        const history = await StorageService.loadHistory();
        const collections = await StorageService.loadCollections();
        const environments = await StorageService.loadEnvironments();

        set({
            history: history || [],
            collections: collections || [],
            environments: environments || []
        });
    },

    addEnvironment: (environment) => {
        const { environments } = get();
        const newEnvironments = [...environments, environment];
        set({ environments: newEnvironments });
        StorageService.saveEnvironments(newEnvironments);
    },

    updateEnvironment: (id, updatedEnvironment) => {
        const { environments } = get();
        const newEnvironments = environments.map(env =>
            env.id === id ? { ...env, ...updatedEnvironment } : env
        );
        set({ environments: newEnvironments });
        StorageService.saveEnvironments(newEnvironments);
    },

    deleteEnvironment: (id) => {
        const { environments } = get();
        const newEnvironments = environments.filter(env => env.id !== id);
        set({ environments: newEnvironments });
        StorageService.saveEnvironments(newEnvironments);
    }
}));