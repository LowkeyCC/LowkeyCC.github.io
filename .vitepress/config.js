import { defineConfig } from 'vitepress'
import { readFileSync } from 'fs'
import masques from '../data/masques.json'

const masqueItems = masques.map((m) => ({ text: m.name, link: '/masques/' + m.id }))

let meta = { featured: [], navOrder: [], hiddenSections: [] }
try {
  meta = JSON.parse(readFileSync(new URL('./../meta.json', import.meta.url), 'utf8'))
} catch {}

const norm = (s) => String(s || '').replace(/^\/+|\/+$/g, '')

let sidebar = {
  '/regles/': [
    { text: '📖 Règles', items: [
      { text: 'Présentation', link: '/regles/01-presentation' },
      { text: 'Phases de jeu', link: '/regles/02-phases' },
      { text: 'Les Camps', link: '/regles/03-camps' },
      { text: 'Les Masques', link: '/regles/04-masques' },
      { text: 'Le Combat', link: '/regles/05-combat' },
      { text: 'Capacités & Talents', link: '/regles/06-capacites' },
      { text: 'Effets spéciaux', link: '/regles/07-effets-speciaux' },
      { text: 'Zones', link: '/regles/08-zones' },
      { text: 'Victoire', link: '/regles/09-victoire' }
    ]}
  ],
  '/masques/': [
    { text: '🎭 Masques', items: masqueItems }
  ],
  '/guide-joueur/': [
    { text: '🎮 Guides', items: [
      { text: 'Premiers pas', link: '/guide-joueur/01-premiers-pas' },
      { text: 'Conseils Vivants', link: '/guide-joueur/02-conseils-vivants' },
      { text: 'Conseils Revenants', link: '/guide-joueur/03-conseils-revenants' },
      { text: "Guide de l'Hôte", link: '/guide-joueur/04-guide-mj' }
    ]}
  ],
  '/technique/': [
    { text: '⚙️ Technique', items: [
      { text: 'Architecture', link: '/technique/01-architecture' },
      { text: 'Données', link: '/technique/02-donnees' },
      { text: 'Commandes', link: '/technique/03-commandes' }
    ]}
  ],
  '/bal/': [
    { text: '🩰 Bal', items: [
      { text: 'Le Bal', link: '/bal/' }
    ]}
  ]
}

const hideSet = new Set((meta.hiddenSections || []).map(norm))
const orderList = (meta.navOrder || []).map(norm)
const orderKeys = orderList.map((o) => '/' + o + '/')
const visibleKeys = Object.keys(sidebar).filter((k) => !hideSet.has(norm(k)))
const orderedKeys = [...orderKeys.filter((k) => visibleKeys.includes(k)), ...visibleKeys.filter((k) => !orderKeys.includes(k))]
const orderedSidebar = {}
for (const k of orderedKeys) orderedSidebar[k] = sidebar[k]
sidebar = orderedSidebar

export default defineConfig({
  title: 'Carnival of the Deads',
  description: 'Wiki — Règles, Masques, Guides, Techniques',
  lang: 'fr',
  lastUpdated: false,
  appearance: 'dark',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Creepster&family=Inter:wght@400;500;600;700&display=swap', rel: 'stylesheet' }]
  ],
  themeConfig: {
    logo: '🎪',
    siteTitle: 'Carnival Wiki',
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Règles', link: '/regles/01-presentation' },
      { text: 'Masques', link: '/masques/' },
      { text: 'Guides', link: '/guide-joueur/01-premiers-pas' },
      { text: 'Technique', link: '/technique/01-architecture' },
      { text: 'Bal', link: '/bal/' }
    ],
    sidebar,
    socialLinks: [],
    footer: {
      message: 'Carnival of the Deads — Wiki',
      copyright: 'Fait avec 🎪'
    },
    search: {
      provider: 'local'
    },
    outline: { level: [2, 3], label: 'Sur cette page' },
    lastUpdated: { text: 'Dernière mise à jour' },
    docFooter: { prev: 'Précédent', next: 'Suivant' },
    darkModeSwitchLabel: 'Thème',
    darkModeSwitchTitle: 'Passer en mode clair',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Retour en haut',
    langMenuLabel: 'Langue'
  },
  markdown: { lineNumbers: false }
})
