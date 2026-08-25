import { get, list, put } from '@vercel/blob'
import { writeFileSync, mkdirSync, readFileSync, statSync, readdirSync } from 'fs'
import { join, relative } from 'path'

const BLOB_PREFIX = 'carnival/'
const token = process.env.BLOB_READ_WRITE_TOKEN
const oidc = process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID
if (!token && !oidc) {
  console.log('[fetch-content] Pas de BLOB_READ_WRITE_TOKEN ni OIDC — utilisation du contenu du repo.')
  process.exit(0)
}
const opts = token ? { token } : {}

async function streamToText(stream) {
  const reader = stream.getReader()
  const dec = new TextDecoder()
  let out = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    out += dec.decode(value, { stream: true })
  }
  out += dec.decode()
  return out
}

const SKIP = new Set(['.git', '.vercel', 'node_modules', '.vitepress', 'dist', 'cache', 'data', 'scripts', 'api'])
function walk(dir, out) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue
    const fp = join(dir, e)
    const st = statSync(fp)
    if (st.isDirectory()) walk(fp, out)
    else {
      const rel = relative(process.cwd(), fp).split('\\').join('/')
      if (e.endsWith('.md') || rel === 'meta.json') out.push(rel)
    }
  }
}

async function main() {
  const repoFiles = []
  walk(process.cwd(), repoFiles)
  const existing = new Set()
  let cursor
  do {
    const r = await list({ cursor, ...opts })
    for (const b of r.blobs) existing.add(b.pathname)
    cursor = r.hasMore ? r.cursor : undefined
  } while (cursor)

  let seeded = 0
  for (const rel of repoFiles) {
    const key = BLOB_PREFIX + rel
    if (!existing.has(key)) {
      try {
        await put(key, readFileSync(join(process.cwd(), rel), 'utf8'), { access: 'private', allowOverwrite: false, ...opts })
        seeded++
      } catch (e) {
        if (/exist/i.test(e?.message || '')) continue
        throw e
      }
    }
  }
  console.log(`[fetch-content] fichiers repo: ${repoFiles.length}, seedés: ${seeded}`)

  const blobs = []
  cursor = undefined
  do {
    const r = await list({ cursor, ...opts })
    for (const b of r.blobs) if (b.pathname.startsWith(BLOB_PREFIX)) blobs.push(b.pathname)
    cursor = r.hasMore ? r.cursor : undefined
  } while (cursor)

  for (const pathname of blobs) {
    const b = await get(pathname, { access: 'private', ...opts })
    const text = await streamToText(b.stream)
    const localRel = pathname.slice(BLOB_PREFIX.length)
    const fp = join(process.cwd(), localRel)
    mkdirSync(join(fp, '..'), { recursive: true })
    writeFileSync(fp, text)
  }
  console.log(`[fetch-content] ${blobs.length} blob(s) téléchargé(s) pour le build.`)
}
main().catch(e => { console.error('[fetch-content] erreur (ignorée):', e?.message || e); process.exit(0) })
