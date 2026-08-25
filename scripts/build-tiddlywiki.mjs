import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.')
const OUTDIR = path.resolve('tiddlywiki')
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true })

const CATS = {
  regles: 'Règles',
  masques: 'Masques',
  'guide-joueur': 'Guide du joueur',
  bal: 'Bal',
  technique: 'Technique'
}
const GROUP_ORDER = ['Règles', 'Masques', 'Guide du joueur', 'Technique', 'Bal']

function h1Of(file) {
  const c = fs.readFileSync(file, 'utf8')
  const m = c.match(/^\s*#\s+(.+)$/m)
  return m ? m[1].trim() : path.basename(file).replace(/\.md$/, '')
}

function convertInline(s) {
  s = s.replace(/\*\*(.+?)\*\*/g, "''$1''")
  s = s.replace(/\*([^*\n]+)\*/g, '//$1//')
  s = s.replace(/_([^_\n]+)_/g, '//$1//')
  s = s.replace(/`([^`]+)`/g, '{{{$1}}}')
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '[$2 $1]')
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[[$2|$1]]')
  return s
}

// convertit le markdown en wikitext ; skip le 1er H1 (le titre du tiddler sert de H1)
function mdToWikitext(md) {
  const lines = md.split(/\r?\n/)
  const out = []
  let i = 0
  let skippedH1 = false
  while (i < lines.length) {
    const line = lines[i]
    if (!skippedH1) {
      const h = line.match(/^#\s+(.*)$/)
      if (h) { skippedH1 = true; i++; continue }
    }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      const tlines = []
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { tlines.push(lines[i]); i++ }
      const rows = tlines.map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|'))
      const sepIdx = rows.findIndex((r) => r.every((c) => /^[\s:|-]+$/.test(c)))
      const header = rows[0]
      out.push('|!' + header.map((c) => c.trim()).join('|!') + '|')
      for (let r = 1; r < rows.length; r++) {
        if (r === sepIdx) continue
        out.push('|' + rows[r].map((c) => c.trim()).join('|') + '|')
      }
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) { out.push('!'.repeat(h[1].length) + ' ' + h[2]); i++; continue }
    if (/^>\s?/.test(line)) {
      const q = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++ }
      out.push('<blockquote>\n' + q.join('\n') + '\n</blockquote>')
      continue
    }
    const li = line.match(/^(\s*)[-*]\s+(.*)$/)
    if (li) { out.push('*'.repeat(Math.floor(li[1].length / 2) + 1) + ' ' + convertInline(li[2])); i++; continue }
    const ol = line.match(/^(\s*)\d+\.\s+(.*)$/)
    if (ol) { out.push('#'.repeat(Math.floor(ol[1].length / 2) + 1) + ' ' + convertInline(ol[2])); i++; continue }
    if (/^---+\s*$/.test(line)) { out.push('----'); i++; continue }
    out.push(convertInline(line))
    i++
  }
  return out.join('\n')
}

const tiddlers = []
const pagesMeta = []
const TAGSET = ['Carnival of the Deads']

function tagStr(arr) {
  return arr.map((t) => (t.includes(' ') ? `[[${t}]]` : t)).join(' ')
}

function addFile(file, cat) {
  const content = fs.readFileSync(file, 'utf8')
  const wt = mdToWikitext(content)
  const h1 = h1Of(file)
  const title = (h1 === cat) ? cat : cat + '/' + h1
  tiddlers.push({ title, tags: tagStr([cat, ...TAGSET]), text: wt })
  pagesMeta.push({ title, label: h1, cat, fileBase: path.basename(file).replace(/\.md$/, '') })
}

for (const [folder, cat] of Object.entries(CATS)) {
  const dir = path.join(ROOT, folder)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    addFile(path.join(dir, f), cat)
  }
}

// ---- Accueil (home VitePress) ----
let masquesJson = []
try { masquesJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'masques.json'), 'utf8')) } catch {}
const masqueById = Object.fromEntries(masquesJson.map((m) => [String(m.id), m]))
const masquePages = pagesMeta.filter((p) => p.cat === 'Masques')
let grid = ''
for (const p of masquePages) {
  const e = masqueById[p.fileBase] || {}
  const name = e.name || p.label
  const style = e.style || 'Sans style'
  const pv = e.pv != null ? e.pv + ' PV' : ''
  grid += `<a href="${p.title}" class="cv-card"><span class="cv-mask">🎭</span><strong>${name}</strong><small>${style}</small><em>${pv}</em></a>\n`
}
const nRegles = pagesMeta.filter((p) => p.cat === 'Règles').length
const nGuides = pagesMeta.filter((p) => p.cat === 'Guide du joueur').length
const accueil = `<style>
.cv-home{ --c-blood:#c0152f; --c-gold:#c9a84c; --c-gold-2:#e8c766; --c-violet:#8b5cf6; --c-ink:#0b0b0f;
  color:#ece8f5; background:
    radial-gradient(120% 80% at 50% -10%, rgba(139,92,246,.12), transparent 60%),
    radial-gradient(90% 60% at 50% 120%, rgba(192,21,47,.14), transparent 60%),
    repeating-linear-gradient(135deg, rgba(201,168,76,.022) 0 2px, transparent 2px 22px), #0b0b0f;
  min-height:100vh; }
.cv-hero{ max-width:1000px; margin:0 auto; padding:72px 24px 40px; text-align:center; position:relative; }
.cv-ornament{ color:var(--c-gold); font-size:28px; opacity:.6; }
.cv-hero h1{ font-family:'Cinzel',serif; font-size:clamp(44px,8vw,88px); line-height:.95; font-weight:900; margin:10px 0;
  background:linear-gradient(120deg,#c0152f,#c9a84c 60%,#8b5cf6); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 0 40px rgba(201,168,76,.2); }
.cv-tag{ color:var(--c-gold-2); font-size:20px; font-weight:700; font-style:italic; }
.cv-copy{ color:#b9aecb; max-width:560px; margin:12px auto 0; font-size:16px; line-height:1.6; }
.cv-actions{ display:flex; gap:14px; justify-content:center; margin-top:28px; flex-wrap:wrap; }
.cv-btn{ padding:13px 26px; border-radius:50px; border:1px solid var(--c-gold); font-weight:800; text-decoration:none; transition:all .2s; }
.cv-btn-primary{ background:linear-gradient(135deg,#c0152f,#9b1024); color:#fff; box-shadow:0 6px 18px rgba(192,21,47,.35); }
.cv-btn-primary:hover{ transform:translateY(-2px); box-shadow:0 10px 26px rgba(192,21,47,.5); }
.cv-btn-ghost{ background:transparent; color:var(--c-gold-2); }
.cv-btn-ghost:hover{ border-color:var(--c-blood); color:#fff; background:rgba(192,21,47,.15); }
.cv-stats{ max-width:1000px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.cv-stats div{ padding:18px; border:1px solid #2e2540; border-radius:18px; background:rgba(29,23,48,.6); text-align:center; }
.cv-stats strong{ display:block; font-size:32px; color:var(--c-gold-2); font-family:'Cinzel',serif; }
.cv-stats span{ font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:#837893; font-weight:700; }
.cv-section{ max-width:1000px; margin:0 auto; padding:56px 24px; }
.cv-section-head{ text-align:center; margin-bottom:24px; }
.cv-section-head span{ color:var(--c-blood); font-size:12px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; }
.cv-section-head h2{ font-family:'Cinzel',serif; font-size:clamp(28px,4vw,42px); color:var(--c-gold-2); margin-top:6px; }
.cv-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }
.cv-card{ padding:18px; border:1px solid #2e2540; border-radius:16px; background:linear-gradient(160deg,#15101c,#1d1730); text-decoration:none; color:#ece8f5; transition:all .2s; display:flex; flex-direction:column; gap:4px; position:relative; overflow:hidden; }
.cv-card::before{ content:''; position:absolute; inset:0 0 auto 0; height:3px; background:linear-gradient(90deg,var(--c-blood),var(--c-gold)); }
.cv-card:hover{ transform:translateY(-4px); border-color:var(--c-gold); box-shadow:0 12px 30px rgba(0,0,0,.5); }
.cv-mask{ font-size:26px; filter:drop-shadow(0 0 10px rgba(201,168,76,.5)); }
.cv-card strong{ font-family:'Cinzel',serif; font-size:17px; color:var(--c-gold-2); }
.cv-card small{ font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:#9b8fb0; }
.cv-card em{ font-style:normal; font-weight:700; color:var(--c-blood); font-size:13px; }
.cv-link{ display:inline-block; margin-top:22px; color:var(--c-gold-2); font-weight:700; text-decoration:none; }
.cv-link:hover{ color:#fff; }
@media (max-width:640px){ .cv-stats{ grid-template-columns:repeat(2,1fr); } }
</style>
<main class="cv-home">
  <section class="cv-hero">
    <div class="cv-ornament">❧</div>
    <h1>Carnival<br>of the Deads</h1>
    <p class="cv-tag">Un bal masqué où chacun cache bien plus que son visage.</p>
    <p class="cv-copy">6 à 12 joueurs. Vivants contre Revenants. Sous les dorures, la pourriture sourit.</p>
    <div class="cv-actions">
      <a href="Règles/Présentation" class="cv-btn cv-btn-primary">Lire les règles</a>
      <a href="Masques" class="cv-btn cv-btn-ghost">Voir les masques</a>
    </div>
  </section>
  <section class="cv-stats">
    <div><strong>${masquePages.length}</strong><span>Masques</span></div>
    <div><strong>2</strong><span>Camps</span></div>
    <div><strong>${nRegles}</strong><span>Règles</span></div>
    <div><strong>${nGuides}</strong><span>Guides</span></div>
  </section>
  <section class="cv-section">
    <div class="cv-section-head"><span>Masques</span><h2>Les visages du bal</h2></div>
    <div class="cv-grid">${grid}</div>
    <a href="Masques" class="cv-link">Tous les ${masquePages.length} masques →</a>
  </section>
</main>`
tiddlers.push({ title: 'Accueil', tags: tagStr(['home', 'Accueil', ...TAGSET]), text: accueil })

// index par catégorie
for (const cat of Object.values(CATS)) {
  tiddlers.push({
    title: cat,
    tags: tagStr([cat, ...TAGSET]),
    text: '!' + cat + '\n\n<<list-links "[tag[' + cat + ']] -[[' + cat + ']]">>'
  })
}

// Menu latéral groupé (style VitePress)
const groups = {}
for (const p of pagesMeta) (groups[p.cat] ||= []).push(p)
let menu = ''
for (const cat of GROUP_ORDER) {
  if (!groups[cat]) continue
  menu += '!! ' + cat + '\n'
  for (const p of groups[cat]) menu += '* [[' + p.title + '|' + p.label + ']]\n'
  menu += '\n'
}
menu += "Clique une catégorie pour ouvrir ses pages."
tiddlers.push({ title: 'Menu', tags: '$:/tags/SideBar', text: menu })

// ---- Thème global (portage VitePress) ----
const css = `/* Carnival of the Deads — thème VitePress (port TiddlyWiki) */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
:root{
  --c-blood:#c0152f; --c-blood-2:#9b1024; --c-gold:#c9a84c; --c-gold-2:#e8c766;
  --c-violet:#8b5cf6; --c-ink:#0b0b0f; --c-border:#2e2540; --c-text:#cfc6dd; --c-text-1:#ece8f5; --c-muted:#b9aecb;
}
html, body, .tc-body{
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(139,92,246,.12), transparent 60%),
    radial-gradient(90% 60% at 50% 120%, rgba(192,21,47,.14), transparent 60%),
    repeating-linear-gradient(135deg, rgba(201,168,76,.022) 0 2px, transparent 2px 22px),
    #0b0b0f !important;
  color:var(--c-text-1); font-family:'Inter',system-ui,sans-serif; font-size:15px; line-height:1.7;
  background-attachment:fixed; -webkit-font-smoothing:antialiased;
}
*::-webkit-scrollbar{width:12px}
*::-webkit-scrollbar-track{background:#14101c}
*::-webkit-scrollbar-thumb{background:var(--c-gold); border-radius:6px; border:3px solid #14101c}
*::-webkit-scrollbar-thumb:hover{background:var(--c-blood)}

.tc-topbar{ background:#0b0b0fe6 !important; backdrop-filter:blur(8px); border-bottom:1px solid var(--c-gold) !important; padding:.5rem .9rem; }
.tc-topbar .tc-site-title, .tc-topbar .tc-title{ font-family:'Cinzel',serif !important; color:var(--c-gold-2) !important; font-weight:800; font-size:17px; letter-spacing:.03em; }
.tc-search input{ background:#14101c !important; border:1px solid var(--c-border) !important; border-radius:999px !important; color:var(--c-text-1) !important; padding:.5rem 1rem !important; }
.tc-search input:focus{ border-color:var(--c-gold) !important; box-shadow:0 0 0 3px rgba(201,168,76,.18); }

.tc-sidebar-scrollable{ background:#100c18 !important; border-right:1px solid var(--c-gold) !important; }
.tc-sidebar-lists{ background:transparent !important; padding:.5rem; }
.tc-sidebar .tc-tab-buttons button{ color:var(--c-muted) !important; border:none !important; font-family:'Cinzel',serif; text-transform:uppercase; letter-spacing:.06em; font-size:.7rem; }
.tc-sidebar .tc-tab-buttons button.tc-tab-selected{ color:var(--c-gold-2) !important; border-bottom:2px solid var(--c-blood) !important; }
.tc-sidebar-lists h2{ color:var(--c-gold-2) !important; text-transform:uppercase; letter-spacing:.1em; font-family:'Cinzel',serif; font-size:12px; font-weight:800; padding:8px 16px; background:linear-gradient(90deg, rgba(201,168,76,.14), transparent); border-radius:8px; margin:14px 8px 6px; }
.tc-sidebar-lists a.tc-tiddlylink, .tc-sidebar-lists a{ display:block; margin:.15rem .5rem; padding:.45rem .9rem; color:#b9aecb !important; font-weight:500; border-left:4px solid transparent; border-radius:0 8px 8px 0; text-decoration:none; transition:.15s; }
.tc-sidebar-lists a.tc-tiddlylink:hover{ color:#ece8f5 !important; background:rgba(201,168,76,.08); }

.tc-story-river{ display:flex; flex-direction:column; align-items:center; padding:1.5rem 1rem; }
.tc-tiddler-frame{ background:transparent !important; border:none !important; box-shadow:none !important; margin:0 !important; padding:0 !important; max-width:760px; width:100%; }
.tc-tiddler-title{ font-family:'Cinzel',serif !important; color:var(--c-gold-2) !important; font-weight:800; font-size:1.9rem !important; letter-spacing:-.01em; text-shadow:0 0 24px rgba(201,168,76,.2); margin-bottom:.4rem; }
.tc-tiddler-controls button{ background:#14101c !important; border:1px solid var(--c-border) !important; border-radius:8px !important; color:var(--c-muted) !important; }
.tc-tiddler-controls button:hover{ color:var(--c-gold-2) !important; border-color:var(--c-gold) !important; }
.tc-tagged-home .tc-tiddler-title{ display:none; }
.tc-tagged-home .tc-tiddler-frame, .tc-tagged-home .tc-tiddler-body{ max-width:100% !important; }

.tc-tiddler-body{ max-width:760px; margin:0 auto; }
.tc-tiddler-body h1{ font-family:'Cinzel',serif !important; color:var(--c-gold-2) !important; letter-spacing:-.01em; text-shadow:0 0 24px rgba(201,168,76,.2); }
.tc-tiddler-body h2{ color:#ece8f5 !important; border-top:3px solid var(--c-gold); padding-top:22px; margin-top:36px; font-family:'Cinzel',serif !important; font-weight:800; font-size:1.35em; position:relative; }
.tc-tiddler-body h2::after{ content:''; position:absolute; left:0; bottom:-3px; width:60px; height:3px; background:linear-gradient(90deg,var(--c-blood),var(--c-gold)); }
.tc-tiddler-body h3{ color:var(--c-violet) !important; font-weight:800; font-family:'Cinzel',serif !important; }
.tc-tiddler-body p{ color:var(--c-text); line-height:1.85; font-size:15px; }
.tc-tiddler-body strong{ color:var(--c-gold-2); font-weight:700; }
.tc-tiddler-body a.tc-tiddlylink{ color:var(--c-gold-2) !important; font-weight:600; }
.tc-tiddler-body a.tc-tiddlylink:hover{ color:#fff !important; text-shadow:0 0 10px rgba(201,168,76,.4); }
.tc-tiddler-body blockquote{ border-left:4px solid var(--c-gold) !important; background:linear-gradient(90deg, rgba(201,168,76,.1), rgba(201,168,76,.02)); padding:16px 22px !important; border-radius:0 14px 14px 0; }
.tc-tiddler-body blockquote p{ color:var(--c-muted); font-style:italic; }
.tc-tiddler-body ul li{ color:var(--c-text); line-height:1.85; }
.tc-tiddler-body ul li::marker{ color:var(--c-blood); font-weight:800; }
.tc-tiddler-body table{ border:1px solid var(--c-gold); border-radius:14px; overflow:hidden; border-collapse:separate; width:100%; }
.tc-tiddler-body th{ background:linear-gradient(180deg,#2a2238,#1d1730) !important; color:var(--c-gold-2) !important; font-weight:800; border-color:var(--c-gold) !important; padding:12px 16px; text-transform:uppercase; font-size:12px; letter-spacing:.05em; font-family:'Cinzel',serif; }
.tc-tiddler-body td{ border-color:var(--c-border) !important; color:var(--c-text); padding:12px 16px; }
.tc-tiddler-body tr:hover td{ background:rgba(201,168,76,.06); }
.tc-tiddler-body code{ background:#16121f !important; color:var(--c-blood) !important; padding:3px 10px; border-radius:6px; font-family:'JetBrains Mono',ui-monospace,monospace; font-size:.88em; font-weight:700; border:1px solid var(--c-border); }
.tc-tiddler-body pre{ background:#16121f !important; border:1px solid var(--c-gold) !important; border-radius:14px; }
.tc-tiddler-body pre code{ background:none; color:#ece8f5; padding:0; border:none; }
.tc-tiddler-body hr{ border:none; border-top:2px dashed var(--c-gold); opacity:.5; }
.tc-tiddler-frame, a, button{ transition:.18s ease; }
`
tiddlers.push({ title: 'Carnival Theme', tags: '$:/tags/Stylesheet', type: 'text/css', text: css })

const palette = {
  title: 'Carnival Palette',
  tags: '$:/tags/Palette',
  text: '',
  'page-background': '#0b0b0f',
  'page-foreground': '#ece8f5',
  'tiddler-background': '#0b0b0f',
  'tiddler-foreground': '#ece8f5',
  'sidebar-background': '#100c18',
  'sidebar-foreground': '#b9aecb',
  'primary': '#c0152f',
  'secondary': '#c9a84c',
  'tertiary': '#e8c766',
  'link-foreground': '#e8c766',
  'link-hover-foreground': '#ffffff',
  'button-background': '#c0152f',
  'button-foreground': '#ffffff',
  'button-border': '#2e2540',
  'border': '#2e2540',
  'shadow': 'rgba(0,0,0,0.5)',
  'code-background': '#16121f',
  'code-foreground': '#ece8f5',
  'edit-textarea-background': '#14101c',
  'edit-textarea-foreground': '#ece8f5',
  'message-background': '#100c18',
  'message-foreground': '#ece8f5'
}
tiddlers.push(palette)
tiddlers.push({ title: '$:/config/DefaultPalette', text: 'Carnival Palette' })

tiddlers.push({ title: '$:/SiteTitle', text: 'Carnival of the Deads' })
tiddlers.push({ title: '$:/SiteSubtitle', text: 'Wiki du bal masqué' })
tiddlers.push({ title: '$:/DefaultTiddlers', text: 'Accueil' })

fs.writeFileSync(path.join(OUTDIR, 'import.json'), JSON.stringify(tiddlers, null, 0))
const theme = tiddlers.find((x) => x.title === 'Carnival Theme')
const paletteTiddler = tiddlers.find((x) => x.title === 'Carnival Palette')
const dfltPalette = tiddlers.find((x) => x.title === '$:/config/DefaultPalette')
fs.writeFileSync(path.join(OUTDIR, 'theme.json'), JSON.stringify([theme, paletteTiddler, dfltPalette], null, 0))
const nav = tiddlers.filter(
  (x) =>
    x.title === 'Accueil' ||
    x.title === 'Menu' ||
    x.title === 'Carnival Theme' ||
    x.title === 'Carnival Palette' ||
    x.title === '$:/config/DefaultPalette'
)
fs.writeFileSync(path.join(OUTDIR, 'nav.json'), JSON.stringify(nav, null, 0))
console.error('[ok] ' + tiddlers.length + ' tiddlers -> tiddlywiki/{import,theme,nav}.json')
