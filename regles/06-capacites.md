# Capacités & Passifs

## Trois types de pouvoirs

Chaque masque possède jusqu'à trois types de pouvoirs :

| Type | Moment d'utilisation | Nombre par partie | Exemples |
|------|---------------------|-------------------|----------|
| **Attaque de Combat** | En Duel (automatique) | Illimité | Aiguillon, Décharge |
| **Capacité de Jour** | Phase d'Actions de Jour | 1 fois (sauf indication) | Traque, Percée |
| **Capacité de Nuit** | Phase de Nuit (en MP) | 1 fois (sauf indication) | Regard Noir, Métamorphose |
| **Passif** | Déclenché automatiquement | Constant ou une fois | Ronces, Brasier |

## Capacités de Jour

Les capacités de Jour sont utilisées pendant la phase d'Actions de Jour. Elles sont de deux types :

### Actions immédiates
Appliquées dès la soumission. Exemple :
- **Empathique — Baume au coeur** : soigne 3 PV au masque du joueur choisi (immédiat).
- **Rage — Rancune** : inflige des dégâts au masque d'un joueur qui vous a défié (immédiat).

### Actions différées (fin de journée)
Appliquées à la fin de la journée. Exemple :
- **Poursuite — Traque** : inflige des dégâts au masque d'un joueur qui n'est pas dans votre salon vocal à la fin de la journée.
- **Sacrifice — Percée** : inflige des dégâts escalonnés au masque d'un joueur dans votre salon vocal à la fin de la journée.
- **Souvenir — Echo** : inflige 2 dégâts fixes au masque d'un joueur défiez en Duel.

### Conditions vocales
Certains masques vérifient la **position vocale** du joueur au moment de la soumission :
- **Poursuite** : la cible doit être dans un salon vocal **différent** du vôtre.
- **Sacrifice** : la cible doit être dans le **même** salon vocal que vous.

> **Important** : la vérification vocale est faite au moment de la **soumission**, pas à la résolution. Vous pouvez vous déplacer après avoir soumis l'action.

## Capacités de Nuit

Les capacités de Nuit sont utilisées pendant la phase de Nuit. Elles sont envoyées en **MP au bot**.

### Ordre de résolution
Les actions de Nuit sont résolues dans un ordre précis (défini par le champ `order`) :

| Ordre | Masque | Capacité | Effet |
|-------|--------|----------|-------|
| 1 | Sans-Visage | Métamorphose | Copie le masque de la cible |
| 1 | Messager | Passerelle | Envoie un message anonyme |
| 2 | Abysse | Regard Noir | Inflige Maudit |
| 3 | Rempart | Forteresse | Bouclier (réduit les dégâts) |
| 4 | Maestro | Crescendo | Dégâts croissants sur la même cible |
| 5 | Parasite | Infestation | Dégâts + soin continus |
| 6 | Vampirisme | Piqûre | Dégâts + soin |
| 7 | Courroux | Fureur | Dégâts de vengeance |
| 8 | Éclat | Radiance | Dégâts si pas attaqué |
| 9 | Sommeil | Berceuse | Inflige Endormi |
| 10 | A-Gaz | Vapeur Nocive | Dégâts |
| 11 | Foudre | Entraves | Dégâts |
| 12 | Vampire | Offrande Sanglante | Soin |
| 13 | Medium | Spiritisme | Découvre le camp d'un joueur |
| 14 | Foyer | Instinct Maternel | Sélectionne un Enfant |

### Utilisation limitée
Certaines capacités de Nuit ne peuvent être utilisées **qu'une fois par partie** (indiqué par `oncePerGame` dans les données). Exemple : Regard Noir de l'Abysse.

### Utilisation à uses limités
D'autres ont un nombre d'utilisations limité (indiqué par `limitedUses`). Exemple : Forteresse du Rempart.

## Passifs

Les passifs sont des effets **automatiques** déclenchés quand une condition est remplie. Ils ne nécessitent aucune action du joueur.

### Types de déclenchement

| Hook | Moment | Exemples |
|------|--------|----------|
| `on_damage_taken` | Quand le masque subit des dégâts | Ronces (Épine) |
| `on_damage_dealt` | Quand le masque inflige des dégâts | Attirance (Foudre), Identification (Sans-Visage) |
| `on_heal_dealt` | Quand le masque soigne | Empathie (Empathique) |
| `on_duel_start` | Quand un Duel commence | Terreur (Effroi), Fournaise (Incendie), Clairvoyance (Oracle) |
| `on_combat_damage_resolve` | Après résolution des dégâts de combat | Lien Familial (Foyer) |
| `on_hp_changed` | Quand les PV changent | Brasier (Incendie) |
| `on_damage_incoming` | Avant application des dégâts | Volonté de pierre (Rocher), L'Indestructible (Inflexible) |
| `on_status_incoming` | Quand un statut est appliqué | Immunité (Chirurgical) |

### Passifs à activation unique
Certains passifs ne se déclenchent qu'**une seule fois** :
- **Fournaise (Incendie)** : +1 dégât permanent à toutes les attaques de combat, une seule fois.
- **Brasier (Incendie)** : +2 dégâts permanents quand les PV tombent sous 6.
- **Identification (Sans-Visage)** : révèle le masque de la cible la première fois que vous infligez des dégâts.

### Passifs constants
D'autres passifs sont **toujours actifs** :
- **Ronces (Épine)** : renvoie des dégâts à l'attaquant.
- **Volonté de pierre (Rocher)** : -50% des dégâts de combat subis.
- **L'Indestructible (Inflexible)** : -50% de tous les dégâts subis.
- **Empathie (Empathique)** : soigne autant que la cible quand vous soignez.
