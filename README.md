# Anathema - une version simplifiée de Postman

Cette application utilise **Electron** et **React** pour fournir une interface moderne et multiplateforme.

<img width="1186" height="794" alt="image" src="https://github.com/user-attachments/assets/7d3e60cd-fa2a-4874-9724-e89b4c97dd31" />

Fonctionnalités principales :  
- ✉️ **Envoi de requêtes HTTP** : configuration des URL, en-têtes, corps de requête.  
- 📄 **Affichage des réponses** : visualisation claire des statuts, en-têtes et contenu de la réponse (JSON, texte, etc.).

<img width="1390" height="792" alt="image" src="https://github.com/user-attachments/assets/5adde370-744a-4bcb-8bc7-b8cf2ed603e2" />

- 🕒 **Historique des requêtes** : sauvegarde automatique des requêtes effectuées pour un accès rapide.
  
  <img width="1391" height="793" alt="image" src="https://github.com/user-attachments/assets/59406920-08c3-403e-b0a4-b8ef55ed769f" />

- 📂 **Collections de requêtes** : organisation des requêtes par projets ou dossiers pour les réutiliser facilement.

<img width="1390" height="793" alt="image" src="https://github.com/user-attachments/assets/ba409707-9671-4ce9-be01-5ee07ca248ac" />
  
- 🎯 **Interface minimaliste et intuitive** : rapide à prendre en main, idéale pour les tests rapides d’API.

---

## 📦 Installation

Assurez-vous d’avoir **Node.js** et **npm** installés sur votre machine.  
Ensuite, installez les dépendances du projet :

```bash
npm i
```

🛠️ Mode Développement

Pour lancer l’application en mode développement :

```bash
npm run dev
```

Cela démarre l’application avec rechargement à chaud (hot reload) pour accélérer le développement.

🏗️ Build de Production

Pour construire la version finale de l’application (prête à être distribuée) :

```bash
npm run build
```

Cela génère un dossier dist/ contenant les fichiers nécessaires.

💻 Tester le Logiciel

Une fois la build terminée, vous pouvez :

Exécuter directement le fichier .exe généré dans le dossier dist/ pour tester l’application.

Ou lancer Anathema Setup 1.0.0.exe pour installer l’application sur votre machine (comme un logiciel classique).

📚 Notes

Vérifiez que toutes les dépendances sont à jour si vous rencontrez des problèmes.

En cas de bug, relancez le build :

```bash
rm -rf dist
npm run build
```
