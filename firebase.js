import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, setDoc, deleteDoc }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

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
const _storage = getStorage(_app);
const _provider = new GoogleAuthProvider();

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
  const avatarContent = esAdmin
    ? `<span class="com-avatar-emoji">${d.avatar||'😊'}</span><span class="com-crown">👑</span>`
    : `<span>${d.avatar||'😊'}</span>`;
  const nombreBadge = esAdmin
    ? `<span class="com-admin-badge">Admin</span>`
    : '';
  const btnEliminar = esYoAdmin
    ? `<button class="com-delete-btn" title="Eliminar comentario" onclick="eliminarComentario('${docSnap.id}',this)">🗑️</button>`
    : '';
  const div = document.createElement('div');
  div.className = 'com-card' + (esAdmin ? ' com-card-admin' : '');
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
    </div>`;
  return div;
}

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
    await addDoc(collection(_db,'comentarios'),{
      nombre, texto, avatar, estrellas,
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
    if(ofNombre)      ofNombre.value             = displayName;
    if(ofNombreText)  ofNombreText.textContent   = displayName;
    if(ofNombreAvatar)ofNombreAvatar.src         = photoURL;
  } else {
    if(btnLogin)  btnLogin.style.display  = 'flex';
    if(userChip)  userChip.style.display  = 'none';
    if(formWrap)  formWrap.style.display  = 'none';
    const adminPanelHide = document.getElementById('admin-stock-panel');
    if(adminPanelHide) adminPanelHide.style.display = 'none';
    const adminWarnHide = document.getElementById('admin-warning');
    if(adminWarnHide) adminWarnHide.style.display = 'none';
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
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    document.getElementById('af-img-tag').src = e.target.result;
    document.getElementById('af-img-preview').style.display='block';
  };
  reader.readAsDataURL(file);
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
    let imgUrl = document.getElementById('af-img-url').value||'';
    let imgStoragePath = '';

    // Subir imagen si hay archivo nuevo
    if(fileInput.files[0]){
      const file = fileInput.files[0];
      const ext  = file.name.split('.').pop();
      const path = `productos/${Date.now()}.${ext}`;
      imgStoragePath = path;
      const storageRef = ref(_storage, path);
      const wrap = document.getElementById('af-upload-wrap');
      const bar  = document.getElementById('af-upload-bar');
      const txt  = document.getElementById('af-upload-txt');
      wrap.style.display='block';
      await new Promise((res,rej)=>{
        const task = uploadBytesResumable(storageRef, file);
        task.on('state_changed',
          snap=>{ const pct=Math.round(snap.bytesTransferred/snap.totalBytes*100); bar.style.width=pct+'%'; txt.textContent='Subiendo… '+pct+'%'; },
          rej,
          async ()=>{ imgUrl = await getDownloadURL(task.snapshot.ref); res(); }
        );
      });
      wrap.style.display='none';
    }

    const data = {
      nombre, precio, categoria,
      materiales: material ? material.split(',').map(s=>s.trim()).filter(Boolean) : ['PLA'],
      peso, tiempoProduccion: tiempo, descripcion: desc,
      imgUrl, imgStoragePath,
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
    if(storagePath){
      try{ await deleteObject(ref(_storage, storagePath)); }catch(e){ console.warn('Imagen no eliminada:',e); }
    }
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