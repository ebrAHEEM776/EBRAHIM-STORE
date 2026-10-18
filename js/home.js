/* =====================================================================
   home.js — منطق الصفحة الرئيسية (index.html)
   دليل الرموز: [كما كان] موجود من قبل | [معدّل] غيّرته | [جديد] أضفته
   يعتمد على js/app.js (الكائن NOVA)
   ===================================================================== */
(() => {
  if (!window.NOVA) return;   // [جديد] تحويل الروابط القديمة #p3 يوقف app.js قبل إنشاء NOVA
  const { C, P, $, esc, card, link, byId } = window.NOVA, N = window.NOVA;

  /* ┌────────────────────────────────────────────────────────────────
     │ «أي هاتف تستخدم؟» — [كما كان]
     │ [معدّل] عند اختيار موديل ننتقل لصفحة المنتجات المتوافقة معه
     └──────────────────────────────────────────────────────────────── */
  const models = [...new Set(P.flatMap(p => p.models))].sort();
  $('#myPhone').insertAdjacentHTML('beforeend', models.map(m => `<option ${m === N.myPhone ? 'selected' : ''}>${esc(m)}</option>`).join(''));
  function phoneMsg() {
    const mp = N.myPhone;
    if (!mp) { $('#finderMsg').textContent = ''; return; }
    const own = P.filter(p => p.models.includes(mp) && p.stock > 0).length, gen = P.filter(p => !p.models.length && p.stock > 0).length;
    $('#finderMsg').textContent = `لهاتفك ${own} منتج مخصص + ${gen} منتج عام يناسب أغلب الأجهزة`;
  }
  $('#myPhone').onchange = e => {
    N.setPhone(e.target.value); phoneMsg();
    if (e.target.value) location.href = 'category.html?mine=1';
  };
  phoneMsg();

  /* ┌────────────────────────────────────────────────────────────────
     │ تسوق حسب العلامة — [معدّل] كل علامة رابط لصفحة منتجاتها
     └──────────────────────────────────────────────────────────────── */
  const bc = {}; P.forEach(x => bc[x.brand] = (bc[x.brand] || 0) + 1);
  $('#brands').innerHTML = Object.keys(bc).map(b => `<a class="brand-btn" href="${link.brand(b)}">${b === 'Generic' ? 'علامات متنوعة' : esc(b)}<small>${bc[b]}</small></a>`).join('');

  /* ┌────────────────────────────────────────────────────────────────
     │ آراء العملاء — [كما كان]
     └──────────────────────────────────────────────────────────────── */
  const rv = C.reviews || [];
  if (rv.length) { $('#reviews').hidden = false; $('#revGrid').innerHTML = rv.map(r => `<div class="rev"><strong>${esc(r.name)}</strong><p>${esc(r.text)}</p></div>`).join(''); }

  /* ┌────────────────────────────────────────────────────────────────
     │ رسم أقسام المنتجات: مختارات، عروض، وصل حديثاً، من منتجاتنا، شاهدتها مؤخراً
     │ تُستدعى عند فتح الصفحة وبعد أي تغيير (مفضلة/مقارنة) لتحديث الأزرار
     └──────────────────────────────────────────────────────────────── */
  function render() {
    const fill = (grid, sec, arr) => { $(grid).innerHTML = arr.map(card).join(''); $(sec).hidden = !arr.length; };
    fill('#featGrid', '#featured', (C.featuredIds || []).map(byId).filter(Boolean));
    fill('#dealStrip', '#dealsSec', P.filter(p => p.oldPrice > p.price && p.stock > 0));
    fill('#newStrip', '#newSec', P.filter(p => p.isNew && p.stock > 0));
    fill('#recentGrid', '#recent', N.recent.map(byId).filter(Boolean).slice(0, 4));
    const fi = p => (C.featuredIds || []).includes(p.id) ? 1 : 0;
    $('#allGrid').innerHTML = [...P].sort((a, b) => fi(b) - fi(a) || b.id - a.id).slice(0, 8).map(card).join('');
  }
  N.hooks.render = render;
  N.refresh();
})();
