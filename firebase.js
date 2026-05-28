import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const _app = initializeApp({
  apiKey:            'AIzaSyCUNeg8VisxV8tysDF0hqZKIoZuezTXj8w',
  authDomain:        'carr3d-aacb2.firebaseapp.com',
  projectId:         'carr3d-aacb2',
  storageBucket:     'carr3d-aacb2.firebasestorage.app',
  messagingSenderId: '625649973013',
  appId:             '1:625649973013:web:cb7b31fcfd77a6a2441b1c',
});
const _db = getFirestore(_app);

const PAGE_SIZE = 5;
let _todosLosDocs = [];
let _mostrados    = [];

function escapeHTML(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function timeAgo(ts){
  if(!ts) return '';
  const d = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if(d < 60)      return 'ahora mismo';
  if(d < 3600)    return Math.floor(d/60) + ' min';
  if(d < 86400)   return Math.floor(d/3600) + ' h';
  if(d < 2592000) return Math.floor(d/86400) + ' d';
  return new Date(ts.toMillis()).toLocaleDateString('es-ES',{day:'numeric',month:'short'});
}
function starsHTML(n){
  let s='';
  for(let i=1;i<=5;i++) s+=`<span class="${i<=n?'s-on':'s-off'}">★</span>`;
  return `<div class="com-card-stars">${s}</div>`;
}
function renderCom(doc){
  const d = doc.data();
  const div = document.createElement('div');
  div.className = 'com-card';
  div.innerHTML = `
    <div class="com-card-avatar">${d.avatar||'😊'}</div>
    <div class="com-card-body">
      <div class="com-card-header">
        <span class="com-card-nombre">${escapeHTML(d.nombre)}</span>
        <span class="com-card-fecha">${timeAgo(d.ts)}</span>
      </div>
      ${d.estrellas ? starsHTML(d.estrellas) : ''}
      <p class="com-card-texto">${escapeHTML(d.texto)}</p>
    </div>`;
  return div;
}

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function actualizarBotonMas(){
  const wrap=document.getElementById('com-load-more-wrap');
  const restantes=_todosLosDocs.filter(d=>!_mostrados.includes(d.id)).length;
  if(wrap) wrap.style.display=restantes>0?'block':'none';
}
function mostrarSiguientes(){
  const _list=document.getElementById('com-list');
  const _empty=document.getElementById('com-empty');
  const pendientes=_todosLosDocs.filter(d=>!_mostrados.includes(d.id));
  if(!pendientes.length){actualizarBotonMas();return;}
  const lote=shuffle(pendientes).slice(0,PAGE_SIZE);
  lote.forEach(doc=>{_mostrados.push(doc.id);_list.appendChild(renderCom(doc));});
  _empty.style.display='none';
  actualizarBotonMas();
}

window.cargarMasComentarios = mostrarSiguientes;

const _list  = document.getElementById('com-list');
const _load  = document.getElementById('com-loading');
const _empty = document.getElementById('com-empty');

onSnapshot(query(collection(_db,'comentarios'),orderBy('ts','desc')),snap=>{
  _load.style.display='none';
  _list.innerHTML='';
  _mostrados=[];
  if(snap.empty){_empty.style.display='flex';actualizarBotonMas();return;}
  _todosLosDocs=snap.docs;
  mostrarSiguientes();
},err=>{
  _load.style.display='none';
  _list.innerHTML='<p style="color:red;padding:1rem;">Error: '+err.code+' — '+err.message+'</p>';
  console.error('Firestore error:',err);
});

window.enviarComentario=async function(){
  const nombre=document.getElementById('com-nombre').value.trim();
  const texto=document.getElementById('com-texto').value.trim();
  const avatar=document.getElementById('com-avatar').value;
  const estrellas=parseInt(document.getElementById('com-estrellas').value)||0;
  if(!nombre){document.getElementById('com-nombre').focus();return;}
  if(nombre.length>30){window.showToast('El nombre es demasiado largo.');return;}
  if(!texto){document.getElementById('com-texto').focus();return;}
  if(texto.length>300){window.showToast('El comentario es demasiado largo.');return;}
  if(!estrellas){window.showToast('Por favor selecciona una valoración ⭐');return;}
  const btn=document.getElementById('com-btn');
  btn.disabled=true;btn.textContent='Enviando…';
  try{
    await addDoc(collection(_db,'comentarios'),{nombre,texto,avatar,estrellas,ts:serverTimestamp()});
    document.getElementById('com-nombre').value='';
    document.getElementById('com-texto').value='';
    document.getElementById('com-nombre-cnt').textContent='0';
    document.getElementById('com-texto-cnt').textContent='0';
    document.getElementById('com-estrellas').value='0';
    document.querySelectorAll('.com-star').forEach(s=>s.classList.remove('active'));
    window.showToast('¡Comentario publicado! 💬');
  }catch(e){
    window.showToast('Error al enviar. Inténtalo de nuevo.');
    console.error(e);
  }
  btn.disabled=false;btn.textContent='Enviar comentario';
};