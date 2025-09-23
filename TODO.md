# TODO - Sécurisation du bouton supprimer des tâches

## ✅ Analyse Complétée
- Structure du projet analysée
- Problème identifié : bouton supprimer visible pour toutes les tâches
- Solution : masquer le bouton pour les tâches d'autres utilisateurs

## 🚧 Étapes à suivre

### 1. Modifier le composant TaskItem
- [ ] Importer le hook useAuth du contexte d'authentification
- [ ] Récupérer l'utilisateur connecté
- [ ] Ajouter la logique de comparaison userId
- [ ] Masquer le bouton supprimer si la tâche n'appartient pas à l'utilisateur

### 2. Tester la fonctionnalité
- [ ] Vérifier l'affichage des tâches
- [ ] Confirmer que le bouton supprimer n'apparaît que pour les propres tâches
- [ ] Tester les autres fonctionnalités (modifier, changer statut)

## 📝 Détails de l'implémentation

**Fichier à modifier :** `explication/frontend/src/components/TaskItem.jsx`

**Logique à implémenter :**
```javascript
const { user } = useAuth();
const isOwner = user && task.userId === user.userId; // à adapter selon la structure
```

**Bouton supprimer :**
- Visible seulement si `isOwner` est true
- Optionnel : afficher un message si la tâche ne peut pas être supprimée
