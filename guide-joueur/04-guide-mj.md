---
title: "🎪 Guide de l'Hôte du Carnaval"
---

# 🎪 Guide de l'Hôte du Carnaval

## Votre rôle

Vous êtes l'**Hôte du Carnaval** — le narrateur, l'arbitre, le pilote de la partie. Vous ne jouez pas, vous faites vivre le jeu.

## Setup de la partie

### 1. Créer la partie

Utilisez la commande :
```
/carnival-nouvelle-partie
```

Le bot crée :
- Un salon vocal pour chaque zone (La Grande Tente, La Foire aux Monstres, Le Cimetière des Caravanes).
- Un salon texte pour les débats.
- Un salon privé pour vous (l'Hôte).

### 2. Inviter les joueurs

Les joueurs rejoignent le salon vocal de leur choix. Le bot les détecte automatiquement.

### 3. Verrouiller la composition

Quand tous les joueurs sont présents :
```
/carnival-verrouiller-composition
```

Le bot :
- Tire aléatoirement les camps (~1/3 Revenants).
- Envoie à chaque joueur son camp et son pool de 3 masques en MP.
- Les joueurs choisissent leur masque.

### 4. Valider et lancer

Quand tous les joueurs ont choisi leur masque :
```
/carnival-lancer-partie
```

La partie commence par la **Nuit 1**.

## Pendant la partie

### Phases
Le bot gère automatiquement les phases :
1. 🌙 **Nuit** : les joueurs envoient leurs actions en MP.
2. 📢 **Résolution** : le bot affiche les résultats.
3. 💬 **Débats** : discussion libre (5 minutes).
4. ☀️ **Actions de Jour** : les joueurs utilisent leurs pouvoirs.
5. ⚔️ **Duels** : les joueurs se défient.

### Avancer les phases
Le bot avance automatiquement les phases. Vous n'avez rien à faire sauf si un joueur a un problème.

### Arbitrage
En tant qu'Hôte, vous arbitrez les situations ambiguës :
- Un joueur a un problème technique ? Aidez-le.
- Un joueur ne comprend pas une règle ? Expliquez-lui.
- Un joueur conteste un résultat ? Vérifiez les logs.

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `/carnival-nouvelle-partie` | Crée une nouvelle partie |
| `/carnival-verrouiller-composition` | Verrouille la composition et tire les camps |
| `/carnival-lancer-partie` | Lance la partie (Nuit 1) |
| `/carnival-annuler-partie` | Annule la partie en cours |
| `/carnival-voir-logs` | Affiche les logs de la partie |

## Conseils pour l'Hôte

### 1. Lisez les règles
Avant de lancer une partie, lisez toutes les règles. Vous devez tout comprendre.

### 2. Soyez neutre
Ne favorisez aucun camp. Ne révélez pas d'informations.

### 3. Gérez le temps
Les Débats durent 5 minutes. Ne les laissez pas trop longtemps.

### 4. Animez le jeu
Utilisez des descriptions narratives pour créer l'ambiance. Le Carnaval est un lieu sombre et fascinant.

### 5. Gérez les Duels
Les Duels sont automatiques, mais vous devez surveiller les problèmes :
- Un joueur quitte le salon vocal pendant un Duel ?
- Un joueur conteste le résultat ?
- Un bug technique ?

## En cas de problème

### Bug technique
Si le bot plante, redémarrez-le et utilisez `/carnival-voir-logs` pour comprendre le problème.

### Joueur absent
Si un joueur est absent pendant longtemps, vous pouvez l'éliminer (son masque est brisé, son identité est révélée).

### Contestations
Si un joueur conteste un résultat, vérifiez les logs et expliquez la règle. En cas de doute, votre décision est finale.
