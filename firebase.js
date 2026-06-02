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

async function cargarBloqueados(){
  try{
    const snap = await getDoc(doc(_db,'config','bloqueados'));
    if(snap.exists()) _blockedUids = snap.data().uids || [];
  }catch(e){ console.error('Error cargando bloqueados:',e); }
}
cargarBloqueados();

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
  const bloqueado = d.uid && _blockedUids.includes(d.uid);
  const btnEliminar = esYoAdmin && !esAdmin
    ? `<button class="com-delete-btn" title="Eliminar comentario" onclick="eliminarComentario('${docSnap.id}',this)">🗑️</button>`
    : '';
  const btnBloquear = esYoAdmin && !esAdmin && d.uid
    ? `<button class="com-block-btn" title="${bloqueado?'Desbloquear':'Bloquear'} usuario" onclick="toggleBloqueo('${d.uid}','${escapeHTML(d.nombre)}',this)">${bloqueado?'🔓':'🚫'}</button>`
    : '';
  const blockedBadge = bloqueado ? `<span class="com-blocked-badge">Bloqueado</span>` : '';
  const div = document.createElement('div');
  div.className = 'com-card' + (esAdmin ? ' com-card-admin' : '') + (bloqueado ? ' com-card-blocked' : '');
  div.setAttribute('data-com-id', docSnap.id);
  div.innerHTML = `
    <div class="com-card-avatar${esAdmin ? ' com-avatar-admin' : ''}">${avatarContent}</div>
    <div class="com-card-body">
      <div class="com-card-header">
        <span class="com-card-nombre">${escapeHTML(d.nombre)}${nombreBadge}${blockedBadge}</span>
        <span class="com-card-fecha">${timeAgo(d.ts)}</span>
        ${btnEliminar}${btnBloquear}
      </div>
      ${d.estrellas ? starsHTML(d.estrellas) : ''}
      <p class="com-card-texto">${escapeHTML(d.texto)}</p>
      <button class="com-replies-toggle" onclick="toggleReplies('${docSnap.id}',this)">
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
    if(labelEl && n > 0){
      labelEl.textContent = `${n} respuesta${n===1?'':'s'}`;
    }
  }catch(e){}
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
  if(_blockedUids.includes(_currentUser.uid)){ window.showToast('Tu cuenta ha sido bloqueada para comentar. 🚫'); return; }
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

window.toggleBloqueo = async function(uid, nombre, btn){
  if(!_currentUser || !_adminUids.includes(_currentUser.uid)) return;
  const estaBloqueado = _blockedUids.includes(uid);
  const accion = estaBloqueado ? 'desbloquear' : 'bloquear';
  if(!confirm(`¿${accion.charAt(0).toUpperCase()+accion.slice(1)} a ${nombre}?`)) return;

  if(estaBloqueado){
    _blockedUids = _blockedUids.filter(u=>u!==uid);
  } else {
    _blockedUids.push(uid);
  }

  try{
    await setDoc(doc(_db,'config','bloqueados'), { uids: _blockedUids }, { merge: false });
    window.showToast(estaBloqueado ? `${nombre} desbloqueado ✓` : `${nombre} bloqueado 🚫`);
    // Refrescar lista de comentarios
    const list = document.getElementById('com-list');
    if(list){
      list.innerHTML='';
      window._mostrados=[];
      window._todosLosDocs && mostrarSiguientes();
    }
  }catch(e){
    window.showToast('Error al '+ accion +'. Inténtalo de nuevo.');
    // Revertir
    if(estaBloqueado) _blockedUids.push(uid);
    else _blockedUids = _blockedUids.filter(u=>u!==uid);
    console.error(e);
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
  // Tomar nombre del usuario de Google directamente (el hidden puede estar vacío)
  const nombre   = (_currentUser.displayName||'').slice(0,30) ||
                   document.getElementById('com-nombre').value.trim();
  const texto    = document.getElementById('com-texto').value.trim();
  const estrellas= parseInt(document.getElementById('com-estrellas').value)||0;

  const uid    = _currentUser.uid;
  const esAdmin = _adminUids.includes(uid);

  if(_blockedUids.includes(uid)){
    window.showToast('Tu cuenta ha sido bloqueada para comentar. 🚫');
    return;
  }
  if(!nombre){ window.showToast('No se pudo obtener tu nombre. Recarga la página.'); return; }
  if(!texto){ document.getElementById('com-texto').focus(); return; }
  if(!esAdmin && texto.length>300){ window.showToast('El comentario es demasiado largo.'); return; }
  if(!estrellas){ window.showToast('Por favor selecciona una valoración ⭐'); return; }

  /* Comprobar límite de 1 comentario por día (no aplica a admins) */
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
    const navFavWrap = document.getElementById('nav-fav-wrap');
    if(navFavWrap) navFavWrap.style.display = 'flex';
    const adminPiggyPanel = document.getElementById('admin-piggy-panel');
    if(adminPiggyPanel) adminPiggyPanel.style.display = _adminUids.includes(user.uid) ? 'block' : 'none';
    const navStatsBtn = document.getElementById('nav-stats-btn');
    if(navStatsBtn) navStatsBtn.style.display = _adminUids.includes(user.uid) ? 'flex' : 'none';
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
    const navFavWrapHide = document.getElementById('nav-fav-wrap');
    if(navFavWrapHide) navFavWrapHide.style.display = 'none';
    _favs = []; actualizarUIFavs();
    const adminPiggyHide = document.getElementById('admin-piggy-panel');
    if(adminPiggyHide) adminPiggyHide.style.display = 'none';
    const navStatsBtnHide = document.getElementById('nav-stats-btn');
    if(navStatsBtnHide) navStatsBtnHide.style.display = 'none';
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
    const isFavT = _favs && _favs.some(f=>f.name===p.nombre);
    div.innerHTML=`
      ${p.destacado ? badgeHTML(p.destacado) : ''}
      <div class="card-img" style="background:var(--bg3)">
        ${p.imgUrl ? '<img src="'+p.imgUrl+'" alt="" style="width:100%;height:100%;object-fit:cover;">' : ''}
        <div class="card-overlay">
          <button class="view-btn" onclick="abrirModalFirestoreTemp('${p.id}')">Ver</button>
          <button class="add-btn" onclick="addToCartFirestoreTemp('${p.id}')">+ Carrito</button>
        </div>
        <button class="fav-btn${isFavT?' active':''}" onclick="event.stopPropagation();toggleFav({name:'${p.nombre.replace(/'/g,"\'")}',price:'${(p.precio||'').replace(/'/g,"\'")}',img:'${(p.imgUrl||'').replace(/'/g,"\'")}'})" title="Favorito">${isFavT?'❤️':'🤍'}</button>
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
  window._setModalFavKey && window._setModalFavKey(p.nombre||'');
  window._registrarVistaProducto && window._registrarVistaProducto(p.nombre||'');
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
   ESTADÍSTICAS ADMIN
══════════════════════════════ */

/* Registrar visita */
async function registrarVisita(){
  try{
    const hoy = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    const ref  = doc(_db,'stats','visitas');
    const snap = await getDoc(ref);
    if(snap.exists()){
      const d = snap.data();
      const visitasHoy = (d.dias && d.dias[hoy]) ? d.dias[hoy] + 1 : 1;
      await setDoc(ref,{
        total: (d.total||0) + 1,
        dias: { ...(d.dias||{}), [hoy]: visitasHoy }
      },{merge:true});
    } else {
      await setDoc(ref,{ total:1, dias:{ [hoy]:1 } });
    }
  }catch(e){ console.warn('Error visita:', e); }
}
registrarVisita();

window.abrirStatsPanel = async function(){
  const overlay = document.getElementById('stats-panel-overlay');
  overlay.style.display = 'block';
  setTimeout(()=> overlay.classList.add('sopen'), 10);
  document.body.style.overflow = 'hidden';
  await cargarStats();
};

window.cerrarStatsPanel = function(){
  const overlay = document.getElementById('stats-panel-overlay');
  overlay.classList.remove('sopen');
  setTimeout(()=>{ overlay.style.display='none'; }, 350);
  document.body.style.overflow = '';
};

async function cargarStats(){
  try{
    const hoy    = new Date().toISOString().slice(0,10);
    const ayer   = new Date(Date.now()-86400000).toISOString().slice(0,10);
    const lunes  = (() => {
      const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1);
      return d.toISOString().slice(0,10);
    })();

    // Visitas
    const vSnap = await getDoc(doc(_db,'stats','visitas'));
    if(vSnap.exists()){
      const vd = vSnap.data();
      document.getElementById('stat-visitas-hoy').textContent   = (vd.dias&&vd.dias[hoy])||0;
      document.getElementById('stat-visitas-total').textContent  = vd.total||0;
    }

    // Comentarios
    const comSnap = await getDocs(collection(_db,'comentarios'));
    const coms = comSnap.docs.map(d=>({...d.data(), id:d.id}));
    const comHoy    = coms.filter(c=>c.ts&&c.ts.toDate().toISOString().slice(0,10)===hoy).length;
    const comSemana = coms.filter(c=>c.ts&&c.ts.toDate().toISOString().slice(0,10)>=lunes).length;
    document.getElementById('stat-com-hoy').textContent    = comHoy;
    document.getElementById('stat-com-semana').textContent = comSemana;
    document.getElementById('stat-com-total').textContent  = coms.length;

    // Productos más vistos (desde stats/productos_vistos)
    const pvSnap = await getDoc(doc(_db,'stats','productos_vistos'));
    const pvEl = document.getElementById('stat-productos-vistos');
    if(pvSnap.exists()){
      const pvd = pvSnap.data();
      const sorted = Object.entries(pvd).sort((a,b)=>b[1]-a[1]).slice(0,5);
      pvEl.innerHTML = sorted.length
        ? sorted.map(([name,n],i)=>`<div class="stat-rank-item"><span style="color:var(--text3);margin-right:.4rem;font-size:.75rem;">${i+1}.</span><span class="stat-rank-name">${escapeHTML(name)}</span><span class="stat-rank-val">${n} visitas</span></div>`).join('')
        : '<p style="font-size:.82rem;color:var(--text3);">Sin datos aún.</p>';
    } else {
      pvEl.innerHTML = '<p style="font-size:.82rem;color:var(--text3);">Sin datos aún.</p>';
    }

    // Favoritos más guardados (contar en docs de usuarios)
    const usSnap = await getDocs(collection(_db,'usuarios'));
    const favCount = {};
    usSnap.docs.forEach(d=>{
      const favs = d.data().favs||[];
      favs.forEach(f=>{ favCount[f.name] = (favCount[f.name]||0)+1; });
    });
    const favEl = document.getElementById('stat-favs-top');
    const favSorted = Object.entries(favCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
    favEl.innerHTML = favSorted.length
      ? favSorted.map(([name,n],i)=>`<div class="stat-rank-item"><span style="color:var(--text3);margin-right:.4rem;font-size:.75rem;">${i+1}.</span><span class="stat-rank-name">${escapeHTML(name)}</span><span class="stat-rank-val">❤️ ${n}</span></div>`).join('')
      : '<p style="font-size:.82rem;color:var(--text3);">Sin favoritos aún.</p>';
    // Pasar conteo global al collage
    window._rebuildCollage && window._rebuildCollage(favCount);

  }catch(e){
    console.error('Error cargando stats:', e);
  }
}

/* Registrar vista de producto */
window._registrarVistaProducto = async function(nombre){
  try{
    const ref  = doc(_db,'stats','productos_vistos');
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    data[nombre] = (data[nombre]||0) + 1;
    await setDoc(ref, data);
  }catch(e){}
};

/* ══════════════════════════════
   FAVORITOS
══════════════════════════════ */

let _favs = []; // [{name, price, img}]
let _modalFavKey = ''; // clave del producto en el modal abierto

function favKey(item){ return item.name; }

async function cargarFavs(){
  if(!_currentUser) return;
  try{
    const snap = await getDoc(doc(_db,'usuarios',_currentUser.uid));
    if(snap.exists() && snap.data().favs){
      _favs = snap.data().favs;
      actualizarUIFavs();
    }
  }catch(e){ console.error('Error favs:', e); }
}

async function guardarFavs(){
  if(!_currentUser) return;
  try{
    await setDoc(doc(_db,'usuarios',_currentUser.uid), { favs: _favs }, { merge: true });
  }catch(e){ console.error('Error guardando favs:', e); }
}

function actualizarUIFavs(){
  const badge = document.getElementById('fav-badge');
  const wrap  = document.getElementById('nav-fav-wrap');
  const n = _favs.length;
  if(badge){ badge.textContent = n; badge.style.display = n > 0 ? 'flex' : 'none'; }
  if(wrap)  wrap.style.display = _currentUser ? 'flex' : 'none';
  // Reconstruir collage con conteo actualizado (solo del usuario actual, aproximación local)
  if(typeof buildCollage === 'function') buildCollage();
  // Actualizar botones de tarjetas
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const name = btn.dataset.favName;
    if(name) btn.textContent = _favs.some(f=>f.name===name) ? '❤️' : '🤍';
  });
  // Modal
  const modalFavBtn = document.getElementById('modal-fav-btn');
  if(modalFavBtn && _modalFavKey){
    const isF = _favs.some(f=>f.name===_modalFavKey);
    modalFavBtn.textContent = isF ? '❤️' : '🤍';
    modalFavBtn.classList.toggle('active', isF);
  }
  renderFavPanel();
}

window.toggleFav = async function(item){
  if(!_currentUser){ window.showToast('Inicia sesión para guardar favoritos 🔑'); return; }
  const idx = _favs.findIndex(f=>f.name===item.name);
  if(idx >= 0){ _favs.splice(idx,1); window.showToast('Eliminado de favoritos'); }
  else        { _favs.push(item);    window.showToast('¡Añadido a favoritos ❤️'); }
  actualizarUIFavs();
  await guardarFavs();
};

window.toggleFavModal = async function(){
  if(!_currentUser){ window.showToast('Inicia sesión para guardar favoritos 🔑'); return; }
  const btn   = document.getElementById('modal-fav-btn');
  const title = document.getElementById('modal-title').textContent;
  const price = document.getElementById('modal-price').textContent;
  const img   = document.getElementById('modal-img-tag').src || '';
  await window.toggleFav({name: title, price, img});
};

function renderFavPanel(){
  const container = document.getElementById('fav-items');
  if(!container) return;
  if(!_favs.length){
    container.innerHTML='<div class="cp-empty"><div class="cp-empty-icon">❤️</div><span>No tienes favoritos aún</span></div>';
    return;
  }
  container.innerHTML='';
  _favs.forEach((f,i) => {
    const div = document.createElement('div');
    div.className = 'fav-item';
    const thumb = f.img
      ? `<img src="${f.img}" alt="${escapeHTML(f.name)}" onerror="this.style.display='none'">`
      : '<span style="font-size:1.4rem;opacity:.4;">📦</span>';
    div.innerHTML = `
      <div class="fav-item-thumb">${thumb}</div>
      <div class="fav-item-info">
        <div class="fav-item-name">${escapeHTML(f.name)}</div>
        <div class="fav-item-price">${f.price||''}</div>
      </div>
      <button class="fav-item-del" onclick="quitarFav(${i})" title="Quitar">✕</button>`;
    container.appendChild(div);
  });
}

window.quitarFav = async function(i){
  _favs.splice(i,1);
  actualizarUIFavs();
  await guardarFavs();
};

window.openFavPanel = function(){
  renderFavPanel();
  document.getElementById('fav-panel-overlay').classList.add('open');
  document.body.style.overflow='hidden';
};
window.closeFavPanel = function(){
  document.getElementById('fav-panel-overlay').classList.remove('open');
  document.body.style.overflow='';
};

/* Exponer _modalFavKey para que openProduct lo actualice */
window._setModalFavKey = function(name){
  _modalFavKey = name;
  const btn = document.getElementById('modal-fav-btn');
  if(btn){
    const isF = _favs.some(f=>f.name===name);
    btn.textContent = isF ? '❤️' : '🤍';
    btn.classList.toggle('active', isF);
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
      // Favs
      if(d.favs){ _favs = d.favs; actualizarUIFavs(); }
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
/* ══════════════════════════════
   CONJUNTOS DE PRODUCTOS
══════════════════════════════ */

function iniciarEscuchaProductos(){
  onSnapshot(
    query(collection(_db,'conjuntos'), orderBy('nombre','asc')),
    snap => {
      _productosFirestore = snap.docs.map(d=>({id:d.id,...d.data()}));
      renderConjuntosWeb();
      if(_currentUser && _adminUids.includes(_currentUser.uid)){
        renderAdminProdList();
      }
    },
    err => console.error('Error conjuntos:', err)
  );
}
iniciarEscuchaProductos();

function renderConjuntosWeb(){
  const grid = document.getElementById('conjunto-grid');
  if(!grid) return;
  grid.innerHTML = '';
  _productosFirestore.forEach(c=>{
    const div = document.createElement('div');
    div.className = 'conjunto-card';
    div.setAttribute('data-source','firestore');
    const prods = c.productos || [];
    const imgHtml = c.imgUrl
      ? `<img src="${c.imgUrl}" alt="${escapeHTML(c.nombre||'')}">`
      : `<span style="font-size:3rem;">📦</span>`;
    div.innerHTML = `
      <div class="conjunto-card-img">${imgHtml}</div>
      <div class="conjunto-card-body">
        <div class="conjunto-card-nombre">${escapeHTML(c.nombre||'')}</div>
        <p class="conjunto-card-desc">${escapeHTML((c.descripcion||'').slice(0,80))}${(c.descripcion||'').length>80?'…':''}</p>
        <div class="conjunto-card-meta">
          <span class="conjunto-card-count">${prods.length} producto${prods.length===1?'':'s'}</span>
          <button class="conjunto-card-btn" onclick="event.stopPropagation();window.abrirConjunto&&window.abrirConjunto('${c.id}')">Ver conjunto →</button>
        </div>
      </div>`;
    div.onclick = (e) => { if(!e.target.closest('.conjunto-card-btn')) window.abrirConjunto&&window.abrirConjunto(c.id); };
    grid.appendChild(div);
  });
}

function renderAdminProdList(){
  const list = document.getElementById('admin-prod-list');
  if(!list) return;
  if(!_productosFirestore.length){
    list.innerHTML='<p style="color:var(--text3);font-size:.85rem;text-align:center;padding:.5rem 0;">No hay conjuntos. Añade el primero.</p>';
    return;
  }
  list.innerHTML='';
  _productosFirestore.forEach(c=>{
    const div = document.createElement('div');
    div.className='admin-prod-row';
    const nProds = (c.productos||[]).length;
    div.innerHTML=`
      ${c.imgUrl?`<img src="${c.imgUrl}" alt="${escapeHTML(c.nombre||'')}">`:'<div style="width:38px;height:38px;background:var(--bg3);border-radius:.4rem;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📦</div>'}
      <div class="admin-prod-row-info">
        <div class="admin-prod-row-name">${escapeHTML(c.nombre||'—')}</div>
        <div class="admin-prod-row-meta">${nProds} producto${nProds===1?'':'s'}</div>
      </div>
      <div class="admin-prod-row-btns">
        <button onclick="abrirFormConjunto('${c.id}')">✏️ Editar</button>
        <button class="btn-del" onclick="eliminarConjunto('${c.id}')">🗑️</button>
      </div>`;
    list.appendChild(div);
  });
}

window.toggleAdminPanel = function(){
  const body  = document.getElementById('admin-stock-body');
  const arrow = document.getElementById('admin-stock-arrow');
  const open  = body.style.display==='none';
  body.style.display  = open?'block':'none';
  arrow.textContent   = open?'▲ Cerrar':'▼ Expandir';
  if(open) renderAdminProdList();
};

/* ── Vista conjunto modal pantalla completa ── */
window.abrirConjunto = function(id){
  const c = _productosFirestore.find(x=>x.id===id);
  if(!c) return;
  const overlay  = document.getElementById('conjunto-overlay');
  const heroImg  = document.getElementById('conjunto-hero-img-tag');
  const heroIcon = heroImg ? heroImg.nextElementSibling : null;
  if(heroImg){
    if(c.imgUrl){ heroImg.src=c.imgUrl; heroImg.style.display='block'; if(heroIcon) heroIcon.style.display='none'; }
    else        { heroImg.style.display='none'; if(heroIcon) heroIcon.style.display='block'; }
  }
  document.getElementById('conjunto-title-header').textContent = c.nombre||'';
  document.getElementById('conjunto-nombre').textContent       = c.nombre||'';
  document.getElementById('conjunto-desc').textContent         = c.descripcion||'';
  const grid = document.getElementById('conjunto-prods-grid');
  grid.innerHTML = '';
  const prods = c.productos || [];
  if(!prods.length){
    grid.innerHTML = '<p style="color:var(--text3);">Este conjunto no tiene productos aún.</p>';
  } else {
    prods.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'product-card';
      const isFav = _favs && _favs.some(f=>f.name===p.nombre);
      const imgHtml = p.imgUrl
        ? `<img src="${p.imgUrl}" alt="${escapeHTML(p.nombre||'')}">`
        : `<div class="card-img-placeholder"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg></div>`;
      const pName = (p.nombre||'').replace(/'/g,"\'");
      const pPrice = (p.precio||'').replace(/'/g,"\'");
      const pImg = (p.imgUrl||'').replace(/'/g,"\'");
      card.innerHTML = `
        ${p.destacado ? badgeHTML(p.destacado) : ''}
        <div class="card-img">${imgHtml}
          <div class="card-overlay">
            <button class="view-btn" onclick="abrirModalProductoConjunto('${id}','${pName}')">Ver detalles</button>
            <button class="add-btn" onclick="addToCartConjuntoBtn(this)">+ Carrito</button>
          </div>
          <button class="fav-btn${isFav?' active':''}" onclick="event.stopPropagation();toggleFav({name:'${pName}',price:'${pPrice}',img:'${pImg}'})" title="Favorito">${isFav?'❤️':'🤍'}</button>
        </div>
        <div class="card-info">
          ${p.categoria?`<div class="card-categoria">${escapeHTML(p.categoria)}</div>`:''}
          <div class="card-name">${escapeHTML(p.nombre||'')}</div>
          <div class="card-meta">
            <span class="card-price">${escapeHTML(p.precio||'')}</span>
            <span class="card-mat-pill">${escapeHTML((p.materiales||['PLA']).join(' · '))}</span>
          </div>
        </div>`;
      // Guardar datos del producto en el botón add
      const addBtn = card.querySelector('.add-btn');
      addBtn._prodData = p;
      grid.appendChild(card);
    });
  }
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
  window._registrarVistaProducto && window._registrarVistaProducto(c.nombre||'');
};

window.cerrarConjunto = function(){
  document.getElementById('conjunto-overlay').classList.remove('open');
  document.body.style.overflow='';
};

window.addToCartConjuntoBtn = function(btn){
  const p = btn._prodData;
  if(!p) return;
  addToCartConjunto(p);
};

window.addToCartConjunto = function(p){
  const precio = parseFloat((p.precio||'0').replace(/[^0-9.,]/g,'').replace(',','.'))||0;
  const ex = cartItems.find(i=>i.name===p.nombre);
  if(ex){ex.qty++;}else{cartItems.push({name:p.nombre,price:precio,img:p.imgUrl||'',svg:'',descuentoEscalonado:null,qty:1});}
  updateBadge();
  window.showToast((p.nombre||'Producto')+' añadido 🎉');
  window._guardarCarritoEnFirestore && window._guardarCarritoEnFirestore(cartItems);
};

window.abrirModalProductoConjunto = function(conjuntoId, nombreProd){
  const c = _productosFirestore.find(x=>x.id===conjuntoId);
  if(!c) return;
  const p = (c.productos||[]).find(x=>x.nombre===nombreProd);
  if(!p) return;
  const overlay = document.getElementById('modal-overlay');
  const imgEl = document.getElementById('modal-img-tag');
  const phEl  = document.getElementById('modal-img-ph');
  if(p.imgUrl){ imgEl.src=p.imgUrl; imgEl.style.display='block'; phEl.style.display='none'; imgEl.onerror=()=>{imgEl.style.display='none';phEl.style.display='flex';}; }
  else        { imgEl.style.display='none'; phEl.style.display='flex'; }
  document.getElementById('modal-kicker').textContent = (p.materiales||['PLA']).join(' · ');
  document.getElementById('modal-title').textContent  = p.nombre||'';
  document.getElementById('modal-price').textContent  = p.precio||'';
  document.getElementById('modal-desc').textContent   = p.descripcion||'';
  const specsEl=document.getElementById('modal-specs'); specsEl.innerHTML='';
  [['Material',(p.materiales||[]).join(' · ')],['Peso',p.peso],['Tiempo',p.tiempoProduccion]].forEach(s=>{
    if(s[1]) specsEl.innerHTML+=`<div class="modal-spec"><span>${s[0]}</span><span>${s[1]}</span></div>`;
  });
  document.getElementById('modal-colors').innerHTML='';
  document.getElementById('modal-add-btn').onclick=()=>{ addToCartConjunto(p); closeModal(); };
  window._setModalFavKey && window._setModalFavKey(p.nombre||'');
  overlay.classList.add('open'); document.body.style.overflow='hidden';
};

/* ── Admin form conjunto ── */
let _afProductos = [];

window.abrirFormConjunto = function(id){
  const overlay = document.getElementById('admin-prod-overlay');
  document.getElementById('af-error').style.display='none';
  document.getElementById('af-img-preview').style.display='none';
  const urlInput = document.getElementById('af-img-file-url');
  if(urlInput) urlInput.value='';
  _afProductos = [];
  if(id){
    const c = _productosFirestore.find(x=>x.id===id);
    if(!c) return;
    document.getElementById('admin-form-title').textContent = 'Editar conjunto';
    document.getElementById('af-doc-id').value   = id;
    document.getElementById('af-nombre').value   = c.nombre||'';
    document.getElementById('af-desc').value     = c.descripcion||'';
    document.getElementById('af-img-url').value  = c.imgUrl||'';
    if(urlInput) urlInput.value = c.imgUrl||'';
    if(c.imgUrl){ document.getElementById('af-img-tag').src=c.imgUrl; document.getElementById('af-img-preview').style.display='block'; }
    _afProductos = JSON.parse(JSON.stringify(c.productos||[]));
  } else {
    document.getElementById('admin-form-title').textContent = 'Añadir conjunto';
    ['af-doc-id','af-nombre','af-desc','af-img-url'].forEach(i=>{ const el=document.getElementById(i); if(el) el.value=''; });
  }
  renderAfProductos();
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
};

window.cerrarFormConjunto = function(){
  document.getElementById('admin-prod-overlay').style.display='none';
  document.body.style.overflow='';
};

function renderAfProductos(){
  const lista = document.getElementById('af-productos-lista');
  if(!lista) return;
  lista.innerHTML='';
  _afProductos.forEach((p,i)=>{
    const div = document.createElement('div');
    div.style.cssText='background:var(--bg3);border:1px solid var(--border);border-radius:.6rem;padding:.75rem;display:flex;flex-direction:column;gap:.5rem;';
    div.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:.82rem;font-weight:700;color:var(--text2);">Producto ${i+1}</span>
        <button onclick="_afQuitarProducto(${i})" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:.9rem;padding:2px 5px;">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
        <input class="form-input" style="font-size:.82rem;" placeholder="Nombre *" value="${escapeHTML(p.nombre||'')}" oninput="_afActualizar(${i},'nombre',this.value)">
        <input class="form-input" style="font-size:.82rem;" placeholder="Precio (€12.50)" value="${escapeHTML(p.precio||'')}" oninput="_afActualizar(${i},'precio',this.value)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
        <input class="form-input" style="font-size:.82rem;" placeholder="Categoría" value="${escapeHTML(p.categoria||'')}" oninput="_afActualizar(${i},'categoria',this.value)">
        <input class="form-input" style="font-size:.82rem;" placeholder="Material (PLA,PETG)" value="${escapeHTML((p.materiales||[]).join(', '))}" oninput="_afActualizar(${i},'materialesStr',this.value)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
        <input class="form-input" style="font-size:.82rem;" placeholder="Peso (10g)" value="${escapeHTML(p.peso||'')}" oninput="_afActualizar(${i},'peso',this.value)">
        <input class="form-input" style="font-size:.82rem;" placeholder="Tiempo prod." value="${escapeHTML(p.tiempoProduccion||'')}" oninput="_afActualizar(${i},'tiempoProduccion',this.value)">
      </div>
      <input class="form-input" style="font-size:.82rem;" placeholder="URL imagen" value="${escapeHTML(p.imgUrl||'')}" oninput="_afActualizar(${i},'imgUrl',this.value)">
      <textarea class="form-textarea" style="font-size:.82rem;min-height:50px;" placeholder="Descripción" oninput="_afActualizar(${i},'descripcion',this.value)">${escapeHTML(p.descripcion||'')}</textarea>
      <select class="form-input" style="font-size:.82rem;cursor:pointer;" onchange="_afActualizar(${i},'destacado',this.value)">
        <option value="" ${!p.destacado?'selected':''}>Sin destacado</option>
        <option value="nuevo" ${p.destacado==='nuevo'?'selected':''}>🆕 Nuevo</option>
        <option value="pocas" ${p.destacado==='pocas'?'selected':''}>⚠️ Últimas unidades</option>
        <option value="sale10" ${p.destacado==='sale10'?'selected':''}>🏷️ −10%</option>
        <option value="sale20" ${p.destacado==='sale20'?'selected':''}>🏷️ −20%</option>
        <option value="sale25" ${p.destacado==='sale25'?'selected':''}>🏷️ −25%</option>
        <option value="bulk25" ${p.destacado==='bulk25'?'selected':''}>📦 +10 = −25%</option>
      </select>`;
    lista.appendChild(div);
  });
}

window.anadirProductoAlConjunto = function(){
  _afProductos.push({nombre:'',precio:'',categoria:'',materiales:['PLA'],peso:'',tiempoProduccion:'',descripcion:'',imgUrl:'',destacado:''});
  renderAfProductos();
};
window._afQuitarProducto = function(i){ _afProductos.splice(i,1); renderAfProductos(); };
window._afActualizar = function(i,campo,val){
  if(campo==='materialesStr') _afProductos[i].materiales = val.split(',').map(s=>s.trim()).filter(Boolean);
  else _afProductos[i][campo] = val;
};

window.guardarConjunto = async function(){
  const nombre = document.getElementById('af-nombre').value.trim();
  const desc   = document.getElementById('af-desc').value.trim();
  const imgUrl = (document.getElementById('af-img-file-url')||{}).value?.trim()||document.getElementById('af-img-url').value||'';
  const docId  = document.getElementById('af-doc-id').value;
  const errEl  = document.getElementById('af-error');
  const saveBtn= document.getElementById('af-save-btn');
  if(!nombre){ errEl.textContent='El nombre es obligatorio.'; errEl.style.display='block'; return; }
  const prodsValidos = _afProductos.filter(p=>p.nombre&&p.precio);
  if(!prodsValidos.length){ errEl.textContent='Añade al menos un producto con nombre y precio.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  saveBtn.disabled=true; saveBtn.textContent='Guardando…';
  try{
    const data = { nombre, descripcion:desc, imgUrl, productos:prodsValidos, updatedAt:serverTimestamp() };
    if(docId){
      await setDoc(doc(_db,'conjuntos',docId), data, {merge:true});
      window.showToast('Conjunto actualizado ✓');
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(collection(_db,'conjuntos'), data);
      window.showToast('Conjunto añadido ✓');
    }
    cerrarFormConjunto();
  }catch(e){
    errEl.textContent='Error: '+e.message;
    errEl.style.display='block';
    console.error(e);
  }
  saveBtn.disabled=false; saveBtn.textContent='Guardar';
};

window.eliminarConjunto = async function(id){
  if(!confirm('¿Eliminar este conjunto y todos sus productos?')) return;
  try{
    await deleteDoc(doc(_db,'conjuntos',id));
    window.showToast('Conjunto eliminado 🗑️');
  }catch(e){ window.showToast('Error al eliminar.'); console.error(e); }
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