import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import MasqueList from './MasqueList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('MasqueList', MasqueList)
  }
}
