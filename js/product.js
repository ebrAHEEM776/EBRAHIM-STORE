/* =====================================================================
   product.js — منطق صفحة المنتج (product.html?id=3) — [جديد] كله
   يعرض: الصور، السعر، التوفر، الوصف، المواصفات، الكمية، أزرار الشراء، منتجات مشابهة
   لإضافة معلومة جديدة للصفحة: عدّل القالب داخل buildProduct()
   ===================================================================== */
(() => {
  if (!window.NOVA) return;   // [جديد] تحويل الروابط القديمة #p3 يوقف app.js قبل إنشاء NOVA
  const N = window.NOVA, { C, P, $, esc, money, card, catName, link, byId, QS } = N;
  const p = byId(+QS.get('id'));
  const pv = $('#pv');

  /* ┌────────────────────────────────────────────────────────────────
     │ إذا لم يوجد المنتج (رابط خاطئ) نعرض رسالة مع روابط للعودة
     └──────────────────────────────────────────────────────────────── */
  if (!p) {
    $('#crumbs').innerHTML = `<a href="${link.home}">الرئيسية</a>`;
    pv.innerHTML = `<div class="empty"><p>هذا المنتج غير موجود أو تم حذفه.</p><a class="btn" href="${link.category('')}">تصفح كل المنتجات</a></div>`;
    N.hooks.render = () => {}; N.refresh();
    return;
  }

  document.title = p.name + ' | ' + C.name;
  N.addRecent(p.id);
  let qty = 1;

  /* ┌────────────────────────────────────────────────────────────────
     │ buildProduct() — قالب صفحة المنتج (يُرسم مرة واحدة)
     └──────────────────────────────────────────────────────────────── */
  function buildProduct() {
    const off = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const imgs = p.images && p.images.length ? p.images : [p.image || 'images/p' + p.id + '.jpg'];
    const stock = p.stock < 1 ? '<span class="stock out">غير متوفر حالياً</span>'
      : p.stock <= 5 ? `<span class="stock low">متبقي ${p.stock} فقط</span>` : '<span class="stock in">متوفر</span>';
    const thumbs = imgs.length > 1 ? `<div class="thumbs">${imgs.map(s => `<button data-th="${esc(s)}" aria-label="صورة"><img src="${esc(s)}" alt=""></button>`).join('')}</div>` : '';
    const specs = Object.assign({ 'العلامة': p.brand, 'النوع': catName(p.cat), 'التوفر': p.stock < 1 ? 'غير متوفر' : 'متوفر', 'متوافق مع': p.models.join('، ') || 'عام (يناسب أغلب الأجهزة)' }, p.specs || {});
    $('#crumbs').innerHTML = `<a href="${link.home}">الرئيسية</a> › <a href="${link.category(p.cat)}">${esc(catName(p.cat))}</a> › ${esc(p.name)}`;
    pv.innerHTML = `<div class="pv">
      <div class="pv-gal">
        <div class="pv-main" id="pvMain" data-zoom><img id="pvImg" src="${esc(imgs[0])}" alt="${esc(p.name)}" onerror="this.outerHTML='<span id=pvImg>${p.emoji || '📦'}</span>'"></div>${thumbs}
      </div>
      <div class="pv-info">
        <h1>${esc(p.name)}</h1>
        <span class="brand">${esc(p.brand)} — <a href="${link.category(p.cat)}">${esc(catName(p.cat))}</a></span>
        <div class="price">${money(p.price)}${off ? `<s>${money(p.oldPrice)}</s> <span class="badge b-off">خصم ${off}%</span>` : ''}</div>
        ${stock}
        <p class="pv-desc">${esc(p.desc)}</p>
        ${p.stock > 0 ? `<div class="pv-qty"><b>الكمية:</b><div class="qty"><button id="qMinus" aria-label="تقليل">−</button><span id="qVal">1</span><button id="qPlus" aria-label="زيادة">+</button></div></div>` : ''}
        <div class="pv-btns">
          <button class="btn big" id="pAdd" ${p.stock < 1 ? 'disabled' : ''}>🛒 أضف للسلة</button>
          <button class="btn buy big" id="pBuy" ${p.stock < 1 ? 'disabled' : ''}>🧾 اشترِ الآن</button>
          <button class="btn ghost" data-fav="${p.id}" id="pFav"></button>
          <button class="btn ghost" id="pShare">مشاركة المنتج</button>
          <a class="btn ghost wide" target="_blank" rel="noopener" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent('أريد الاستفسار عن: ' + p.name + ' (' + money(p.price) + ')')}">💬 اسأل عن هذا المنتج</a>
        </div>
      </div></div>
      <section class="pv-sec"><h2>المواصفات</h2><table class="specs">${Object.entries(specs).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table></section>`;

    /* --- ربط الأزرار --- */
    $('#pvMain').onclick = () => N.zoomShow($('#pvImg'));
    pv.querySelectorAll('[data-th]').forEach(b => b.onclick = e => { e.stopPropagation(); const m = $('#pvImg'); if (m && m.tagName === 'IMG') m.src = b.dataset.th; });
    if (p.stock > 0) {
      const setQ = v => { qty = Math.max(1, Math.min(p.stock, v)); $('#qVal').textContent = qty; };
      $('#qMinus').onclick = () => setQ(qty - 1); $('#qPlus').onclick = () => setQ(qty + 1);
      $('#pAdd').onclick = () => N.addToCart(p.id, qty);
      $('#pBuy').onclick = () => N.buyNow(p.id, qty);
    }
    $('#pShare').onclick = () => N.share(p.id);
  }
  buildProduct();

  /* ┌────────────────────────────────────────────────────────────────
     │ render() — يحدّث الأجزاء المتغيرة فقط (زر المفضلة، المشابهة، المشاهدة مؤخراً)
     └──────────────────────────────────────────────────────────────── */
  function render() {
    const fav = N.favs.includes(p.id);
    $('#pFav').textContent = fav ? '♥ في المفضلة' : '♡ أضف للمفضلة';
    const sim = [...P.filter(x => x.cat === p.cat && x.id !== p.id), ...P.filter(x => x.cat !== p.cat && x.id !== p.id)].slice(0, 4);
    $('#simSec').hidden = !sim.length; $('#simGrid').innerHTML = sim.map(card).join('');
    const rl = N.recent.filter(i => i !== p.id).map(byId).filter(Boolean).slice(0, 4);
    $('#recent').hidden = !rl.length; $('#recentGrid').innerHTML = rl.map(card).join('');
  }
  N.hooks.render = render;
  N.refresh();
})();
