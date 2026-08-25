import fs from 'fs'

const token = process.env.GITHUB_TOKEN
if (!token) { console.error('GITHUB_TOKEN manquant'); process.exit(1) }

const owner = 'LowkeyCC'
const repo = 'LowkeyCC.github.io'
const API = 'https://api.github.com'

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

async function main() {
  // 1) activer GitHub Pages en mode GitHub Actions
  let r = await api('/repos/' + owner + '/' + repo + '/pages', {
    method: 'POST',
    body: JSON.stringify({ build_type: 'workflow' })
  })
  console.error('Pages POST:', r.status, r.ok ? 'OK' : await r.text())

  // 2) pousser le workflow
  const rel = '.github/workflows/deploy.yml'
  const url = '/repos/' + owner + '/' + repo + '/contents/' + encodeURI(rel)
  const content = Buffer.from(workflow).toString('base64')
  const body = { message: 'Add deploy workflow', content, encoding: 'base64' }
  const cur = await api(url)
  if (cur.ok) body.sha = (await cur.json()).sha
  r = await api(url, { method: 'PUT', body: JSON.stringify(body) })
  console.error('workflow PUT:', r.status, r.ok ? 'OK' : await r.text())

  // 3) vérifier le run
  await new Promise((res) => setTimeout(res, 3000))
  const runs = await api('/repos/' + owner + '/' + repo + '/actions/runs?per_page=1')
  if (runs.ok) {
    const j = await runs.json()
    if (j.workflow_runs && j.workflow_runs[0]) {
      const w = j.workflow_runs[0]
      console.error('Dernier run:', w.id, w.status, w.conclusion, w.html_url)
    }
  }
  console.error('-> Le push du workflow déclenche le build+deploy automatiquement.')
}
main()
