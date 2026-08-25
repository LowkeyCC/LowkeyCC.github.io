# ⚙️ Architecture

## Vue d'ensemble

Carnival of the Deads est un bot Discord écrit en **Node.js** avec **Discord.js**. Il utilise un moteur générique qui gère les phases, les actions et les résolutions, avec un thème spécifique pour la mise en scène.

## Structure du projet

```
bot-carnival/
├── data/
│   ├── carnival-pokemon.json      ← 28 masques (stats, capacités, talents)
│   └── carnival-characters.json   ← 12 identités (pools de masques)
├── src/
│   ├── index.js                   ← Point d'entrée, connexion Discord
│   ├── themes.js                  ← Thème Carnival (zones, camps, textes)
│   ├── engine/
│   │   ├── repo.js                ← Accès à la base SQLite
│   │   ├── effects.js             ← Application des effets (dégâts, soins, etc.)
│   │   ├── scripts.js             ← Scripts de capacités et talents
│   │   ├── abilities.js           ← Exécution des effets
│   │   ├── phases.js              ← Gestion des phases de jeu
│   │   ├── nightResolution.js     ← Résolution des actions de nuit
│   │   ├── duel.js                ← Résolution des duels
│   │   └── gameSetup.js           ← Setup de la partie
│   └── discord/
│       ├── commands.js            ← Slash commands
│       ├── panels.js              ← Panneaux joueur (MP)
│       ├── views.js               ← Vues (Grimoire, PV, etc.)
│       ├── interactions.js        ← Handlers d'interactions
│       ├── actionPrompts.js       ← Prompts d'actions (Jour/Nuit)
│       ├── gameSetup.js           ← Setup Discord (salons, rôles)
│       ├── duelViews.js           ← Vues des Duels
│       └── dashboard.js           ← Dashboard de l'Hôte
├── tests/                         ← Tests unitaires
├── schema.sql                     ← Schéma de la base SQLite
└── package.json
```

## Le moteur générique

Le moteur est conçu pour être **indépendant du thème**. Il gère :
- Les phases de jeu (Nuit → Résolution → Débats → Actions → Duels).
- Les actions des joueurs (soumission, résolution).
- Les effets (dégâts, soins, révélations, etc.).
- Les duels (défi, acceptance, résolution).

Le thème (Carnival) fournit :
- Les masques et leurs capacités.
- Les zones (salons vocaux).
- Les textes et l'ambiance.
- Les règles spécifiques (pas de statuts, camps aléatoires, etc.).

## Base de données

Le bot utilise **SQLite** via `better-sqlite3`. Le schéma est dans `schema.sql`.

### Tables principales
- `games` : les parties en cours.
- `players` : les joueurs et leur état.
- `day_actions` : les actions de jour soumises.
- `night_actions` : les actions de nuit soumises.
- `duels` : les duels en cours.
- `notes` : les notes MJ et les feedbacks.

## Flux d'une partie

```
1. Setup
   ├── Création de la partie
   ├── Ajout des joueurs
   ├── Distribution des identités
   └── Choix des masques

2. Boucle de jeu
   ├── Nuit
   │   ├── Envoi des prompts (MP)
   │   ├── Soumission des actions
   │   └── Résolution automatique
   ├── Débats (5 min)
   ├── Actions de Jour
   │   ├── Soumission des actions
   │   └── Résolution (immédiate ou différée)
   └── Duels
       ├── Défis
       ├── Acceptations
       └── Résolution automatique

3. Fin de partie
   ├── Détection de la victoire
   ├── Révélation de la composition
   └── Statistiques
```
