---
title: "🎮 Commandes"
---

# 🎮 Commandes

## Slash Commands

### Gestion de la partie

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `/carnival-nouvelle-partie` | Crée une nouvelle partie | — |
| `/carnival-verrouiller-composition` | Verrouille la composition et tire les camps | — |
| `/carnival-lancer-partie` | Lance la partie (Nuit 1) | — |
| `/carnival-annuler-partie` | Annule la partie en cours | — |
| `/carnival-voir-logs` | Affiche les logs de la partie | — |

### Actions de joueur

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `/carnival-choisir-masque` | Choisir un masque dans votre pool | `masque` : le masque choisi |
| `/carnival-action-jour` | Utiliser votre capacité de jour | `cible` : le joueur ciblé |
| `/carmival-action-nuit` | Utiliser votre capacité de nuit | `cible` : le joueur ciblé |
| `/carnival-defier-duel` | Défier un joueur en Duel | `cible` : le joueur défiez |
| `/carnival-accepter-duel` | Accepter un Duel | — |
| `/carnival-refuser-duel` | Refuser un Duel | — |

### Information

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `/carnival-grimoire` | Affiche le Grimoire des Masques | — |
| `/carnival-pv` | Affiche vos PV actuels | — |
| `/carnival-identite` | Affiche votre identité secrète | — |
| `/carnival-rumeur` | Laisser une dernière rumeur (après K.O.) | `message` : votre rumeur (200 car. max) |

### Administration

| Commande | Description | Paramètres |
|----------|-------------|------------|
| `/carnival-note-mj` | Ajouter une note MJ privée | `note` : le contenu |
| `/carnival-note-joueur` | Ajouter une note joueur privée | `note` : le contenu |
| `/carnival-feedback` | Laisser un feedback sur la partie | `note` : de 1 à 5, `commentaire` : optionnel |

## Interactions Discord

### Panneau joueur (MP)

Le bot envoie à chaque joueur un panneau interactif en MP contenant :
- Son identité secrète.
- Son pool de masques (au début).
- Ses actions disponibles (Jour/Nuit).
- Ses PV actuels.
- Le Grimoire des Masques.

### Salons vocaux

Les joueurs se déplacent entre les 3 zones du bal :
- 🎪 La Grande Tente
- 🎠 La Foire aux Monstres
- ⚰️ Le Cimetière des Caravanes

### Salon de débats

Un salon texte dédié aux discussions pendant la phase de Débats.

### Salon MJ (privé)

Un salon privé pour l'Hôte du Carnaval, contenant :
- Les logs de la partie.
- Les notes MJ.
- Les actions des joueurs.
