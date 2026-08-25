# Les Camps

## Vue d'ensemble

La partie oppose deux camps. Le camp de chaque joueur est tiré au sort au début de la partie et reste secret jusqu'à la fin.

| Camp | Objectif | Connaissance |
|------|----------|-------------|
| **Vivant** | Éliminer tous les Revenants | Connaît son propre camp uniquement |
| **Revenant** (le Cercle) | Éliminer tous les Vivants | Connaît tous les autres Revenants |

## Les Vivants

Les Vivants sont les Invités ordinaires du bal. Ils ne savent pas qui sont les Revenants. Leur seule certitude : ils ne sont pas seuls.

### Ce que les Vivants savent
- Ils sont Vivants (leur camp).
- Le **nombre total de Revenants** (affiché au début de la partie).
- Ce qu'ils observent : les masques qui se brisent, les accusations, les alliances.

### Ce que les Vivants ne savent pas
- Qui sont les Revenants.
- Les PV des autres joueurs.
- Les camps des autres joueurs (sauf par déduction ou par le pouvoir de certains masques).

### Stratégie des Vivants
- Réseauter, accuser sans preuve, défendre les alliés.
- Utiliser les masques à capacités d'information (Medium, Oracle, Sans-Visage).
- Protéger les joueurs utiles.
- Éliminer les suspects par les Duels.

## Les Revenants (le Cercle)

Les Revenants sont les Invités possédés par l'esprit du bal. Ils forment un groupe secret qui tire profit de la nuit.

### Ce que les Revenants savent
- Ils sont Revenants (leur camp).
- **Qui sont tous les autres Revenants** (ils se reconnaissent entre eux).
- Le nombre total de Vivants.

### Ce que les Revenants ne savent pas
- Les PV des Vivants.
- Les identités exactes des Vivants (sauf par déduction).
- Qui parmi les Vivants est le plus dangereux.

### Stratégie des Revenants
- Se fondre dans la masse : ne pas se faire remarquer.
- Éliminer les Vivants en douce pendant la Nuit.
- Protéger les alliés Revenants (en les défendant lors des Duels).
- Créer la confusion : accuser des Vivants entre eux.
- Éviter les Duels risqués.

## Distribution des camps

### Nombre de Revenants

Le nombre de Revenants est calculé automatiquement :
```
Revenants = max(1, round(N joueurs / 3))
```

| Joueurs | Revenants |
|---------|-----------|
| 6 | 2 |
| 7 | 2 |
| 8 | 3 |
| 9 | 3 |
| 10 | 3-4 |
| 11 | 4 |
| 12 | 4 |

### Processus de distribution

1. Le bot tire aléatoirement les camps.
2. Chaque joueur reçoit secrètement son camp (en MP).
3. Les Revenants voient la liste des autres Revenants.
4. L'Hôte du Carnaval valide la composition.
5. Une fois validée, la composition est **verrouillée** et ne peut plus être modifiée.

### Validation

L'Hôte du Carnaval peut :
- **Valider** la composition telle quelle.
- **Relancer** le tirage si la composition semble déséquilibrée (optionnel).

> **Important** : la composition réelle n'est révélée qu'à la fin de la partie. Personne ne peut prouver qui est Revenant sauf par déduction.

## Révélation

### Au bris de masque
Quand un masque se brise, **seule l'identité du joueur est révélée** (son nom de masque). Son **camp reste secret**.

> *Exemple : si "Marie" porte le masque de l'Épine et que son masque se brise, le bot annonce : "Masque brisé — Marie est K.O. Son identité était Masque de l'Épine." Le camp de Marie n'est pas révélé.*

### À la fin de la partie
Quand un camp gagne, le bot révèle **toute la composition** :
- Chaque joueur et son masque.
- Chaque joueur et son camp.
- Le nombre de Revenants et de Vivants.
