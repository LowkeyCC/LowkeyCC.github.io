import fs from 'fs'
import path from 'path'

const token = process.env.GITHUB_TOKEN
if (!token) { console.error('GITHUB_TOKEN manquant'); process.exit(1) }

const ROOT = process.cwd()
const owner = 'LowkeyCC'
const repo = 'LowkeyCC.github.io'
const API = 'https://api.github.com'

const SKIP = [
  /(^|[/\\])\.git([/\\]|$)/,
  /(^|[/\\])node_modules([/\\]|$)/,
  /(^|[/\\])\.vitepress[/\\](dist|cache)([/\\]|$)/,
  /(^|[/\\])tiddlywiki([/\\]|$)/,
  /(^|[/\\])gitbook([/\\]|$)/,
  /(^|[/\\])miraheze([/\\]|$)/,
  /(^|[/\\])api([/\\]|$)/,
  /(^|[/\\])scripts[/\\]gh-pages\.mjs$/,
  /(^|[/\\])vercel\.json$/,
  /\.zip$/,
]

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    const rel = path.relative(ROOT, p).split(path.sep).join('/')
    if (SKIP.some((re) => re.test(rel))) continue
    if (e.isDirectory()) walk(p, out)
    else if (e.isFile()) out.push(rel)
  }
  return out
}

const files = walk(ROOT)

const workflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
`

function api(url, opts = {}) {
  return fetch(API + url, {
    ...opts,
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', ...(opts.headers || {}) }
  })
}

async function pushOne(rel, content) {
  const url = '/repos/' + owner + '/' + repo + '/contents/' + encodeURI(rel)
  const body = { message: 'Add wiki source: ' + rel, content, encoding: 'base64' }
  const cur = await api(url)
  if (cur.ok) {
    const j = await cur.json()
    if (j.content === content) return 'skip'
    body.sha = j.sha
  }
  const r = await api(url, { method: 'PUT', body: JSON.stringify(body) })
  if (!r.ok) console.error('  ->', rel, r.status, await r.text())
  return r.ok
}

async function main() {
  let ok = 0, fail = 0
  for (const rel of files) {
    const b64 = fs.readFileSync(path.join(ROOT, rel)).toString('base64')
    const r = await pushOne(rel, b64)
    if (r) ok++; else { fail++; if (fail <= 5) console.error('échec', rel) }
  }
  const wf = await pushOne('.github/workflows/deploy.yml', Buffer.from(workflow).toString('base64'))
  console.error('source poussé:', ok + '/' + files.length, 'workflow:', wf ? 'ok' : 'échec', 'échecs:', fail)
  console.error('Prochaine étape (manuelle) : Settings > Pages > Source = GitHub Actions')
}
main()
