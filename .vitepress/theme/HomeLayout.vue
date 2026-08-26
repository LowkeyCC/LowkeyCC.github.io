<template>
  <main class="cv-home">
    <section class="cv-hero">
      <div class="cv-ornament">❧</div>
      <h1>Carnival<br>of the Deads</h1>
      <p class="cv-tag">Un bal masqué où chacun cache bien plus que son visage.</p>
      <p class="cv-copy">6 à 12 joueurs. Vivants contre Revenants. Sous les dorures, la pourriture sourit.</p>
      <div class="cv-actions">
        <a href="/regles/01-presentation" class="cv-btn cv-btn-primary">Lire les règles</a>
        <a href="/masques/" class="cv-btn cv-btn-ghost">Voir les masques</a>
      </div>
    </section>

    <section class="cv-stats">
      <div><strong>{{ masques.length }}</strong><span>Masques</span></div>
      <div><strong>2</strong><span>Camps</span></div>
      <div><strong>9</strong><span>Règles</span></div>
      <div><strong>4</strong><span>Guides</span></div>
    </section>

    <section class="cv-section">
      <div class="cv-section-head">
        <span>Masques</span>
        <h2>Les visages du bal</h2>
      </div>
      <div class="cv-grid">
        <a v-for="m in displayMasques" :key="m.id" :href="'/masques/' + m.id" class="cv-card">
          <span class="cv-mask">🎭</span>
          <strong>{{ m.name }}</strong>
          <em>{{ m.pv }} PV</em>
        </a>
      </div>
      <a href="/masques/" class="cv-link">Tous les {{ masques.length }} masques →</a>
    </section>
  </main>
</template>

<script setup>
import masques from '../../data/masques.json'
import meta from '../../meta.json'

const displayMasques = (meta.featured && meta.featured.length)
  ? [...meta.featured.map((id) => masques.find((m) => m.id === id)).filter(Boolean), ...masques.filter((m) => !meta.featured.includes(m.id))]
  : masques
</script>

<style>
.cv-home {
  --c-blood: #c0152f;
  --c-gold: #c9a84c;
  --c-gold-2: #e8c766;
  --c-violet: #8b5cf6;
  --c-ink: #0b0b0f;
  color: #ece8f5;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(139, 92, 246, .12), transparent 60%),
    radial-gradient(90% 60% at 50% 120%, rgba(192, 21, 47, .14), transparent 60%),
    repeating-linear-gradient(135deg, rgba(201, 168, 76, .022) 0 2px, transparent 2px 22px),
    #0b0b0f;
  min-height: 100vh;
}
.cv-hero { max-width: 1000px; margin: 0 auto; padding: 72px 24px 40px; text-align: center; position: relative; }
.cv-ornament { color: var(--c-gold); font-size: 28px; opacity: .6; }
.cv-hero h1 {
  font-family: 'Cinzel', serif; font-size: clamp(44px, 8vw, 88px); line-height: .95; font-weight: 900;
  margin: 10px 0; background: linear-gradient(120deg, #c0152f, #c9a84c 60%, #8b5cf6);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 40px rgba(201, 168, 76, .2);
}
.cv-tag { color: var(--c-gold-2); font-size: 20px; font-weight: 700; font-style: italic; }
.cv-copy { color: #b9aecb; max-width: 560px; margin: 12px auto 0; font-size: 16px; line-height: 1.6; }
.cv-actions { display: flex; gap: 14px; justify-content: center; margin-top: 28px; flex-wrap: wrap; }
.cv-btn { padding: 13px 26px; border-radius: 50px; border: 1px solid var(--c-gold); font-weight: 800; text-decoration: none; transition: all .2s; }
.cv-btn-primary { background: linear-gradient(135deg, #c0152f, #9b1024); color: #fff; box-shadow: 0 6px 18px rgba(192, 21, 47, .35); }
.cv-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(192, 21, 47, .5); }
.cv-btn-ghost { background: transparent; color: var(--c-gold-2); }
.cv-btn-ghost:hover { border-color: var(--c-blood); color: #fff; background: rgba(192, 21, 47, .15); }
.cv-stats { max-width: 1000px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.cv-stats div { padding: 18px; border: 1px solid #2e2540; border-radius: 18px; background: rgba(29, 23, 48, .6); text-align: center; }
.cv-stats strong { display: block; font-size: 32px; color: var(--c-gold-2); font-family: 'Cinzel', serif; }
.cv-stats span { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #837893; font-weight: 700; }
.cv-section { max-width: 1000px; margin: 0 auto; padding: 56px 24px; }
.cv-section-head { text-align: center; margin-bottom: 24px; }
.cv-section-head span { color: var(--c-blood); font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.cv-section-head h2 { font-family: 'Cinzel', serif; font-size: clamp(28px, 4vw, 42px); color: var(--c-gold-2); margin-top: 6px; }
.cv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
.cv-card {
  padding: 18px; border: 1px solid #2e2540; border-radius: 16px;
  background: linear-gradient(160deg, #15101c, #1d1730); text-decoration: none; color: #ece8f5;
  transition: all .2s; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden;
}
.cv-card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 3px; background: linear-gradient(90deg, var(--c-blood), var(--c-gold)); }
.cv-card:hover { transform: translateY(-4px); border-color: var(--c-gold); box-shadow: 0 12px 30px rgba(0, 0, 0, .5); }
.cv-mask { font-size: 26px; filter: drop-shadow(0 0 10px rgba(201, 168, 76, .5)); }
.cv-card strong { font-family: 'Cinzel', serif; font-size: 17px; color: var(--c-gold-2); }
.cv-card small { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #9b8fb0; }
.cv-card em { font-style: normal; font-weight: 700; color: var(--c-blood); font-size: 13px; }
.cv-link { display: inline-block; margin-top: 22px; color: var(--c-gold-2); font-weight: 700; text-decoration: none; }
.cv-link:hover { color: #fff; }
@media (max-width: 640px) { .cv-stats { grid-template-columns: repeat(2, 1fr); } }
</style>
