# Phases de jeu

## Le cycle complet

Une partie de Carnival of the Deads suit un cycle repete jusqu'a la victoire d'un camp :

> **Nuit** → **Resolution** → **Debats** → **Actions de Jour** → **Duels** → *(cycle suivant)*

Chaque phase se deroule dans l'ordre ci-dessus. Apres les Duels, un nouveau cycle recommence par la Nuit.

## Phase de Nuit

**Duree** : illimitee (les joueurs envoient leurs actions en MP au bot)

C'est la phase la plus secrete du jeu. Chaque joueur recoit en **message prive** les actions disponibles pour son masque :

- Les joueurs ayant une **capacite de Nuit** peuvent l'utiliser maintenant.
- Les joueurs sans capacite de Nuit observent simplement le deroulement.
- Les **deplacements sont verrouilles** : personne ne peut changer de salon vocal.
- Les joueurs sont **muets** dans les salons vocaux.

### Ordre de resolution

Les actions de Nuit sont resolutes dans un **ordre precis** :

| Ordre | Masque | Capacite | Effet |
|-------|--------|----------|-------|
| 1 | Sans-Visage | Metamorphose | Copie le masque de la cible |
| 1 | Messager | Passerelle | Envoie un message anonyme |
| 2 | Abysse | Regard Noir | Inflige Maudit |
| 3 | Rempart | Forteresse | Bouclier (reduit les degats) |
| 4 | Maestro | Crescendo | Degats croissants |
| 5 | Parasite | Infestation | Degats + soin continus |
| 6 | Vampirisme | Piqure | Degats + soin |
| 7 | Courroux | Fureur | Degats de vengeance |
| 8 | Eclat | Radiance | Degats si pas attaque |
| 9 | Sommeil | Berceuse | Inflige Endormi |
| 10 | Gaz | Vapeur Nocive | Degats |
| 11 | Foudre | Entraves | Degats |
| 12 | Vampire | Offrande Sanglante | Soin |
| 13 | Medium | Spiritisme | Decouvre le camp d'un joueur |
| 14 | Foyer | Instinct Maternel | Selectionne un Enfant |

> **Pourquoi cet ordre ?** Il permet des combos et des contres. La Metamorphose est resolue en premier pour que Sans-Visage puisse copier un masque avant que celui-ci ne soit revele par d'autres effets.

## Phase de Resolution

**Duree** : quelques secondes (automatique)

Le bot resout automatiquement toutes les actions de Nuit dans l'ordre :
- Les degats sont appliques.
- Les soins sont appliques.
- Les effets speciaux (Maudit, Metamorphose, etc.) sont declenches.
- Si un masque se brise, **l'identite du joueur est revelee** dans le salon general.
- Le joueur K.O. peut laisser une **derniere rumeur**.

> **Important** : la resolution est **publique**. Tout le monde voit les resultats des actions de Nuit (mais pas qui les a effectuees).

## Phase de Debats

**Duree** : 5 minutes (configurable)

C'est la phase de discussion libre. Les joueurs peuvent :
- **Parler** dans les salons vocaux.
- **Se deplacer** librement entre les 3 zones du bal.
- **Accuser**, **defendre**, **bluffer**, **reseauter**.
- Consulter le **Grimoire des Masques** et leur panneau joueur.

Aucune action de pouvoir ne peut etre utilisee pendant les Debats. C'est le moment du pur social.

## Phase d'Actions de Jour

**Duree** : jusqu'a ce que tous les joueurs aient utilise leur capacite de Jour (ou renonce)

Les joueurs ayant une **capacite de Jour** peuvent l'utiliser maintenant :
- Les actions sont soumises en MP au bot.
- Certains masques ont des actions **immediates** (appliquees tout de suite).
- D'autres ont des actions **differees** (appliquees a la fin de la journee).

> **Astuce** : si vous n'avez pas de capacite de Jour, vous pouvez simplement attendre que la phase se termine.

## Phase de Duels

**Duree** : illimitee (les joueurs declenchent des duels pendant cette phase)

C'est la phase d'affrontement direct. Un joueur peut **defier** un autre joueur en Duel :
- Les deux joueurs doivent etre dans le **meme salon vocal**.
- Le defi est envoye au joueur cible (acceptation ou refus).
- Si refuse, le defi est annule (pas de consequence).
- Si accepte, le Duel est resolu **automatiquement a la fin de la phase**.

### Resolution des Duels

Quand la phase de Duels se termine, tous les Duels acceptes sont resolus **simultanement** :
1. Chaque duo de duellistes s'attaque mutuellement avec son **Attaque de Combat**.
2. Les degats sont appliques **en meme temps** (meme si l'un des deux tombe K.O.).
3. Si un masque se brise, l'identite est revelee.

### Duels simultanes

Il est possible de participer a **plusieurs Duels** lors de la meme phase. Le bot gere automatiquement les Duels multiples.

### Degats de combat

Les degats de combat sont **fixes** et definis par le masque. Ils ne sont pas modifiables par les statuts.

## Cycle suivant

Apres les Duels, un nouveau cycle commence par la Nuit. Le numero de nuit s'incremente automatiquement.

## Fin de partie

La partie se termine quand **l'un des camps est entierement elimine** :
- Tous les Revenants K.O. → **Victoire des Vivants**
- Tous les Vivants K.O. → **Victoire des Revenants**

Apres la victoire, le bot revele la composition complete de la partie (identites et camps de tous les joueurs).
