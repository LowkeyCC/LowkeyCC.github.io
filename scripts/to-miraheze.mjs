import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'fs'
import { join, relative } from 'path'

const ROOT = process.cwd()
const OUT = join(ROOT, 'miraheze')

const FOLDER_LABEL = {
  'regles': 'Règles',
  'masques': 'Masques',
  'guide-joueur': 'Guide du joueur',
  'bal': 'Bal',
  'technique': 'Technique',
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const prettyFile = (n) => cap(n.replace(/[-_]/g, ' '))
const firstH1 = (md) => { const m = md.match(/^#\s+(.+)$/m); return m ? m[1].trim() : null }

function pageTitle(rel, content) {
  let p = rel.replace(/\.md$/, '')
  if (p === 'index') return 'Accueil'
  const parts = p.split('/')
  if (parts[parts.length - 1] === 'index') { parts.pop(); return parts.map(s => FOLDER_LABEL[s] || cap(s)).join('/') }
  const fileName = parts.pop()
  const name = firstH1(content) || prettyFile(fileName)
  return name
}
function categoryFor(rel) {
  const top = rel.split('/')[0]
  if (top === 'index') return null
  return FOLDER_LABEL[top] || cap(top)
}

// ---- collect md files ----
const files = []
function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (['node_modules', '.git', '.vitepress', 'miraheze', 'scripts'].includes(e)) continue
    const fp = join(dir, e)
    if (statSync(fp).isDirectory()) walk(fp)
    else if (e.endsWith('.md')) files.push(fp)
  }
}
walk(ROOT)

// ---- build path -> title map (for link rewriting) ----
const map = { '': 'Accueil', 'index': 'Accueil', '/': 'Accueil', '/index': 'Accueil' }
for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, '/')
  const key = rel.replace(/\.md$/, '')
  const title = pageTitle(rel, readFileSync(f, 'utf8'))
  map[key] = title
  map['/' + key] = title
  const segs = key.split('/')
  if (segs[segs.length - 1] === 'index') {
    const folder = segs.slice(0, -1).join('/')
    map[folder] = title
    map['/' + folder] = title
  }
}

function fixLinks(text) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    url = url.trim()
    if (/^https?:\/\//.test(url)) return `[[${url}|${label}]]`
    let u = url.replace(/^\//, '').replace(/\.html$/, '').replace(/\.md$/, '').replace(/\/$/, '')
    if (u === '' || u === 'index') u = 'index'
    const t = map[u] || map['/' + u] || (u.split('/').pop() ? prettyFile(u.split('/').pop()) : 'Accueil')
    return `[[[${t}|${label}]]]`
  })
}
function inline(s) {
  s = fixLinks(s)
  s = s.replace(/`([^`]+)`/g, '//<code>$1</code>//')
  s = s.replace(/\*\*([^*]+)\*\*/g, '**$1**')
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, (m, p1, p2) => p1 + '//' + p2 + '//')
  return s
}
function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(s => s.trim())
}
function renderList(list) {
  return list.map(it => '  '.repeat(it.indent) + it.bullet + ' ' + inline(it.text))
}

function mdToWiki(md) {
  const lines = md.replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n?/, '').split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) { const l = Math.min(h[1].length, 6); out.push('+'.repeat(l) + ' ' + h[2].trim()); i++; continue }
    if (/^---+$/.test(line)) { out.push('----'); i++; continue }
    if (/^```/.test(line)) {
      const code = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++ }
      i++
      out.push('[[code]]\n' + code.join('\n') + '\n[[/code]]')
      continue
    }
    if (/^>\s?/.test(line)) {
      const q = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++ }
      out.push(q.map(x => '> ' + x).join('\n'))
      continue
    }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|?$/.test(lines[i + 1])) {
      const head = splitRow(line); i += 2
      const rows = []
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(splitRow(lines[i])); i++ }
      let t = '^ ' + head.join(' ^ ') + ' ^\n'
      for (const r of rows) t += '|| ' + r.join(' || ') + ' ||\n'
      out.push(t.trim())
      continue
    }
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const list = []
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/)
        const indent = Math.floor(m[1].length / 2)
        const bullet = (m[2] === '*' || m[2] === '-' || m[2] === '+') ? '*' : '#'
        list.push({ indent, bullet, text: m[3] })
        i++
      }
      out.push(...renderList(list))
      continue
    }
    if (line.trim() === '') { i++; continue }
    const para = []
    while (i < lines.length && lines[i].trim() !== '' &&
      !/^(#{1,6})\s|^>\s?|^\||^```|^\s*([-*+]|\d+\.)\s/.test(lines[i])) {
      para.push(lines[i]); i++
    }
    const ptext = para.join(' ').trim()
    if (ptext) out.push(inline(ptext))
  }
  return out.join('\n')
}

// ---- Accueil (special landing page, built as markdown then converted) ----
function buildAccueilMd() {
  const byCat = {}
  for (const f of files) {
    const rel = relative(ROOT, f).replace(/\\/g, '/')
    if (rel === 'index.md') continue
    const cat = categoryFor(rel)
    if (!cat) continue
    const title = pageTitle(rel, readFileSync(f, 'utf8'))
    ;(byCat[cat] ||= []).push(title)
  }
  let s = `# Carnival of the Deads\nBienvenue sur le wiki du **Carnival of the Deads**, un bal masqué où chacun cache bien plus que son visage.\n`
  for (const cat of ['Règles', 'Masques', 'Guide du joueur', 'Bal', 'Technique']) {
    if (!byCat[cat]) continue
    s += `\n## ${cat}\n`
    for (const t of byCat[cat].sort()) s += `* [${t}](/${t.replace(/\//g, '/')})\n`
  }
  return s
}

// ---- generate pages ----
const pages = []
for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, '/')
  let title, wiki
  if (rel === 'index.md') { title = 'Accueil'; wiki = mdToWiki(buildAccueilMd()) }
  else {
    const md = readFileSync(f, 'utf8')
    title = pageTitle(rel, md)
    wiki = mdToWiki(md)
    const cat = categoryFor(rel)
    if (cat) wiki += `\n\n[[category ${cat}]]`
  }
  pages.push({ title, wiki })
}

// ---- emit one .txt file per page (Wikidot drop-in) ----
mkdirSync(join(OUT, 'wikidot', 'pages'), { recursive: true })
for (const p of pages) {
  const rel = p.title.replace(/ /g, '_')
  const fp = join(OUT, 'wikidot', 'pages', rel + '.txt')
  mkdirSync(join(fp, '..'), { recursive: true })
  writeFileSync(fp, p.wiki)
}
console.log(`Généré ${pages.length} pages -> miraheze/wikidot/pages/`)
