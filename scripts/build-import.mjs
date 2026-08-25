import fs from 'node:fs'
import path from 'node:path'

const PAGES_DIR = path.resolve('miraheze/wikidot/pages')
const OUT = path.resolve('miraheze/wikidot/import.txt')

function titleFor(file) {
  const c = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8')
  const h1 = c.match(/^\+\s+(.+)$/m)
  return (h1 ? h1[1] : file.replace(/\.txt$/, '')).trim()
}

const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.txt')).sort()
const blocks = []
for (const file of files) {
  const title = titleFor(file)
  const content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8').replace(/\s+$/, '')
  blocks.push(`%%page\ntitle: ${title}\n%%content\n${content}\n%%`)
}
fs.writeFileSync(OUT, blocks.join('\n\n') + '\n')
console.error(`[ok] ${blocks.length} pages -> ${OUT}`)
