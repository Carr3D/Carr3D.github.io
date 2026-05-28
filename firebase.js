import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const _app = initializeApp({
  apiKey:            'AIzaSyCUNeg8VisxV8tysDF0hqZKIoZuezTXj8w',
  authDomain:        'carr3d-aacb2.firebaseapp.com',
  projectId:         'carr3d-aacb2',
  storageBucket:     'carr3d-aacb2.firebasestorage.app',
  messagingSenderId: '625649973013',
  appId:             '1:625649973013:web:cb7b31fcfd77a6a2441b1c',
});
const _db   = getFirestore(_app);
const _auth = getAuth(_app);
const _provider = new GoogleAuthProvider();

/* ── ESTADO USUARIO ── */
let _currentUser = null;

/* ── PAGINACIÓN COMENTARIOS ── */
const PAGE_SIZE = 5;
let _todosLosDocs = [];
let _mostrados    = [];

/* ── HELPERS ── */
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
function renderCom(docSnap){
  const d = docSnap.data();
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
  lote.forEach(docSnap=>{_mostrados.push(docSnap.id);_list.appendChild(renderCom(docSnap));});
  _empty.style.display='none';
  actualizarBotonMas();
}
window.cargarMasComentarios = mostrarSiguientes;

/* ── CARGAR COMENTARIOS ── */
const _list  = document.getElementById('com-list');
const _load  = document.getElementById('com-loading');
const _empty = document.getElementById('com-empty');

onSnapshot(
  query(collection(_db,'comentarios'), orderBy('ts','desc')),
  snap=>{
    _load.style.display='none';
    _list.innerHTML='';
    _mostrados=[];
    if(snap.empty){_empty.style.display='flex';actualizarBotonMas();return;}
    _todosLosDocs=snap.docs;
    mostrarSiguientes();
  },
  err=>{
    _load.style.display='none';
    _list.innerHTML='<p style="color:red;padding:1rem;">Error: '+err.code+' — '+err.message+'</p>';
    console.error('Firestore error:',err);
  }
);

/* ── ENVIAR COMENTARIO ── */
window.enviarComentario = async function(){
  if(!_currentUser){
    window.showToast('Inicia sesión con Google para comentar 🔑');
    return;
  }
  const nombre   = document.getElementById('com-nombre').value.trim();
  const texto    = document.getElementById('com-texto').value.trim();
  const avatar   = document.getElementById('com-avatar').value;
  const estrellas= parseInt(document.getElementById('com-estrellas').value)||0;

  if(!nombre){document.getElementById('com-nombre').focus();return;}
  if(nombre.length>30){window.showToast('El nombre es demasiado largo.');return;}
  if(!texto){document.getElementById('com-texto').focus();return;}
  if(texto.length>300){window.showToast('El comentario es demasiado largo.');return;}
  if(!estrellas){window.showToast('Por favor selecciona una valoración ⭐');return;}

  /* Comprobar límite de 1 comentario por día */
  const uid = _currentUser.uid;
  const userRef = doc(_db, 'usuarios', uid);
  const userSnap = await getDoc(userRef);
  if(userSnap.exists()){
    const lastTs = userSnap.data().lastComment;
    if(lastTs){
      const diffHours = (Date.now() - lastTs.toMillis()) / 3600000;
      if(diffHours < 24){
        const hRestantes = Math.ceil(24 - diffHours);
        window.showToast(`Ya comentaste hoy. Vuelve en ${hRestantes}h ⏳`);
        return;
      }
    }
  }

  const btn=document.getElementById('com-btn');
  btn.disabled=true; btn.textContent='Enviando…';
  try{
    await addDoc(collection(_db,'comentarios'),{
      nombre, texto, avatar, estrellas,
      uid,
      ts: serverTimestamp()
    });
    /* Actualizar timestamp en doc del usuario */
    await setDoc(userRef, { lastComment: serverTimestamp() }, { merge: true });

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
  btn.disabled=false; btn.textContent='Enviar comentario';
};

/* ══════════════════════════════
   AUTENTICACIÓN CON GOOGLE
══════════════════════════════ */

/* Login */
window.loginGoogle = async function(){
  try{
    await signInWithPopup(_auth, _provider);
  }catch(e){
    if(e.code !== 'auth/popup-closed-by-user'){
      window.showToast('Error al iniciar sesión. Inténtalo de nuevo.');
      console.error(e);
    }
  }
};

/* Logout */
window.logoutGoogle = async function(){
  await signOut(_auth);
  /* Limpiar carrito local al cerrar sesión */
  window._clearCartLocal && window._clearCartLocal();
};

/* Observer: actualiza la UI cuando cambia el estado de sesión */
onAuthStateChanged(_auth, async user => {
  _currentUser = user;
  actualizarUIAuth(user);
  if(user){
    await sincronizarCarrito(user.uid);
  } else {
    window._clearCartLocal && window._clearCartLocal();
  }
});

function actualizarUIAuth(user){
  const btnLogin  = document.getElementById('nav-login-btn');
  const userChip  = document.getElementById('nav-user-chip');
  const userAvatar= document.getElementById('nav-user-avatar');
  const userName  = document.getElementById('nav-user-name');
  const formWrap  = document.getElementById('com-form-wrap');
  const formLock  = document.getElementById('com-form-lock');

  if(user){
    /* Nav */
    if(btnLogin)  btnLogin.style.display  = 'none';
    if(userChip)  userChip.style.display  = 'flex';
    if(userAvatar) userAvatar.src = user.photoURL || '';
    if(userName)  userName.textContent    = user.displayName?.split(' ')[0] || 'Tú';
    /* Formulario comentarios: mostrar, ocultar candado */
    if(formWrap)  formWrap.style.display  = 'block';
    if(formLock)  formLock.style.display  = 'none';
    /* Prellenar nombre con el de Google */
    const nombreInput = document.getElementById('com-nombre');
    if(nombreInput && !nombreInput.value){
      nombreInput.value = (user.displayName||'').slice(0,30);
      document.getElementById('com-nombre-cnt').textContent = nombreInput.value.length;
    }
  } else {
    if(btnLogin)  btnLogin.style.display  = 'flex';
    if(userChip)  userChip.style.display  = 'none';
    if(formWrap)  formWrap.style.display  = 'none';
    if(formLock)  formLock.style.display  = 'flex';
  }
}

/* ══════════════════════════════
   CARRITO PERSISTENTE
══════════════════════════════ */

async function sincronizarCarrito(uid){
  try{
    const ref  = doc(_db, 'usuarios', uid);
    const snap = await getDoc(ref);
    if(snap.exists() && snap.data().carrito){
      const items = snap.data().carrito;
      window._loadCartFromFirestore && window._loadCartFromFirestore(items);
    }
  }catch(e){
    console.error('Error cargando carrito:', e);
  }
}

window._guardarCarritoEnFirestore = async function(items){
  if(!_currentUser) return;
  try{
    await setDoc(
      doc(_db,'usuarios',_currentUser.uid),
      { carrito: items },
      { merge: true }
    );
  }catch(e){
    console.error('Error guardando carrito:', e);
  }
};