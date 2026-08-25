# 📦 Données

## Format des masques

Les masques sont stockés dans `data/carnival-pokemon.json`. Chaque masque a la structure suivante :

```json
{
  "id": "epine",
  "name": "Masque de l'Épine",
  "pv": 17,
  "combat": {
    "name": "Frappe Acérée",
    "description": "Inflige 3 dégâts.",
    "effects": [{ "type": "damage", "target": "opponent", "amount": 3 }]
  },
  "day": null,
  "night": null,
  "talent": {
    "name": "Contrecoup",
    "description": "Lorsqu'on vous inflige des dégâts, infligez 2 dégâts à l'attaquant.",
    "hook": "on_damage_taken",
    "script": "reflect_damage",
    "params": { "amount": 2 }
  }
}
```

### Champs obligatoires

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique du masque |
| `name` | string | Nom du masque |
| `pv` | number | Points de vie maximums |
| `combat` | object | Attaque de combat (obligatoire) |

### Champs optionnels

| Champ | Type | Description |
|-------|------|-------------|
| `style` | string | Style du masque (Tank, Offensif, Assassin, Information, Support) |
| `day` | object | Capacité de jour (null si aucune) |
| `night` | object | Capacité de nuit (null si aucune) |
| `talent` | object | Talent passif (null si aucun) |

## Format des capacités

### Capacité de combat

```json
{
  "name": "Frappe Acérée",
  "description": "Inflige 3 dégâts.",
  "effects": [
    { "type": "damage", "target": "opponent", "amount": 3 }
  ]
}
```

### Capacité de jour

```json
{
  "name": "Traque",
  "description": "Choisissez un joueur qui n'est pas dans votre salon vocal...",
  "targeting": "single_choice",
  "timing": "end_of_day",
  "requiresMjCheck": "not_in_voice_channel",
  "effects": [
    { "type": "damage", "target": "chosen", "amount": 3 }
  ]
}
```

### Capacité de nuit

```json
{
  "name": "Œil Noir",
  "order": 2,
  "description": "Une fois par partie, choisissez un joueur...",
  "targeting": "single_choice",
  "oncePerGame": true,
  "effects": [
    { "type": "curse", "target": "chosen" }
  ]
}
```

## Types d'effets

| Type | Description | Paramètres |
|------|-------------|------------|
| `damage` | Inflige des dégâts | `target`, `amount`, `fixed` (optionnel) |
| `heal` | Soigne des PV | `target`, `amount` |
| `curse` | Applique la Malédiction | `target` |
| `metamorphose` | Copie le masque de la cible | `target` |
| `mark_child` | Désigne l'Enfant du Foyer | `target` |
| `reveal_camp` | Révèle le camp de la cible | `target` |
| `mj_relay_message` | Envoie un message anonyme | `target`, `maxWords` |
| `shield` | Bouclier (Rempart) | `target`, `amount`, `duration`, `preventAttack` |
| `damage_modifier` | Modifie les dégâts subis | `target`, `delta`, `duration` |

## Cibles

| Cible | Description |
|-------|-------------|
| `self` | Le joueur lui-même |
| `chosen` | Le joueur choisi par l'utilisateur |
| `opponent` | L'adversaire en Duel |

## Ajouter un masque

### Étapes

1. **Créer le masque** dans `data/carnival-pokemon.json`.
2. **Définir les effets** (voir la section Types d'effets).
3. **Ajouter un talent** (optionnel, voir les hooks dans `scripts.js`).
4. **Ajouter au pool** d'une ou plusieurs identités dans `data/carnival-characters.json`.
5. **Tester** avec `npm test`.

### Exemple

```json
{
  "id": "nouveau-masque",
  "name": "Masque du Nouveau",
  "pv": 15,
  "style": "Offensif",
  "combat": {
    "name": "Attaque",
    "description": "Inflige 3 dégâts.",
    "effects": [{ "type": "damage", "target": "opponent", "amount": 3 }]
  },
  "day": {
    "name": "Capacité de Jour",
    "description": "Inflige 2 dégâts au joueur de votre choix.",
    "targeting": "single_choice",
    "effects": [{ "type": "damage", "target": "chosen", "amount": 2 }]
  },
  "night": null,
  "talent": null
}
```

## Hooks de talents

| Hook | Moment | Scripts disponibles |
|------|--------|---------------------|
| `on_damage_taken` | Quand le masque subit des dégâts | `reflect_damage` |
| `on_damage_dealt` | Quand le masque inflige des dégâts | `reveal_pokemon_to_self`, `bonus_damage_vs_night_damaged` |
| `on_heal_dealt` | Quand le masque soigne | `mirror_heal_self` |
| `on_duel_start` | Quand un Duel commence | `duel_damage_modifier_opponent`, `permanent_combat_buff_once`, `reveal_camp_on_duel_start` |
| `on_combat_damage_resolve` | Après résolution des dégâts de combat | `double_combat_damage_while_child_alive` |
| `on_hp_changed` | Quand les PV changent | `threshold_permanent_combat_buff` |
| `on_damage_incoming` | Avant application des dégâts | `damage_reduction_percent` |
| `on_status_incoming` | Quand un statut est appliqué | `status_immunity` |
