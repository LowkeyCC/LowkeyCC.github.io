<template>
<div class="ab" v-if="ready">
  <div class="ab-side">
    <button v-if="!user" class="ab-fab" title="Connexion" @click="showLogin=true">🔐</button>
    <template v-else>
      <button class="ab-fab" title="Éditer la page" @click="openEdit">✎</button>
      <button v-if="user.role==='admin'" class="ab-fab ab-g" title="Panneau admin" @click="openAdmin">⚙</button>
      <button class="ab-fab ab-x" title="Déconnexion" @click="logout">⏻</button>
    </template>
  </div>

  <div class="ab-modal" v-if="showLogin" @click.self="showLogin=false">
    <div class="ab-card">
      <h3>🔐 Connexion</h3>
      <input v-model="lu" placeholder="Identifiant"/>
      <input v-model="lp" type="password" placeholder="Mot de passe" @keyup.enter="login"/>
      <p class="ab-e" v-if="err">{{err}}</p>
      <div class="ab-act"><button class="ab-btn" @click="login">Entrer</button><button class="ab-btn g" @click="showLogin=false">Annuler</button></div>
    </div>
  </div>

  <div class="ab-modal" v-if="showEdit" @click.self="showEdit=false">
    <div class="ab-card big">
      <h3>✎ Éditer <code>{{page}}</code></h3>
      <textarea v-model="content" spellcheck="false"></textarea>
      <p class="ab-e" v-if="err">{{err}}</p>
      <div class="ab-act"><button class="ab-btn" @click="saveEdit">Enregistrer</button><button class="ab-btn g" @click="showEdit=false">Fermer</button></div>
    </div>
  </div>

  <div class="ab-modal" v-if="showAdmin" @click.self="showAdmin=false">
    <div class="ab-card big">
      <h3>⚙ Admin — <code>{{wid}}</code></h3>
      <div class="ab-tabs"><button :class="{on:tab==='u'}" @click="tab='u'">Utilisateurs</button><button :class="{on:tab==='l'}" @click="tab='l'">Agencement</button></div>
      <div v-if="tab==='u'">
        <div class="ab-row" v-for="x in users" :key="x.id">
          <span>{{x.username}} <em>{{x.role}}</em></span>
          <span>
            <select :value="x.role" @change="setRole(x.id,$event.target.value)"><option>admin</option><option>dev</option><option>viewer</option></select>
            <button class="ab-btn g" @click="del(x.id)">Retirer</button>
          </span>
        </div>
        <div class="ab-row">
          <input v-model="nu" placeholder="identifiant"/><input v-model="np" type="password" placeholder="mot de passe"/>
          <select v-model="nr"><option value="dev">dev</option><option value="viewer">viewer</option><option value="admin">admin</option></select>
          <button class="ab-btn" @click="add">Créer</button>
        </div>
        <p class="ab-h">dev = édite pages & agencement · viewer = lecture seule.</p>
      </div>
      <div v-if="tab==='l'">
        <label>Pages en vedette (virgules)</label>
        <input v-model="mf" placeholder="dracaufeu, noctunoir"/>
        <label>Ordre des sections nav (1 par ligne)</label>
        <textarea v-model="mn" rows="6" spellcheck="false"></textarea>
        <label>Sections masquées (1 par ligne)</label>
        <textarea v-model="mh" rows="3" spellcheck="false"></textarea>
        <p class="ab-e" v-if="err">{{err}}</p>
        <div class="ab-act"><button class="ab-btn" @click="saveMeta">Enregistrer l'agencement</button></div>
      </div>
      <div class="ab-act"><button class="ab-btn g" @click="showAdmin=false">Fermer</button></div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vitepress'
const route = useRoute()
const W = (typeof window!=='undefined'&&window.__WIKI__)||{id:'miascarade',api:'http://localhost:8787'}
const API=W.api, wid=W.id
const ready=ref(false), user=ref(null), err=ref('')
const showLogin=ref(false), showEdit=ref(false), showAdmin=ref(false)
const lu=ref(''), lp=ref(''), content=ref(''), page=ref('')
const users=ref([]), tab=ref('u')
const nu=ref(''), np=ref(''), nr=ref('dev')
const mf=ref(''), mn=ref(''), mh=ref('')
function pageOf(){ return route.path==='/'?'index':route.path.replace(/^\//,'').replace(/\.html$/,'').replace(/\/$/,'') }
async function api(p,o={}){ const r=await fetch(API+p,{credentials:'include',method:o.method||'GET',headers:o.body?{'Content-Type':'application/json'}:{},body:o.body?JSON.stringify(o.body):undefined}); let d=null; try{d=await r.json()}catch{}; if(!r.ok)throw new Error((d&&d.error)||('HTTP '+r.status)); return d }
onMounted(async()=>{ try{const m=await api('/api/auth/me');user.value=m.user}catch{}; ready.value=true })
async function login(){ err.value=''; try{ const r=await fetch(API+'/api/auth/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:lu.value,password:lp.value})}); if(!r.ok)throw new Error('Identifiants invalides'); const d=await r.json(); user.value=d.user; lu.value='';lp.value='';showLogin.value=false }catch(e){err.value=e.message} }
async function logout(){ await fetch(API+'/api/auth/logout',{method:'POST',credentials:'include'}); user.value=null }
async function openEdit(){ err.value=''; page.value=pageOf(); try{ const d=await api('/api/pages/'+wid+'/'+page.value); content.value=d.content||''; showEdit.value=true }catch(e){err.value=e.message} }
async function saveEdit(){ try{ await api('/api/pages/'+wid+'/'+page.value,{method:'PUT',body:{content:content.value}}); showEdit.value=false; location.reload() }catch(e){err.value=e.message} }
async function openAdmin(){ err.value=''; try{ const [u,m]=await Promise.all([api('/api/users'),api('/api/meta/'+wid)]); users.value=u.users; const mt=m.meta||{}; mf.value=(mt.featured||[]).join(', '); mn.value=(mt.navOrder||[]).join('\n'); mh.value=(mt.hiddenSections||[]).join('\n'); showAdmin.value=true }catch(e){err.value=e.message} }
async function add(){ try{ await api('/api/users',{method:'POST',body:{username:nu.value,password:np.value,role:nr.value}}); nu.value='';np.value=''; openAdmin() }catch(e){err.value=e.message} }
async function del(id){ try{ await api('/api/users/'+id,{method:'DELETE'}); users.value=users.value.filter(x=>x.id!==id) }catch(e){err.value=e.message} }
async function setRole(id,role){ try{ await api('/api/users/'+id,{method:'PATCH',body:{role}}) }catch(e){err.value=e.message} }
async function saveMeta(){ try{ await api('/api/meta/'+wid,{method:'PUT',body:{meta:{featured:mf.value.split(',').map(s=>s.trim()).filter(Boolean),navOrder:mn.value.split('\n').map(s=>s.trim()).filter(Boolean),hiddenSections:mh.value.split('\n').map(s=>s.trim()).filter(Boolean)}}}); showAdmin.value=false; location.reload() }catch(e){err.value=e.message} }
</script>

<style>
.ab{position:fixed;right:18px;bottom:18px;z-index:1000;font-family:'Inter',system-ui,sans-serif}
.ab-side{display:flex;flex-direction:column;gap:8px;align-items:flex-end}
.ab-fab{width:46px;height:46px;border-radius:14px;border:1px solid rgba(201,168,76,.5);background:rgba(15,12,24,.92);color:#e8c766;font-size:20px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.5);transition:.15s}
.ab-fab:hover{transform:translateY(-2px);border-color:#e8c766}
.ab-g{color:#c0152f;border-color:rgba(192,21,47,.6)}
.ab-x{color:#9b8fb0}
.ab-modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1001;padding:20px}
.ab-card{background:linear-gradient(160deg,#15101c,#1d1730);border:1px solid rgba(201,168,76,.4);border-radius:18px;padding:22px;width:340px;color:#ece8f5;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.ab-card.big{width:min(620px,92vw);max-height:86vh;overflow:auto}
.ab-card h3{font-family:'Cinzel',serif;color:#e8c766;margin-bottom:14px;font-size:17px}
.ab-card input,.ab-card textarea,.ab-card select{width:100%;padding:9px 11px;margin:6px 0;border-radius:9px;border:1px solid #2e2540;background:#0b0b0f;color:#ece8f5;font-size:14px;font-family:inherit}
.ab-card textarea{min-height:240px;resize:vertical;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.5}
.ab-card label{display:block;margin-top:10px;font-size:12px;color:#9b8fb0;text-transform:uppercase;letter-spacing:.06em}
.ab-act{display:flex;gap:10px;margin-top:14px}
.ab-btn{flex:1;padding:10px;border-radius:10px;border:1px solid #c0152f;background:linear-gradient(135deg,#c0152f,#9b1024);color:#fff;font-weight:700;cursor:pointer}
.ab-btn.g{flex:0 0 auto;border-color:#2e2540;background:transparent;color:#b9aecb}
.ab-btn:hover{filter:brightness(1.1)}
.ab-e{color:#ff9aa9;font-size:13px;margin:6px 0}
.ab-tabs{display:flex;gap:8px;margin-bottom:14px}
.ab-tabs button{padding:8px 14px;border-radius:10px;border:1px solid #2e2540;background:transparent;color:#b9aecb;cursor:pointer;font-weight:600}
.ab-tabs button.on{border-color:#e8c766;color:#e8c766;background:rgba(201,168,76,.12)}
.ab-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #2e2540}
.ab-row em{color:#e8c766;font-style:normal}
.ab-row select{width:auto;margin:0}
.ab-h{color:#837893;font-size:12px;margin-top:10px}
code{color:#e8c766}
</style>
