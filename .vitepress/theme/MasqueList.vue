<template>
  <div class="ml">
    <ul class="ml-list">
      <li v-for="m in masques" :key="m.id">
        <a :href="'/masques/' + m.id">
          <span class="ml-mask-shape"></span>
          <span class="ml-card-content">
            <strong>{{ m.name }}</strong>
            <span class="ml-meta">
              <span class="ml-pv">{{ m.pv }} PV</span>
            </span>
            <em class="ml-lore">{{ m.lore }}</em>
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import masques from '../../data/masques.json'
</script>

<style>
.ml {
  margin-top: 28px;
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
    radial-gradient(circle at 50% 28%, rgba(214,168,79,.12), transparent 42'),
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

.ml-lore {
  display: block;
  color: #9d8f78;
  font-size: 13px;
  line-height: 1.5;
  font-style: italic;
}
</style>
