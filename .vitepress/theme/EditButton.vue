<template>
  <Teleport to="body">
    <button class="edit-fab" @click="open" title="Editer cette page">Editer</button>

    <div v-if="open_" class="edit-overlay" @click.self="close">
      <div class="edit-modal">
        <div class="edit-header">
          <span class="edit-title">{{ title }}</span>
          <button class="edit-close" @click="close">x</button>
        </div>

        <div v-if="type === 'masque'" class="edit-category-bar">
          <span class="cat-label">Categorie :</span>
          <button v-for="cat in categories" :key="cat.id"
            class="cat-pill" :class="{ active: masqueCategory === cat.id }"
            :style="{ '--pill-color': cat.color }"
            @click="masqueCategory = masqueCategory === cat.id ? '' : cat.id">{{ cat.name }}</button>
          <button class="cat-pill cat-manage" @click="showCatManager = !showCatManager">Gerer</button>
        </div>

        <div v-if="showCatManager && type === 'masque'" class="cat-manager">
          <div class="cat-manager-title">Gerer les categories</div>
          <div v-for="cat in categories" :key="cat.id" class="cat-row">
            <input v-model="cat.name" class="cat-input" placeholder="Nom" />
            <input v-model="cat.color" type="color" class="cat-color" />
            <button class="cat-btn-save" @click="updateCat(cat)">Ok</button>
            <button class="cat-btn-del" @click="deleteCat(cat.id)">Supprimer</button>
          </div>
          <div class="cat-row cat-new-row">
            <input v-model="newCatName" class="cat-input" placeholder="Nouvelle categorie" />
            <input v-model="newCatColor" type="color" class="cat-color" />
            <button class="cat-btn-add" @click="addCategory">Ajouter</button>
          </div>
        </div>

        <textarea v-model="content" class="edit-textarea" spellcheck="false" @keydown.stop @keyup.stop @keypress.stop></textarea>
        <div class="edit-footer">
          <button v-if="type === 'masque'" class="edit-delete" @click="remove">Supprimer</button>
          <button class="edit-cancel" @click="close">Annuler</button>
          <button class="edit-save" @click="save">Sauvegarder</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vitepress'

const API = 'http://localhost:3001'
const route = useRoute()
const open_ = ref(false)
const content = ref('')
const type = ref('')
const filePath = ref('')
const masqueId = ref('')
const categories = ref([])
const masqueCategory = ref('')
const showCatManager = ref(false)
const newCatName = ref('')
const newCatColor = ref('#9ca3af')

const title = computed(() => {
  if (type.value === 'masque') return 'Masque: ' + masqueId.value
  return filePath.value
})

function detectType() {
  const path = route.path
  if (path.startsWith('/masques/') && path !== '/masques/') {
    const id = path.replace('/masques/', '').replace(/\/$/, '').replace('.html', '')
    if (id && id !== 'index') {
      type.value = 'masque'
      masqueId.value = id
      filePath.value = ''
      return
    }
  }
  type.value = 'file'
  masqueId.value = ''
  const clean = route.path.replace(/^\//, '').replace(/\/$/, '')
  filePath.value = clean + '.md'
}

async function open() {
  detectType()
  try {
    const catsR = await fetch(API + '/api/categories')
    categories.value = await catsR.json()

    if (type.value === 'masque') {
      const r = await fetch(API + '/api/masque/' + masqueId.value)
      const data = await r.json()
      masqueCategory.value = data.category || ''
      content.value = JSON.stringify(data, null, 2)
    } else {
      const r = await fetch(API + '/api/file/' + encodeURIComponent(filePath.value))
      content.value = await r.text()
    }
    open_.value = true
  } catch (e) {
    content.value = 'Erreur: ' + e.message
    open_.value = true
  }
}

function close() { open_.value = false; showCatManager.value = false }

async function refreshCats() {
  const catsR = await fetch(API + '/api/categories')
  categories.value = await catsR.json()
}

async function addCategory() {
  if (!newCatName.value.trim()) return
  try {
    await fetch(API + '/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName.value.trim(), color: newCatColor.value })
    })
    newCatName.value = ''
    await refreshCats()
  } catch (e) { alert('Erreur: ' + e.message) }
}

async function updateCat(cat) {
  if (!cat.name.trim()) return
  try {
    await fetch(API + '/api/category/' + cat.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cat.name.trim(), color: cat.color })
    })
    await refreshCats()
  } catch (e) { alert('Erreur: ' + e.message) }
}

async function deleteCat(id) {
  if (!confirm('Supprimer cette categorie ?')) return
  try {
    await fetch(API + '/api/category/' + id, { method: 'DELETE' })
    if (masqueCategory.value === id) masqueCategory.value = ''
    await refreshCats()
  } catch (e) { alert('Erreur: ' + e.message) }
}

async function save() {
  try {
    if (type.value === 'masque') {
      const data = JSON.parse(content.value)
      data.category = masqueCategory.value
      await fetch(API + '/api/masque/' + masqueId.value, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } else {
      await fetch(API + '/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath.value, data: content.value })
      })
    }
    close()
    window.location.reload(true)
  } catch (e) { alert('Erreur: ' + e.message) }
}

async function remove() {
  if (!confirm('Supprimer ce masque ?')) return
  try {
    await fetch(API + '/api/masque/' + masqueId.value, { method: 'DELETE' })
    close()
    window.location.href = '/masques/'
  } catch (e) { alert('Erreur: ' + e.message) }
}

watch(() => route.path, () => { open_.value = false })
</script>

<style>
.edit-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #a855f7;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
  transition: all 0.2s;
  font-family: 'Inter', system-ui, sans-serif;
}
.edit-fab:hover { background: #9333ea; transform: scale(1.04); box-shadow: 0 4px 25px rgba(168, 85, 247, 0.4); }

.edit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.edit-modal {
  background: #0a0a10;
  border: 1px solid #1e1830;
  border-radius: 14px;
  width: 90vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(168, 85, 247, 0.05);
}

.edit-header {
  padding: 14px 20px;
  border-bottom: 1px solid #2a2a38;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-title {
  color: #a855f7;
  font-size: 14px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}

.edit-close { background: none; border: none; color: #504068; cursor: pointer; font-size: 18px; }

/* Category bar */
.edit-category-bar {
  padding: 10px 20px;
  border-bottom: 1px solid #2a2a38;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.cat-label { color: #707088; font-size: 12px; font-weight: 600; margin-right: 4px; }

.cat-pill {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--pill-color, #555);
  background: transparent;
  color: var(--pill-color, #aaa);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'Inter', system-ui, sans-serif;
}
.cat-pill:hover { background: color-mix(in srgb, var(--pill-color) 20%, transparent); }
.cat-pill.active { background: var(--pill-color); color: #0c0c10; }

.cat-manage { --pill-color: #707088; font-style: italic; }

/* Cat manager */
.cat-manager {
  padding: 12px 20px;
  border-bottom: 1px solid #2a2a38;
  background: #111118;
}

.cat-manager-title {
  font-size: 11px;
  font-weight: 700;
  color: #707088;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.cat-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}

.cat-input {
  flex: 1;
  padding: 5px 10px;
  background: #0c0c10;
  border: 1px solid #2a2a38;
  border-radius: 6px;
  color: #c8c8d4;
  font-size: 12px;
  font-family: 'Inter', system-ui, sans-serif;
}

.cat-color { width: 30px; height: 30px; border: none; cursor: pointer; background: none; border-radius: 6px; }

.cat-btn-save {
  padding: 5px 12px;
  background: #a855f7;
  color: #0c0c10;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', system-ui, sans-serif;
}

.cat-btn-add {
  padding: 5px 12px;
  background: #34d399;
  color: #0c0c10;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', system-ui, sans-serif;
}

.cat-btn-del {
  padding: 5px 12px;
  background: #f87171;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', system-ui, sans-serif;
}

.cat-new-row { margin-top: 8px; padding-top: 8px; border-top: 1px solid #2a2a38; }

/* Textarea */
.edit-textarea {
  flex: 1;
  padding: 16px 20px;
  background: #0c0c10;
  color: #c8c8d4;
  border: none;
  resize: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
  outline: none;
}

.edit-footer {
  padding: 12px 20px;
  border-top: 1px solid #2a2a38;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.edit-footer button {
  padding: 7px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
}

.edit-save { background: #a855f7; color: #fff; }
.edit-cancel { background: #2a2a38; color: #c8c8d4; }
.edit-delete { background: #f87171; color: #fff; margin-right: auto; }
</style>
