import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MASQUES_DIR = join(ROOT, 'masques')
const OUT = join(ROOT, 'data', 'masques.json')

function parseMd(file) {
  const raw = readFileSync(file, 'utf8').replace(/\uFEFF/g, '').replace(/\r\n/g, '\n')
  const id = file.replace(/\\/g, '/').split('/').pop().replace(/\.md$/, '')

  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  let fmTitle = null
  if (fm) {
    const t = fm[1].match(/title:\s*(.*)/)
    if (t) fmTitle = t[1].trim().replace(/^["']|["']$/g, '')
  }
  const head = raw.match(/^#\s+(.+)$/m)
  const headName = head ? head[1].trim() : null
  const name = fmTitle && fmTitle !== id ? fmTitle : headName || fmTitle || id

  const lines = raw.split('\n')
  const pvLine = lines.find((l) => /\*\*[0-9]+\s*PV\*\*/.test(l)) || ''
  const pvMatch = pvLine.match(/\*\*([0-9]+)\s*PV\*\*/)
  const pv = pvMatch ? parseInt(pvMatch[1], 10) : null

  const loreLines = lines
    .filter((l) => l.trim().startsWith('>'))
    .map((l) => l.replace(/^>\s?/, '').trim())
  const lore = loreLines.join(' ').trim()

  return { id, name, lore, pv }
}

const files = readdirSync(MASQUES_DIR)
  .filter((f) => f.endsWith('.md') && f !== 'index.md')
  .sort()

const masques = files.map((f) => parseMd(join(MASQUES_DIR, f)))
writeFileSync(OUT, JSON.stringify(masques, null, 2) + '\n', 'utf8')
console.log(`generated ${masques.length} masks -> data/masques.json`)
