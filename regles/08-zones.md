---
title: "Zones"
---

# Zones

## Les trois zones du bal

Le Carnaval est composé de **3 zones** (salons vocaux). Les joueurs se déplacent librement entre eux pendant la phase de Débats.

| Salon | Nom | Ambiance |
|-------|-----|----------|
| La Grande Tente | Le cœur du bal. Lumineux, bruyant, central. |
| La Foire aux Monstres | Les attractions sombres. Loin des regards. |
| Le Cimetière des Caravanes | Les tombes des anciens carnavals. Glacial, isolé. |

## Déplacement

### Quand se déplacer ?

- **Pendant les Débats** : les joueurs se déplacent **librement** entre les 3 zones.
- **Pendant la Nuit** : les déplacements sont **verrouillés**. Chaque joueur reste dans le salon où il se trouve.
- **Pendant les Duels** : les déplacements sont **verrouillés**.
- **Pendant les Actions de Jour** : les déplacements sont **libres** (mais les conditions vocales sont vérifiées à la soumission).

### Comment se déplacer ?

Via le bot Discord, le joueur sélectionne le salon vocal dans lequel il souhaite se rendre. Le bot le déplace automatiquement.

## Importance des zones

Les zones ne sont pas juste cosmétiques — elles ont un **impact mécanique** :

### Capacités vérifiant la position

| Masque | Capacité | Condition |
|--------|----------|-----------|
| Poursuite | Traque | La cible doit être dans un salon **différent** du vôtre |
| Sacrifice | Percée | La cible doit être dans le **même** salon que vous |

### Stratégie de déplacement

- **Pour le Poursuite** : traquez les joueurs isolés dans d'autres zones.
- **Pour le Sacrifice** : restez dans la même zone que votre cible.
- **Pour les autres** : déplacez-vous pour fuir les menaces ou pour vous rapprocher d'alliés.

### Position et information

La position des joueurs est **visible par tous** (qui est dans quel salon). C'est une information publique qui peut être exploitée.

- "Pourquoi X est-il toujours dans le Cimetière ?"
- "Y et Z sont dans la même zone — sont-ils alliés ?"
- "Le joueur isolé dans la Foire aux Monstres est une cible facile pour le Poursuite."

## Verrouillage vocal

### Quand les salons sont verrouillés ?

Les salons vocaux sont verrouillés par le bot pendant :
- La **Nuit** (actions secrètes)
- Les **Duels** (affrontements)
- La **Résolution** (résolution des actions de Nuit)

### Comment ?

Le bot modifie les permissions des salons vocaux pour empêcher les déplacements et les messages.

### Déverrouillage

Les salons sont déverrouillés automatiquement quand la phase suivante commence (Débats ou Actions de Jour).
