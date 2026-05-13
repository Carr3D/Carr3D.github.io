/* ─── HUCHA / META DE DINERO ─── */
// ══════════════════════════════════════════════════════════
//  MODIFICA AQUÍ PARA ACTUALIZAR LA HUCHA
//  piggyFilled: número entre 0 y 100 (porcentaje llenado)
//  piggyGoal:   meta en euros
//  piggyCurrent: cantidad recaudada actual en euros
const piggyFilled  = 0;   // ← CAMBIA ESTE NÚMERO (0–100)
const piggyGoal    = 2000; // ← META EN EUROS
const piggyCurrent = Math.round(piggyGoal * piggyFilled / 100);
// ══════════════════════════════════════════════════════════

/* ─── CARRITO (estado global) ─── */
let cartItems = [];

/* ─── PANEL CARRITO ─── */
function openCartPanel() {
  renderCartPanel();
  document.getElementById('cart-panel-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCartPanel() {
  document.getElementById('cart-panel-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function renderCartPanel() {
  const itemsEl = document.getElementById('cp-items');
  const totalEl = document.getElementById('cp-total-price');
  const footerEl = document.getElementById('cp-footer');
  itemsEl.innerHTML = '';
  if (cartItems.length === 0) {
    itemsEl.innerHTML = '<div class="cp-empty"><div class="cp-empty-icon">🛒</div><span>Tu carrito está vacío</span></div>';
    footerEl.style.display = 'none';
    return;
  }
  footerEl.style.display = 'flex';
  let total = 0;
  cartItems.forEach((item, idx) => {
    total += item.price * item.qty;
    const thumb = item.img
      ? `<img src="${item.img}" alt="${item.name}">`
      : `<span style="font-size:1.4rem;opacity:.4">📦</span>`;
    itemsEl.innerHTML += `
      <div class="cp-item">
        <div class="cp-item-thumb">${thumb}</div>
        <div class="cp-item-info">
          <div class="cp-item-name">${item.name}</div>
          <div class="cp-item-price">€${(item.price * item.qty).toFixed(2)}</div>
          <div class="cp-item-qty">
            <button class="cp-qty-btn" onclick="changeQty(${idx},-1)">−</button>
            <span class="cp-qty-num">${item.qty}</span>
            <button class="cp-qty-btn" onclick="changeQty(${idx},1)">+</button>
          </div>
        </div>
        <button class="cp-remove" onclick="removeItem(${idx})" title="Eliminar">✕</button>
      </div>`;
  });
  totalEl.textContent = '€' + total.toFixed(2);
}
function changeQty(idx, delta) {
  cartItems[idx].qty += delta;
  if (cartItems[idx].qty <= 0) cartItems.splice(idx, 1);
  updateBadge();
  renderCartPanel();
}
function removeItem(idx) {
  cartItems.splice(idx, 1);
  updateBadge();
  renderCartPanel();
}
function clearCart() {
  cartItems = [];
  updateBadge();
  renderCartPanel();
}
function updateBadge() {
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

/* ─── AÑADIR AL CARRITO ─── */
function addToCart(name, priceStr, img) {
  const price = parseFloat((priceStr || '0').replace(/[^0-9.,]/g,'').replace(',','.')) || 0;
  const existing = cartItems.find(i => i.name === name);
  if (existing) { existing.qty++; }
  else { cartItems.push({ name: name || 'Producto', price, img: img || '', qty: 1 }); }
  const badge = document.getElementById('cart-badge');
  updateBadge();
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);
  showToast((name || 'Producto') + ' añadido al carrito 🎉');
}

/* ─── MODAL RESUMEN PEDIDO ─── */
function submitOrder() {
  // Recoger datos del formulario
  const nombre  = document.querySelector('.order-form .form-input[placeholder="Tu nombre"]')?.value.trim()   || '—';
  const email   = document.querySelector('.order-form .form-input[placeholder="tu@email.com"]')?.value.trim() || '—';
  const objeto  = document.querySelector('.order-form .form-input[placeholder="Nombre o descripción breve del objeto"]')?.value.trim() || '—';
  const material = document.querySelector('.mat-pill.active')?.textContent || '—';
  const dims    = document.querySelector('.order-form .form-input[placeholder="Alto × Ancho × Largo"]')?.value.trim() || '—';
  const cantidad= document.querySelector('.order-form .form-input[placeholder="1"]')?.value.trim() || '1';
  const desc    = document.querySelector('.order-form .form-textarea')?.value.trim() || '—';
  const archivo = document.querySelector('.upload-text strong')?.textContent?.replace('✓ ','') || 'Ninguno';

  const overlay = document.getElementById('order-summary-overlay');
  document.getElementById('osm-nombre').textContent   = nombre;
  document.getElementById('osm-email').textContent    = email;
  document.getElementById('osm-objeto').textContent   = objeto;
  document.getElementById('osm-material').textContent = material;
  document.getElementById('osm-dims').textContent     = dims;
  document.getElementById('osm-cantidad').textContent = cantidad;
  document.getElementById('osm-desc').textContent     = desc.length > 120 ? desc.slice(0,120)+'…' : desc;
  document.getElementById('osm-archivo').textContent  = archivo;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeOrderSummary() {
  document.getElementById('order-summary-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function confirmOrder() {
  closeOrderSummary();
  showToast('¡Solicitud enviada! Te contactamos en 24 h ✓');
}

function renderPiggy() {
  const pct = Math.max(0, Math.min(100, piggyFilled));
  // Nivel del líquido dentro del cerdo (de abajo a arriba)
  const liquidLevel = 1 - pct / 100; // 0 = lleno, 1 = vacío

  // Actualizar barra y textos
  document.getElementById('piggy-fill-bar').style.width = pct + '%';
  document.getElementById('piggy-current-val').textContent = '€' + piggyCurrent.toLocaleString('es-ES');
  document.getElementById('piggy-goal-val').textContent = '€' + piggyGoal.toLocaleString('es-ES');
  document.getElementById('piggy-pct-label').textContent = pct + '% completado';

  // Redibujar el SVG del cerdo con nivel de llenado
  buildPiggySVG(pct);
}

function buildPiggySVG(pct) {
  const svg = document.getElementById('piggy-svg');
  if (!svg) return;

  // Cuerpo: esfera centrada en (150,158), radio ~102
  // Relleno sube desde abajo (y=260) hasta y=56 (100%)
  const bodyCX = 150, bodyCY = 158, bodyRX = 102, bodyRY = 100;
  const fillBottom = bodyCY + bodyRY; // 258
  const fillTop    = bodyCY - bodyRY; // 58
  const fillRange  = fillBottom - fillTop; // 200
  const fillY = fillBottom - (pct / 100) * fillRange; // nivel del líquido
  const liqColor = pct > 75 ? '#c8860a' : '#a86a08';
  const liqLight = pct > 75 ? '#f5c842' : '#d4a017';

  svg.innerHTML = `
  <defs>
    <!-- Gradiente cuerpo: dorado bronce, iluminado arriba-izquierda -->
    <radialGradient id="bG" cx="36%" cy="28%" r="62%">
      <stop offset="0%"   stop-color="#f0d060"/>
      <stop offset="30%"  stop-color="#c8940c"/>
      <stop offset="65%"  stop-color="#9a6b04"/>
      <stop offset="100%" stop-color="#6b4500"/>
    </radialGradient>
    <!-- Gradiente orejas -->
    <radialGradient id="eG" cx="35%" cy="30%" r="70%">
      <stop offset="0%"   stop-color="#e8c040"/>
      <stop offset="100%" stop-color="#7a5200"/>
    </radialGradient>
    <!-- Gradiente hocico (círculo): más oscuro, textura -->
    <radialGradient id="sG" cx="38%" cy="32%" r="65%">
      <stop offset="0%"   stop-color="#b8880a"/>
      <stop offset="60%"  stop-color="#8a5e04"/>
      <stop offset="100%" stop-color="#5c3a00"/>
    </radialGradient>
    <!-- Gradiente patas -->
    <radialGradient id="lG" cx="35%" cy="25%" r="70%">
      <stop offset="0%"   stop-color="#d4a010"/>
      <stop offset="100%" stop-color="#7a5200"/>
    </radialGradient>
    <!-- Patrón de rejilla para el hocico (como en la foto) -->
    <pattern id="gridPat" width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="2.5" cy="2.5" r="1.4" fill="#6b4200" opacity="0.55"/>
    </pattern>
    <!-- ClipPath: silueta del cuerpo -->
    <clipPath id="bodyClip">
      <ellipse cx="${bodyCX}" cy="${bodyCY}" rx="${bodyRX}" ry="${bodyRY}"/>
    </clipPath>
    <!-- Gradiente líquido interior -->
    <linearGradient id="liqG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${liqLight}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${liqColor}"  stop-opacity="0.95"/>
    </linearGradient>
    <!-- Brillo especular cuerpo -->
    <radialGradient id="shG" cx="32%" cy="22%" r="40%">
      <stop offset="0%"   stop-color="rgba(255,255,220,0.52)"/>
      <stop offset="100%" stop-color="rgba(255,255,220,0)"/>
    </radialGradient>
    <!-- Brillo secundario (abajo-derecha, reflejo ambiental) -->
    <radialGradient id="sh2G" cx="75%" cy="80%" r="35%">
      <stop offset="0%"   stop-color="rgba(255,220,80,0.18)"/>
      <stop offset="100%" stop-color="rgba(255,220,80,0)"/>
    </radialGradient>
    <filter id="sf" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5"/>
    </filter>
    <filter id="gf" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- SOMBRA SUELO -->
  <ellipse cx="150" cy="274" rx="82" ry="10" fill="rgba(0,0,0,0.18)" filter="url(#sf)"/>

  <!-- ═══ OREJAS (detrás del cuerpo) ═══ -->
  <!-- Oreja izquierda: pequeña, triangular-redondeada, pegada a la cabeza -->
  <path d="M94,72 Q84,54 100,50 Q116,48 112,68 Q106,76 94,72 Z" fill="url(#eG)"/>
  <path d="M97,71 Q89,57 102,54 Q113,52 110,66 Q105,73 97,71 Z" fill="#5c3a00" opacity="0.35"/>
  <!-- Oreja derecha -->
  <path d="M206,72 Q216,54 200,50 Q184,48 188,68 Q194,76 206,72 Z" fill="url(#eG)"/>
  <path d="M203,71 Q211,57 198,54 Q187,52 190,66 Q195,73 203,71 Z" fill="#5c3a00" opacity="0.35"/>

  <!-- ═══ CUERPO PRINCIPAL ═══ (gran esfera gordita) -->
  <ellipse cx="${bodyCX}" cy="${bodyCY}" rx="${bodyRX}" ry="${bodyRY}" fill="url(#bG)"/>

  <!-- LÍQUIDO INTERIOR (clipado) -->
  <g clip-path="url(#bodyClip)">
    ${pct > 0 ? `
    <!-- Relleno sólido desde abajo -->
    <rect x="${bodyCX - bodyRX}" y="${fillY}" width="${bodyRX*2}" height="${fillBottom - fillY + 2}" fill="url(#liqG)"/>
    <!-- Ola animada en la superficie -->
    <g>
      <path d="M${bodyCX-bodyRX-10},${fillY}
               Q${bodyCX-50},${fillY-9} ${bodyCX},${fillY}
               Q${bodyCX+50},${fillY+9} ${bodyCX+bodyRX+10},${fillY}
               L${bodyCX+bodyRX+10},${fillBottom+5}
               L${bodyCX-bodyRX-10},${fillBottom+5} Z"
            fill="${liqLight}" opacity="0.6">
        <animateTransform attributeName="transform" type="translate"
          values="0,0;-18,0;0,0" dur="2.8s" repeatCount="indefinite"/>
      </path>
    </g>
    <!-- Reflejo/brillo en el líquido -->
    <ellipse cx="${bodyCX-20}" cy="${fillY+8}" rx="22" ry="4" fill="rgba(255,255,200,0.35)" opacity="${pct>4?1:0}"/>
    ` : ''}
  </g>

  <!-- Contorno cuerpo encima del líquido -->
  <ellipse cx="${bodyCX}" cy="${bodyCY}" rx="${bodyRX}" ry="${bodyRY}"
    fill="none" stroke="#5c3a00" stroke-width="2" opacity="0.3"/>

  <!-- ═══ RANURA MONEDA (en lo alto del cuerpo) ═══ -->
  <rect x="140" y="59" width="20" height="5" rx="2.5" fill="#3a2000" opacity="0.75"/>

  <!-- ═══ HOCICO CIRCULAR (gran círculo texturizado) ═══ -->
  <!-- Base oscura del hocico -->
  <circle cx="150" cy="175" r="46" fill="url(#sG)"/>
  <!-- Capa de textura de rejilla (hexdots como en la foto) -->
  <circle cx="150" cy="175" r="46" fill="url(#gridPat)" opacity="0.9"/>
  <!-- Borde del hocico: sutil resalte dorado -->
  <circle cx="150" cy="175" r="46" fill="none" stroke="#c8940c" stroke-width="2.5" opacity="0.6"/>
  <!-- Fosas nasales: dos óvalos negros grandes -->
  <ellipse cx="136" cy="178" rx="12" ry="14" fill="#1a0e00" opacity="0.88"/>
  <ellipse cx="164" cy="178" rx="12" ry="14" fill="#1a0e00" opacity="0.88"/>
  <!-- Brillito en las fosas -->
  <ellipse cx="132" cy="173" rx="4" ry="3" fill="rgba(255,255,255,0.12)"/>
  <ellipse cx="160" cy="173" rx="4" ry="3" fill="rgba(255,255,255,0.12)"/>

  <!-- ═══ OJOS: cejas arqueadas en V (como en la foto, muy características) ═══ -->
  <!-- Ojo izquierdo: forma de V/chevron angular, negro -->
  <path d="M108,112 L116,120 L124,112" fill="none" stroke="#1a0e00" stroke-width="6"
        stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Ojo derecho -->
  <path d="M176,112 L184,120 L192,112" fill="none" stroke="#1a0e00" stroke-width="6"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ═══ PATAS (4 cilindros redondos pequeños) ═══ -->
  <!-- Pata trasera izq -->
  <ellipse cx="98"  cy="256" rx="18" ry="13" fill="url(#lG)"/>
  <rect x="80"  y="243" width="36" height="16" rx="0" fill="url(#lG)"/>
  <!-- Pata trasera der -->
  <ellipse cx="202" cy="256" rx="18" ry="13" fill="url(#lG)"/>
  <rect x="184" y="243" width="36" height="16" rx="0" fill="url(#lG)"/>
  <!-- Pata delantera izq -->
  <ellipse cx="112" cy="256" rx="18" ry="13" fill="url(#lG)"/>
  <rect x="94"  y="243" width="36" height="16" rx="0" fill="url(#lG)"/>
  <!-- Pata delantera der -->
  <ellipse cx="188" cy="256" rx="18" ry="13" fill="url(#lG)"/>
  <rect x="170" y="243" width="36" height="16" rx="0" fill="url(#lG)"/>
  <!-- Tapas superiores de patas -->
  <ellipse cx="98"  cy="243" rx="18" ry="11" fill="#d4a010"/>
  <ellipse cx="202" cy="243" rx="18" ry="11" fill="#d4a010"/>
  <ellipse cx="112" cy="243" rx="18" ry="11" fill="#d4a010"/>
  <ellipse cx="188" cy="243" rx="18" ry="11" fill="#d4a010"/>

  <!-- ═══ BRILLOS ESPECULARES ═══ -->
  <!-- Gran brillo arriba-izquierda (como en la foto) -->
  <ellipse cx="${bodyCX}" cy="${bodyCY}" rx="${bodyRX}" ry="${bodyRY}" fill="url(#shG)"/>
  <!-- Brillo secundario suave -->
  <ellipse cx="${bodyCX}" cy="${bodyCY}" rx="${bodyRX}" ry="${bodyRY}" fill="url(#sh2G)"/>
  <!-- Punto de brillo especular pequeño y brillante -->
  <ellipse cx="108" cy="98" rx="14" ry="9" fill="rgba(255,255,230,0.38)" transform="rotate(-20,108,98)"/>
  <ellipse cx="111" cy="96" rx="6" ry="4" fill="rgba(255,255,255,0.55)" transform="rotate(-20,111,96)"/>

  <!-- Destellos si está muy lleno -->
  ${pct >= 85 ? `
  <circle cx="232" cy="92" r="5" fill="#fff8dc" opacity="0.9" filter="url(#gf)">
    <animate attributeName="opacity" values="0.9;0.15;0.9" dur="1.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="68" cy="110" r="3.5" fill="#fff8dc" opacity="0.75" filter="url(#gf)">
    <animate attributeName="opacity" values="0.75;0.1;0.75" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="190" cy="72" r="3" fill="#fff8dc" opacity="0.6" filter="url(#gf)">
    <animate attributeName="opacity" values="0.6;0.05;0.6" dur="1.9s" repeatCount="indefinite"/>
  </circle>` : ''}
  `;
}

/* ─── DOM READY ─── */
document.addEventListener('DOMContentLoaded', function() {

  /* THEME */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('carr3d-theme');
  if (saved) { html.setAttribute('data-theme', saved); themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙'; }
  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('carr3d-theme', next);
  });

  /* PROGRESS */
  window.addEventListener('scroll', () => {
    document.getElementById('progress-bar').style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  }, { passive: true });

  /* IMAGE SEQUENCE */
  const TOTAL=30, EXT='.jpg', PREFIX='img/frame_';
  const frameSrc=n=>PREFIX+String(n).padStart(3,'0')+EXT;
  const frames=[];
  let loaded=0;
  for(let i=1;i<=TOTAL;i++){
    const img=new Image();
    img.src=frameSrc(i);
    img.onload=()=>loaded++;
    img.onerror=()=>loaded++;
    frames.push(img);
  }
  const wrapper=document.getElementById('hero-sticky-wrapper');
  const seqImg=document.getElementById('seq-img');
  const placeholder=document.getElementById('seq-placeholder');
  const counter=document.getElementById('frame-counter');
  const heroCTA=document.getElementById('hero-cta');
  let curFrame=-1;
  function updateSeq(){
    const rect=wrapper.getBoundingClientRect();
    const scrolled=-rect.top;
    const total=rect.height-window.innerHeight;
    const progress=Math.max(0,Math.min(1,scrolled/total));
    const idx=Math.min(Math.floor(progress*TOTAL),TOTAL-1);
    progress>0.88?heroCTA.classList.add('visible'):heroCTA.classList.remove('visible');
    if(idx===curFrame)return;
    curFrame=idx;
    counter.textContent=(idx+1)+' / '+TOTAL;
    const img=frames[idx];
    if(img&&img.complete&&img.naturalWidth>0){
      seqImg.src=img.src;seqImg.style.display='block';placeholder.style.display='none';
    } else {
      seqImg.style.display='none';placeholder.style.display='flex';
    }
  }
  window.addEventListener('scroll',updateSeq,{passive:true});
  updateSeq();

  /* REVEAL */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* COUNTERS */
  const so = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    so.disconnect();
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = +el.dataset.target, suf = el.dataset.suf;
      let c = 0; const step = target / 55;
      const t = setInterval(() => { c = Math.min(c + step, target); el.textContent = Math.floor(c) + suf; if (c >= target) clearInterval(t); }, 18);
    });
  }, { threshold: .5 });
  so.observe(document.getElementById('stats'));

  /* FILE INPUT */
  const fi = document.getElementById('file-input');
  if (fi) fi.addEventListener('change', function() {
    if (this.files[0]) document.querySelector('.upload-text').innerHTML = '<strong style="color:var(--accent2)">✓ ' + this.files[0].name + '</strong>';
  });

  /* MODAL producto */
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  /* MODAL resumen pedido */
  const osOverlay = document.getElementById('order-summary-overlay');
  osOverlay.addEventListener('click', e => { if (e.target === osOverlay) closeOrderSummary(); });

  /* Panel carrito */
  const cpOverlay = document.getElementById('cart-panel-overlay');
  cpOverlay.addEventListener('click', e => { if (e.target === cpOverlay) closeCartPanel(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeCartPanel(); closeOrderSummary(); }
  });

  /* HUCHA */
  renderPiggy();

  /* Animación barra de progreso hucha al hacer scroll */
  const piggyObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        document.getElementById('piggy-fill-bar').style.width = piggyFilled + '%';
      }, 200);
    }
  }, { threshold: .3 });
  const piggySection = document.getElementById('piggy-goal');
  if (piggySection) piggyObs.observe(piggySection);
});

/* SCROLL HELPER */
function scroll2(s) { document.querySelector(s)?.scrollIntoView({ behavior: 'smooth' }); }

/* TOAST */
function showToast(msg) {
  document.getElementById('t-msg').textContent = msg;
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* FORM */
function selectMat(el) { document.querySelectorAll('.mat-pill').forEach(m => m.classList.remove('active')); el.classList.add('active'); }
function selectColor(el) { document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active')); el.classList.add('active'); }

/* ─── MODAL DE PRODUCTO ─── */
function openProduct(data) {
  const overlay = document.getElementById('modal-overlay');
  const imgEl = document.getElementById('modal-img-tag');
  const phEl  = document.getElementById('modal-img-ph');
  if (data.img) {
    imgEl.src = data.img; imgEl.style.display = 'block'; phEl.style.display = 'none';
  } else if (data.svgPlaceholder) {
    imgEl.style.display = 'none';
    phEl.innerHTML = data.svgPlaceholder;
    phEl.style.display = 'flex';
  } else {
    imgEl.style.display = 'none';
    phEl.innerHTML = '<div class="card-img-empty"><div class="empty-icon">📦</div><div class="empty-label">Producto</div></div>';
    phEl.style.display = 'flex';
  }
  document.getElementById('modal-kicker').textContent = data.kicker || '';
  document.getElementById('modal-title').textContent  = data.name   || '';
  document.getElementById('modal-price').textContent  = data.price  || '';
  document.getElementById('modal-desc').textContent   = data.desc   || '';
  const specsEl = document.getElementById('modal-specs');
  specsEl.innerHTML = '';
  (data.specs || []).forEach(s => {
    specsEl.innerHTML += `<div class="modal-spec"><span>${s[0]}</span><span>${s[1]}</span></div>`;
  });
  document.getElementById('modal-add-btn').onclick = () => {
    addToCart(data.name, data.price, data.img || '');
    closeModal();
  };
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden'; 
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}