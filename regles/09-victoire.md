---
title: "🏆 Victoire"
---

# 🏆 Victoire

## Conditions de victoire

La partie se termine dès que l'un des camps est **entièrement éliminé**.

### 🟦 Victoire des Vivants

**Condition** : tous les Revenants sont K.O. (masques brisés).

Quand le dernier Revenant tombe :
1. Le bot annonce la victoire dans le salon général.
2. La partie est terminée.
3. La composition complète est révélée.

### 🟥 Victoire des Revenants

**Condition** : tous les Vivants sont K.O. (masques brisés).

Quand le dernier Vivant tombe :
1. Le bot annonce la victoire dans le salon général.
2. La partie est terminée.
3. La composition complète est révélée.

## Révélation finale

Après la victoire, le bot révèle :
- Le **camp gagnant**.
- La **composition complète** de la partie :
  - Chaque joueur et son masque.
  - Chaque joueur et son camp (Vivant ou Revenant).
  - Le nombre de Revenants et de Vivants.

> **Important** : la composition réelle n'est révélée qu'à ce moment. Personne ne peut prouver qui était Revenant avant la fin.

## Fin anticipée

### Tous les joueurs K.O.
Si tous les joueurs sont K.O. (masques brisés), la partie se termine sans vainqueur. C'est un match nul.

### Abandon
Si un joueur quitte la partie avant la fin :
- Son masque est considéré comme **brisé** (son identité est révélée).
- Son camp reste secret.
- La partie continue.

### Annulation par l'Hôte
L'Hôte du Carnaval peut annuler la partie à tout moment via la commande `/carnival-annuler-partie`. La composition est révélée.

## Statistiques de fin

Après la victoire, le bot affiche :
- Le **nombre total de nuits**.
- Le **nombre de Duels**.
- Le **nombre de masques brisés**.
- Le **camp gagnant**.
- La **composition complète**.
