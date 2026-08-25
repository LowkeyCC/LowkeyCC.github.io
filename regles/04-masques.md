# Les Masques

## Concept

Chaque joueur porte un **Masque** unique qui détermine :
- Ses **PV maximums** (points de vie).
- Son **Attaque de Combat** (dégâts fixes en Duel).
- Sa **capacité de Jour** (pouvoir utilisé pendant la phase de Jour).
- Sa **capacité de Nuit** (pouvoir utilisé pendant la phase de Nuit).
- Son **passif** (effet déclenché automatiquement).

Le masque est la seule chose que les autres joueurs voient. Votre identité réelle (votre nom de joueur) et votre camp restent secrets.

## Les PV secrets

### Principe
- Chaque masque a un nombre de **PV maximums** (fixe, défini par le masque).
- Les **PV actuels restent secrets** : seul le total de dégâts reçus est public.
- Les joueurs ne connaissent que leurs propres PV.
- Quand un masque se brise (PV ≤ 0), le joueur est K.O.

### Pourquoi des PV secrets ?
C'est le cœur de la stratégie : vous ne savez pas si un masque est à bout ou sain. Accuser un joueur à 1 PV est risqué — il peut être à bout ou à pleine vie. Défier un joueur en Duel est un pari.

### Le Grimoire des Masques
Le **Grimoire** est un document consultable par tous les joueurs (via leur panneau joueur en MP). Il contient :
- La liste de tous les masques du jeu.
- Les PV maximums de chaque masque.
- Les descriptions des capacités et passifs.

> **Astuce** : mémoriser les PV max des masques est essentiel pour évaluer les menaces.

## Le bris de masque

### Quand un masque se brise ?
Un masque se brise quand ses PV tombent à **0 ou moins**.

### Que se passe-t-il ?
1. L'**identité du joueur est révélée** dans le salon général (son nom de masque).
2. Le **camp n'est PAS révélé**.
3. Le joueur peut laisser une **dernière rumeur** (message public de max 200 caractères).
4. Le joueur quitte la partie (il ne peut plus agir).

### Exception : Métamorphose (Sans-Visage)
Si un joueur portant le masque du Sans-Visage est métamorphosé et que son masque se brise, c'est le **masque copié** qui est révélé à la place de son identité réelle.

## Choix du masque

### Pool de choix
Au début de la partie, chaque joueur reçoit un **pool de masques** parmi lesquels il doit en choisir un. Le pool est déterminé par l'identité (rôle) du joueur.

### Processus
1. Le bot envoie à chaque joueur (en MP) son pool de masques.
2. Le joueur choisit un masque dans son pool.
3. Le masque choisi est **secret** — les autres joueurs ne voient pas votre choix.

### Stratégie du choix
Choisir un masque, c'est choisir :
- **Sa durabilité** : un masque avec beaucoup de PV survit plus longtemps.
- **Sa capacité de Jour** : certains masques ont des pouvoirs offensifs, d'autres informationnels.
- **Sa capacité de Nuit** : les actions de Nuit sont plus puissantes mais plus risquées.
- **Son passif** : certains passifs sont dévastateurs, d'autres sont subtils.

## Styles de masques

| Style | Description | Exemples |
|-------|-------------|----------|
| **Tank** | PV élevés, dégâts réduits, résistant | Inflexible, Rocher, Épine |
| **Offensif** | Dégâts élevés, PV moyens, agressif | Rage, Incendie, Sacrifice |
| **Assassin** | Dégâts ciblés, PV faibles, élimination | Poursuite, Souffrance, Maestro |
| **Information** | Capacités de révélation, utility | Chirurgical, Medium, Sans-Visage |
| **Support** | Soin, protection, buff d'alliés | Vampire, Empathique |

> **Note** : le style est une indication, pas une restriction. Un masque "Tank" peut jouer agressivement, et vice versa.
