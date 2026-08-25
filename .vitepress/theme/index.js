import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import AdminBar from './AdminBar.vue'
import './custom.css'

if (typeof window !== 'undefined') {
  const isVite = (location.port === '5173' || location.port === '5174')
  window.__WIKI__ = { id: 'carnival-wiki', api: isVite ? 'http://localhost:8787' : '' }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('AdminBar', AdminBar)
  }
}
