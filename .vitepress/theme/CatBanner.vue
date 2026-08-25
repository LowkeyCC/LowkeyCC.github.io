<template>
  <Teleport to="body">
    <div v-if="show" class="cat-banner" :style="{ background: catColor }">
      <span class="cat-banner-text">{{ catName }}</span>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vitepress'

const API = 'http://localhost:3001'
const route = useRoute()
const show = ref(false)
const catName = ref('')
const catColor = ref('#999')

async function check() {
  const path = route.path
  if (path.startsWith('/masques/') && path !== '/masques/') {
    const id = path.replace('/masques/', '').replace(/\/$/, '').replace('.html', '')
    if (id && id !== 'index') {
      try {
        const r = await fetch(API + '/api/masque/' + id)
        const m = await r.json()
        if (m.category) {
          const catsR = await fetch(API + '/api/categories')
          const cats = await catsR.json()
          const cat = cats.find(c => c.id === m.category)
          if (cat) {
            catName.value = cat.name
            catColor.value = cat.color
            show.value = true
            return
          }
        }
      } catch {}
    }
  }
  show.value = false
}

onMounted(check)
watch(() => route.path, check)
</script>

<style>
.cat-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100;
}
.cat-banner-text {
  display: none;
}
</style>
