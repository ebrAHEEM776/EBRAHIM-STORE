/* =====================================================================
   category.js — منطق صفحة المنتجات (category.html)
   كل المنطق هنا هو نفس منطق الفلترة القديم [كما كان] لكنه صار يعمل على صفحة
   مستقلة لكل نوع، والنوع يُقرأ من الرابط:  category.html?cat=iphone
   دليل الرموز: [كما كان] | [معدّل] | [جديد]
   ===================================================================== */
(() => {
  if (!window.NOVA) return;   // [جديد] تحويل الروابط القديمة #p3 يوقف app.js قبل إنشاء NOVA
  const N = window.NOVA, { C, P, $, esc, card, catName, norm, link, byId, QS } = N;

  /* ┌────────────────────────────────────────────────────────────────
     │ حالة الفلاتر f — [معدّل] تبدأ من قيم الرابط (cat / q / brand / view / mine)
     │ view = fav (المفضلة) | deals (العروض) | new (وصل حديثاً)
     └──────────────────────────────────────────────────────────────── */
  const catId = C.categories.some(c => c.id === QS.get('cat')) ? QS.get('cat') : '';
  const f = {
    cat: catId, q: QS.get('q') || '', brand: QS.get('brand') || '', view: QS.get('view') || '',
    model: '', sort: 'rec', max: 0, stock: false, deal: false, mine: QS.get('mine') === '1' && !!N.myPhone
  };
  const PAGE_SIZE = C.productsPerPage || 12;
  let limit = PAGE_SIZE, lastSig = '';

  /* ┌────────────────────────────────────────────────────────────────
     │ قائمة الموديلات — [معدّل] تعرض فقط موديلات منتجات هذا النوع
     └──────────────────────────────────────────────────────────────── */
  const scope = P.filter(p => !f.cat || p.cat === f.cat);
  const models = [...new Set(scope.flatMap(p => p.models))].sort();
  $('#model').insertAdjacentHTML('beforeend', models.map(m => `<option>${esc(m)}</option>`).join(''));
  if (!models.length) $('#model').hidden = true;

  /* ┌────────────────────────────────────────────────────────────────
     │ visible() — [كما كان] الفلترة والترتيب والبحث العربي الذكي
     │ [جديد] دعم view (مفضلة/عروض/جديد)
     └──────────────────────────────────────────────────────────────── */
  function visible() {
    const q = norm(f.q.trim());
    let list = P.filter(p => {
      if (f.cat && p.cat !== f.cat) return false;
      if (f.view === 'fav' && !N.favs.includes(p.id)) return false;
      if (f.view === 'deals' && !(p.oldPrice > p.price)) return false;
      if (f.view === 'new' && !p.isNew) return false;
      if (f.model && p.models.length && !p.models.includes(f.model)) return false;
      if (f.model && !p.models.length) return false;
      if (f.brand && p.brand !== f.brand) return false;
      if (f.max && p.price > f.max) return false;
      if (f.stock && p.stock < 1) return false;
      if (f.deal && !(p.oldPrice > p.price)) return false;
      if (f.mine && N.myPhone && p.models.length && !p.models.includes(N.myPhone)) return false;
      if (q) {
        const hay = norm([p.name, p.brand, p.desc, catName(p.cat), ...p.models].join(' '));
        if (!q.split(/\s+/).every(w => hay.includes(w))) return false;
      }
      return true;
    });
    if (f.sort === 'rec') { const fi = p => (C.featuredIds || []).includes(p.id) ? 1 : 0; list.sort((a, b) => fi(b) - fi(a) || b.id - a.id); }
    else if (f.sort === 'asc') list.sort((a, b) => a.price - b.price);
    else if (f.sort === 'desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.id - a.id);
    return list;
  }

  /* ┌────────────────────────────────────────────────────────────────
     │ عنوان الصفحة ومسار التنقل — [جديد] (النص الظاهر أعلى الصفحة)
     └──────────────────────────────────────────────────────────────── */
  function heading() {
    const viewName = { fav: 'المفضلة', deals: 'عروض حالية', new: 'وصل حديثاً' }[f.view];
    const base = viewName || (f.cat ? catName(f.cat) : f.brand ? `منتجات ${f.brand === 'Generic' ? 'علامات متنوعة' : f.brand}` : (f.mine && N.myPhone) ? `إكسسوارات ${N.myPhone}` : 'جميع المنتجات');
    const title = f.q ? `${f.cat ? base + ' — ' : ''}نتائج البحث: ${f.q}` : base;
    const icon = viewName ? { fav: '♥', deals: '🏷️', new: '🆕' }[f.view] : f.cat ? (C.categories.find(c => c.id === f.cat) || {}).icon || '🧩' : f.q ? '🔎' : '✨';
    return { title, icon, base };
  }

  /* ┌────────────────────────────────────────────────────────────────
     │ render() — رسم الصفحة. [كما كان] نفس فكرة الدالة القديمة
     └──────────────────────────────────────────────────────────────── */
  function render() {
    const list = visible();
    const sig = JSON.stringify(f); if (sig !== lastSig) { limit = PAGE_SIZE; lastSig = sig; }
    $('#grid').innerHTML = list.slice(0, limit).map(card).join('');
    $('#more').hidden = list.length <= limit;
    $('#empty').hidden = list.length > 0;
    $('#emptyMsg').textContent = f.view === 'fav' && !N.favs.length ? 'لم تضف أي منتج للمفضلة بعد. اضغط ♡ على أي منتج.' : 'لا توجد منتجات تطابق بحثك.';
    $('#count').textContent = list.length ? `عرض ${Math.min(limit, list.length)} من ${list.length} منتج` : '';
    $('#favShare').hidden = !(f.view === 'fav' && N.favs.length);
    $('#mineLbl').hidden = !N.myPhone;
    const rl = N.recent.map(byId).filter(Boolean).slice(0, 4);
    $('#recent').hidden = !rl.length; $('#recentGrid').innerHTML = rl.map(card).join('');
    const h = heading();
    $('#listTitle').textContent = h.title; $('#pIcon').textContent = h.icon;
    $('#crumbs').innerHTML = `<a href="${link.home}">الرئيسية</a> › ${f.cat || f.view || f.brand || f.q ? `<a href="${link.category('')}">المنتجات</a> › ${esc(h.title)}` : 'المنتجات'}`;
    document.title = h.title + ' | ' + C.name;
  }

  /* [جديد] تحديث الرابط عند البحث ليبقى قابلاً للمشاركة وزر الرجوع يعمل */
  function syncUrl() {
    const u = new URLSearchParams();
    if (f.cat) u.set('cat', f.cat); if (f.q) u.set('q', f.q); if (f.brand) u.set('brand', f.brand);
    if (f.view) u.set('view', f.view); if (f.mine) u.set('mine', '1');
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
  }

  /* ┌────────────────────────────────────────────────────────────────
     │ ربط أدوات الفلترة — [كما كان]
     └──────────────────────────────────────────────────────────────── */
  $('#model').onchange = e => { f.model = e.target.value; render(); };
  $('#sort').onchange = e => { f.sort = e.target.value; render(); };
  $('#maxPrice').oninput = e => { f.max = +e.target.value || 0; render(); };
  $('#onlyStock').onchange = e => { f.stock = e.target.checked; render(); };
  $('#onlyDeal').onchange = e => { f.deal = e.target.checked; render(); };
  $('#onlyMine').onchange = e => { f.mine = e.target.checked; syncUrl(); render(); };
  $('#more').onclick = () => { limit += PAGE_SIZE; render(); };
  /* [معدّل] «مسح الفلاتر» يبقي على نوع الصفحة الحالي ويمسح الباقي. وزر الفراغ يفتح كل المنتجات */
  $('#reset').onclick = () => {
    Object.assign(f, { q: '', brand: '', model: '', sort: 'rec', max: 0, stock: false, deal: false, mine: false });
    $('#q').value = ''; $('#model').value = ''; $('#sort').value = 'rec'; $('#maxPrice').value = '';
    $('#onlyStock').checked = $('#onlyDeal').checked = $('#onlyMine').checked = false; syncUrl(); render();
  };
  $('#reset2').onclick = () => { location.href = link.category(''); };
  $('#onlyMine').checked = f.mine;
  $('#q').value = f.q;
  $('#favShare').onclick = () => {
    const l = N.favs.map(byId).filter(Boolean).map(p => `• ${p.name} — ${N.money(p.price)}`);
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent('منتجاتي المفضلة من ' + C.name + ':\n' + l.join('\n') + '\nأريد الاستفسار عنها.')}`, '_blank', 'noopener');
  };

  /* [جديد] البحث من شريط الأعلى يحدّث نتائج هذه الصفحة مباشرة */
  N.hooks.search = q => { f.q = q; syncUrl(); render(); };
  N.hooks.render = render;
  N.refresh();
})();
