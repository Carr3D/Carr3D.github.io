import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc, deleteDoc, getDocs }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
// Storage no usado (imágenes por URL)

const _app = initializeApp({
  apiKey:            'AIzaSyCUNeg8VisxV8tysDF0hqZKIoZuezTXj8w',
  authDomain:        'carr3d-aacb2.firebaseapp.com',
  projectId:         'carr3d-aacb2',
  storageBucket:     'carr3d-aacb2.firebasestorage.app',
  messagingSenderId: '625649973013',
  appId:             '1:625649973013:web:cb7b31fcfd77a6a2441b1c',
});
const _db   = getFirestore(_app);
const _auth    = getAuth(_app);
// const _storage = getStorage(_app); // no usado


const _provider = new GoogleAuthProvider();

/* Procesar resultado del redirect al volver de Google */
getRedirectResult(_auth).then(result => {
  if(result && result.user){
    console.log('Login por redirect OK:', result.user.displayName);
  }
}).catch(e => {
  if(e && e.code !== 'auth/no-current-user'){
    console.error('Redirect result error:', e);
    window.showToast && window.showToast('Error al iniciar sesión. Inténtalo de nuevo.');
  }
});

/* ── ESTADO USUARIO ── */
let _currentUser = null;
let _adminUids = [];

async function cargarAdmins(){
  try{
    const snap = await getDoc(doc(_db,"config","admins"));
    if(snap.exists()) _adminUids = snap.data().uids || [];
  }catch(e){ console.error("Error cargando admins:",e); }
}
cargarAdmins();

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
  const esAdmin = d.uid && _adminUids.includes(d.uid);
  const esYoAdmin = _currentUser && _adminUids.includes(_currentUser.uid);
  const fotoUrl = d.photoURL || '';
  const inicial = (d.nombre||'?')[0].toUpperCase();
  const fotoHtml = fotoUrl
    ? `<img src="${fotoUrl}" alt="${escapeHTML(d.nombre)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;font-weight:800;font-size:1.1rem;align-items:center;justify-content:center;">${inicial}</span>`
    : `<span style="display:flex;width:44px;height:44px;border-radius:50%;background:var(--accent);color:#fff;font-weight:800;font-size:1.1rem;align-items:center;justify-content:center;">${inicial}</span>`;
  const avatarContent = esAdmin
    ? `${fotoHtml}<span class="com-crown">👑</span>`
    : fotoHtml;
  const nombreBadge = esAdmin
    ? `<span class="com-admin-badge">Admin</span>`
    : '';
  const btnEliminar = esYoAdmin
    ? `<button class="com-delete-btn" title="Eliminar comentario" onclick="eliminarComentario('${docSnap.id}',this)">🗑️</button>`
    : '';
  const div = document.createElement('div');
  div.className = 'com-card' + (esAdmin ? ' com-card-admin' : '');
  div.setAttribute('data-com-id', docSnap.id);
  div.innerHTML = `
    <div class="com-card-avatar${esAdmin ? ' com-avatar-admin' : ''}">${avatarContent}</div>
    <div class="com-card-body">
      <div class="com-card-header">
        <span class="com-card-nombre">${escapeHTML(d.nombre)}${nombreBadge}</span>
        <span class="com-card-fecha">${timeAgo(d.ts)}</span>
        ${btnEliminar}
      </div>
      ${d.estrellas ? starsHTML(d.estrellas) : ''}
      <p class="com-card-texto">${escapeHTML(d.texto)}</p>
      <button class="com-replies-toggle" onclick="toggleReplies('${docSnap.id}',this)" style="display:none;">
        💬 <span class="replies-count-label">Responder</span>
      </button>
      <div class="com-replies-area" style="display:none;"></div>
    </div>`;
  // Cargar conteo de respuestas en segundo plano
  contarRespuestas(docSnap.id, div.querySelector('.replies-count-label'));
  return div;
}

/* ── Contar respuestas (sin suscripción) ── */
async function contarRespuestas(comId, labelEl){
  try{
    const snap = await getDocs(collection(_db,'comentarios',comId,'respuestas'));
    const n = snap.size;
    if(labelEl){
      labelEl.textContent = n > 0 ? `${n} respuesta${n===1?'':'s'}` : 'Responder';
      // Mostrar el botón ahora que sabemos el conteo
      const btn = labelEl.closest('.com-replies-toggle');
      if(btn) btn.style.display = '';
    }
  }catch(e){
    // Si falla, mostrar igual con texto "Responder"
    if(labelEl){
      labelEl.textContent = 'Responder';
      const btn = labelEl.closest('.com-replies-toggle');
      if(btn) btn.style.display = '';
    }
  }
}

/* ── Toggle panel de respuestas ── */
const _repliesCache = {}; // cache por comentario
window.toggleReplies = async function(comId, btn){
  const card   = btn.closest('.com-card');
  const area   = card.querySelector('.com-replies-area');
  const label  = btn.querySelector('.replies-count-label');
  const open   = area.style.display === 'none';
  area.style.display = open ? 'block' : 'none';
  if(!open) return;
  area.innerHTML = '<p style="font-size:.8rem;color:var(--text3);padding:.5rem 0;">Cargando…</p>';
  await cargarRespuestas(comId, area, label);
};

const REPLY_PAGE = 5;

async function cargarRespuestas(comId, area, label){
  try{
    const snap = await getDocs(
      query(collection(_db,'comentarios',comId,'respuestas'), orderBy('ts','asc'))
    );
    const todas = snap.docs;
    const n = todas.length;
    if(label) label.textContent = n > 0 ? `${n} respuesta${n===1?'':'s'}` : 'Responder';
    _repliesCache[comId] = todas;
    renderReplies(comId, area, 0);
  }catch(e){
    area.innerHTML='<p style="color:red;font-size:.8rem;">Error cargando respuestas.</p>';
  }
}

function renderReplies(comId, area, desde){
  const todas = _repliesCache[comId] || [];
  const esYoAdmin = _currentUser && _adminUids.includes(_currentUser.uid);

  const adminReplies = todas.filter(r => _adminUids.includes(r.data().uid));
  const otherReplies = todas.filter(r => !_adminUids.includes(r.data().uid));
  const ordenadas    = [...adminReplies, ...otherReplies];

  const lote   = ordenadas.slice(desde, desde + REPLY_PAGE);
  const quedan = ordenadas.length - desde - lote.length;

  area.querySelectorAll('.com-reply, .com-replies-more').forEach(el=>el.remove());

  const formEl = area.querySelector('.com-reply-form');

  lote.forEach(r => {
    const rd = r.data();
    const isAdmin = _adminUids.includes(rd.uid);
    const foto = rd.photoURL || '';
    const inicial = (rd.nombre||'?')[0].toUpperCase();

    const div = document.createElement('div');
    div.className = 'com-reply' + (isAdmin ? ' reply-admin' : '');
    div.setAttribute('data-reply-id', r.id);

    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'com-reply-avatar';
    if(foto){
      const img = document.createElement('img');
      img.src = foto;
      img.onerror = () => { avatarDiv.textContent = inicial; };
      avatarDiv.appendChild(img);
    } else {
      avatarDiv.textContent = inicial;
    }

    // Body
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'com-reply-body';

    const header = document.createElement('div');
    header.className = 'com-reply-header';
    header.innerHTML = '<span class="com-reply-nombre">' + escapeHTML(rd.nombre||'?') + '</span>'
      + (isAdmin ? '<span class="com-reply-admin-badge">Admin</span>' : '')
      + '<span class="com-reply-fecha">' + timeAgo(rd.ts) + '</span>';

    const texto = document.createElement('p');
    texto.className = 'com-reply-texto';
    texto.textContent = rd.texto || '';

    bodyDiv.appendChild(header);
    bodyDiv.appendChild(texto);
    div.appendChild(avatarDiv);
    div.appendChild(bodyDiv);

    // Botón eliminar (solo admin)
    if(esYoAdmin){
      const delBtn = document.createElement('button');
      delBtn.className = 'com-reply-del';
      delBtn.title = 'Eliminar';
      delBtn.textContent = '🗑️';
      delBtn.onclick = () => eliminarRespuesta(comId, r.id, delBtn);
      div.appendChild(delBtn);
    }

    if(formEl) area.insertBefore(div, formEl);
    else area.appendChild(div);
  });

  if(quedan > 0){
    const more = document.createElement('button');
    more.className = 'com-replies-more';
    more.textContent = 'Ver ' + Math.min(quedan, REPLY_PAGE) + ' más…';
    more.onclick = () => renderReplies(comId, area, desde + REPLY_PAGE);
    if(formEl) area.insertBefore(more, formEl);
    else area.appendChild(more);
  }

  if(!area.querySelector('.com-reply-form')){
    if(_currentUser){
      const form = document.createElement('div');
      form.className = 'com-reply-form';
      const ta = document.createElement('textarea');
      ta.className = 'com-reply-input';
      ta.placeholder = 'Escribe una respuesta…';
      ta.maxLength = 300;
      ta.rows = 1;
      ta.oninput = function(){ this.style.height='auto'; this.style.height=this.scrollHeight+'px'; };
      const sendBtn = document.createElement('button');
      sendBtn.className = 'com-reply-send';
      sendBtn.textContent = 'Enviar';
      sendBtn.onclick = () => enviarRespuesta(comId, sendBtn);
      form.appendChild(ta);
      form.appendChild(sendBtn);
      area.appendChild(form);
    } else {
      const lock = document.createElement('p');
      lock.style.cssText = 'font-size:.8rem;color:var(--text3);margin-top:.5rem;';
      lock.textContent = 'Inicia sesión para responder.';
      area.appendChild(lock);
    }
  }
}
window.enviarRespuesta = async function(comId, btn){
  if(!_currentUser){ window.showToast('Inicia sesión para responder 🔑'); return; }
  const form  = btn.closest('.com-reply-form');
  const input = form.querySelector('.com-reply-input');
  const texto = input.value.trim();
  if(!texto) return;
  btn.disabled = true; btn.textContent = '…';
  try{
    await addDoc(collection(_db,'comentarios',comId,'respuestas'),{
      texto,
      nombre:   _currentUser.displayName||'Usuario',
      photoURL: _currentUser.photoURL||'',
      uid:      _currentUser.uid,
      ts:       serverTimestamp(),
    });
    input.value = '';
    input.style.height = 'auto';
    // Recargar respuestas
    const area  = btn.closest('.com-replies-area');
    const card  = btn.closest('.com-card');
    const label = card.querySelector('.replies-count-label');
    await cargarRespuestas(comId, area, label);
    window.showToast('Respuesta enviada 💬');
  }catch(e){
    window.showToast('Error al enviar.');
    console.error(e);
  }
  btn.disabled = false; btn.textContent = 'Enviar';
};

window.eliminarRespuesta = async function(comId, replyId, btn){
  if(!_currentUser || !_adminUids.includes(_currentUser.uid)) return;
  if(!confirm('¿Eliminar esta respuesta?')) return;
  btn.disabled = true;
  try{
    await deleteDoc(doc(_db,'comentarios',comId,'respuestas',replyId));
    const area  = btn.closest('.com-replies-area');
    const card  = btn.closest('.com-card');
    const label = card.querySelector('.replies-count-label');
    await cargarRespuestas(comId, area, label);
    window.showToast('Respuesta eliminada 🗑️');
  }catch(e){
    window.showToast('Error al eliminar.');
    btn.disabled = false;
  }
};

window.eliminarComentario = async function(id, btn){
  if(!_currentUser || !_adminUids.includes(_currentUser.uid)) return;
  if(!confirm('¿Eliminar este comentario?')) return;
  btn.disabled = true;
  try{
    await deleteDoc(doc(_db, 'comentarios', id));
    window.showToast('Comentario eliminado 🗑️');
  }catch(e){
    window.showToast('Error al eliminar.');
    console.error(e);
    btn.disabled = false;
  }
};

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
  if(!esAdmin && texto.length>300){window.showToast('El comentario es demasiado largo.');return;}
  if(!estrellas){window.showToast('Por favor selecciona una valoración ⭐');return;}

  /* Comprobar límite de 1 comentario por día (no aplica a admins) */
  const uid = _currentUser.uid;
  const esAdmin = _adminUids.includes(uid);
  const userRef = doc(_db, 'usuarios', uid);
  if(!esAdmin){
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
  }

  const btn=document.getElementById('com-btn');
  btn.disabled=true; btn.textContent='Enviando…';
  try{
    const photoURL = _currentUser.photoURL || '';
    await addDoc(collection(_db,'comentarios'),{
      nombre, texto, estrellas,
      photoURL,
      uid,
      ts: serverTimestamp()
    });
    /* Actualizar timestamp en doc del usuario */
    await setDoc(userRef, { lastComment: serverTimestamp() }, { merge: true });

    document.getElementById('com-texto').value='';
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

/* Login — popup con fallback a redirect si el popup está bloqueado */
window.loginGoogle = function(){
  signInWithPopup(_auth, _provider).catch(function(e){
    if(e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user'){
      // Popup bloqueado → fallback a redirect
      signInWithRedirect(_auth, _provider).catch(function(e2){
        window.showToast('Error al iniciar sesión. Inténtalo de nuevo.');
        console.error(e2);
      });
    } else if(e.code !== 'auth/cancelled-popup-request'){
      window.showToast('Error al iniciar sesión. Inténtalo de nuevo.');
      console.error(e);
    }
  });
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
    /* Si es admin: quitar límite de caracteres en el textarea */
    const ta = document.getElementById('com-texto');
    const cnt = document.getElementById('com-texto-cnt');
    if(ta){
      if(_adminUids.includes(user.uid)){
        ta.removeAttribute('maxlength');
        if(cnt) cnt.parentElement.querySelector('span:last-child') && (cnt.parentElement.textContent='');
      } else {
        ta.setAttribute('maxlength','300');
      }
    }
    /* Formulario comentarios: mostrar, ocultar candado */
    if(formWrap)  formWrap.style.display  = 'block';
    /* Panel admin */
    const adminPanel = document.getElementById('admin-stock-panel');
    if(adminPanel) adminPanel.style.display = _adminUids.includes(user.uid) ? 'block' : 'none';
    const adminTempPanel = document.getElementById('admin-temporada-panel');
    if(adminTempPanel) adminTempPanel.style.display = _adminUids.includes(user.uid) ? 'block' : 'none';
    const adminPiggyPanel = document.getElementById('admin-piggy-panel');
    if(adminPiggyPanel) adminPiggyPanel.style.display = _adminUids.includes(user.uid) ? 'block' : 'none';
    const adminMetasPanel = document.getElementById('admin-metas-panel');
    if(adminMetasPanel) adminMetasPanel.style.display = _adminUids.includes(user.uid) ? 'block' : 'none';
    const adminWarn = document.getElementById('admin-warning');
    if(adminWarn) adminWarn.style.display = _adminUids.includes(user.uid) ? 'block' : 'none';
    if(formLock)  formLock.style.display  = 'none';
    /* Prellenar nombre con el de Google — campo oculto + display visual */
    const nombreInput   = document.getElementById('com-nombre');
    const nombreDisplay = document.getElementById('com-nombre-text');
    const nombreAvatar  = document.getElementById('com-nombre-avatar');
    const ofNombre      = document.getElementById('of-nombre');
    const ofNombreText  = document.getElementById('of-nombre-text');
    const ofNombreAvatar= document.getElementById('of-nombre-avatar');
    const displayName   = (user.displayName||'').slice(0,30);
    const photoURL      = user.photoURL || '';
    if(nombreInput)   nombreInput.value         = displayName;
    if(nombreDisplay) nombreDisplay.textContent  = displayName;
    if(nombreAvatar)  nombreAvatar.src           = photoURL;
    /* Guardar photoURL en campo oculto del formulario */
    const comAvatarHidden = document.getElementById('com-avatar');
    if(comAvatarHidden) comAvatarHidden.value = photoURL;
    if(ofNombre)      ofNombre.value             = displayName;
    if(ofNombreText)  ofNombreText.textContent   = displayName;
    if(ofNombreAvatar)ofNombreAvatar.src         = photoURL;
  } else {
    if(btnLogin)  btnLogin.style.display  = 'flex';
    if(userChip)  userChip.style.display  = 'none';
    if(formWrap)  formWrap.style.display  = 'none';
    const adminPanelHide = document.getElementById('admin-stock-panel');
    if(adminPanelHide) adminPanelHide.style.display = 'none';
    const adminTempPanelHide = document.getElementById('admin-temporada-panel');
    if(adminTempPanelHide) adminTempPanelHide.style.display = 'none';
    const adminPiggyHide = document.getElementById('admin-piggy-panel');
    if(adminPiggyHide) adminPiggyHide.style.display = 'none';
    const adminMetasHide = document.getElementById('admin-metas-panel');
    if(adminMetasHide) adminMetasHide.style.display = 'none';
    const adminWarnHide = document.getElementById('admin-warning');
    if(adminWarnHide) adminWarnHide.style.display = 'none';
    if(formLock)  formLock.style.display  = 'flex';
  }
}

/* ══════════════════════════════
   PANEL ADMIN — TEMPORADA
══════════════════════════════ */

let _productosTemporada = [];

function iniciarEscuchaTemporada(){
  onSnapshot(
    query(collection(_db,'productos_temporada'), orderBy('nombre','asc')),
    snap => {
      _productosTemporada = snap.docs.map(d=>({id:d.id,...d.data()}));
      renderTemporadaWeb();
      if(_currentUser && _adminUids.includes(_currentUser.uid)){
        renderAdminTemporadaList();
      }
    },
    err => console.error('Error temporada:', err)
  );
}
iniciarEscuchaTemporada();

function renderTemporadaWeb(){
  const sfw = document.getElementById('season-featured-wrap');
  const ssm = document.getElementById('season-smalls');
  if(!sfw || !ssm) return;

  // Quitar solo los de Firestore
  sfw.querySelectorAll('[data-source="firestore"]').forEach(el=>el.remove());
  ssm.querySelectorAll('[data-source="firestore"]').forEach(el=>el.remove());

  const principal   = _productosTemporada.filter(p=>p.seccion==='temporada-principal');
  const secundarios = _productosTemporada.filter(p=>p.seccion==='temporada-secundaria');

  principal.forEach(p=>{
    const div = document.createElement('div');
    div.setAttribute('data-source','firestore');
    div.className='season-featured';
    const imgBlock = p.imgUrl
      ? `<img src="${p.imgUrl}" alt="${p.nombre||''}" style="width:100%;height:100%;object-fit:cover;">`
      : `<div style="width:100%;height:100%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:3rem;">📦</div>`;
    div.innerHTML=`
      <div class="season-feat-img">${imgBlock}</div>
      <div class="season-feat-info">
        <span class="season-tag">Edición limitada · ${(p.materiales||['PLA']).join(' · ')}</span>
        <h3 class="season-feat-title">${p.nombre||''}</h3>
        <p class="season-feat-desc">${p.descripcion||''}</p>
        <div class="season-feat-price">${p.precio||''}</div>
        <button class="btn-filled" onclick="addToCartFirestoreTemp('${p.id}')">Añadir al carrito</button>
      </div>`;
    sfw.appendChild(div);
  });

  secundarios.forEach(p=>{
    const div = document.createElement('div');
    div.setAttribute('data-source','firestore');
    div.className='product-card season-small-item';
    div.setAttribute('data-cat', p.categoria||'');
    div.setAttribute('data-precio', parseFloat((p.precio||'0').replace(/[^0-9.,]/g,'').replace(',','.'))||0);
    div.innerHTML=`
      ${p.destacado ? badgeHTML(p.destacado) : ''}
      <div class="card-img" style="background:var(--bg3)">
        ${p.imgUrl?`<img src="${p.imgUrl}" alt="${p.nombre||''}" style="width:100%;height:100%;object-fit:cover;">`:''}
        <div class="card-overlay">
          <button class="view-btn" onclick="abrirModalFirestoreTemp('${p.id}')">Ver</button>
          <button class="add-btn" onclick="addToCartFirestoreTemp('${p.id}')">+ Carrito</button>
        </div>
      </div>
      <div class="card-info">
        ${p.categoria?`<div class="card-categoria">${p.categoria}</div>`:''}
        <div class="card-name">${p.nombre||''}</div>
        <div class="card-meta">
          <span class="card-price">${p.precio||''}</span>
          <span class="card-mat-pill">${(p.materiales||['PLA']).join(' · ')}</span>
        </div>
      </div>`;
    ssm.appendChild(div);
  });
}

window.addToCartFirestoreTemp = function(id){
  const p = _productosTemporada.find(x=>x.id===id);
  if(!p) return;
  const precio = parseFloat((p.precio||'0').replace(/[^0-9.,]/g,'').replace(',','.'))||0;
  const ex = cartItems.find(i=>i.name===p.nombre);
  if(ex){ex.qty++;}else{cartItems.push({name:p.nombre,price:precio,img:p.imgUrl||'',svg:'',descuentoEscalonado:null,qty:1});}
  updateBadge();
  window.showToast((p.nombre||'Producto')+' añadido 🎉');
  window._guardarCarritoEnFirestore && window._guardarCarritoEnFirestore(cartItems);
};

window.abrirModalFirestoreTemp = function(id){
  const p = _productosTemporada.find(x=>x.id===id);
  if(!p) return;
  const overlay = document.getElementById('modal-overlay');
  const imgEl = document.getElementById('modal-img-tag');
  const phEl  = document.getElementById('modal-img-ph');
  if(p.imgUrl){
    imgEl.src=p.imgUrl; imgEl.style.display='block'; phEl.style.display='none';
    imgEl.onerror=()=>{imgEl.style.display='none';phEl.style.display='flex';};
  } else {
    imgEl.style.display='none'; phEl.style.display='flex';
  }
  document.getElementById('modal-kicker').textContent=(p.materiales||['PLA']).join(' · ');
  document.getElementById('modal-title').textContent=p.nombre||'';
  document.getElementById('modal-price').textContent=p.precio||'';
  document.getElementById('modal-desc').textContent=p.descripcion||'';
  const specsEl=document.getElementById('modal-specs'); specsEl.innerHTML='';
  [['Material',(p.materiales||[]).join(' · ')],['Peso',p.peso],['Tiempo de producción',p.tiempoProduccion]]
    .forEach(s=>{if(s[1])specsEl.innerHTML+=`<div class="modal-spec"><span>${s[0]}</span><span>${s[1]}</span></div>`;});
  document.getElementById('modal-colors').innerHTML='';
  document.getElementById('modal-add-btn').onclick=()=>{addToCartFirestoreTemp(id);closeModal();};
  overlay.classList.add('open'); document.body.style.overflow='hidden';
};

/* ── Lista admin temporada ── */
function renderAdminTemporadaList(){
  const listP = document.getElementById('admin-temp-principal-list');
  const listS = document.getElementById('admin-temp-secundarios-list');
  if(!listP||!listS) return;

  const principales  = _productosTemporada.filter(p=>p.seccion==='temporada-principal');
  const secundarios  = _productosTemporada.filter(p=>p.seccion==='temporada-secundaria');

  [listP, listS].forEach(l=>l.innerHTML='');

  const buildRow = (p) => {
    const div = document.createElement('div');
    div.className='admin-prod-row';
    div.innerHTML=`
      ${p.imgUrl?`<img src="${p.imgUrl}" alt="${p.nombre}">`:'<div style="width:38px;height:38px;background:var(--bg3);border-radius:.4rem;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📦</div>'}
      <div class="admin-prod-row-info">
        <div class="admin-prod-row-name">${p.nombre||'—'}</div>
        <div class="admin-prod-row-meta">${p.precio||''} · ${p.seccion}</div>
      </div>
      <div class="admin-prod-row-btns">
        <button onclick="abrirFormTemporada('${p.seccion}','${p.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="eliminarProductoTemporada('${p.id}','${(p.imgStoragePath||'').replace(/'/g,"\'")}')">🗑️</button>
      </div>`;
    return div;
  };

  if(!principales.length) listP.innerHTML='<p style="color:var(--text3);font-size:.82rem;">Sin producto principal.</p>';
  else principales.forEach(p=>listP.appendChild(buildRow(p)));

  if(!secundarios.length) listS.innerHTML='<p style="color:var(--text3);font-size:.82rem;">Sin productos secundarios.</p>';
  else secundarios.forEach(p=>listS.appendChild(buildRow(p)));
}

window.toggleAdminTemporadaPanel = function(){
  const body  = document.getElementById('admin-temporada-body');
  const arrow = document.getElementById('admin-temporada-arrow');
  const open  = body.style.display==='none';
  body.style.display = open?'block':'none';
  arrow.textContent  = open?'▲ Cerrar':'▼ Expandir';
  if(open) renderAdminTemporadaList();
};

window.abrirFormTemporada = function(seccion, id){
  const overlay = document.getElementById('admin-temp-overlay');
  document.getElementById('at-error').style.display='none';
  document.getElementById('at-upload-wrap').style.display='none';
  document.getElementById('at-img-preview').style.display='none';
  document.getElementById('at-img-file').value='';
  document.getElementById('at-seccion').value=seccion;

  if(id){
    const p=_productosTemporada.find(x=>x.id===id);
    if(!p) return;
    document.getElementById('at-form-title').textContent='Editar producto de temporada';
    document.getElementById('at-doc-id').value=id;
    document.getElementById('at-nombre').value=p.nombre||'';
    document.getElementById('at-precio').value=p.precio||'';
    document.getElementById('at-categoria').value=p.categoria||'';
    document.getElementById('at-material').value=(p.materiales||[]).join(', ');
    document.getElementById('at-peso').value=p.peso||'';
    document.getElementById('at-tiempo').value=p.tiempoProduccion||'';
    document.getElementById('at-desc').value=p.descripcion||'';
    document.getElementById('at-img-url').value=p.imgUrl||'';
    const atDest = document.getElementById('at-destacado');
    if(atDest) atDest.value = p.destacado||'';
    const atUrlInput = document.getElementById('at-img-file-url');
    if(atUrlInput) atUrlInput.value = p.imgUrl||'';
    if(p.imgUrl){
      document.getElementById('at-img-tag').src=p.imgUrl;
      document.getElementById('at-img-preview').style.display='block';
    }
  } else {
    document.getElementById('at-form-title').textContent = seccion==='temporada-principal'?'Añadir producto principal':'Añadir producto secundario';
    ['at-doc-id','at-nombre','at-precio','at-categoria','at-material','at-peso','at-tiempo','at-desc','at-img-url'].forEach(id=>document.getElementById(id).value='');
    const atDestReset = document.getElementById('at-destacado'); if(atDestReset) atDestReset.value='';
  }
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
};

window.cerrarFormTemporada = function(){
  document.getElementById('admin-temp-overlay').style.display='none';
  document.body.style.overflow='';
};

window.previsualizarImagenTemp = function(input){
  const url  = input.value.trim();
  const tag  = document.getElementById('at-img-tag');
  const prev = document.getElementById('at-img-preview');
  if(url){ tag.src = url; prev.style.display='block'; }
  else   { prev.style.display='none'; }
};

window.guardarProductoTemporada = async function(){
  const nombre    = document.getElementById('at-nombre').value.trim();
  const precio    = document.getElementById('at-precio').value.trim();
  const categoria = document.getElementById('at-categoria').value.trim();
  const material  = document.getElementById('at-material').value.trim();
  const peso      = document.getElementById('at-peso').value.trim();
  const tiempo    = document.getElementById('at-tiempo').value.trim();
  const desc      = document.getElementById('at-desc').value.trim();
  const docId     = document.getElementById('at-doc-id').value;
  const seccion   = document.getElementById('at-seccion').value;
  const fileInput = document.getElementById('at-img-file');
  const errEl     = document.getElementById('at-error');
  const saveBtn   = document.getElementById('at-save-btn');

  if(!nombre||!precio||!categoria){
    errEl.textContent='Nombre, precio y categoría son obligatorios.';
    errEl.style.display='block'; return;
  }
  errEl.style.display='none';
  saveBtn.disabled=true; saveBtn.textContent='Guardando…';

  try{
    const imgUrl = (document.getElementById('at-img-file-url')||{}).value?.trim()
                || document.getElementById('at-img-url').value||'';
    const imgStoragePath = '';

    const destacadoT = document.getElementById('at-destacado') ? document.getElementById('at-destacado').value || '' : '';
    const data={
      nombre, precio, categoria, seccion,
      materiales: material?material.split(',').map(s=>s.trim()).filter(Boolean):['PLA'],
      peso, tiempoProduccion:tiempo, descripcion:desc,
      imgUrl, imgStoragePath,
      destacado: destacadoT,
      updatedAt:serverTimestamp(),
    };

    if(docId){
      await setDoc(doc(_db,'productos_temporada',docId),data,{merge:true});
      window.showToast('Producto actualizado ✓');
    } else {
      data.createdAt=serverTimestamp();
      await addDoc(collection(_db,'productos_temporada'),data);
      window.showToast('Producto añadido ✓');
    }
    cerrarFormTemporada();
  }catch(e){
    errEl.textContent='Error: '+e.message;
    errEl.style.display='block';
    console.error(e);
  }
  saveBtn.disabled=false; saveBtn.textContent='Guardar';
};

window.eliminarProductoTemporada = async function(id, storagePath){
  if(!confirm('¿Eliminar este producto de temporada?')) return;
  try{
    await deleteDoc(doc(_db,'productos_temporada',id));
    window.showToast('Producto eliminado 🗑️');
  }catch(e){
    window.showToast('Error al eliminar.');
    console.error(e);
  }
};

/* ══════════════════════════════
   METAS CUMPLIDAS — FIRESTORE
══════════════════════════════ */

function iniciarEscuchaMetas(){
  onSnapshot(
    query(collection(_db,'metas_cumplidas'), orderBy('creadoEn','asc')),
    snap => {
      _metasFirestore = snap.docs.map(d=>({id:d.id,...d.data()}));
      renderMetas();
      if(_currentUser && _adminUids.includes(_currentUser.uid)){
        renderAdminMetasList();
      }
    },
    err => console.error('Error metas:', err)
  );
}
iniciarEscuchaMetas();

function renderAdminMetasList(){
  const list = document.getElementById('admin-metas-list');
  if(!list) return;
  if(!_metasFirestore.length){
    list.innerHTML='<p style="color:var(--text3);font-size:.85rem;text-align:center;padding:.5rem 0;">No hay metas en Firestore. Las del código siguen apareciendo.</p>';
    return;
  }
  list.innerHTML='';
  _metasFirestore.forEach(m=>{
    const div=document.createElement('div');
    div.className='admin-prod-row';
    div.innerHTML=`
      <div style="font-size:1.5rem;width:38px;text-align:center;flex-shrink:0;">${m.emoji||'🏆'}</div>
      <div class="admin-prod-row-info">
        <div class="admin-prod-row-name">${m.nombre||'—'}</div>
        <div class="admin-prod-row-meta">${m.importe||''} ${m.fecha?'· '+m.fecha:''}</div>
      </div>
      <div class="admin-prod-row-btns">
        <button onclick="abrirFormMeta('${m.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="eliminarMetaCumplida('${m.id}')">🗑️</button>
      </div>`;
    list.appendChild(div);
  });
}

window.toggleAdminMetasPanel = function(){
  const body  = document.getElementById('admin-metas-body');
  const arrow = document.getElementById('admin-metas-arrow');
  const open  = body.style.display==='none';
  body.style.display = open?'block':'none';
  arrow.textContent  = open?'▲ Cerrar':'▼ Expandir';
  if(open) renderAdminMetasList();
};

window.abrirFormMeta = function(id){
  const overlay = document.getElementById('admin-meta-overlay');
  document.getElementById('am-error').style.display='none';
  if(id){
    const m = _metasFirestore.find(x=>x.id===id);
    if(!m) return;
    document.getElementById('am-form-title').textContent='Editar meta cumplida';
    document.getElementById('am-doc-id').value  = id;
    document.getElementById('am-emoji').value   = m.emoji||'🏆';
    document.getElementById('am-nombre').value  = m.nombre||'';
    document.getElementById('am-desc').value    = m.desc||'';
    document.getElementById('am-importe').value = m.importe||'';
    document.getElementById('am-fecha').value   = m.fecha||'';
  } else {
    document.getElementById('am-form-title').textContent='Añadir meta cumplida';
    ['am-doc-id','am-nombre','am-desc','am-importe','am-fecha'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('am-emoji').value='🏆';
  }
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
};

window.cerrarFormMeta = function(){
  document.getElementById('admin-meta-overlay').style.display='none';
  document.body.style.overflow='';
};

window.guardarMetaCumplida = async function(){
  const nombre  = document.getElementById('am-nombre').value.trim();
  const desc    = document.getElementById('am-desc').value.trim();
  const emoji   = document.getElementById('am-emoji').value.trim()||'🏆';
  const importe = document.getElementById('am-importe').value.trim();
  const fecha   = document.getElementById('am-fecha').value.trim();
  const docId   = document.getElementById('am-doc-id').value;
  const errEl   = document.getElementById('am-error');
  const saveBtn = document.getElementById('am-save-btn');

  if(!nombre||!desc){
    errEl.textContent='Nombre y descripción son obligatorios.';
    errEl.style.display='block'; return;
  }
  errEl.style.display='none';
  saveBtn.disabled=true; saveBtn.textContent='Guardando…';

  try{
    const data = { emoji, nombre, desc, importe, fecha, creadoEn: serverTimestamp() };
    if(docId){
      await setDoc(doc(_db,'metas_cumplidas',docId), data, {merge:true});
      window.showToast('Meta actualizada ✓');
    } else {
      await addDoc(collection(_db,'metas_cumplidas'), data);
      window.showToast('Meta añadida ✓');
    }
    cerrarFormMeta();
  }catch(e){
    errEl.textContent='Error: '+e.message;
    errEl.style.display='block';
    console.error(e);
  }
  saveBtn.disabled=false; saveBtn.textContent='Guardar';
};

window.eliminarMetaCumplida = async function(id){
  if(!confirm('¿Eliminar esta meta cumplida?')) return;
  try{
    await deleteDoc(doc(_db,'metas_cumplidas',id));
    window.showToast('Meta eliminada 🗑️');
  }catch(e){
    window.showToast('Error al eliminar.');
    console.error(e);
  }
};

/* ══════════════════════════════
   META DE RECAUDACIÓN — FIRESTORE
══════════════════════════════ */

async function cargarMeta(){
  try{
    const snap = await getDoc(doc(_db,'config','meta'));
    if(snap.exists()){
      const d = snap.data();
      piggyEarned  = d.earned  ?? piggyEarned;
      piggyGoal    = d.goal    ?? piggyGoal;
      piggyFilled  = Math.min(100, Math.round(piggyEarned / piggyGoal * 100));
      piggyCurrent = piggyEarned;
      renderPiggy();
      // Actualizar nombre y descripción si existen
      if(d.nombre){
        const el = document.getElementById('piggy-meta-nombre-label');
        if(el) el.textContent = d.nombre;
      }
      if(d.descripcion){
        const el = document.getElementById('piggy-desc-label');
        if(el) el.innerHTML = d.descripcion.replace(/\n/g,'<br>');
      }
    }
  }catch(e){ console.error('Error cargando meta:', e); }
}
cargarMeta();

window.toggleAdminPiggyPanel = function(){
  const body  = document.getElementById('admin-piggy-body');
  const arrow = document.getElementById('admin-piggy-arrow');
  const open  = body.style.display === 'none';
  body.style.display = open ? 'block' : 'none';
  arrow.textContent  = open ? '▲ Cerrar' : '▼ Expandir';
  if(open){
    document.getElementById('piggy-edit-earned').value = piggyEarned;
    document.getElementById('piggy-edit-goal').value   = piggyGoal;
    const nombreEl = document.getElementById('piggy-meta-nombre-label');
    if(nombreEl) document.getElementById('piggy-edit-nombre').value = nombreEl.textContent;
    const descEl = document.getElementById('piggy-desc-label');
    if(descEl) document.getElementById('piggy-edit-desc').value = descEl.innerText;
  }
};

window.guardarMetaAdmin = async function(){
  const earned = parseFloat(document.getElementById('piggy-edit-earned').value) || 0;
  const goal   = parseFloat(document.getElementById('piggy-edit-goal').value)   || 1;
  const nombre = document.getElementById('piggy-edit-nombre').value.trim();
  const desc   = document.getElementById('piggy-edit-desc').value.trim();
  const btn    = document.getElementById('piggy-save-btn');
  const ok     = document.getElementById('piggy-save-ok');

  btn.disabled = true; btn.textContent = 'Guardando…';
  try{
    await setDoc(doc(_db,'config','meta'), { earned, goal, nombre, descripcion: desc }, { merge: true });
    piggyEarned  = earned;
    piggyGoal    = goal;
    piggyFilled  = Math.min(100, Math.round(earned / goal * 100));
    piggyCurrent = earned;
    renderPiggy();
    if(nombre){
      const el = document.getElementById('piggy-meta-nombre-label');
      if(el) el.textContent = nombre;
    }
    if(desc){
      const el = document.getElementById('piggy-desc-label');
      if(el) el.innerHTML = desc.replace(/\n/g,'<br>');
    }
    ok.style.display = 'inline';
    setTimeout(()=>{ ok.style.display='none'; }, 2500);
  }catch(e){
    window.showToast('Error al guardar. Inténtalo de nuevo.');
    console.error(e);
  }
  btn.disabled = false; btn.textContent = 'Guardar cambios';
};

/* ══════════════════════════════
   CARRITO PERSISTENTE
══════════════════════════════ */

async function sincronizarCarrito(uid){
  try{
    const ref  = doc(_db, 'usuarios', uid);
    const snap = await getDoc(ref);
    if(snap.exists()){
      const d = snap.data();
      // Carrito
      if(d.carrito){
        window._loadCartFromFirestore && window._loadCartFromFirestore(d.carrito);
      }
      // Tema
      if(d.tema){
        const html = document.documentElement;
        const tb   = document.getElementById('theme-toggle');
        html.setAttribute('data-theme', d.tema);
        if(tb) tb.textContent = d.tema === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('carr3d-theme', d.tema);
      }
    }
  }catch(e){
    console.error('Error cargando datos usuario:', e);
  }
}

window._guardarTemaEnFirestore = async function(tema){
  if(!_currentUser) return;
  try{
    await setDoc(doc(_db,'usuarios',_currentUser.uid), { tema }, { merge: true });
  }catch(e){
    console.error('Error guardando tema:', e);
  }
};

/* ══════════════════════════════
   PANEL ADMIN — GESTIÓN DE STOCK
══════════════════════════════ */

let _productosFirestore = []; // cache local

/* Escuchar cambios en tiempo real en la colección productos */
function iniciarEscuchaProductos(){
  onSnapshot(
    query(collection(_db,'productos'), orderBy('nombre','asc')),
    snap => {
      _productosFirestore = snap.docs.map(d=>({id:d.id,...d.data()}));
      renderProductosWeb();
      if(_currentUser && _adminUids.includes(_currentUser.uid)){
        renderAdminProdList();
      }
    },
    err => console.error('Error productos:', err)
  );
}
iniciarEscuchaProductos();

/* Renderizar productos de Firestore en el grid de la web */
function renderProductosWeb(){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  // Quitar solo las tarjetas de Firestore (tienen data-source="firestore")
  grid.querySelectorAll('[data-source="firestore"]').forEach(el=>el.remove());
  _productosFirestore.forEach((p,i)=>{
    const img = p.imgUrl || '';
    const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg>`;
    const precio = p.precio||'€0.00';
    const nombre = p.nombre||'Producto';
    const imgHtml = img
      ? `<img src="${img}" alt="${nombre}" onerror="this.style.display='none'">`
      : `<div class="card-img-placeholder">${svg}</div>`;
    const div = document.createElement('div');
    div.className = 'product-card';
    div.setAttribute('data-source','firestore');
    div.setAttribute('data-cat', p.categoria||'');
    div.setAttribute('data-precio', parseFloat((precio).replace(/[^0-9.,]/g,'').replace(',','.'))||0);
    div.innerHTML = `
      ${p.destacado ? badgeHTML(p.destacado) : ''}
      <div class="card-img">${imgHtml}
        <div class="card-overlay">
          <button class="view-btn" onclick="abrirModalFirestore('${p.id}')">Ver detalles</button>
          <button class="add-btn" onclick="addToCartFirestore('${p.id}')">+ Carrito</button>
        </div>
      </div>
      <div class="card-info">
        ${p.categoria?`<div class="card-categoria">${p.categoria}</div>`:''}
        <div class="card-name">${nombre}</div>
        <div class="card-meta">
          <span class="card-price">${precio}</span>
          <span class="card-mat-pill">${(p.materiales||[]).join(' · ')||'PLA'}</span>
        </div>
      </div>`;
    grid.appendChild(div);
  });
  // Actualizar filtros con las nuevas categorías
  actualizarFiltroConFirestore();
}

function actualizarFiltroConFirestore(){
  const sel = document.getElementById('material-filter');
  if(!sel) return;
  const cats = new Set();
  // Categorías del script.js
  if(typeof PRODUCTOS !== 'undefined'){
    PRODUCTOS.filter(p=>p.seccion==='stock').forEach(p=>{if(p.categoria)cats.add(p.categoria);});
  }
  // Categorías de Firestore
  _productosFirestore.forEach(p=>{if(p.categoria)cats.add(p.categoria);});
  const current = sel.value;
  sel.innerHTML = '<option value="">Todas las categorías</option>';
  [...cats].sort().forEach(c=>{
    sel.innerHTML += `<option value="${c}"${c===current?' selected':''}>${c}</option>`;
  });
}

window.addToCartFirestore = function(id){
  const p = _productosFirestore.find(x=>x.id===id);
  if(!p) return;
  const precio = parseFloat((p.precio||'0').replace(/[^0-9.,]/g,'').replace(',','.'))||0;
  const ex = cartItems.find(i=>i.name===p.nombre);
  if(ex){ex.qty++;}else{cartItems.push({name:p.nombre,price:precio,img:p.imgUrl||'',svg:'',descuentoEscalonado:null,qty:1});}
  updateBadge();
  const b=document.getElementById('cart-badge');
  b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');
  setTimeout(()=>b.classList.remove('bump'),300);
  window.showToast((p.nombre||'Producto')+' añadido 🎉');
  window._guardarCarritoEnFirestore && window._guardarCarritoEnFirestore(cartItems);
};

window.abrirModalFirestore = function(id){
  const p = _productosFirestore.find(x=>x.id===id);
  if(!p) return;
  // Reutilizar modal existente
  const overlay = document.getElementById('modal-overlay');
  const imgEl = document.getElementById('modal-img-tag');
  const phEl  = document.getElementById('modal-img-ph');
  if(p.imgUrl){
    imgEl.src = p.imgUrl; imgEl.style.display='block'; phEl.style.display='none';
    imgEl.onerror=()=>{imgEl.style.display='none';phEl.style.display='flex';};
  } else {
    imgEl.style.display='none'; phEl.style.display='flex';
  }
  document.getElementById('modal-kicker').textContent = (p.materiales||['PLA']).join(' · ');
  document.getElementById('modal-title').textContent  = p.nombre||'';
  document.getElementById('modal-price').textContent  = p.precio||'';
  document.getElementById('modal-desc').textContent   = p.descripcion||'';
  const specsEl = document.getElementById('modal-specs'); specsEl.innerHTML='';
  [['Material',(p.materiales||[]).join(' · ')],['Peso',p.peso],['Tiempo de producción',p.tiempoProduccion]]
    .forEach(s=>{if(s[1])specsEl.innerHTML+=`<div class="modal-spec"><span>${s[0]}</span><span>${s[1]}</span></div>`;});
  document.getElementById('modal-colors').innerHTML='';
  document.getElementById('modal-add-btn').onclick=()=>{addToCartFirestore(id);closeModal();};
  overlay.classList.add('open'); document.body.style.overflow='hidden';
};

/* ── Lista admin ── */
function renderAdminProdList(){
  const list = document.getElementById('admin-prod-list');
  if(!list) return;
  if(!_productosFirestore.length){
    list.innerHTML='<p style="color:var(--text3);font-size:.85rem;text-align:center;padding:.5rem 0;">No hay productos. Añade el primero.</p>';
    return;
  }
  list.innerHTML='';
  _productosFirestore.forEach(p=>{
    const div = document.createElement('div');
    div.className='admin-prod-row';
    div.innerHTML=`
      ${p.imgUrl?`<img src="${p.imgUrl}" alt="${p.nombre}">`:'<div style="width:38px;height:38px;background:var(--bg3);border-radius:.4rem;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📦</div>'}
      <div class="admin-prod-row-info">
        <div class="admin-prod-row-name">${p.nombre||'—'}</div>
        <div class="admin-prod-row-meta">${p.precio||''} · ${p.categoria||''}</div>
      </div>
      <div class="admin-prod-row-btns">
        <button onclick="abrirFormAdmin('${p.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="eliminarProductoAdmin('${p.id}','${(p.imgStoragePath||'').replace(/'/g,"\'")}')">🗑️</button>
      </div>`;
    list.appendChild(div);
  });
}

/* ── Toggle panel ── */
window.toggleAdminPanel = function(){
  const body  = document.getElementById('admin-stock-body');
  const arrow = document.getElementById('admin-stock-arrow');
  const open  = body.style.display==='none';
  body.style.display  = open?'block':'none';
  arrow.textContent   = open?'▲ Cerrar':'▼ Expandir';
  if(open) renderAdminProdList();
};

/* ── Abrir formulario ── */
window.abrirFormAdmin = function(id){
  const overlay = document.getElementById('admin-prod-overlay');
  document.getElementById('af-error').style.display='none';
  document.getElementById('af-upload-wrap').style.display='none';
  document.getElementById('af-img-preview').style.display='none';
  document.getElementById('af-img-file').value='';

  if(id){
    const p = _productosFirestore.find(x=>x.id===id);
    if(!p) return;
    document.getElementById('admin-form-title').textContent = 'Editar producto';
    document.getElementById('af-doc-id').value    = id;
    document.getElementById('af-nombre').value    = p.nombre||'';
    document.getElementById('af-precio').value    = p.precio||'';
    document.getElementById('af-categoria').value = p.categoria||'';
    document.getElementById('af-material').value  = (p.materiales||[]).join(', ');
    document.getElementById('af-peso').value      = p.peso||'';
    document.getElementById('af-tiempo').value    = p.tiempoProduccion||'';
    document.getElementById('af-desc').value      = p.descripcion||'';
    document.getElementById('af-img-url').value   = p.imgUrl||'';
    document.getElementById('af-destacado').value = p.destacado||'';
    const afUrlInput = document.getElementById('af-img-file-url');
    if(afUrlInput) afUrlInput.value = p.imgUrl||'';
    if(p.imgUrl){
      document.getElementById('af-img-tag').src = p.imgUrl;
      document.getElementById('af-img-preview').style.display='block';
    }
  } else {
    document.getElementById('admin-form-title').textContent = 'Añadir producto';
    document.getElementById('af-doc-id').value='';
    document.getElementById('af-nombre').value='';
    document.getElementById('af-precio').value='';
    document.getElementById('af-categoria').value='';
    document.getElementById('af-material').value='';
    document.getElementById('af-peso').value='';
    document.getElementById('af-tiempo').value='';
    document.getElementById('af-desc').value='';
    document.getElementById('af-img-url').value='';
  }
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
};

window.cerrarFormAdmin = function(){
  document.getElementById('admin-prod-overlay').style.display='none';
  document.body.style.overflow='';
};

/* ── Previsualizar imagen ── */
window.previsualizarImagen = function(input){
  const url = input.value.trim();
  const tag  = document.getElementById('af-img-tag');
  const prev = document.getElementById('af-img-preview');
  if(url){ tag.src = url; prev.style.display='block'; }
  else   { prev.style.display='none'; }
};

/* ── Guardar producto ── */
window.guardarProductoAdmin = async function(){
  const nombre    = document.getElementById('af-nombre').value.trim();
  const precio    = document.getElementById('af-precio').value.trim();
  const categoria = document.getElementById('af-categoria').value.trim();
  const material  = document.getElementById('af-material').value.trim();
  const peso      = document.getElementById('af-peso').value.trim();
  const tiempo    = document.getElementById('af-tiempo').value.trim();
  const desc      = document.getElementById('af-desc').value.trim();
  const docId     = document.getElementById('af-doc-id').value;
  const fileInput = document.getElementById('af-img-file');
  const errEl     = document.getElementById('af-error');
  const saveBtn   = document.getElementById('af-save-btn');

  if(!nombre||!precio||!categoria){
    errEl.textContent='Nombre, precio y categoría son obligatorios.';
    errEl.style.display='block'; return;
  }
  errEl.style.display='none';
  saveBtn.disabled=true; saveBtn.textContent='Guardando…';

  try{
    const imgUrl = (document.getElementById('af-img-file-url')||{}).value?.trim()
                || document.getElementById('af-img-url').value||'';
    const imgStoragePath = '';

    const destacado = document.getElementById('af-destacado').value || '';
    const data = {
      nombre, precio, categoria,
      materiales: material ? material.split(',').map(s=>s.trim()).filter(Boolean) : ['PLA'],
      peso, tiempoProduccion: tiempo, descripcion: desc,
      imgUrl, imgStoragePath,
      destacado,
      seccion: 'stock',
      updatedAt: serverTimestamp(),
    };

    if(docId){
      await setDoc(doc(_db,'productos',docId), data, {merge:true});
      window.showToast('Producto actualizado ✓');
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(collection(_db,'productos'), data);
      window.showToast('Producto añadido ✓');
    }
    cerrarFormAdmin();
  }catch(e){
    errEl.textContent='Error: '+e.message;
    errEl.style.display='block';
    console.error(e);
  }
  saveBtn.disabled=false; saveBtn.textContent='Guardar';
};

/* ── Eliminar producto ── */
window.eliminarProductoAdmin = async function(id, storagePath){
  if(!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  try{
    await deleteDoc(doc(_db,'productos',id));
    window.showToast('Producto eliminado 🗑️');
  }catch(e){
    window.showToast('Error al eliminar.');
    console.error(e);
  }
};

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