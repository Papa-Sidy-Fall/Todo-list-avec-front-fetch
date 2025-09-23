# Gestionnaire de Tâches - Frontend React

Une application React moderne pour gérer vos tâches avec authentification.

## Fonctionnalités

- ✅ Authentification utilisateur (login/logout)
- ✅ Création, modification et suppression de tâches
- ✅ Changement de statut des tâches (À faire, En cours, Terminé)
- ✅ Interface responsive et moderne
- ✅ Gestion d'état avec React Context
- ✅ API REST complète

## Prérequis

- Node.js (version 16 ou supérieure)
- Le backend API doit être en cours d'exécution sur le port 3003

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer l'application en mode développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur

## Structure du projet

```
src/
├── components/          # Composants React
│   ├── Login.jsx       # Formulaire de connexion
│   ├── TaskList.jsx    # Liste des tâches
│   ├── TaskForm.jsx    # Formulaire de création
│   └── TaskItem.jsx    # Élément de tâche individuel
├── contexts/
│   └── AuthContext.jsx # Gestion de l'authentification
├── services/
│   └── api.js          # Service API pour communiquer avec le backend
├── App.jsx             # Composant principal
└── main.jsx           # Point d'entrée de l'application
```

## Utilisation

1. **Connexion** : Utilisez vos identifiants pour vous connecter
2. **Créer une tâche** : Utilisez le formulaire en haut de la page
3. **Gérer les tâches** :
   - Cliquez sur "Modifier" pour éditer une tâche
   - Utilisez le menu déroulant pour changer le statut
   - Cliquez sur "Supprimer" pour effacer une tâche
4. **Statistiques** : Visualisez le nombre de tâches par statut

## API Endpoints utilisés

- `POST /auth/login` - Connexion utilisateur
- `GET /taches` - Récupérer toutes les tâches
- `POST /taches` - Créer une nouvelle tâche
- `PUT /taches/:id` - Modifier une tâche
- `DELETE /taches/:id` - Supprimer une tâche
- `PATCH /taches/:id/:status` - Changer le statut d'une tâche

## Technologies utilisées

- React 18
- Vite
- JavaScript ES6+
- CSS3 (styles inline pour simplicité)
- Context API pour la gestion d'état
- Fetch API pour les requêtes HTTP
