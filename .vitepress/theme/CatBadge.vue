<template>
  <Teleport to="body">
    <div ref="badgeEl" v-if="show" class="cat-badge-inline" :style="{ background: catColor }">
      {{ catName }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const API = 'http://localhost:3001'
const route = useRoute()
const show = ref(false)
const catName = ref('')
const catColor = ref('#999')
const badgeEl = ref(null)

async function place() {
  if (!show.value || !badgeEl.value) return
  await nextTick()
  const doc = document.querySelector('.vp-doc')
  if (!doc) return
  const ps = doc.querySelectorAll('p')
  for (const p of ps) {
    if (p.textContent.includes('PV') && p.querySelector('strong')) {
      if (!p.contains(badgeEl.value)) {
        p.appendChild(badgeEl.value)
      }
      return
    }
  }
}

async function check() {
  show.value = false
  await nextTick()
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
            await nextTick()
            place()
            return
          }
        }
      } catch {}
    }
  }
}

onMounted(check)
watch(() => route.path, () => { show.value = false; nextTick(check) })
</script>

<style>
.cat-badge-inline {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #0c0c10;
  margin-left: 8px;
  vertical-align: middle;
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
