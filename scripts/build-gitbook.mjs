import fs from 'node:fs'
import path from 'node:path'

const SRC = path.resolve('.')
const OUT = path.resolve('gitbook')
const SKIP = new Set(['node_modules', '.git', 'gitbook', 'miraheze', 'scripts', 'src', 'public', '.vitepress', 'api', 'data'])

function walk(dir, rel = '') {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue
    const full = path.join(dir, e.name)
    const r = path.join(rel, e.name)
    if (e.isDirectory()) out.push(...walk(full, r))
    else if (e.name.endsWith('.md')) out.push(r)
  }
  return out
}

function h1Of(file) {
  const c = fs.readFileSync(file, 'utf8')
  const m = c.match(/^\s*#\s+(.+)$/m)
  return m ? m[1].trim() : path.basename(file).replace(/\.md$/, '')
}

function copyTree() {
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })
  const files = walk(SRC).filter((f) => path.basename(f) !== 'index.md' || path.dirname(f) !== '.')
  for (const f of files) {
    const dest = path.join(OUT, f)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(path.join(SRC, f), dest)
  }
}

function group() {
  const files = walk(SRC).filter((f) => path.basename(f) !== 'index.md' || path.dirname(f) !== '.')
  const cats = {}
  for (const f of files) {
    const top = f.split(path.sep)[0]
    ;(cats[top] ||= []).push(f)
  }
  return cats
}

function buildSummary() {
  const cats = group()
  const lines = ['# Summary', '', '* [Accueil](README.md)', '']
  const order = ['regles', 'masques', 'guide-joueur', 'bal', 'technique']
  const titles = {
    regles: 'Règles', masques: 'Masques', 'guide-joueur': 'Guide du joueur',
    bal: 'Le Bal', technique: 'Technique'
  }
  for (const cat of order) {
    if (!cats[cat]) continue
    const pages = cats[cat].slice().sort()
    const first = pages[0]
    lines.push(`* [${titles[cat]}](${first.replace(/\\/g, '/')})`)
    for (const p of pages) {
      const label = h1Of(path.join(SRC, p))
      lines.push(`  * [${label}](${p.replace(/\\/g, '/')})`)
    }
    lines.push('')
  }
  return lines.join('\n') + '\n'
}

function buildReadme() {
  return `# Carnival of the Deads

Bienvenue sur le wiki du **Carnival of the Deads**, un bal masqué maudit où chaque invité cache bien plus que son visage.

Le jeu se joue sur **Discord** via un bot qui gère les phases, les actions et les résolutions. Un joueur — l'**Hôte du Carnaval** — pilote la partie.

## Sommaire

- **Règles** : Concept, camps, phases, combat, capacités, effets spéciaux, zones et victoire.
- **Masques** : Chaque masque confère des pouvoirs uniques (Jour / Nuit) et un passif.
- **Guide du joueur** : Premiers pas, conseils pour les Vivants et les Revenants, guide du MJ.
- **Le Bal** : Organisation et ambiance de la partie.
- **Technique** : Architecture, données et commandes du bot.

> Explorez les sections dans la barre latérale.
`
}

copyTree()
fs.writeFileSync(path.join(OUT, 'README.md'), buildReadme())
fs.writeFileSync(path.join(OUT, 'SUMMARY.md'), buildSummary())
console.error('[ok] dossier gitbook/ pret :')
for (const f of walk(OUT).concat(['README.md', 'SUMMARY.md'])) {
  console.error('   ', f)
}
