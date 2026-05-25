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
  {
     nombre: 'Llavaro perro tejido',
     imgPrincipal: 'productos/constante/llavero_perro_cosido.jpg',
     svgPlaceholder: `<svg>...</svg>`,
     precio: '€2.00',
     categoria: 'Llavero',
     materiales: ['PLA'],
     colores: ['#e99573'],
     descripcion: 'Llavero de un perro con acabado de tejido',
     peso: '?g',
     tiempoProduccion: '1 día',
     seccion: 'stock',
  },
  {
    nombre: 'Soporte de escritorio',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="45" y="78" width="110" height="84" rx="5" fill="none" stroke="var(--accent2)" stroke-width="2"/><rect x="62" y="48" width="76" height="30" rx="3" fill="none" stroke="var(--accent2)" stroke-width="1.8"/><rect x="55" y="86" width="28" height="28" rx="3" fill="var(--accent2-s)"/><rect x="117" y="86" width="28" height="28" rx="3" fill="var(--accent2-s)"/><rect x="86" y="116" width="28" height="46" rx="3" fill="var(--accent2-s)"/></svg>`,
    precio: '€18.50',destacado: 'pocas',categoria: 'Utilidad',materiales: ['PETG'],
    colores: ['#0891b2','#22c55e'],
    descripcion: 'Soporte multiusos para escritorio impreso en PETG turquesa de alta resistencia. Ideal para móvil, tablet o papelería.',
    peso: '140 g',tiempoProduccion: '2–3 días',seccion: 'stock',
  },
  {
    nombre: 'Mandala decorativo',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="62" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="100" cy="100" r="42" fill="none" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="5,4"/><circle cx="100" cy="100" r="22" fill="var(--accent-s)"/><circle cx="100" cy="100" r="7" fill="var(--accent)"/><g stroke="var(--accent)" stroke-width="1.2" opacity=".3"><line x1="100" y1="38" x2="100" y2="162"/><line x1="38" y1="100" x2="162" y2="100"/><line x1="56" y1="56" x2="144" y2="144"/><line x1="144" y1="56" x2="56" y2="144"/></g></svg>`,
    precio: '€22.00',destacado: '',categoria: 'Decoración',materiales: ['PLA'],
    colores: ['#e8541a','#ef4444','#a855f7'],
    descripcion: 'Mandala de pared impreso en PLA coral. Diseño de alta precisión con capas de 0,1 mm para máximo detalle. Incluye anclaje trasero.',
    peso: '110 g',tiempoProduccion: '3–4 días',seccion: 'stock',
  },
  {
    nombre: 'Jarrón espiral',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M72,162 Q50,142 56,112 Q46,90 62,68 Q74,52 100,48 Q126,52 138,68 Q154,90 144,112 Q150,142 128,162 Z" fill="var(--accent-s)" stroke="var(--accent)" stroke-width="2"/><ellipse cx="100" cy="78" rx="24" ry="6" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".4"/><ellipse cx="100" cy="100" rx="33" ry="7" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".4"/><ellipse cx="100" cy="122" rx="35" ry="7" fill="none" stroke="var(--accent)" stroke-width="1" opacity=".4"/></svg>`,
    precio: '€34.00',destacado: '',categoria: 'Decoración',materiales: ['PLA'],
    colores: ['#e8541a','#1c1917','#22c55e'],
    descripcion: 'Jarrón de forma orgánica impreso en modo espiral (vase mode) para paredes ultrafinas y translúcidas. Impermeable con tratamiento interior.',
    peso: '~180 g',tiempoProduccion: '4–5 días',seccion: 'stock',
  },
  {
    nombre: 'Octaedro decorativo',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,40 158,100 100,160 42,100" fill="var(--accent2-s)" stroke="var(--accent2)" stroke-width="2.5" stroke-linejoin="round"/><line x1="100" y1="40" x2="100" y2="160" stroke="var(--accent2)" stroke-width="1.2" stroke-dasharray="5,5" opacity=".5"/><line x1="42" y1="100" x2="158" y2="100" stroke="var(--accent2)" stroke-width="1.2" stroke-dasharray="5,5" opacity=".5"/><circle cx="100" cy="100" r="5" fill="var(--accent2)"/></svg>`,
    precio: '€15.00',destacado: 'nuevo',categoria: 'Decoración',materiales: ['PETG'],
    colores: ['#f5f2ec','#cffafe','#0891b2'],
    descripcion: 'Octaedro geométrico en PETG transparente de alta claridad. La luz lo atraviesa creando reflejos únicos. Ideal para lámparas o móviles decorativos.',
    peso: '60 g',tiempoProduccion: '1–2 días',seccion: 'stock',
  },
  {
    nombre: 'Engranaje decorativo',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="44" fill="none" stroke="var(--accent)" stroke-width="2.5"/><circle cx="100" cy="100" r="20" fill="var(--accent-s)" stroke="var(--accent)" stroke-width="2"/><circle cx="100" cy="100" r="6" fill="var(--accent)"/><g stroke="var(--accent)" stroke-width="6" stroke-linecap="round" opacity=".45"><line x1="100" y1="48" x2="100" y2="38"/><line x1="100" y1="162" x2="100" y2="152"/><line x1="48" y1="100" x2="38" y2="100"/><line x1="162" y1="100" x2="152" y2="100"/></g></svg>`,
    precioOriginal: '€12.00',descuentoProducto: 0.20,
    destacado: 'descuento',categoria: 'Decoración',materiales: ['PLA'],
    colores: ['#a8a29e','#1c1917'],
    descripcion: 'Engranaje decorativo de pared impreso en PLA gris plata metalizado. Perfecto para decoración industrial o steampunk.',
    peso: '75 g',tiempoProduccion: '1–2 días',seccion: 'stock',
  },
  {
    nombre: 'Sol & Mar Collection',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg"><circle cx="140" cy="140" r="88" fill="var(--accent2-s)" stroke="var(--accent2)" stroke-width="2"/><circle cx="140" cy="140" r="60" fill="none" stroke="var(--accent2)" stroke-width="1.2" stroke-dasharray="7,5" opacity=".6"/><circle cx="140" cy="140" r="30" fill="var(--accent2)" opacity=".18"/><circle cx="140" cy="140" r="14" fill="var(--accent2)" opacity=".6"/><circle cx="140" cy="140" r="5" fill="var(--accent2)"/></svg>`,
    precio: '€45.00',destacado: 'nuevo',categoria: 'Decoración',materiales: ['PETG'],
    colores: ['#0891b2','#fbbf24'],
    descripcion: 'Escultura decorativa inspirada en el Mediterráneo. Impresa en PETG premium con acabado satinado. Edición limitada de 50 unidades.',
    peso: '200 g',tiempoProduccion: '3–5 días',seccion: 'temporada-principal',
  },
  {
    nombre: 'Cactus decorativo',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="86" y="88" width="28" height="72" rx="5" fill="none" stroke="#22c55e" stroke-width="2.5"/><path d="M86,128 Q62,128 62,106 Q62,84 78,84" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/><path d="M114,118 Q138,118 138,96 Q138,74 122,74" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round"/><circle cx="100" cy="84" r="4.5" fill="#22c55e"/></svg>`,
    precio: '€16.00',precioOriginal: '€16.00',destacado: '',categoria: 'Decoración',materiales: ['PLA'],
    colores: ['#22c55e','#16a34a'],
    descripcion: 'Cactus decorativo de escritorio en PLA verde. Impresión de alta resolución con textura realista. Sin necesidad de riego. A partir de 11 unidades: 25% descuento.',
    peso: '90 g',tiempoProduccion: '2–3 días',seccion: 'temporada-secundaria',
    descuentoEscalonado: { unidades: 10, porcentaje: 0.25 },
  },
  {
    nombre: 'Posavasos ola',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M36,118 Q56,98 76,118 Q96,138 116,118 Q136,98 164,118" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-linecap="round"/><ellipse cx="100" cy="154" rx="68" ry="9" fill="var(--accent2-s)"/></svg>`,
    precio: '€8.00',precioOriginal: '€8.00',destacado: '',categoria: 'Utilidad',materiales: ['PETG'],
    colores: ['#0891b2','#cffafe'],
    descripcion: 'Posavasos con forma de ola marina en PETG azul agua. Resistente al calor y a la humedad. Se vende en packs de 4. A partir de 11 unidades: 50% descuento.',
    peso: '40 g x4',tiempoProduccion: '1–2 días',seccion: 'temporada-secundaria',
    descuentoEscalonado: { unidades: 10, porcentaje: 0.50 },
  },
  {
    nombre: 'Sombrilla miniatura',
    imgPrincipal: '',imgSecundaria: '',
    svgPlaceholder: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100,72 Q142,72 158,102 Q142,132 100,132 Q58,132 42,102 Q58,72 100,72 Z" fill="#fef9c3" stroke="#ffc800" stroke-width="2.5"/><line x1="100" y1="102" x2="100" y2="160" stroke="#ffc800" stroke-width="3" stroke-linecap="round"/></svg>`,
    precio: '€11.00',destacado: '',categoria: 'Decoración',materiales: ['PLA'],
    colores: ['#fbbf24','#ef4444','#0891b2'],
    descripcion: 'Sombrilla decorativa en miniatura impresa en PLA amarillo. Ideal para decorar cócteles, plantas pequeñas o como souvenir veraniego.',
    peso: '35 g',tiempoProduccion: '1 día',seccion: 'temporada-secundaria',
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
   
   • piggyFilled: Porcentaje completado (0-100)
     Ejemplo: 67 = 67% completado
   
   • piggyGoal: Meta total en euros
     Ejemplo: 2000 = €2.000
   
   La hucha se actualizará automáticamente con:
   - Barra de progreso visual
   - Dinero recaudado (calculado: goal × filled ÷ 100)
   - Animación de líquido dentro del cerdo
   
   ================================================================ */
 
const piggyFilled = 14;    // % completado (0-100)
const piggyGoal = 500;    // Meta en euros (€)
const piggyCurrent = Math.round(piggyGoal * piggyFilled / 100);  // Se calcula automáticamente
 
const BADGE_MAP = {
  nuevo:{cls:'badge-new',txt:'Nuevo'},
  pocas:{cls:'badge-low',txt:'Pocas unidades'},
  descuento:{cls:'badge-sale',txt:'−20%'},
};
function badgeHTML(d,descuentoEscalonado){
  if(descuentoEscalonado&&descuentoEscalonado.porcentaje){
    const pct=(descuentoEscalonado.porcentaje*100|0);
    const unidades=descuentoEscalonado.unidades||10;
    return '<span class="badge badge-sale">+'+unidades+' = −'+pct+'%</span>';
  }
  return (!d||!BADGE_MAP[d])?'':'<span class="badge '+BADGE_MAP[d].cls+'">'+BADGE_MAP[d].txt+'</span>';
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
 
/* ── MODAL PEDIDO ── */
function submitOrder(){
  const g=s=>document.querySelector(s)?.value.trim()||'—';
  document.getElementById('osm-nombre').textContent=g('.order-form .form-input[placeholder="Tu nombre"]');
  document.getElementById('osm-email').textContent=g('.order-form .form-input[placeholder="tu@email.com"]');
  document.getElementById('osm-objeto').textContent=g('.order-form .form-input[placeholder="Nombre o descripción breve del objeto"]');
  document.getElementById('osm-material').textContent=document.querySelector('.mat-pill.active')?.textContent||'—';
  document.getElementById('osm-dims').textContent=g('.order-form .form-input[placeholder="Alto × Ancho × Largo"]');
  document.getElementById('osm-cantidad').textContent=g('.order-form .form-input[placeholder="1"]')||'1';
  document.getElementById('osm-color').textContent=document.getElementById('custom-color-input')?.value.trim()||'—';
  const d=g('.order-form .form-textarea');
  document.getElementById('osm-desc').textContent=d.length>120?d.slice(0,120)+'…':d;
  document.getElementById('order-summary-overlay').classList.add('open');document.body.style.overflow='hidden';
}
function closeOrderSummary(){document.getElementById('order-summary-overlay').classList.remove('open');document.body.style.overflow='';}
function confirmOrder(){closeOrderSummary();showToast('¡Solicitud enviada! Te contactamos en 24 h ✓');}
function copyPhone(){navigator.clipboard?.writeText(document.getElementById('osm-phone').textContent);showToast('Número copiado ✓');}
 
/* ── HUCHA ── */
function renderPiggy(){
  document.getElementById('piggy-fill-bar').style.width=piggyFilled+'%';
  document.getElementById('piggy-current-val').textContent='€'+piggyCurrent.toLocaleString('es-ES');
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
 
/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded',function(){
  /* Theme */
  const html=document.documentElement,tb=document.getElementById('theme-toggle');
  const sv=localStorage.getItem('carr3d-theme');
  if(sv){html.setAttribute('data-theme',sv);tb.textContent=sv==='dark'?'☀️':'🌙';}
  tb.addEventListener('click',()=>{const n=html.getAttribute('data-theme')==='dark'?'light':'dark';html.setAttribute('data-theme',n);tb.textContent=n==='dark'?'☀️':'🌙';localStorage.setItem('carr3d-theme',n);});
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
  /* File input */
  const fi=document.getElementById('file-input');
  if(fi)fi.addEventListener('change',function(){if(this.files[0])document.querySelector('.upload-text').innerHTML='<strong style="color:var(--accent2)">✓ '+this.files[0].name+'</strong>';});
  /* Modals */
  document.getElementById('modal-close-btn').addEventListener('click',closeModal);
  ['modal-overlay','order-summary-overlay','cart-panel-overlay'].forEach(id=>{
    const el=document.getElementById(id);
    el.addEventListener('click',e=>{if(e.target===el){if(id==='modal-overlay')closeModal();else if(id==='order-summary-overlay')closeOrderSummary();else closeCartPanel();}});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCartPanel();closeOrderSummary();}});
  /* Hucha */
  renderPiggy();
  const po=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)setTimeout(()=>{document.getElementById('piggy-fill-bar').style.width=piggyFilled+'%';},200);},{threshold:.3});
  const ps=document.getElementById('piggy-goal');if(ps)po.observe(ps);
});
 
function scroll2(s){document.querySelector(s)?.scrollIntoView({behavior:'smooth'});}
function showToast(msg){document.getElementById('t-msg').textContent=msg;const t=document.getElementById('toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}
function selectMat(el){document.querySelectorAll('.mat-pill').forEach(m=>m.classList.remove('active'));el.classList.add('active');}
function selectColor(el){document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));el.classList.add('active');}