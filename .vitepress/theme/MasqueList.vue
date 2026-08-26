<template>
  <div class="ml">
    <div class="ml-pills">
      <button class="ml-pill" :class="{ active: activeCat === '' }" @click="activeCat = ''">Tous</button>
      <button v-for="cat in categories" :key="cat.id" class="ml-pill"
        :class="{ active: activeCat === cat.id }"
        :style="{ '--pill-color': cat.color }"
        @click="activeCat = cat.id">{{ cat.name }}</button>
    </div>
    <ul class="ml-list">
      <li v-for="m in filtered" :key="m.id">
        <a :href="'/masques/' + m.id">
          <span class="ml-mask-shape"></span>
          <span class="ml-card-content">
            <strong>{{ m.name }}</strong>
            <span class="ml-meta">
              <span class="ml-pv">{{ m.pv }} PV</span>
              <span v-if="getCat(m)" class="ml-badge" :style="{ '--cat-color': getCat(m).color }">{{ getCat(m).name }}</span>
            </span>
            <em class="ml-lore">{{ m.lore }}</em>
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import masques from '../../data/masques.json'
import categories from '../../data/categories.json'

const activeCat = ref('')
const filtered = computed(() => {
  if (!activeCat.value) return masques
  return masques.filter(m => (m.category || m.style) === activeCat.value)
})
function getCat(m) {
  return categories.find(c => c.id === (m.category || m.style))
}
</script>

<style>
.ml {
  margin-top: 28px;
}

.ml-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  padding: 14px;
  border: 1px solid rgba(214, 168, 79, .22);
  background: rgba(16, 10, 20, .72);
}

.ml-pill {
  padding: 8px 13px;
  border-radius: 0;
  border: 1px solid color-mix(in srgb, var(--pill-color, #d6a84f) 72%, #27131a);
  background: rgba(214, 168, 79, .035);
  color: color-mix(in srgb, var(--pill-color, #d6a84f) 82%, #f9e8c7);
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  transition: all .2s;
  font-family: 'Cinzel', Georgia, serif;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.ml-pill:hover,
.ml-pill.active {
  background: color-mix(in srgb, var(--pill-color, #d6a84f) 24%, transparent);
  color: #f9e8c7;
  box-shadow: 0 0 18px color-mix(in srgb, var(--pill-color, #d6a84f) 20%, transparent);
}

.ml-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
  list-style: none;
  padding: 0;
}

.ml-list li {
  margin: 0;
}

.ml-list a {
  min-height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 16px;
  position: relative;
  overflow: hidden;
  padding: 20px;
  border: 1px solid rgba(214, 168, 79, .24);
  background:
    radial-gradient(circle at 50% 28%, rgba(214,168,79,.12), transparent 42%),
    linear-gradient(180deg, #17101b, #0b050d);
  color: #f9e8c7;
  text-decoration: none;
  transition: border-color .2s, transform .2s, box-shadow .2s;
}

.ml-list a:hover {
  border-color: #d6a84f;
  transform: translateY(-3px);
  box-shadow: 0 0 34px rgba(214, 168, 79, .12);
}

.ml-mask-shape {
  position: absolute;
  top: 22px;
  left: 50%;
  width: 86px;
  height: 58px;
  transform: translateX(-50%);
  border: 1px solid rgba(214, 168, 79, .64);
  border-radius: 50% 50% 42% 42%;
  background: rgba(249, 232, 199, .06);
  box-shadow: inset 0 -18px 28px rgba(0,0,0,.18);
}

.ml-mask-shape::before,
.ml-mask-shape::after {
  content: '';
  position: absolute;
  top: 27px;
  width: 25px;
  height: 9px;
  border-radius: 50%;
  background: #070309;
}

.ml-mask-shape::before { left: 17px; transform: rotate(9deg); }
.ml-mask-shape::after { right: 17px; transform: rotate(-9deg); }

.ml-card-content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 7px;
}

.ml-list strong {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 16px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.ml-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.ml-pv {
  color: #d6a84f;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.ml-badge {
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid var(--cat-color);
  color: color-mix(in srgb, var(--cat-color) 78%, #f9e8c7);
  background: color-mix(in srgb, var(--cat-color) 12%, transparent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.ml-lore {
  display: block;
  color: #9d8f78;
  font-size: 13px;
  line-height: 1.5;
  font-style: italic;
}
</style>
