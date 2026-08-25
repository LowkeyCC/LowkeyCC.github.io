import fs from 'node:fs'
import path from 'node:path'

const PAGES_DIR = path.resolve('miraheze/wikidot/pages')
const API_URL = 'https://www.wikidot.com/xml-rpc-api.php'

const USER = process.env.WIKIDOT_USER
const API_KEY = process.env.WIKIDOT_API_KEY
const SITE = process.env.WIKIDOT_SITE || 'carnivalofthedeads'
const AUTH_USER = process.env.WIKIDOT_AUTH_USER || 'carnival-migrator'

if (!USER || !API_KEY) {
  console.error('WIKIDOT_USER et WIKIDOT_API_KEY requis.')
  process.exit(1)
}

const auth = 'Basic ' + Buffer.from(AUTH_USER + ':' + API_KEY).toString('base64')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function buildXmlRpc(method, params) {
  const members = Object.entries(params)
    .map(([k, v]) => `<member><name>${esc(k)}</name><value><string>${esc(v)}</string></value></member>`)
    .join('')
  return `<?xml version="1.0"?><methodCall><methodName>${method}</methodName>` +
    `<params><param><value><struct>${members}</struct></value></param></params></methodCall>`
}

async function call(method, params) {
  const xml = buildXmlRpc(method, params)
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml', 'User-Agent': AUTH_USER, 'Authorization': auth },
    body: xml
  })
  const text = await r.text()
  if (text.includes('<fault>')) {
    const m = text.match(/<string>([\s\S]*?)<\/string>/)
    throw new Error('Fault: ' + (m ? m[1] : text.slice(0, 200)))
  }
  return text
}

function titleFor(file) {
  let content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8')
  const h1 = content.match(/^\+\s+(.+)$/m)
  return (h1 ? h1[1] : file.replace(/\.txt$/, '')).trim()
}

async function savePage(title, file) {
  const content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8')
  await call('pages.save_one', { site: SITE, title, content })
}

async function main() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.txt'))
  console.error(`[init] ${files.length} pages -> ${SITE}.wikidot.com (user ${USER})`)

  for (const file of files) {
    const title = titleFor(file)
    const target = title.toLowerCase() === 'accueil' ? 'start' : title
    try {
      await savePage(target, file)
      console.error(`[ok]   ${file} -> ${target}`)
    } catch (e) {
      console.error(`[FAIL] ${file}: ${e.message}`)
    }
  }

  if (files.some((f) => f.toLowerCase().startsWith('accueil'))) {
    try {
      await call('pages.save_one', {
        site: SITE,
        title: 'Accueil',
        content: '[[module Redirect destination="start"]]'
      })
      console.error('[ok]   redirection Accueil -> start créée')
    } catch (e) {
      console.error('[FAIL] redirection Accueil: ' + e.message)
    }
  }

  console.error('[done] import terminé')
}

main().catch((e) => { console.error('FATAL', e.message); process.exit(1) })
