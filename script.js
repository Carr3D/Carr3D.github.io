/* ================================================================
   🎯 GUÍA COMPLETA: CÓMO MODIFICAR TUS PRODUCTOS
   ================================================================
   
   Aquí tienes 3 secciones diferentes donde puedes añadir productos.
   Sigue los pasos para cada tipo:
 
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
   📦 STOCK CONSTANTE (Catálogo principal - arriba)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Estos productos SIEMPRE están disponibles y aparecen en el catálogo.
   Se aplican filtros de categoría y precio.
 
   Pasos:
   1. Copia el bloque { } de un producto existente
   2. Modifica estos campos:
      - nombre: "Tu producto"
      - precio: "€XX.XX"
      - categoria: "Decoración" o "Utilidad"
      - materiales: ['PLA'], ['PETG'], etc.
      - colores: ['#e8541a', '#fbbf24'] (códigos hex)
      - descripcion: "Texto descriptivo..."
      - peso: "XXg"
      - tiempoProduccion: "X-X días"
      - seccion: 'stock'  ← ¡IMPORTANTE!
   
   3. Para imágenes:
      - imgPrincipal: "ruta/a/tu/imagen.jpg"
      - Si NO pones imagen, usa svgPlaceholder con un SVG
      - Si pones imagen pero falla, mostrará el SVG de fallback
 
   Ejemplo mínimo:
   {
     nombre: 'Mi producto',
     imgPrincipal: 'images/mi-producto.jpg',
     svgPlaceholder: `<svg>...</svg>`,
     precio: '€25.00',
     categoria: 'Decoración',
     materiales: ['PLA'],
     colores: ['#e8541a'],
     descripcion: 'Descripción corta',
     peso: '100g',
     tiempoProduccion: '2-3 días',
     seccion: 'stock',
   },
 
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
   🌟 TEMPORADA - PRODUCTO PRINCIPAL (Destacado grande)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Este es el producto ESTRELLA que aparece grande en la sección.
   NO se filtra por precio (siempre visible).
   Es edición limitada.
 
   Pasos:
   1. Copia un producto existente con seccion: 'temporada-principal'
   2. Modifica los mismos campos que stock
   3. ¡IMPORTANTE! Usa: seccion: 'temporada-principal'
   
   Campos específicos:
   - nombre: "Sol & Mar Collection" (tu nombre de edición)
   - descripcion: "Texto sobre esta edición limitada..."
   - precio: "€XX.XX" (puede ser alto, sin filtro)
 
   Ejemplo:
   {
     nombre: 'Edición Navidad 2025',
     imgPrincipal: 'images/navidad.jpg',
     svgPlaceholder: `<svg>...</svg>`,
     precio: '€55.00',
     categoria: 'Decoración',
     materiales: ['PETG'],
     colores: ['#ef4444', '#22c55e'],
     descripcion: 'Edición limitada navideña...',
     peso: '250g',
     tiempoProduccion: '5-7 días',
     seccion: 'temporada-principal',  ← ¡CLAVE!
   },
 
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
   🎨 TEMPORADA - PRODUCTOS SECUNDARIOS (Grid pequeña)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Estos aparecen en la grid de 3 columnas bajo el principal.
   SÍ se filtran por categoría y precio.
   Ideales para complementos o variaciones.
 
   Pasos:
   1. Copia un producto con seccion: 'temporada-secundaria'
   2. Rellena los campos normales
   3. IMPORTANTE: seccion: 'temporada-secundaria'
   
   Opciones avanzadas (DESCUENTOS POR CANTIDAD):
   {
     nombre: 'Cactus decorativo',
     ...
     descuentoEscalonado: {
       unidades: 10,  // A partir de la unidad 11
       porcentaje: 0.25  // 25% descuento
     },
   }
 
   Ejemplo:
   {
     nombre: 'Pack primavera',
     imgPrincipal: 'images/pack-primavera.jpg',
     svgPlaceholder: `<svg>...</svg>`,
     precio: '€18.00',
     categoria: 'Utilidad',
     materiales: ['PLA'],
     colores: ['#fbbf24'],
     descripcion: 'Pack de 3 piezas primavera',
     peso: '150g',
     tiempoProduccion: '2-3 días',
     seccion: 'temporada-secundaria',  ← ¡CLAVE!
     descuentoEscalonado: { unidades: 5, porcentaje: 0.15 },
   },
 
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
   💡 CONSEJOS GENERALES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   • Colores: Usa códigos HEX (#e8541a). Más de 3 colores = flexible
   • SVG: Si no tienes imagen, el SVG se muestra automáticamente
   • Imágenes: Resuelve proporción 1:1 (cuadradas) para mejor visual
   • Precios: Formato "€XX.XX" o "€XX.50"
   • Tiempos: "1 día", "2-3 días", "3-5 días", etc.
   • Descripciones: Máx 150 caracteres (se trunca en card)
 
   ================================================================ */
 
const PRODUCTOS = [
  /* Productos constantes */
  {
     nombre: 'Llavaro perro tejido',
     imgPrincipal: 'productos/constante/llavero_perro_cosido.png',
     svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg>`,
     precio: '€2.00',
     categoria: 'LLAVERO',
     materiales: ['PLA'],
     colores: ['#e99573','#e8541a'],
     descripcion: 'Llavero de un perro con acabado de tejido',
     peso: '10g',
     tiempoProduccion: '1 día',
     seccion: 'stock',
     descuentoEscalonado: { unidades: 10, porcentaje: 0.25 },
  },
  {
     nombre: 'Llavero gato tejido',
     imgPrincipal: 'productos/constante/llavero_gato_cosido.png',
     svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg>`,
     precio: '€2.00',
     categoria: 'LLAVERO',
     materiales: ['PLA'],
     colores: ['#e99573','#e8541a'],
     descripcion: 'Llavero de un gato con acabado de tejido',
     peso: '10g',
     tiempoProduccion: '1 día',
     seccion: 'stock',
     descuentoEscalonado: { unidades: 10, porcentaje: 0.25 },
   },
   {
     nombre: 'Llavero baca tejida',
     imgPrincipal: 'productos/constante/llavero_baca_cosida.png',
     svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg>`,
     precio: '€2.00',
     categoria: 'LLAVERO',
     materiales: ['PLA'],
     colores: ['#e99573','#e8541a'],
     descripcion: 'Llavero de una baca con acabado de tejido',
     peso: '10g',
     tiempoProduccion: '1 día',
     seccion: 'stock',
     descuentoEscalonado: { unidades: 10, porcentaje: 0.25 },
   },
   {
     nombre: 'Llavero capibara tejido',
     imgPrincipal: 'productos/constante/llavero_capibara_cosido.png',
     svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg>`,
     precio: '€2.00',
     categoria: 'LLAVERO',
     materiales: ['PLA'],
     colores: ['#e99573','#e8541a'],
     descripcion: 'Llavero de un capibara con acabado de tejido',
     peso: '10g',
     tiempoProduccion: '1 día',
     seccion: 'stock',
     descuentoEscalonado: { unidades: 10, porcentaje: 0.25 },
   },
   {
     nombre: 'Peine mariposa',
     imgPrincipal: 'productos/constante/peine_mariposa.png',
     svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80" fill="none" stroke="#e8541a" stroke-width="2"/><circle cx="100" cy="100" r="50" fill="#fde8dc"/></svg>`,
     precio: '€2.00',
     categoria: 'CUCHILLO',
     materiales: ['PLA'],
     colores: [],
     descripcion: 'Juguete de peine parecido a los cuchillos mariposa',
     peso: '10g',
     tiempoProduccion: '1 día',
     seccion: 'stock',
   },
   /* Producto temporada principal */
   {
     nombre: 'World Cup',
     imgPrincipal: 'productos/temporada/world_cup.png',
     svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,30 160,80 140,150 60,150 40,80" fill="none" stroke="#FFD700" stroke-width="2.5"/><circle cx="100" cy="100" r="30" fill="#FFD700" opacity="0.2"/></svg>`,
     precio: '€30.00',
     categoria: 'Decoración',
     materiales: ['PLA'],
     colores: ['#FFD700'],
     descripcion: 'Edición limitada de la copa del mundo a tamaño real',
     peso: '250g',
     tiempoProduccion: '2-3 días',
     seccion: 'temporada-principal',
   },
];
 
/* Procesar descuentos */
PRODUCTOS.forEach(p=>{
  if(p.precioOriginal&&p.descuentoProducto&&!p.precio){
    const original=parseFloat(p.precioOriginal.replace(/[^0-9.,]/g,'').replace(',','.'))||0;
    const precioConDescuento=original*(1-p.descuentoProducto);
    const simbolo=p.precioOriginal.match(/[€$]/)?.[0]||'€';
    p.precio=simbolo+precioConDescuento.toFixed(2);
  }
});
 
/* ================================================================
   🐷 CONFIGURACIÓN DE LA HUCHA (Meta de recaudación)
   ================================================================
   
   Edita estos valores para cambiar la meta y progreso de la hucha
   que aparece en la sección "Ayúdanos a crecer".
 
   Campos a modificar:
   
   • piggyEarned: Dinero recaudado hasta ahora (en euros)
     Ejemplo: 57.50 = €57,50 recaudados
   
   • piggyGoal: Meta total en euros
     Ejemplo: 500 = €500 de meta
   
   El porcentaje se calcula solo automáticamente.
   La hucha se actualizará con:
   - Barra de progreso visual
   - Dinero recaudado
   - Porcentaje completado (calculado automáticamente)
   - Animación de líquido dentro del cerdo
   
   ================================================================ */

let piggyEarned = 57.50; // valor por defecto hasta que cargue Firestore
let piggyGoal   = 500;
let piggyFilled   = Math.min(100, Math.round(piggyEarned / piggyGoal * 100));
let piggyCurrent  = piggyEarned;

/* ================================================================
   🏆 METAS CUMPLIDAS
   ================================================================

   Añade aquí las metas que ya habéis alcanzado.
   Aparecerán en la sección "Metas cumplidas" debajo de la hucha.

   Copia y pega un bloque { } para cada meta.
   Campos:
     • emoji:   Icono que representa la meta (cualquier emoji)
     • nombre:  Título corto de la meta
     • desc:    Descripción de lo que se consiguió
     • importe: Cantidad recaudada (opcional, ej: '€250')
     • fecha:   Cuándo se cumplió (opcional, ej: 'Mayo 2026')

   Si no hay ninguna meta cumplida todavía, deja el array vacío: []

   ================================================================ */

const METAS_CUMPLIDAS = [
  // Ejemplo (descomenta para usar):
  // {
  //   emoji:   '🏆',
  //   nombre:  'Primera venta',
  //   desc:    'Vendimos nuestra primera pieza y recuperamos los primeros materiales.',
  //   importe: '€12.00',
  //   fecha:   'Abril 2026',
  // },
];

/* ================================================================
   📸 GUÍA: CÓMO AÑADIR FOTOS AL COLLAGE
   ================================================================

   Añade las rutas de tus fotos en el array COLLAGE_FOTOS de abajo.
   Las fotos deben estar en la misma carpeta que este archivo HTML,
   o en una subcarpeta.

   Ejemplos de rutas:
   • Foto en la misma carpeta:       'mi_foto.jpg'
   • Foto en una subcarpeta:         'fotos/mi_foto.jpg'
   • Foto ya usada en productos:     'productos/constante/llavero_perro_cosido.png'

   Puedes añadir tantas fotos como quieras.
   El collage las repite automáticamente en bucle infinito.

   Formatos admitidos: .jpg  .jpeg  .png  .webp  .gif

   ================================================================ */

const COLLAGE_FOTOS = [
  /* ── Añade tus fotos aquí ── */
  'productos/constante/llavero_perro_cosido.png',
  'productos/constante/llavero_gato_cosido.png',
  'productos/constante/llavero_baca_cosida.png',
  'productos/constante/llavero_capibara_cosido.png',
  'productos/constante/peine_mariposa.png',
  'productos/temporada/world_cup.png',
];
 
const BADGE_MAP = {
  nuevo:   {cls:'badge-new',  txt:'Nuevo',          tip:'¡Producto recién añadido al catálogo!'},
  pocas:   {cls:'badge-low',  txt:'Últimas unidades',tip:'Quedan muy pocas unidades disponibles. ¡Date prisa!'},
  sale10:  {cls:'badge-sale', txt:'−10%',            tip:'Este producto tiene un descuento del 10%.'},
  sale20:  {cls:'badge-sale', txt:'−20%',            tip:'Este producto tiene un descuento del 20%.'},
  sale25:  {cls:'badge-sale', txt:'−25%',            tip:'Este producto tiene un descuento del 25%.'},
  bulk25:  {cls:'badge-sale', txt:'+10 = −25%',      tip:'Pide más de 10 unidades y obtendrás un 25% de descuento en las que pasen de ese número.'},
};
function badgeHTML(d,descuentoEscalonado){
  if(descuentoEscalonado&&descuentoEscalonado.porcentaje){
    const pct=(descuentoEscalonado.porcentaje*100|0);
    const unidades=descuentoEscalonado.unidades||10;
    const tip='Pide más de '+unidades+' unidades y obtendrás un '+pct+'% de descuento en las que pasen de ese número.';
    return '<span class="badge badge-sale badge-tip" data-tip="'+tip+'">+'+unidades+' = −'+pct+'%</span>';
  }
  if(!d||!BADGE_MAP[d])return'';
  const b=BADGE_MAP[d];
  return '<span class="badge '+b.cls+' badge-tip" data-tip="'+b.tip+'">'+b.txt+'</span>';
}
function matsLabel(arr){return (arr||[]).join(' · ');}
function safeQ(s){return (s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function coloresHTML(arr,cls){
  return (arr||[]).map(c=>'<span class="'+cls+'" style="background:'+c+';'+((c==='#ffffff'||c==='#f5f2ec')?'border:1.5px solid #ccc;':'')+'" title="'+c+'"></span>').join('');
}
 
/* ── CARRITO ── */
let cartItems=[];
function openCartPanel(){renderCartPanel();document.getElementById('cart-panel-overlay').classList.add('open');document.body.style.overflow='hidden';}
function closeCartPanel(){document.getElementById('cart-panel-overlay').classList.remove('open');document.body.style.overflow='';}
function renderCartPanel(){
  const itemsEl=document.getElementById('cp-items'),totalEl=document.getElementById('cp-total-price'),footerEl=document.getElementById('cp-footer');
  itemsEl.innerHTML='';
  if(!cartItems.length){itemsEl.innerHTML='<div class="cp-empty"><div class="cp-empty-icon">🛒</div><span>Tu carrito está vacío</span></div>';footerEl.style.display='none';return;}
  footerEl.style.display='flex';
  let total=0;
  cartItems.forEach((item,idx)=>{
    let itemTotal=0,discount=0,unidades=10;
    if(item.descuentoEscalonado&&item.descuentoEscalonado.porcentaje&&item.qty>item.descuentoEscalonado.unidades){
      discount=item.descuentoEscalonado.porcentaje;unidades=item.descuentoEscalonado.unidades;
      itemTotal=(item.price*unidades)+(item.price*(item.qty-unidades)*(1-discount));
    }else{itemTotal=item.price*item.qty;}
    total+=itemTotal;
    const thumbInner=item.img
      ?('<img src="'+item.img+'" alt="'+safeQ(item.name)+'" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">'+'<span class="cp-thumb-fallback" style="display:none">📦</span>')
      :(item.svg?('<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:6px;">'+item.svg+'</div>'):'<span class="cp-thumb-fallback">📦</span>');
    const discountLabel=discount>0?'<div style="font-size:.7rem;color:#22c55e;font-weight:700;">-'+(discount*100|0)+'% a partir de la '+(unidades+1)+'ª</div>':'';
    itemsEl.innerHTML+='<div class="cp-item"><div class="cp-item-thumb">'+thumbInner+'</div><div class="cp-item-info"><div class="cp-item-name">'+item.name+'</div><div class="cp-item-price">€'+(itemTotal).toFixed(2)+'</div>'+discountLabel+'<div class="cp-item-qty"><button class="cp-qty-btn" onclick="changeQty('+idx+',-1)">−</button><span class="cp-qty-num">'+item.qty+'</span><button class="cp-qty-btn" onclick="changeQty('+idx+',1)">+</button></div></div><button class="cp-remove" onclick="removeItem('+idx+')" title="Eliminar">✕</button></div>';
  });
  totalEl.textContent='€'+total.toFixed(2);
}
function changeQty(idx,delta){cartItems[idx].qty+=delta;if(cartItems[idx].qty<=0)cartItems.splice(idx,1);updateBadge();renderCartPanel();}
function removeItem(idx){cartItems.splice(idx,1);updateBadge();renderCartPanel();}
function clearCart(){cartItems=[];updateBadge();renderCartPanel();}
function updateBadge(){const t=cartItems.reduce((s,i)=>s+i.qty,0),b=document.getElementById('cart-badge');b.textContent=t;b.style.display=t>0?'flex':'none';}
function addToCart(name,priceStr,img,idx){
  const price=parseFloat((priceStr||'0').replace(/[^0-9.,]/g,'').replace(',','.'))||0;
  const svg=(idx!==undefined&&PRODUCTOS[idx])?PRODUCTOS[idx].svgPlaceholder||'':'';
  const descuentoEscalonado=(idx!==undefined&&PRODUCTOS[idx])?PRODUCTOS[idx].descuentoEscalonado||null:null;
  const precioReal=(idx!==undefined&&PRODUCTOS[idx]&&PRODUCTOS[idx].descuentoProducto)
    ?parseFloat((PRODUCTOS[idx].precioOriginal||'0').replace(/[^0-9.,]/g,'').replace(',','.'))||price:price;
  const ex=cartItems.find(i=>i.name===name);
  if(ex){ex.qty++;}else{cartItems.push({name:name||'Producto',price:precioReal,img:img||'',svg,descuentoEscalonado,qty:1});}
  const b=document.getElementById('cart-badge');updateBadge();
  b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump');
  setTimeout(()=>b.classList.remove('bump'),300);
  showToast((name||'Producto')+' añadido 🎉');
}
 
/* ── RENDER TARJETAS ── */
function cardHTML(p,idx){
  const img=p.imgPrincipal?('<img src="'+p.imgPrincipal+'" alt="'+safeQ(p.nombre)+'" onerror="this.style.display=\'none\'">'):'<div class="card-img-placeholder">'+p.svgPlaceholder+'</div>';
  const catHTML=p.categoria?('<div class="card-categoria">'+p.categoria+'</div>'):'';
  const matPill='<span class="card-mat-pill">'+(p.materiales||[]).join(' · ')+'</span>';
  return '<div class="product-card" data-cat="'+(p.categoria||'')+'" data-idx="'+idx+'" onclick="handleCardClick(event,'+idx+')">'+badgeHTML(p.destacado,p.descuentoEscalonado)+'<div class="card-img">'+img+'<div class="card-overlay"><button class="view-btn" onclick="event.stopPropagation();openProduct('+idx+')">Ver detalles</button><button class="add-btn" onclick="event.stopPropagation();addToCart(\''+safeQ(p.nombre)+'\',\''+safeQ(p.precio)+'\',\''+safeQ(p.imgPrincipal||'')+'\','+idx+')">+ Carrito</button></div></div><div class="card-info">'+catHTML+'<div class="card-name">'+p.nombre+'</div><div class="card-meta"><span class="card-price">'+p.precio+'</span>'+matPill+'</div></div></div>';
}
function seasonSmallHTML(p,idx){
  const img=p.imgPrincipal?('<img src="'+p.imgPrincipal+'" alt="'+safeQ(p.nombre)+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">'):'<div class="card-img-placeholder">'+p.svgPlaceholder+'</div>';
  const catHTML=p.categoria?('<div class="card-categoria">'+p.categoria+'</div>'):'';
  const matPill='<span class="card-mat-pill">'+(p.materiales||[]).join(' · ')+'</span>';
  return '<div class="product-card season-small-item" data-cat="'+(p.categoria||'')+'" data-idx="'+idx+'" onclick="openProduct('+idx+')">'+badgeHTML(p.destacado)+'<div class="card-img" style="background:var(--bg3)">'+img+'<div class="card-img-placeholder" style="display:none;">'+p.svgPlaceholder+'</div><div class="card-overlay"><button class="view-btn" onclick="event.stopPropagation();openProduct('+idx+')">Ver</button><button class="add-btn" onclick="event.stopPropagation();addToCart(\''+safeQ(p.nombre)+'\',\''+safeQ(p.precio)+'\',\''+safeQ(p.imgPrincipal||'')+'\','+idx+')">+ Carrito</button></div></div><div class="card-info">'+catHTML+'<div class="card-name">'+p.nombre+'</div><div class="card-meta"><span class="card-price">'+p.precio+'</span>'+matPill+'</div></div></div>';
}
function seasonFeaturedHTML(p,idx){
  const imgBlock=p.imgPrincipal?('<img src="'+p.imgPrincipal+'" alt="'+safeQ(p.nombre)+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'"><div class="season-feat-img-placeholder" style="display:none;">'+p.svgPlaceholder+'</div>'):'<div class="season-feat-img-placeholder">'+p.svgPlaceholder+'</div>';
  return '<div class="season-featured"><div class="season-feat-img">'+imgBlock+'</div><div class="season-feat-info"><span class="season-tag">Edición limitada · '+matsLabel(p.materiales)+'</span><h3 class="season-feat-title">'+p.nombre+'</h3><p class="season-feat-desc">'+p.descripcion+'</p><div class="season-feat-price">'+p.precio+'</div><button class="btn-filled" onclick="addToCart(\''+safeQ(p.nombre)+'\',\''+safeQ(p.precio)+'\',\''+safeQ(p.imgPrincipal||'')+'\','+idx+')">Añadir al carrito</button></div></div>';
}
 
/* ── FILTRO ── */
function buildFilter(){
  const cats=new Set();
  PRODUCTOS.filter(p=>p.seccion==='stock').forEach(p=>{if(p.categoria)cats.add(p.categoria);});
  const sel=document.getElementById('material-filter');
  sel.innerHTML='<option value="">Todas las categorías</option>';
  [...cats].sort().forEach(c=>{sel.innerHTML+='<option value="'+c+'">'+c+'</option>';});
}
 
/* ── FILTRO PRECIO (NUEVO) ── */
let _priceMin=null,_priceMax=null;
 
function getCardPrice(card){
  const idx=parseInt(card.getAttribute('data-idx')??'-1');
  if(idx<0||!PRODUCTOS[idx])return 0;
  const raw=PRODUCTOS[idx].precio||'0';
  return parseFloat(raw.replace(/[^0-9.,]/g,'').replace(',','.'))||0;
}
 
function applyFilter(){
  const cat=document.getElementById('material-filter').value;
  const minV=_priceMin!==null?_priceMin:null;
  const maxV=_priceMax!==null?_priceMax:null;
  const cards=document.querySelectorAll('#product-grid .product-card');
  let vis=0;
  cards.forEach(c=>{
    const catOk=!cat||c.dataset.cat===cat;
    const price=getCardPrice(c);
    const minOk=minV===null||price>=minV;
    const maxOk=maxV===null||price<=maxV;
    const show=catOk&&minOk&&maxOk;
    c.classList.toggle('hidden',!show);
    if(show)vis++;
  });
  document.getElementById('filter-count').textContent=vis+' producto'+(vis!==1?'s':'');
 
  // Los productos secundarios de temporada SÍ se filtran por precio
  const seasonCards=document.querySelectorAll('.season-small-item');
  seasonCards.forEach(c=>{
    const catOk=!cat||c.dataset.cat===cat;
    const price=getCardPrice(c);
    const minOk=minV===null||price>=minV;
    const maxOk=maxV===null||price<=maxV;
    const show=catOk&&minOk&&maxOk;
    c.classList.toggle('hidden',!show);
  });
 
  const resetBtn=document.getElementById('price-reset');
  if(resetBtn)resetBtn.classList.toggle('hidden',minV===null&&maxV===null);
}
 
function onSliderInput(val){
  const f=parseFloat(val);
  _priceMax=f;
  const maxEl=document.getElementById('price-max');
  if(maxEl)maxEl.value=f.toFixed(0);
  updateSliderTrack(f);
  applyFilter();
}
 
function onPriceInput(){
  const minEl=document.getElementById('price-min'),maxEl=document.getElementById('price-max');
  const minV=minEl.value!==''?parseFloat(minEl.value):null;
  const maxV=maxEl.value!==''?parseFloat(maxEl.value):null;
  _priceMin=minV;_priceMax=maxV;
  const slider=document.getElementById('price-slider-max');
  if(slider&&maxV!==null){slider.value=Math.min(maxV,parseFloat(slider.max));updateSliderTrack(parseFloat(slider.value));}
  applyFilter();
}
 
function updateSliderTrack(val){
  const slider=document.getElementById('price-slider-max');if(!slider)return;
  const pct=((val-parseFloat(slider.min))/(parseFloat(slider.max)-parseFloat(slider.min)))*100;
  slider.style.background='linear-gradient(90deg,var(--accent) '+pct+'%,var(--border) '+pct+'%)';
}
 
function resetPriceFilter(){
  _priceMin=null;_priceMax=null;
  const minEl=document.getElementById('price-min'),maxEl=document.getElementById('price-max'),slider=document.getElementById('price-slider-max');
  if(minEl)minEl.value='';
  if(maxEl)maxEl.value='';
  if(slider){slider.value=slider.max;slider.style.background='var(--border)';}
  applyFilter();
}
 
function initPriceFilter(){
  let maxPrice=0;
  // Ignorar temporada-principal, calcular maxPrice solo de stock y temporada-secundaria
  PRODUCTOS.forEach(p=>{
    if(p.seccion==='stock'||p.seccion==='temporada-secundaria'){
      const raw=p.precio||'0';
      const v=parseFloat(raw.replace(/[^0-9.,]/g,'').replace(',','.'))||0;
      if(v>maxPrice)maxPrice=v;
    }
  });
  const ceiling=Math.ceil(maxPrice/5)*5+5;
  const slider=document.getElementById('price-slider-max');
  if(slider){slider.max=ceiling;slider.value=ceiling;slider.style.background='var(--border)';}
}
 
/* ── COMPORTAMIENTO TACTIL VS MOUSE ── */
const isTouchDevice=()=>window.matchMedia('(hover:none)').matches;
function handleCardClick(e,idx){
  const card=e.currentTarget;
  if(isTouchDevice()){
    e.preventDefault();
    if(card.classList.contains('touched')){openProduct(idx);card.classList.remove('touched');}
    else{document.querySelectorAll('#product-grid .product-card.touched').forEach(c=>c.classList.remove('touched'));card.classList.add('touched');}
  }else{openProduct(idx);}
}
 
/* ── MODAL PRODUCTO ── */
function openProduct(idx){
  window._setModalFavKey && window._setModalFavKey(PRODUCTOS[idx]?.nombre||'');
  window._registrarVistaProducto && window._registrarVistaProducto(PRODUCTOS[idx]?.nombre||'');
  const p=PRODUCTOS[idx];if(!p)return;
  const overlay=document.getElementById('modal-overlay');
  const imgEl=document.getElementById('modal-img-tag'),phEl=document.getElementById('modal-img-ph');
  const src=p.imgSecundaria||p.imgPrincipal;
  if(src){imgEl.src=src;imgEl.style.display='block';phEl.style.display='none';imgEl.onerror=()=>{imgEl.style.display='none';phEl.innerHTML=p.svgPlaceholder||'';phEl.style.display='flex';};}
  else if(p.svgPlaceholder){imgEl.style.display='none';phEl.innerHTML=p.svgPlaceholder;phEl.style.display='flex';}
  else{imgEl.style.display='none';phEl.innerHTML='<div style="font-size:3rem;opacity:.3">📦</div>';phEl.style.display='flex';}
  document.getElementById('modal-kicker').textContent=matsLabel(p.materiales);
  document.getElementById('modal-title').textContent=p.nombre;
  document.getElementById('modal-price').textContent=p.precio;
  document.getElementById('modal-desc').textContent=p.descripcion;
  const specsEl=document.getElementById('modal-specs');specsEl.innerHTML='';
  [['Material',matsLabel(p.materiales)],['Peso',p.peso],['Tiempo de producción',p.tiempoProduccion]].forEach(s=>{
    if(s[1])specsEl.innerHTML+='<div class="modal-spec"><span>'+s[0]+'</span><span>'+s[1]+'</span></div>';
  });
  const coloresContent=(p.colores||[]).length?coloresHTML(p.colores,'modal-color-dot'):'<span style="font-size:.85rem;font-weight:600;color:var(--text2)">Todos</span>';
  document.getElementById('modal-colors').innerHTML='<div class="modal-spec"><span>Colores disponibles</span><div class="modal-colors-row">'+coloresContent+'</div></div>';
  document.getElementById('modal-add-btn').onclick=()=>{addToCart(p.nombre,p.precio,p.imgPrincipal||'',idx);closeModal();};
  overlay.classList.add('open');document.body.style.overflow='hidden';
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('open');document.body.style.overflow='';}
 
/* ── VALIDACIÓN ── */
function setFieldState(el,valid,msg){
  const wrap=el.closest('.form-group')||el.parentElement;
  let hint=wrap.querySelector('.field-hint');
  if(!hint){hint=document.createElement('span');hint.className='field-hint';wrap.appendChild(hint);}
  el.classList.toggle('field-error',!valid);
  el.classList.toggle('field-ok',valid);
  hint.textContent=valid?'':msg;
  hint.style.color=valid?'':'var(--val-err)';
}
function clearFieldState(el){
  const wrap=el.closest('.form-group')||el.parentElement;
  const hint=wrap.querySelector('.field-hint');
  if(hint)hint.textContent='';
  el.classList.remove('field-error','field-ok');
}
function isValidEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);}
function isValidPhone(v){return /^\d{9}$/.test(v.replace(/\s/g,''));}
function isValidPrefix(v){return /^\+\d{1,4}$/.test(v.trim());}

/* Validación formulario carrito */
function validateCCFields(){
  const prefEl=document.getElementById('cc-prefix');
  const phEl=document.getElementById('cc-phone');
  const emEl=document.getElementById('cc-email');
  const prefix=prefEl.value.trim();
  const phone=phEl.value.trim().replace(/\s/g,'');
  const email=emEl.value.trim();
  let ok=true;

  /* Prefijo: obligatorio si hay teléfono */
  if(phone){
    if(!isValidPrefix(prefix)){setFieldState(prefEl,false,'Ej: +34');ok=false;}
    else clearFieldState(prefEl);
  } else clearFieldState(prefEl);

  /* Teléfono */
  if(phone&&!isValidPhone(phone)){setFieldState(phEl,false,'Exactamente 9 dígitos');ok=false;}
  else if(phone){setFieldState(phEl,true,'');}
  else clearFieldState(phEl);

  /* Email */
  if(email&&!isValidEmail(email)){setFieldState(emEl,false,'Formato inválido (ej: tu@email.com)');ok=false;}
  else if(email){setFieldState(emEl,true,'');}
  else clearFieldState(emEl);

  /* Al menos uno obligatorio */
  if(!phone&&!email){
    setFieldState(phEl,false,'Introduce teléfono y/o correo');
    setFieldState(emEl,false,'Introduce teléfono y/o correo');
    ok=false;
  }
  return ok;
}

/* Validación formulario personalizado */
function validateOrderForm(){
  let ok=true;
  const nombre=document.querySelector('.order-form #of-nombre');
  const email=document.querySelector('.order-form #of-email');
  const objeto=document.querySelector('.order-form #of-objeto');
  const cantidad=document.querySelector('.order-form .form-input[placeholder="1"]');
  const color=document.getElementById('custom-color-input');
  const dims=document.querySelector('.order-form .form-input[placeholder="Alto × Ancho × Largo"]');
  const desc=document.querySelector('.order-form .form-textarea');

  if(!nombre.value.trim()||nombre.value.trim().length<2){setFieldState(nombre,false,'Introduce tu nombre (mín. 2 letras)');ok=false;}
  else setFieldState(nombre,true,'');

  if(!email.value.trim()){setFieldState(email,false,'El correo es obligatorio');ok=false;}
  else if(!isValidEmail(email.value.trim())){setFieldState(email,false,'Formato inválido (ej: tu@email.com)');ok=false;}
  else setFieldState(email,true,'');

  if(!objeto.value.trim()||objeto.value.trim().length<3){setFieldState(objeto,false,'Describe brevemente el objeto (mín. 3 caracteres)');ok=false;}
  else setFieldState(objeto,true,'');

  if(!color||!color.value.trim()){setFieldState(color,false,'Indica el color deseado');ok=false;}
  else setFieldState(color,true,'');

  if(!dims||!dims.value.trim()){setFieldState(dims,false,'Indica las dimensiones aproximadas');ok=false;}
  else setFieldState(dims,true,'');

  const cant=parseInt(cantidad.value);
  if(!cantidad.value||isNaN(cant)||cant<1){setFieldState(cantidad,false,'Mínimo 1 unidad');ok=false;}
  else setFieldState(cantidad,true,'');

  if(!desc||!desc.value.trim()||desc.value.trim().length<10){setFieldState(desc,false,'Describe el pedido con más detalle (mín. 10 caracteres)');ok=false;}
  else setFieldState(desc,true,'');

  return ok;
}

/* ── MODAL PEDIDO ── */
function submitOrder(){
  if(!validateOrderForm())return;
  const nombre=document.querySelector('.order-form #of-nombre').value.trim();
  const email=document.querySelector('.order-form #of-email').value.trim();
  const objeto=document.querySelector('.order-form #of-objeto').value.trim();
  const material=document.querySelector('.mat-pill.active')?.textContent||'—';
  const color=document.getElementById('custom-color-input')?.value.trim()||'—';
  const dims=document.querySelector('.order-form .form-input[placeholder="Alto × Ancho × Largo"]')?.value.trim()||'—';
  const cantidad=document.querySelector('.order-form .form-input[placeholder="1"]')?.value||'1';
  let desc=document.querySelector('.order-form .form-textarea')?.value.trim()||'—';
  if(desc.length>200)desc=desc.slice(0,200)+'…';

  const lines=[
    'Nombre: '+nombre,
    'Correo: '+email,
    'Objeto: '+objeto,
    'Material: '+material,
    'Color: '+color,
    'Dimensiones: '+dims,
    'Cantidad: '+cantidad,
    'Descripción: '+desc,
  ];
  document.getElementById('osm-summary-box').textContent=lines.join('\n');
  document.getElementById('order-summary-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeOrderSummary(){document.getElementById('order-summary-overlay').classList.remove('open');document.body.style.overflow='';}
function confirmOrder(){
  closeOrderSummary();
  // Limpiar formulario
  document.querySelector('.order-form #of-nombre').value='';
  document.querySelector('.order-form #of-email').value='';
  document.querySelector('.order-form #of-objeto').value='';
  document.getElementById('custom-color-input').value='';
  const dims=document.querySelector('.order-form .form-input[placeholder="Alto × Ancho × Largo"]');if(dims)dims.value='';
  const cant=document.querySelector('.order-form .form-input[placeholder="1"]');if(cant)cant.value='';
  const ta=document.querySelector('.order-form .form-textarea');if(ta)ta.value='';
  document.querySelectorAll('.order-form .form-input,.order-form .form-textarea').forEach(el=>clearFieldState(el));
  showToast('¡Solicitud enviada! Te contactamos en 24 h ✓');
}
function copyOrderSummary(){
  const txt=document.getElementById('osm-summary-box').textContent;
  navigator.clipboard?.writeText(txt);
  showToast('¡Datos copiados! ✓');
}
function copyPhone(){navigator.clipboard?.writeText(document.getElementById('osm-phone').textContent);showToast('Número copiado ✓');}

function openCheckoutContact(){
  closeCartPanel();
  document.getElementById('cc-prefix').value='+34';
  document.getElementById('cc-phone').value='';
  document.getElementById('cc-email').value='';
  document.getElementById('checkout-contact-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCheckoutContact(){
  document.getElementById('checkout-contact-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function goToOrderConfirm(){
  if(!validateCCFields())return;
  const prefix=document.getElementById('cc-prefix').value.trim();
  const phone=document.getElementById('cc-phone').value.trim();
  const email=document.getElementById('cc-email').value.trim();
  closeCheckoutContact();
  // Build summary text
  let lines=[];
  if(email)lines.push('Correo: '+email);
  if(phone)lines.push('Número: '+(prefix?prefix+' ':'')+phone);
  if(cartItems.length){
    const pedidoLineas=cartItems.map(i=>{
      let s=i.name+' × '+i.qty;
      let total=i.price*i.qty;
      if(i.descuentoEscalonado&&i.descuentoEscalonado.porcentaje&&i.qty>i.descuentoEscalonado.unidades){
        const u=i.descuentoEscalonado.unidades,d=i.descuentoEscalonado.porcentaje;
        total=(i.price*u)+(i.price*(i.qty-u)*(1-d));
      }
      return s+' (€'+total.toFixed(2)+')';
    });
    lines.push('Pedido: '+pedidoLineas.join(', '));
    const grandTotal=cartItems.reduce((s,i)=>{
      let t=i.price*i.qty;
      if(i.descuentoEscalonado&&i.descuentoEscalonado.porcentaje&&i.qty>i.descuentoEscalonado.unidades){
        const u=i.descuentoEscalonado.unidades,d=i.descuentoEscalonado.porcentaje;
        t=(i.price*u)+(i.price*(i.qty-u)*(1-d));
      }
      return s+t;
    },0);
    lines.push('Total: €'+grandTotal.toFixed(2));
  }
  document.getElementById('cc-summary-box').textContent=lines.join('\n');
  document.getElementById('checkout-confirm-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCheckoutConfirm(){
  document.getElementById('checkout-confirm-overlay').classList.remove('open');
  document.body.style.overflow='';
}
function copySummary(){
  const txt=document.getElementById('cc-summary-box').textContent;
  navigator.clipboard?.writeText(txt);
  showToast('¡Datos copiados! ✓');
}
function finalizeOrder(){
  closeCheckoutConfirm();
  clearCart();
  showToast('¡Pedido enviado! Te contactamos pronto ✓');
}
 
/* ── HUCHA ── */
function renderPiggy(){
  document.getElementById('piggy-fill-bar').style.width=piggyFilled+'%';
  document.getElementById('piggy-current-val').textContent='€'+piggyCurrent.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById('piggy-goal-val').textContent='€'+piggyGoal.toLocaleString('es-ES');
  document.getElementById('piggy-pct-label').textContent=piggyFilled+'% completado';
  buildPiggySVG(piggyFilled);
}
function buildPiggySVG(pct){
  const svg=document.getElementById('piggy-svg');if(!svg)return;
  const cx=150,cy=158,rx=102,ry=100,fb=cy+ry,ft=cy-ry,fr=fb-ft,fy=fb-(pct/100)*fr;
  const lc=pct>75?'#c8860a':'#a86a08',ll=pct>75?'#f5c842':'#d4a017';
  svg.innerHTML='<defs>'
    +'<radialGradient id="bG" cx="36%" cy="28%" r="62%"><stop offset="0%" stop-color="#f0d060"/><stop offset="30%" stop-color="#c8940c"/><stop offset="65%" stop-color="#9a6b04"/><stop offset="100%" stop-color="#6b4500"/></radialGradient>'
    +'<radialGradient id="eG" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#e8c040"/><stop offset="100%" stop-color="#7a5200"/></radialGradient>'
    +'<radialGradient id="sG" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="#b8880a"/><stop offset="60%" stop-color="#8a5e04"/><stop offset="100%" stop-color="#5c3a00"/></radialGradient>'
    +'<radialGradient id="lG" cx="35%" cy="25%" r="70%"><stop offset="0%" stop-color="#d4a010"/><stop offset="100%" stop-color="#7a5200"/></radialGradient>'
    +'<pattern id="gP" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.4" fill="#6b4200" opacity="0.55"/></pattern>'
    +'<clipPath id="bC"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'"/></clipPath>'
    +'<linearGradient id="lqG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+ll+'" stop-opacity="0.85"/><stop offset="100%" stop-color="'+lc+'" stop-opacity="0.95"/></linearGradient>'
    +'<radialGradient id="shG" cx="32%" cy="22%" r="40%"><stop offset="0%" stop-color="rgba(255,255,220,0.52)"/><stop offset="100%" stop-color="rgba(255,255,220,0)"/></radialGradient>'
    +'<filter id="sf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter>'
    +'</defs>'
    +'<ellipse cx="150" cy="274" rx="82" ry="10" fill="rgba(0,0,0,0.18)" filter="url(#sf)"/>'
    +'<path d="M94,72 Q84,54 100,50 Q116,48 112,68 Q106,76 94,72 Z" fill="url(#eG)"/>'
    +'<path d="M206,72 Q216,54 200,50 Q184,48 188,68 Q194,76 206,72 Z" fill="url(#eG)"/>'
    +'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="url(#bG)"/>'
    +'<g clip-path="url(#bC)">'
    +(pct>0
      ?'<rect x="'+(cx-rx)+'" y="'+fy+'" width="'+(rx*2)+'" height="'+(fb-fy+2)+'" fill="url(#lqG)"/>'
        +'<g><path d="M'+(cx-rx-10)+','+fy+' Q'+(cx-50)+','+(fy-9)+' '+cx+','+fy+' Q'+(cx+50)+','+(fy+9)+' '+(cx+rx+10)+','+fy+' L'+(cx+rx+10)+','+(fb+5)+' L'+(cx-rx-10)+','+(fb+5)+' Z" fill="'+ll+'" opacity="0.6"><animateTransform attributeName="transform" type="translate" values="0,0;-18,0;0,0" dur="2.8s" repeatCount="indefinite"/></path></g>'
        +'<ellipse cx="'+(cx-20)+'" cy="'+(fy+8)+'" rx="22" ry="4" fill="rgba(255,255,200,0.35)" opacity="'+(pct>4?1:0)+'"/>'
      :'')
    +'</g>'
    +'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="#5c3a00" stroke-width="2" opacity="0.3"/>'
    +'<rect x="140" y="59" width="20" height="5" rx="2.5" fill="#3a2000" opacity="0.75"/>'
    +'<circle cx="150" cy="175" r="46" fill="url(#sG)"/>'
    +'<circle cx="150" cy="175" r="46" fill="url(#gP)" opacity="0.9"/>'
    +'<circle cx="150" cy="175" r="46" fill="none" stroke="#c8940c" stroke-width="2.5" opacity="0.6"/>'
    +'<ellipse cx="136" cy="178" rx="12" ry="14" fill="#1a0e00" opacity="0.88"/>'
    +'<ellipse cx="164" cy="178" rx="12" ry="14" fill="#1a0e00" opacity="0.88"/>'
    +'<path d="M108,112 L116,120 L124,112" fill="none" stroke="#1a0e00" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    +'<path d="M176,112 L184,120 L192,112" fill="none" stroke="#1a0e00" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    +'<ellipse cx="98" cy="256" rx="18" ry="13" fill="url(#lG)"/><rect x="80" y="243" width="36" height="16" fill="url(#lG)"/>'
    +'<ellipse cx="202" cy="256" rx="18" ry="13" fill="url(#lG)"/><rect x="184" y="243" width="36" height="16" fill="url(#lG)"/>'
    +'<ellipse cx="112" cy="256" rx="18" ry="13" fill="url(#lG)"/><rect x="94" y="243" width="36" height="16" fill="url(#lG)"/>'
    +'<ellipse cx="188" cy="256" rx="18" ry="13" fill="url(#lG)"/><rect x="170" y="243" width="36" height="16" fill="url(#lG)"/>'
    +'<ellipse cx="98" cy="243" rx="18" ry="11" fill="#d4a010"/><ellipse cx="202" cy="243" rx="18" ry="11" fill="#d4a010"/>'
    +'<ellipse cx="112" cy="243" rx="18" ry="11" fill="#d4a010"/><ellipse cx="188" cy="243" rx="18" ry="11" fill="#d4a010"/>'
    +'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="url(#shG)"/>'
    +'<ellipse cx="108" cy="98" rx="14" ry="9" fill="rgba(255,255,230,0.38)" transform="rotate(-20,108,98)"/>'
    +'<ellipse cx="111" cy="96" rx="6" ry="4" fill="rgba(255,255,255,0.55)" transform="rotate(-20,111,96)"/>';
}
 
/* ── COLLAGE BUILDER ── */

// Reconstruir collage cuando cambien los favoritos o los productos de Firestore
window._rebuildCollage = function(favCount){
  _collageFavCount = favCount || _collageFavCount;
  buildCollage();
};
let _collageFavCount = {}; // {nombre: n_favs}

function buildCollage(){
  const track = document.getElementById('collage-track');
  if(!track) return;

  // Recopilar todos los productos con imagen
  const allProds = [];

  // Productos del script.js
  if(typeof PRODUCTOS !== 'undefined'){
    PRODUCTOS.forEach(p => {
      const img = p.imgPrincipal || (p.imagenes && p.imagenes[0]) || '';
      if(img) allProds.push({ name: p.nombre||'', img });
    });
  }
  // Productos de Firestore (stock + temporada)
  if(typeof _productosFirestore !== 'undefined'){
    _productosFirestore.forEach(p => { if(p.imgUrl) allProds.push({ name: p.nombre||'', img: p.imgUrl }); });
  }
  if(typeof _productosTemporada !== 'undefined'){
    _productosTemporada.forEach(p => { if(p.imgUrl) allProds.push({ name: p.nombre||'', img: p.imgUrl }); });
  }

  // Fallback a COLLAGE_FOTOS si no hay productos con imagen
  const baseFotos = allProds.length
    ? allProds.map(p => p.img)
    : (typeof COLLAGE_FOTOS !== 'undefined' ? COLLAGE_FOTOS : []);

  if(!baseFotos.length) return;

  // Ordenar por favoritos
  const sorted = [...allProds].sort((a,b) => (_collageFavCount[b.name]||0) - (_collageFavCount[a.name]||0));
  const sortedImgs = sorted.length ? sorted.map(p=>p.img) : baseFotos;

  // Resto aleatorio (los que no están en los primeros 4)
  const top4  = sortedImgs.slice(0,4);
  const rest  = sortedImgs.slice(4);
  // Mezclar el resto
  for(let i=rest.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}

  // Construir cells:
  // Bloque especial: col1=2x2 (top fav), col2=2alto×1ancho (2º fav), col3=2alto×1ancho (3º fav), col4=2alto×1ancho (4º fav)
  // Luego el resto en 1x1
  const cells = [];

  // Celda 2×2 — primer producto (span 2 columnas, 2 filas)
  if(top4[0]) cells.push({ src: top4[0], wide: true, tall: true });

  // Celdas 2alto×1ancho — productos 2,3,4
  [top4[1], top4[2], top4[3]].forEach(src => {
    if(src) cells.push({ src, wide: false, tall: true });
  });

  // Resto en 1×1
  const restLoop = rest.length ? rest : baseFotos;
  let ri = 0;
  while(cells.length < 40){
    cells.push({ src: restLoop[ri % restLoop.length], wide: false, tall: false });
    ri++;
  }

  // Duplicar para bucle infinito
  const allCells = [...cells, ...cells];

  // Calcular grid: necesitamos saber cuántas columnas ocupa cada cell
  // Usamos CSS grid con grid-column: span 2 para la wide
  track.innerHTML = '';
  // Cambiar el grid para soportar wide (2 cols)
  track.style.gridTemplateColumns = 'repeat(auto-flow, 180px)';
  track.style.gridAutoColumns = '180px';

  allCells.forEach(({ src, wide, tall }) => {
    const div = document.createElement('div');
    div.className = 'collage-cell' + (tall ? ' tall' : '');
    if(wide) div.style.gridColumn = 'span 2';
    const img = document.createElement('img');
    img.alt = 'Carr3D producto';
    img.loading = 'lazy';
    img.onload = function(){
      const ratio = this.naturalWidth / this.naturalHeight;
      this.style.objectPosition = ratio > 1.4 ? 'center center' : ratio < 0.75 ? 'center top' : 'center center';
    };
    img.src = src;
    div.appendChild(img);
    track.appendChild(div);
  });
}

/* ── DOM READY ── */
if('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0,0);

document.addEventListener('DOMContentLoaded',function(){
  /* Badge tooltips */
  const btt=document.getElementById('badge-tooltip');
  let bttActive=false;

  // Desktop: hover + mousemove
  document.addEventListener('mouseover',e=>{
    const b=e.target.closest('.badge-tip');
    if(!b||!b.dataset.tip)return;
    btt.textContent=b.dataset.tip;
    btt.classList.add('visible');
  });
  document.addEventListener('mousemove',e=>{
    if(!btt.classList.contains('visible')||bttActive)return;
    const tw=btt.offsetWidth,x=e.clientX;
    let left=x-16;
    if(left+tw>window.innerWidth-8)left=window.innerWidth-tw-8;
    btt.style.left=left+'px';
    btt.style.top=(e.clientY+18)+'px';
  });
  document.addEventListener('mouseout',e=>{
    if(e.target.closest('.badge-tip'))btt.classList.remove('visible');
  });

  // Móvil: tap en badge → mostrar tooltip anclado encima del badge
  document.addEventListener('touchstart',e=>{
    const b=e.target.closest('.badge-tip');
    if(b&&b.dataset.tip){
      e.stopPropagation();
      bttActive=true;
      btt.textContent=b.dataset.tip;
      // Posicionar encima del badge
      const r=b.getBoundingClientRect();
      btt.style.top='';btt.style.bottom='';btt.style.left='';
      btt.classList.add('visible');
      requestAnimationFrame(()=>{
        const tw=btt.offsetWidth,th=btt.offsetHeight;
        let left=r.left;
        if(left+tw>window.innerWidth-8)left=window.innerWidth-tw-8;
        if(left<8)left=8;
        // Intentar colocar encima; si no cabe, debajo
        const top=r.top-th-10>0?r.top-th-10:r.bottom+10;
        btt.style.left=left+'px';
        btt.style.top=top+'px';
      });
      return;
    }
    // Tocar fuera cierra el tooltip
    if(bttActive){btt.classList.remove('visible');bttActive=false;}
  },{passive:false});
  /* Theme */
  const html=document.documentElement,tb=document.getElementById('theme-toggle');
  const sv=localStorage.getItem('carr3d-theme');
  if(sv){html.setAttribute('data-theme',sv);tb.textContent=sv==='dark'?'☀️':'🌙';}
  tb.addEventListener('click',()=>{
    const n=html.getAttribute('data-theme')==='dark'?'light':'dark';
    html.setAttribute('data-theme',n);
    tb.textContent=n==='dark'?'☀️':'🌙';
    localStorage.setItem('carr3d-theme',n);
    window._guardarTemaEnFirestore && window._guardarTemaEnFirestore(n);
  });
  /* Hamburger */
  const hb=document.getElementById('hamburger-btn'),mm=document.getElementById('mobile-menu');
  hb.addEventListener('click',()=>{const o=mm.classList.toggle('open');hb.textContent=o?'✕':'☰';document.body.style.overflow=o?'hidden':'';});
  mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');hb.textContent='☰';document.body.style.overflow='';}));
  /* Progress */
  window.addEventListener('scroll',()=>{document.getElementById('progress-bar').style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%';},{passive:true});
  /* Seq images */
  const TOTAL=45,PREFIX='img/frame_',EXT='.jpg';
  const frames=[];
  for(let i=1;i<=TOTAL;i++){const img=new Image();img.src=PREFIX+String(i).padStart(3,'0')+EXT;frames.push(img);}
  const wr=document.getElementById('hero-sticky-wrapper'),si=document.getElementById('seq-img'),pl=document.getElementById('seq-placeholder'),ct=document.getElementById('frame-counter'),hc=document.getElementById('hero-cta');
  let cf=-1;
  function updateSeq(){
    const r=wr.getBoundingClientRect(),sc=-r.top,tot=r.height-window.innerHeight,prog=Math.max(0,Math.min(1,sc/tot)),idx=Math.min(Math.floor(prog*TOTAL),TOTAL-1);
    prog>0.88?hc.classList.add('visible'):hc.classList.remove('visible');
    if(idx===cf&&cf!==-1)return;cf=idx;ct.textContent=(idx+1)+' / '+TOTAL;
    const img=frames[idx];
    if(img&&img.complete&&img.naturalWidth>0){si.src=img.src;si.style.display='block';pl.style.display='none';}
    else{img.onload=()=>{si.src=img.src;si.style.display='block';pl.style.display='none';};pl.style.display='flex';}
  }
  window.addEventListener('scroll',updateSeq,{passive:true});updateSeq();
  /* Render productos */
  const grid=document.getElementById('product-grid');
  const ssm=document.getElementById('season-smalls');
  const sfw=document.getElementById('season-featured-wrap');
  PRODUCTOS.forEach((p,idx)=>{
    if(p.seccion==='stock')grid.innerHTML+=cardHTML(p,idx);
    if(p.seccion==='temporada-principal')sfw.innerHTML+=seasonFeaturedHTML(p,idx);
    if(p.seccion==='temporada-secundaria')ssm.innerHTML+='<div class="product-card season-small-item" data-cat="'+(p.categoria||'')+'" data-idx="'+idx+'" onclick="openProduct('+idx+')">'+badgeHTML(p.destacado)+'<div class="card-img" style="background:var(--bg3)"><img src="'+safeQ(p.imgPrincipal)+'" alt="'+safeQ(p.nombre)+'" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'"><div class="card-img-placeholder" style="display:none;">'+p.svgPlaceholder+'</div><div class="card-overlay"><button class="view-btn" onclick="event.stopPropagation();openProduct('+idx+')">Ver</button><button class="add-btn" onclick="event.stopPropagation();addToCart(\''+safeQ(p.nombre)+'\',\''+safeQ(p.precio)+'\',\''+safeQ(p.imgPrincipal||'')+'\','+idx+')">+ Carrito</button></div></div><div class="card-info"><div class="card-categoria">'+p.categoria+'</div><div class="card-name">'+p.nombre+'</div><div class="card-meta"><span class="card-price">'+p.precio+'</span><span class="card-mat-pill">'+(p.materiales||[]).join(' · ')+'</span></div></div></div>';
  });
  /* Filtro */
  buildFilter();
  initPriceFilter();
  document.getElementById('material-filter').addEventListener('change',applyFilter);
  applyFilter();
  /* Reveal */
  const ro=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
  /* Counters */
  const so=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;so.disconnect();
    document.querySelectorAll('[data-target]').forEach(el=>{
      const t=+el.dataset.target,sf=el.dataset.suf;let c=0;const st=t/55;
      const ti=setInterval(()=>{c=Math.min(c+st,t);el.textContent=Math.floor(c)+sf;if(c>=t)clearInterval(ti);},18);
    });
  },{threshold:.5});
  so.observe(document.getElementById('stats'));
/* ── Validación en tiempo real: formulario personalizado ── */
  const orderForm=document.querySelector('.order-form');
  if(orderForm){
    const nombre=orderForm.querySelector('#of-nombre');
    const email=orderForm.querySelector('#of-email');
    const objeto=orderForm.querySelector('#of-objeto');
    const cantidad=orderForm.querySelector('.form-input[placeholder="1"]');
    const color=document.getElementById('custom-color-input');
    const dims=orderForm.querySelector('.form-input[placeholder="Alto × Ancho × Largo"]');
    const desc=orderForm.querySelector('.form-textarea');

    nombre?.addEventListener('input',()=>{
      if(!nombre.value.trim()||nombre.value.trim().length<2)setFieldState(nombre,false,'Mín. 2 letras');
      else setFieldState(nombre,true,'');
    });
    email?.addEventListener('input',()=>{
      if(!email.value.trim())clearFieldState(email);
      else if(!isValidEmail(email.value.trim()))setFieldState(email,false,'Formato inválido');
      else setFieldState(email,true,'');
    });
    objeto?.addEventListener('input',()=>{
      if(!objeto.value.trim()||objeto.value.trim().length<3)setFieldState(objeto,false,'Mín. 3 caracteres');
      else setFieldState(objeto,true,'');
    });
    color?.addEventListener('input',()=>{
      if(!color.value.trim())setFieldState(color,false,'Indica el color deseado');
      else setFieldState(color,true,'');
    });
    dims?.addEventListener('input',()=>{
      if(!dims.value.trim())setFieldState(dims,false,'Indica las dimensiones');
      else setFieldState(dims,true,'');
    });
    cantidad?.addEventListener('input',()=>{
      cantidad.value=cantidad.value.replace(/[^0-9]/g,'');
      const v=parseInt(cantidad.value);
      if(!cantidad.value||isNaN(v)||v<1)setFieldState(cantidad,false,'Mínimo 1');
      else setFieldState(cantidad,true,'');
    });
    desc?.addEventListener('input',()=>{
      if(!desc.value.trim()||desc.value.trim().length<10)setFieldState(desc,false,'Mín. 10 caracteres');
      else setFieldState(desc,true,'');
    });
  }

  /* ── Validación en tiempo real: modal carrito ── */
  const ccPhone=document.getElementById('cc-phone');
  const ccPrefix=document.getElementById('cc-prefix');
  const ccEmail=document.getElementById('cc-email');
  ccPhone?.addEventListener('input',()=>{
    ccPhone.value=ccPhone.value.replace(/[^0-9 ]/g,'');
    const v=ccPhone.value.replace(/\s/g,'');
    if(!v){clearFieldState(ccPhone);clearFieldState(ccPrefix);return;}
    if(!isValidPhone(v))setFieldState(ccPhone,false,'Exactamente 9 dígitos');
    else setFieldState(ccPhone,true,'');
    if(ccPrefix.value.trim()&&!isValidPrefix(ccPrefix.value.trim()))setFieldState(ccPrefix,false,'Ej: +34');
    else if(ccPrefix.value.trim())setFieldState(ccPrefix,true,'');
  });
  ccPrefix?.addEventListener('input',()=>{
    ccPrefix.value=ccPrefix.value.replace(/[^+0-9]/g,'');
    if(!ccPrefix.value)return;
    if(!isValidPrefix(ccPrefix.value))setFieldState(ccPrefix,false,'Ej: +34');
    else setFieldState(ccPrefix,true,'');
  });
  ccEmail?.addEventListener('input',()=>{
    if(!ccEmail.value.trim()){clearFieldState(ccEmail);return;}
    if(!isValidEmail(ccEmail.value.trim()))setFieldState(ccEmail,false,'Formato inválido');
    else setFieldState(ccEmail,true,'');
  });
  /* Modals */
  document.getElementById('modal-close-btn').addEventListener('click',closeModal);
  ['modal-overlay','order-summary-overlay','cart-panel-overlay','checkout-contact-overlay','checkout-confirm-overlay'].forEach(id=>{
    const el=document.getElementById(id);
    el.addEventListener('click',e=>{if(e.target===el){if(id==='modal-overlay')closeModal();else if(id==='order-summary-overlay')closeOrderSummary();else if(id==='checkout-contact-overlay')closeCheckoutContact();else if(id==='checkout-confirm-overlay')closeCheckoutConfirm();else closeCartPanel();}});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCartPanel();closeOrderSummary();closeCheckoutContact();closeCheckoutConfirm();}});
  /* Hucha */
  renderPiggy();
  /* Metas cumplidas */
  renderMetas();
  /* Collage */
  buildCollage();
  const po=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)setTimeout(()=>{document.getElementById('piggy-fill-bar').style.width=piggyFilled+'%';},200);},{threshold:.3});
  const ps=document.getElementById('piggy-goal');if(ps)po.observe(ps);
});
 
function scroll2(s){document.querySelector(s)?.scrollIntoView({behavior:'smooth'});}
function showToast(msg){document.getElementById('t-msg').textContent=msg;const t=document.getElementById('toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}
function selectMat(el){document.querySelectorAll('.mat-pill').forEach(m=>m.classList.remove('active'));el.classList.add('active');}
function selectColor(el){document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));el.classList.add('active');}

/* ── CONTENIDOS DE LOS MODALES ── */
const INFO_MODALS = {

  materiales: {
    icon: '🧪',
    title: 'Materiales disponibles',
    body: `
      <div class="im-section">
        <p class="im-section-title">Material actual</p>
        <div class="im-mat-card">
          <div class="im-mat-icon">🌿</div>
          <div>
            <p class="im-mat-name">PLA (Ácido Poliláctico)</p>
            <p class="im-mat-desc">
              Actualmente trabajamos exclusivamente con PLA, un material de origen vegetal
              y fácil de imprimir. Ofrece una excelente precisión dimensional, acabados
              lisos y una amplia gama de colores. Es la opción más habitual para
              decoración, llaveros y piezas de uso cotidiano que no estén expuestas
              a altas temperaturas.
            </p>
          </div>
        </div>
      </div>

      <div class="im-section">
        <p class="im-section-title">Características del PLA</p>
        <p>✅ Alta rigidez y buena resistencia mecánica</p>
        <p>✅ Temperatura de impresión moderada (190–220 °C)</p>
        <p>✅ Biodegradable en condiciones industriales</p>
        <p>⚠️ No apto para entornos con temperaturas superiores a ~60 °C</p>
        <p>⚠️ Menor flexibilidad respecto a otros materiales como el TPU</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Próximos materiales</p>
        <p>A medida que vayamos ampliando nuestra infraestructura, tenemos previsto
          incorporar gradualmente nuevos materiales para poder cubrir un mayor
          abanico de necesidades:</p>
        <div class="im-chips">
          <span class="im-chip">PETG</span>
          <span class="im-chip">ABS</span>
          <span class="im-chip">TPU (flexible)</span>
          <span class="im-chip">ASA</span>
          <span class="im-chip">Resina (SLA)</span>
        </div>
        <div class="im-soon-badge">🏦 La expansión depende de nuestras metas de recaudación</div>
      </div>
    `
  },

  envios: {
    icon: '📦',
    title: 'Política de envíos',
    body: `
      <div class="im-section">
        <p class="im-section-title">Plazos de entrega</p>
        <p>La mayoría de los pedidos se preparan y despachan en un plazo de
          <strong>24–48 horas</strong> desde la confirmación del pago. No obstante,
          ciertos factores pueden prolongar este tiempo:</p>
        <div class="im-chips">
          <span class="im-chip">24–48 h</span>
          <span class="im-chip">Estándar</span>
          <span class="im-chip">Piezas grandes: 3–5 días</span>
          <span class="im-chip">Pedidos personalizados: hasta 7 días</span>
        </div>
      </div>

      <div class="im-section">
        <p class="im-section-title">Factores que pueden influir en el plazo</p>
        <p>🔹 <strong>Tamaño y complejidad de la pieza:</strong> Las impresiones de mayor
          volumen o con geometrías complejas requieren más horas de fabricación.</p>
        <p>🔹 <strong>Cantidad de unidades:</strong> Pedidos con varias unidades se
          procesan en lotes, lo que puede añadir uno o dos días laborables.</p>
        <p>🔹 <strong>Distancia de entrega:</strong> Enviamos a toda España. Las zonas más alejadas de Extremadura pueden necesitar un día extra de tránsito.</p>
        <p>🔹 <strong>Festivos y fines de semana:</strong> Los plazos se cuentan en
          días laborables. Los pedidos realizados en viernes o víspera de festivo
          se procesan el siguiente día hábil.</p>
      </div>

    `
  },

  aviso: {
    icon: '📋',
    title: 'Aviso legal',
    body: `
      <div class="im-section">
        <p class="im-section-title">Titular del sitio</p>
        <p>El presente sitio web es titularidad de <strong>Carr3D</strong>, actividad de
          fabricación y venta de objetos mediante impresión 3D, con sede en
          Extremadura, España. El uso de este sitio implica la aceptación de
          las condiciones aquí descritas.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Objeto y actividad</p>
        <p>Carr3D ofrece productos impresos en 3D tanto de catálogo como bajo pedido
          personalizado. Todos los artículos se fabrican de forma artesanal con
          materiales de calidad. Las imágenes y descripciones son orientativas;
          el resultado final puede presentar ligeras variaciones propias del proceso
          de impresión.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Propiedad intelectual</p>
        <p>Los diseños, fotografías, textos y logotipos presentes en esta web son
          propiedad de Carr3D o de sus respectivos autores y están protegidos por
          la legislación española e internacional de propiedad intelectual.
          Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Responsabilidad</p>
        <p>Carr3D no se hace responsable del uso indebido que el usuario pueda hacer
          de los productos adquiridos. Las piezas decorativas no están diseñadas
          para soportar cargas estructurales ni para uso en entornos de alta
          temperatura salvo indicación expresa.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Legislación aplicable</p>
        <p>Este aviso legal se rige por la legislación española vigente. Para
          cualquier controversia derivada del uso de este sitio web, las partes
          se someten a los juzgados y tribunales de Extremadura.</p>
      </div>
    `
  },

  privacidad: {
    icon: '🔒',
    title: 'Política de privacidad',
    body: `
      <div class="im-section">
        <p class="im-section-title">Responsable del tratamiento</p>
        <p>Carr3D es el responsable del tratamiento de los datos personales que
          el usuario facilite a través de los formularios de este sitio web,
          de conformidad con el Reglamento General de Protección de Datos (RGPD)
          y la Ley Orgánica 3/2018 de Protección de Datos.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Datos que recopilamos</p>
        <p>Únicamente recogemos los datos que el usuario introduce voluntariamente
          en el formulario de pedido personalizado: nombre, correo electrónico,
          descripción del encargo y datos de contacto. No se recogen datos de
          forma automática más allá de los estrictamente necesarios para el
          funcionamiento técnico del sitio.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Finalidad y uso</p>
        <p>Los datos se utilizan exclusivamente para gestionar y responder a la
          solicitud del usuario, elaborar presupuestos y coordinar la entrega del
          pedido. No cedemos ni vendemos datos a terceros bajo ningún concepto.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Conservación</p>
        <p>Los datos se conservan durante el tiempo necesario para tramitar el
          pedido y el periodo legal de garantía. Transcurrido ese plazo, se
          eliminan de forma segura.</p>
      </div>

      <div class="im-section">
        <p class="im-section-title">Tus derechos</p>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión,
          portabilidad y oposición escribiéndonos a
          <strong>Carr3D@gmail.com</strong>. Atendemos todas las solicitudes
          en un plazo máximo de 30 días.</p>
      </div>
    `
  },

  contacto: {
    icon: '✉️',
    title: 'Contacto',
    body: `
      <div class="im-section">
        <p class="im-section-title">Pedidos personalizados</p>
        <p>¿Tienes una idea en mente? La mejor forma de ponerte en contacto con
          nosotros para encargar una pieza personalizada es a través del formulario
          de la sección <strong>«Pedidos personalizados»</strong> de esta misma web.</p>
        <p>Cuéntanos qué quieres imprimir, las dimensiones aproximadas, el color
          y cualquier detalle que nos ayude a entender tu proyecto. Te responderemos
          con un presupuesto en menos de 24 horas laborables.</p>
        <button onclick="closeInfoModal();setTimeout(()=>scroll2('#custom'),150)" style="
          margin-top:.5rem;padding:.6rem 1.2rem;background:var(--accent);color:#fff;
          border:none;border-radius:.6rem;font-size:.9rem;font-weight:700;
          cursor:pointer;font-family:inherit;">
          Ir a pedidos personalizados →
        </button>
      </div>

      <div class="im-section" style="margin-top:1.5rem;">
        <p class="im-section-title">Otras consultas</p>
        <p>Para cualquier otra duda, incidencia con un pedido ya realizado o
          consulta general, puedes escribirnos directamente al correo:</p>
        <a href="mailto:Carr3D@gmail.com" style="
          display:inline-flex;align-items:center;gap:.5rem;margin-top:.5rem;
          padding:.6rem 1.2rem;background:var(--bg2);border:1px solid var(--border);
          border-radius:.6rem;font-size:.95rem;font-weight:700;color:var(--text1);
          text-decoration:none;">
          📧 Carr3D@gmail.com
        </a>
        <p style="margin-top:.75rem;font-size:.85rem;">Intentamos responder en un plazo de 24–48 horas laborables.</p>
      </div>
    `
  },

  faq: {
    icon: '❓',
    title: 'Preguntas frecuentes',
    body: `
      <div style="margin-top:.25rem;">
        ${[
          {
            q: '¿Cómo puedo realizar un pedido personalizado?',
            a: 'Dirígete a la sección «Pedidos personalizados» de nuestra web y rellena el formulario con los datos de tu proyecto: objeto, material, color, dimensiones y descripción. Te enviaremos un presupuesto en menos de 24 horas laborables.'
          },
          {
            q: '¿Qué formato de archivo necesito para un diseño propio?',
            a: 'Aceptamos archivos STL, OBJ y 3MF, que son los formatos estándar para impresión 3D. Si no tienes el modelo 3D, descríbenos la pieza y valoraremos si podemos diseñarla o adaptarla para ti.'
          },
          {
            q: '¿Puedo elegir el color de mi pieza?',
            a: 'Sí. En el catálogo cada producto indica los colores disponibles. Para pedidos personalizados disponemos de más de 20 tonalidades de PLA. Consulta disponibilidad en el formulario de pedido.'
          },
          {
            q: '¿Qué hago si mi pedido llega dañado?',
            a: 'Escríbenos en las primeras 48 horas tras recibir el paquete con una foto del desperfecto. Revisaremos el caso y, si se confirma un fallo de fabricación o transporte, reimprimiremos o reembolsaremos la pieza sin coste adicional.'
          },
          {
            q: '¿Admitís devoluciones?',
            a: 'Dado que cada pieza se fabrica bajo demanda, no admitimos devoluciones por cambio de opinión. Sí atendemos incidencias por defectos de fabricación o errores en el pedido. Contacta con nosotros y buscaremos la mejor solución.'
          },
          {
            q: '¿Podéis imprimir en grandes cantidades?',
            a: 'Sí, ofrecemos precios especiales para pedidos a partir de 10 unidades del mismo modelo. Contáctanos a través del formulario de pedidos personalizados y te preparamos un presupuesto adaptado.'
          },
          {
            q: '¿Las piezas son resistentes al agua?',
            a: 'El PLA tiene una resistencia moderada a la humedad puntual, pero no es apto para inmersión prolongada ni para entornos muy húmedos. Si necesitas piezas impermeables, consúltanos sobre futuros materiales como el PETG o ABS.'
          },
        ].map((item,i)=>`
          <div class="im-faq-item" id="faq-item-${i}">
            <button class="im-faq-q" onclick="toggleFaq(${i})">
              <span>${item.q}</span>
              <span class="im-faq-arrow">▼</span>
            </button>
            <div class="im-faq-a">${item.a}</div>
          </div>
        `).join('')}
      </div>
    `
  }
};


let _metasFirestore = [];

function renderMetas() {
  const grid  = document.getElementById('metas-grid');
  const empty = document.getElementById('metas-empty');
  if (!grid) return;
  grid.innerHTML = '';

  // Combinar hardcoded + Firestore
  const todas = [...METAS_CUMPLIDAS, ..._metasFirestore];

  if (!todas.length) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  const esAdmin = _currentUser && _adminUids.includes(_currentUser.uid);

  todas.forEach(m => {
    const btnDel = (esAdmin && m.id)
      ? `<button class="meta-card-del" onclick="event.stopPropagation();eliminarMetaCumplida('${m.id}')" title="Eliminar">✕</button>`
      : '';
    grid.innerHTML += `
      <div class="meta-card">
        ${btnDel}
        <div class="meta-card-emoji">${m.emoji || '🏆'}</div>
        <div class="meta-card-nombre">${m.nombre}</div>
        <div class="meta-card-desc">${m.desc}</div>
        <div class="meta-card-footer">
          <span class="meta-card-importe">${m.importe || ''}</span>
          <span class="meta-card-fecha">${m.fecha || ''}</span>
        </div>
      </div>`;
  });
}

function openInfoModal(key) {
  const data = INFO_MODALS[key];
  if (!data) return;
  document.getElementById('info-modal-icon').textContent = data.icon;
  document.getElementById('info-modal-title').textContent = data.title;
  document.getElementById('info-modal-body').innerHTML = data.body;
  const overlay = document.getElementById('info-modal-overlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('iopen'));
  document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
  const overlay = document.getElementById('info-modal-overlay');
  overlay.classList.remove('iopen');
  setTimeout(() => { overlay.style.display = 'none'; }, 220);
  document.body.style.overflow = '';
}

function toggleFaq(idx) {
  const item = document.getElementById('faq-item-' + idx);
  if (!item) return;
  item.classList.toggle('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('info-modal-overlay').classList.contains('iopen')) {
    closeInfoModal();
  }
});

/* Exponer funciones globales necesarias para los onclick del HTML */
Object.assign(window,{
  addToCart,changeQty,clearCart,
  closeCartPanel,closeCheckoutConfirm,closeCheckoutContact,
  closeInfoModal,closeModal,closeOrderSummary,
  confirmOrder,copyOrderSummary,copySummary,
  finalizeOrder,goToOrderConfirm,handleCardClick,
  openCartPanel,openCheckoutContact,openInfoModal,openProduct,
  removeItem,resetPriceFilter,scroll2,
  selectMat,showToast,submitOrder,toggleFaq,
  selectAvatar(btn,emoji){
    document.querySelectorAll('.com-avatar-opt').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('com-avatar').value=emoji;
  },
  enviarComentario(){
    // La implementación real la sobreescribe el módulo de Firebase al cargar
    console.warn('Firebase aún no cargado');
  },
});
/* ── PARCHE: funciones de estrellas, carrito persistente y auth ── */
Object.assign(window,{
  setEstrellas(n){
    document.getElementById('com-estrellas').value=n;
    document.querySelectorAll('.com-star').forEach((s,i)=>{
      s.classList.toggle('active',i<n);
      s.classList.toggle('hover',false);
    });
  },
  hoverEstrellas(n){
    document.querySelectorAll('.com-star').forEach((s,i)=>{
      s.classList.toggle('hover',i<n);
    });
  },
  resetEstrellas(){
    const sel=parseInt(document.getElementById('com-estrellas').value)||0;
    document.querySelectorAll('.com-star').forEach((s,i)=>{
      s.classList.toggle('hover',false);
      s.classList.toggle('active',i<sel);
    });
  },
});

/* ── Carrito: hooks para Firebase ── */
/* Guardar en Firestore cada vez que cambia el carrito */
function _persistCart(){
  window._guardarCarritoEnFirestore && window._guardarCarritoEnFirestore(
    cartItems.map(i=>({name:i.name,price:i.price,img:i.img,svg:i.svg,qty:i.qty,
      descuentoEscalonado:i.descuentoEscalonado||null}))
  );
}
/* Sobrescribir changeQty/removeItem/addToCart para que llamen a _persistCart */
const _origChangeQty=window.changeQty;
window.changeQty=function(idx,delta){_origChangeQty(idx,delta);_persistCart();};
const _origRemoveItem=window.removeItem;
window.removeItem=function(idx){_origRemoveItem(idx);_persistCart();};
const _origAddToCart=window.addToCart;
window.addToCart=function(name,priceStr,img,idx){_origAddToCart(name,priceStr,img,idx);_persistCart();};
const _origClearCart=window.clearCart;
window.clearCart=function(){_origClearCart();_persistCart();};

/* Limpiar carrito local al cerrar sesión */
window._clearCartLocal=function(){
  cartItems=[];
  updateBadge();
  renderCartPanel();
};

/* Cargar carrito desde Firestore al iniciar sesión */
window._loadCartFromFirestore=function(items){
  cartItems=items.map(i=>({
    name:i.name,price:i.price,img:i.img||'',svg:i.svg||'',
    qty:i.qty,descuentoEscalonado:i.descuentoEscalonado||null
  }));
  updateBadge();
  renderCartPanel();
};