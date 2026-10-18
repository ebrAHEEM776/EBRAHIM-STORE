/* =====================================================================
   app.js — القلب المشترك لكل صفحات المتجر
   يعمل في: index.html (الرئيسية) و category.html (التصنيفات) و product.html (المنتج)

   دليل الرموز:  [كما كان] = موجود من قبل | [معدّل] = غيّرته | [جديد] = أضفته
   ملفات الصفحات الخاصة: js/home.js  js/category.js  js/product.js
   كل صفحة تأخذ الأدوات من الكائن العام window.NOVA الذي ينشئه هذا الملف.

   الأقسام:
     1) أدوات مساعدة         2) الحالة (سلة/مفضلة/مقارنة)   3) هيكل الصفحة المشترك (ترويسة/قائمة جانبية/تذييل)
     4) بطاقة المنتج         5) السلة                       6) إتمام الطلب وواتساب
     7) الفاتورة والطباعة    8) العرض السريع والمقارنة      9) طلباتي
    10) البحث               11) التنقل والمظهر والتثبيت     12) تشغيل الصفحة
   ===================================================================== */
(() => {

  /* ┌────────────────────────────────────────────────────────────────
     │ (1) أدوات مساعدة
     │ [كما كان] $ و esc و money و store و byId و norm
     │ [جديد]   link (عناوين الصفحات) و catName
     └──────────────────────────────────────────────────────────────── */
  const C = window.STORE_CONFIG, P = C.products;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => Number(n).toLocaleString('en-US') + ' ' + C.currencyLabel;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const byId = id => P.find(p => p.id === id);
  const norm = s => String(s).toLowerCase().replace(/[ً-ٟـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  const catName = id => (C.categories.find(c => c.id === id) || {}).name || '';
  const PAGE = document.body.dataset.page || 'home';   // [جديد] اسم الصفحة الحالية: home | category | product
  const QS = new URLSearchParams(location.search);

  /* [جديد] عناوين الصفحات في مكان واحد — لو غيّرت اسم ملف غيّره هنا فقط */
  const link = {
    home: 'index.html',
    category: id => 'category.html' + (id ? '?cat=' + encodeURIComponent(id) : ''),
    product: id => 'product.html?id=' + id,
    search: q => 'category.html?q=' + encodeURIComponent(q),
    brand: b => 'category.html?brand=' + encodeURIComponent(b),
    view: v => 'category.html?view=' + v          // v = fav | deals | new
  };

  /* [معدّل] روابط المنتجات القديمة بصيغة index.html#p3 تُحوَّل تلقائياً لصفحة المنتج الجديدة */
  const oldHash = location.hash.match(/^#p(\d+)$/);
  if (oldHash) { location.replace(link.product(oldHash[1])); return; }


  /* ┌────────────────────────────────────────────────────────────────
     │ (2) الحالة: السلة والمفضلة والمقارنة وهاتفي والمشاهدات الأخيرة
     │ [كما كان] السلة والمفضلة وتنظيف السلة من منتجات حُذفت
     │ [معدّل] المقارنة صارت تُحفظ لتبقى عند التنقل بين الصفحات
     └──────────────────────────────────────────────────────────────── */
  let cart = store.get('nova_cart', {});          // {id: qty}
  let favs = store.get('nova_favs', []);
  let cmp = store.get('nova_cmp', []);
  let recent = store.get('nova_recent', []);
  let recS = store.get('nova_recent_q', []);
  let myPhone = store.get('nova_phone', '');
  Object.keys(cart).forEach(k => {
    const p = byId(+k);
    if (!p || p.stock < 1) delete cart[k]; else cart[k] = Math.min(cart[k], p.stock);
  });
  const smooth = matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth';
  const root = document.documentElement;

  /* [جديد] كائن عام تستعمله ملفات الصفحات. hooks.render تعرّفه كل صفحة لتُعيد رسم نفسها بعد أي تغيير */
  const NOVA = window.NOVA = {
    C, P, $, esc, money, store, byId, norm, catName, link, PAGE, QS, smooth,
    hooks: {},                                   // render() و search(q) تضعهما الصفحة
    get favs() { return favs; }, get cmp() { return cmp; }, get recent() { return recent; },
    get myPhone() { return myPhone; },
    setPhone(v) { myPhone = v; store.set('nova_phone', v); },
    addRecent(id) { recent = [id, ...recent.filter(x => x !== id)].slice(0, 8); store.set('nova_recent', recent); }
  };


  /* ┌────────────────────────────────────────────────────────────────
     │ (3) هيكل الصفحة المشترك — [جديد]
     │ بدل تكرار الترويسة والتذييل والنوافذ في كل صفحة HTML، تُرسم كلها من هنا.
     │ تعديل الترويسة أو التذييل أو القائمة الجانبية = تعديل في هذا القسم فقط.
     └──────────────────────────────────────────────────────────────── */

  /* --- الشريط العلوي + الترويسة (شعار، بحث، حجم النص، الوضع الليلي، المفضلة، السلة) --- */
  $('#shellTop').innerHTML = `
    <div class="topbar" id="topBar"></div>
    <header class="head">
      <a class="logo" href="${link.home}"><img src="images/icon.svg" alt="" width="36" height="36"><span>${esc(C.name)}</span></a>
      <div class="search">
        <input id="q" type="search" aria-label="بحث" placeholder="ابحث عن منتج أو موديل هاتف…" autocomplete="off">
        <button type="button" class="mic" id="mic" aria-label="بحث صوتي" hidden>🎤</button>
        <div class="sugg" id="sugg" hidden></div>
      </div>
      <button class="icon-btn" id="fontBtn" title="حجم النص" aria-label="تغيير حجم النص">Aa</button>
      <button class="icon-btn" id="themeBtn" title="تبديل الوضع الليلي والنهاري">🌙</button>
      <button class="icon-btn" id="favBtn" aria-pressed="false" title="المفضلة">♡<b id="favCount" hidden>0</b></button>
      <button class="icon-btn" id="cartBtn" title="السلة">🛒<b id="cartCount" hidden>0</b></button>
    </header>`;

  /* --- التذييل --- */
  $('#siteFoot').className = 'foot';
  $('#siteFoot').innerHTML = `
    <div>
      <strong>${esc(C.name)}</strong>
      <p id="fTag"></p>
      <p id="fTrust"></p>
      <p><a href="index.html#faq">أسئلة شائعة</a> — <button class="link" id="ordersBtn">طلباتي على هذا الجهاز</button></p>
      <p><button class="link" id="install" hidden>ثبّت المتجر على هاتفك</button></p>
    </div>
    <div>
      <p id="fAddr"></p>
      <p><a id="fWa" href="#" target="_blank" rel="noopener">تواصل عبر واتساب</a></p>
    </div>
    <p class="copy">© 2026 ${esc(C.name)}. جميع الحقوق محفوظة.</p>`;

  /* --- النوافذ والعناصر العائمة: السلة، العرض السريع، الفاتورة، التكبير، واتساب، التنقل السفلي --- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay" id="overlay" hidden></div>
    <aside class="drawer" id="drawer" aria-label="سلة المشتريات" hidden>
      <div class="d-head"><h2 id="dTitle">سلة المشتريات</h2><button class="icon-btn" id="closeCart" aria-label="إغلاق">✕</button></div>
      <div class="d-body" id="dBody"></div>
    </aside>
    <div class="modal" id="qv" hidden role="dialog" aria-modal="true" aria-label="عرض سريع"><div class="qv-box" id="qvBody"></div></div>
    <div class="modal inv-modal" id="invModal" hidden role="dialog" aria-modal="true" aria-label="الفاتورة">
      <div class="inv-box"><div class="inv-tools" id="invTools"></div><div class="inv-scroll"><div id="invSheet"></div></div></div>
    </div>
    <div class="zoom" id="zoom" hidden></div>
    <a class="wafab" id="waFab" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب">💬</a>
    <div class="cmpbar" id="cmpBar" hidden><button class="btn" id="cmpBtn"></button></div>
    <div id="toasts" aria-live="polite"></div>
    <button class="totop" id="toTop" hidden aria-label="العودة إلى أعلى الصفحة">↑</button>
    <nav class="bnav" id="bnav" aria-label="التنقل السريع">
      <button data-nav="home"><span>🏠</span>الرئيسية</button>
      <button data-nav="search"><span>🔍</span>بحث</button>
      <button data-nav="cats"><span>🗂️</span>التصنيفات</button>
      <button data-nav="fav"><span>♡</span>المفضلة</button>
      <button data-nav="cart"><span>🛒</span>السلة<b id="navCart" hidden>0</b></button>
    </nav>`);

  /* --- ترويسة وتذييل من الإعدادات [كما كان] --- */
  $('#topBar').textContent = C.topBar;
  $('#fTag').textContent = C.tagline;
  $('#fAddr').textContent = C.address + ' — ' + C.phoneDisplay;
  $('#fWa').href = 'https://wa.me/' + C.whatsapp;
  $('#fTrust').textContent = [C.trustLine, C.commercialInfo].filter(Boolean).join(' — ');
  $('#waFab').href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن منتج من ' + C.name)}`;

  /* --- القائمة الجانبية (أنواع المنتجات) على اليسار — [جديد] ---
     كل عنصر رابط حقيقي يفتح صفحة جديدة: category.html?cat=...
     العنصر الحالي يُلوَّن بالأخضر تلقائياً. الأنواع تأتي من categories في config.js */
  function sideHTML() {
    let cur = { cat: '', view: '', all: false };
    if (PAGE === 'category') {
      cur.cat = QS.get('cat') || ''; cur.view = QS.get('view') || '';
      cur.all = !cur.cat && !cur.view && !QS.get('brand') && !QS.get('q') && QS.get('mine') !== '1';
    } else if (PAGE === 'product') {
      const pr = byId(+QS.get('id')); cur.cat = pr ? pr.cat : '';
    }
    const a = (href, icon, label, count, on) => `<a class="side-link" href="${href}" ${on ? 'aria-current="page"' : ''}><span class="ic" aria-hidden="true">${icon}</span>${esc(label)}${count !== '' ? `<small>${count}</small>` : ''}</a>`;
    const cats = C.categories.filter(c => P.some(p => p.cat === c.id));
    const deals = P.filter(p => p.oldPrice > p.price).length, news = P.filter(p => p.isNew).length;
    return `<nav class="side-box" aria-label="${esc(C.sidebarTitle || 'أنواع المنتجات')}">
        <h2>${esc(C.sidebarTitle || 'أنواع المنتجات')}</h2>
        <div class="side-list">
          ${a(link.category(''), '✨', 'جميع المنتجات', P.length, cur.all)}
          ${cats.map(c => a(link.category(c.id), c.icon || '🧩', c.name, P.filter(p => p.cat === c.id).length, cur.cat === c.id && !cur.view)).join('')}
        </div>
        <div class="side-short"><h3>اختصارات</h3><div class="side-list">
          ${deals ? a(link.view('deals'), '🏷️', 'عروض حالية', deals, cur.view === 'deals') : ''}
          ${news ? a(link.view('new'), '🆕', 'وصل حديثاً', news, cur.view === 'new') : ''}
          ${a(link.view('fav'), '♥', 'المفضلة', favs.length || '', cur.view === 'fav')}
        </div></div>
      </nav>
      <div class="side-box side-help"><strong>تحتاج مساعدة؟</strong><br>اسألنا عن أي منتج أو موديل يناسب هاتفك.
        <a class="btn" target="_blank" rel="noopener" href="https://wa.me/${C.whatsapp}">💬 تواصل عبر واتساب</a></div>`;
  }
  const renderSide = () => { $('#side').innerHTML = sideHTML(); };
  renderSide();


  /* ┌────────────────────────────────────────────────────────────────
     │ (4) بطاقة المنتج — تُستعمل في كل الصفحات
     │ [معدّل] الصورة والاسم صارا رابطين لصفحة المنتج، وأضفت زر «اشترِ الآن»
     │ ★ هنا إصلاح مشكلة «أضغط على المنتج ولا يحدث شيء» ★
     │   السبب القديم: سطر واحد في app.js القديم كان يربط الضغط بالشبكة
     │   الرئيسية بطريقة خاطئة فتصبح قيمته undefined، فلا يعمل أي زر في
     │   المنتجات التي ليست داخل الأقسام الأفقية. الحل: مستمع ضغط واحد
     │   (أسفل هذا القسم) يخدم كل البطاقات في كل مكان تلقائياً.
     └──────────────────────────────────────────────────────────────── */
  function card(p) {
    const off = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const st = p.stock < 1 ? '<span class="stock out">غير متوفر حالياً</span>'
      : p.stock <= 5 ? `<span class="stock low">متبقي ${p.stock} فقط</span>` : '<span class="stock in">متوفر</span>';
    const media = `<img src="${esc(p.image || 'images/p' + p.id + '.jpg')}" alt="${esc(p.name)}" loading="lazy" onerror="this.outerHTML='<span>${p.emoji || '📦'}</span>'">`;
    const isFav = favs.includes(p.id);
    const href = link.product(p.id);
    return `<article class="card"><div class="media"><a class="media-link" href="${href}" aria-label="${esc(p.name)}">${media}</a>
      <div class="badges">${p.isNew ? '<span class="badge b-new">جديد</span>' : ''}${off ? `<span class="badge b-off">خصم ${off}%</span>` : ''}${p.stock < 1 ? '<span class="badge b-out">نفد</span>' : ''}${myPhone && p.models.includes(myPhone) ? '<span class="badge b-fit">✓ يناسب هاتفك</span>' : ''}</div>
      <button class="fav" data-fav="${p.id}" aria-pressed="${isFav}" aria-label="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">${isFav ? '♥' : '♡'}</button></div>
      <div class="info"><h3><a href="${href}">${esc(p.name)}</a></h3><span class="brand">${esc(p.brand)}</span>
      <div class="price">${money(p.price)}${off ? `<s>${money(p.oldPrice)}</s>` : ''}</div>${st}
      <div class="acts"><button class="btn" data-add="${p.id}" ${p.stock < 1 ? 'disabled' : ''}>أضف للسلة</button>
        <div class="acts2"><button class="btn buy" data-buy="${p.id}" ${p.stock < 1 ? 'disabled' : ''}>🧾 اشترِ الآن</button><button class="btn ghost" data-qv="${p.id}">عرض سريع</button></div>
        <button class="link" data-cmp="${p.id}">${cmp.includes(p.id) ? '✓ في المقارنة' : '+ قارن'}</button></div></div></article>`;
  }
  NOVA.card = card;

  function toggleFav(id) {
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    store.set('nova_favs', favs); refresh(); toast(favs.includes(id) ? 'أضيف إلى المفضلة' : 'أزيل من المفضلة');
  }

  /* [جديد] مستمع الضغط الوحيد لكل أزرار المنتجات في أي صفحة وأي قسم */
  document.addEventListener('click', e => {
    const g = k => e.target.closest(`[data-${k}]`)?.dataset[k];
    const add = g('add'), fav = g('fav'), qv = g('qv'), cm = g('cmp'), buy = g('buy');
    if (add) addToCart(+add);
    else if (fav) toggleFav(+fav);
    else if (qv) openQV(+qv);
    else if (cm) toggleCmp(+cm);
    else if (buy) buyNow(+buy);
  });


  /* ┌────────────────────────────────────────────────────────────────
     │ (5) السلة — [كما كان] بدون تغيير في المنطق
     │ [معدّل] addToCart يقبل كمية (qty) لاستعمالها من صفحة المنتج
     └──────────────────────────────────────────────────────────────── */
  const saveCart = () => store.set('nova_cart', cart);
  function addToCart(id, qty = 1) {
    const p = byId(id); if (!p || p.stock < 1) return;
    if ((cart[id] || 0) >= p.stock) { toast('وصلت للحد الأقصى المتوفر من هذا المنتج', 'warn'); return; }
    cart[id] = Math.min((cart[id] || 0) + qty, p.stock);
    saveCart(); refresh(); openDrawer(); showCart();
  }
  const items = () => Object.keys(cart).map(k => ({ p: byId(+k), q: cart[k] })).filter(i => i.p);
  const subtotal = () => items().reduce((s, i) => s + i.p.price * i.q, 0);

  const drawer = $('#drawer'), overlay = $('#overlay'), body = $('#dBody');
  function openDrawer() { drawer.hidden = overlay.hidden = false; }
  function closeDrawer() { drawer.hidden = overlay.hidden = true; }
  $('#cartBtn').onclick = () => { openDrawer(); showCart(); };
  $('#closeCart').onclick = overlay.onclick = closeDrawer;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); closeQV(); closeInvoice(); $('#zoom').hidden = true; }
  });

  function showCart() {
    $('#dTitle').textContent = 'سلة المشتريات';
    const list = items();
    if (!list.length) { body.innerHTML = '<p class="empty">السلة فارغة. أضف منتجاً من المتجر لتبدأ.</p>'; return; }
    body.innerHTML = list.map(({ p, q }) => `<div class="row"><div class="t">${p.emoji || '📦'}</div>
      <div class="n"><strong><a href="${link.product(p.id)}">${esc(p.name)}</a></strong><br>${money(p.price)}</div>
      <div class="qty"><button data-dec="${p.id}" aria-label="تقليل">−</button><span>${q}</span><button data-inc="${p.id}" aria-label="زيادة">+</button></div>
      <button class="link" data-del="${p.id}">حذف</button></div>`).join('') +
      `<div class="sum"><div class="tot"><span>إجمالي المنتجات</span><span>${money(subtotal())}</span></div></div>
      ${cartExtras()}
      <div class="actions"><button class="btn ghost" id="clear">إفراغ السلة</button><button class="btn" id="next">إتمام الطلب</button></div>`;
  }
  body.onclick = e => {
    const g = a => e.target.closest(`[data-${a}]`)?.dataset[a];
    const inc = g('inc'), dec = g('dec'), del = g('del');
    if (inc) { const p = byId(+inc); if (cart[inc] < p.stock) cart[inc]++; }
    else if (dec) { if (--cart[dec] < 1) delete cart[dec]; }
    else if (del) delete cart[del];
    else if (g('up')) cart[g('up')] = 1;
    else if (g('re') !== undefined) reorder(+g('re'));
    else if (g('inv') !== undefined) return openOrderInvoice(+g('inv'));   // [جديد] زر الفاتورة
    else if (e.target.id === 'clear') cart = {};
    else if (e.target.id === 'next') return showCheckout();
    else return;
    saveCart(); refresh(); showCart();
  };

  const feeFor = (area, sub) => !area ? 0 : (C.freeDeliveryFrom > 0 && sub >= C.freeDeliveryFrom ? 0 : area.fee);
  const cartExtras = () => {
    let h = '<p class="note">رسوم التوصيل تُحسب في الخطوة التالية حسب منطقتك.</p>';
    if (C.freeDeliveryFrom > 0) { const s = subtotal(), left = C.freeDeliveryFrom - s;
      h += left > 0 ? `<p class="note">أضف ${money(left)} للحصول على توصيل مجاني</p><div class="bar"><i style="width:${Math.round(s / C.freeDeliveryFrom * 100)}%"></i></div>` : '<p class="note">🎉 توصيلك مجاني</p>'; }
    const cats = items().map(i => i.p.cat), up = P.filter(x => x.stock > 0 && !cart[x.id] && !cats.includes(x.cat)).slice(0, 3);
    return h + (up.length ? `<h3 class="uph">قد يهمك أيضاً</h3><div class="sim">${up.map(x => `<button data-up="${x.id}">+ ${esc(x.name)} — ${money(x.price)}</button>`).join('')}</div>` : '');
  };


  /* ┌────────────────────────────────────────────────────────────────
     │ (6) إتمام الطلب وإرساله عبر واتساب — [كما كان]
     │ [معدّل] sendOrder يحفظ نسخة فاتورة، وشاشة «تم تجهيز الطلب» فيها زر الفاتورة
     └──────────────────────────────────────────────────────────────── */
  function showCheckout() {
    $('#dTitle').textContent = 'إتمام الطلب';
    body.innerHTML = `<form class="form" id="form" novalidate>
      <label for="fn">الاسم الكامل</label><input id="fn" autocomplete="name">
      <label for="fp">رقم الهاتف</label><input id="fp" type="tel" inputmode="tel" autocomplete="tel" placeholder="09XXXXXXXX">
      <label>طريقة الاستلام</label>
      <div class="radio"><label><input type="radio" name="m" value="pickup" checked> استلام من المتجر</label><label><input type="radio" name="m" value="delivery"> توصيل</label></div>
      <div id="dv" hidden><label for="fa">المنطقة</label><select id="fa"><option value="">اختر المنطقة</option>${C.deliveryAreas.map((a, i) => `<option value="${i}">${esc(a.name)} — ${money(a.fee)}</option>`).join('')}</select>
      <label for="fd">العنوان التفصيلي</label><input id="fd" autocomplete="street-address"></div>
      <label for="fo">ملاحظات (اختياري)</label><textarea id="fo" rows="2"></textarea>
      <div class="sum" id="sum"></div><p class="err" id="err" role="alert"></p>
      <p class="note">الدفع نقداً عند الاستلام. سيفتح واتساب برسالة جاهزة، ويُعتبر طلبك مؤكداً بعد رد المتجر عليك. يُحفظ اسمك ورقمك على جهازك فقط لتسهيل طلبك القادم.</p>
      <div class="actions"><button type="button" class="btn ghost" id="back">رجوع</button><button class="btn" type="submit">إرسال الطلب عبر واتساب</button></div></form>`;
    const form = $('#form'), dv = $('#dv');
    const sv = store.get('nova_cust', {}); $('#fn').value = sv.name || ''; $('#fp').value = sv.phone || '';
    const method = () => form.m.value;
    const fee = () => method() === 'delivery' && $('#fa').value !== '' ? feeFor(C.deliveryAreas[+$('#fa').value], subtotal()) : 0;
    const sum = () => {
      const d = method() === 'delivery';
      $('#sum').innerHTML = `<div><span>المنتجات</span><span>${money(subtotal())}</span></div>
        <div><span>التوصيل</span><span>${!d ? 'بدون' : $('#fa').value === '' ? 'يُحدد بعد اختيار المنطقة' : money(fee())}</span></div>
        ${d && $('#fa').value === '' ? '' : `<div class="tot"><span>الإجمالي</span><span>${money(subtotal() + fee())}</span></div>`}`;
    };
    form.onchange = () => { dv.hidden = method() !== 'delivery'; sum(); };
    sum();
    $('#back').onclick = showCart;
    form.onsubmit = e => {
      e.preventDefault();
      const name = $('#fn').value.trim(), phone = $('#fp').value.replace(/[\s\-+]/g, '');
      const d = method() === 'delivery', area = $('#fa').value, addr = $('#fd').value.trim();
      let err = '';
      if (name.length < 3) err = 'اكتب اسمك الكامل.';
      else if (!/^\d{9,15}$/.test(phone)) err = 'رقم الهاتف غير صحيح.';
      else if (d && area === '') err = 'اختر منطقة التوصيل.';
      else if (d && addr.length < 4) err = 'اكتب العنوان التفصيلي.';
      if (!err) items().forEach(({ p, q }) => { if (q > p.stock) err = `الكمية المطلوبة من «${p.name}» أكبر من المتوفر.`; });
      if (err) { $('#err').textContent = err; return; }
      sendOrder({ name, phone, d, area: d ? C.deliveryAreas[+area] : null, addr, note: $('#fo').value.trim() });
    };
  }

  function orderNo() {
    const n = (store.get('nova_seq', 0) + 1); store.set('nova_seq', n);
    return `${C.orderPrefix}-${new Date().getFullYear()}-${String(n).padStart(5, '0')}`;
  }

  function sendOrder(o) {
    store.set('nova_cust', { name: o.name, phone: o.phone });
    const no = orderNo(), fee = feeFor(o.area, subtotal()), total = subtotal() + fee;
    const lines = items().map(({ p, q }) => `• ${p.name} × ${q} = ${money(p.price * q)}`);
    const msg = [`*طلب جديد ${no}* — ${C.name}`, '', ...lines, '',
      `المنتجات: ${money(subtotal())}`, o.d ? `التوصيل (${o.area.name}): ${money(fee)}` : 'الاستلام: من المتجر',
      `*الإجمالي: ${money(total)}*`, 'الدفع: عند الاستلام', '',
      `الاسم: ${o.name}`, `الهاتف: ${o.phone}`, o.d ? `العنوان: ${o.addr}` : '', o.note ? `ملاحظات: ${o.note}` : ''].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n');
    const url = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
    /* [جديد] نسخة الفاتورة تُحفظ مع الطلب لتستطيع إعادة طباعتها لاحقاً من «طلباتي» */
    const invoice = {
      no: newInvNo(), orderNo: no, t: Date.now(), name: o.name, phone: o.phone,
      method: o.d ? 'delivery' : 'pickup', areaName: o.d ? o.area.name : '', addr: o.addr, fee, note: o.note,
      lines: items().map(({ p, q }) => ({ id: p.id, name: p.name, price: p.price, q })), editable: false
    };
    const hist = store.get('nova_orders', []);
    hist.unshift({ no, t: Date.now(), total, items: items().map(i => ({ id: i.p.id, q: i.q })), inv: invoice });
    store.set('nova_orders', hist.slice(0, 10));
    cart = {}; saveCart(); refresh();
    $('#dTitle').textContent = 'تم تجهيز الطلب';
    body.innerHTML = `<div class="done"><h3>رسالة الطلب جاهزة</h3><div class="no">${no}</div>
      <p>اضغط الزر لإرسالها عبر واتساب. الطلب يُعتبر مؤكداً بعد رد المتجر عليك.</p><br>
      <a class="btn" href="${url}" target="_blank" rel="noopener">فتح واتساب وإرسال الطلب</a><br>
      <button class="btn ghost" data-inv="0">🖨️ عرض وطباعة الفاتورة</button></div>`;
    window.open(url, '_blank', 'noopener');
  }


  /* ┌────────────────────────────────────────────────────────────────
     │ (7) الفاتورة والطباعة — [جديد] كله
     │ buyNow(id,qty)      : زر «اشترِ الآن» الوهمي → يفتح فاتورة للمنتج
     │ openOrderInvoice(i) : يفتح فاتورة طلب سابق من «طلباتي»
     │ لتغيير شكل الفاتورة (الأعمدة، النصوص): عدّل sheetHTML() أدناه
     │ لتغيير عنوانها/شكرها/رقمها: عدّل invoice في config.js
     │ الطباعة: window.print() مع CSS خاص (قسم 17 في style.css) يطبع الفاتورة فقط
     │ تدعم A4 والطابعات الحرارية (إيصال 80 مم)
     └──────────────────────────────────────────────────────────────── */
  const INV = Object.assign({ title: 'فاتورة بيع', prefix: 'INV', footer: '', note: '', taxNo: '' }, C.invoice || {});
  let inv = null, paper = store.get('nova_paper', 'a4');     // inv = الفاتورة المعروضة حالياً

  function newInvNo() {
    const n = store.get('nova_inv_seq', 0) + 1; store.set('nova_inv_seq', n);
    return `${INV.prefix}-${new Date().getFullYear()}-${String(n).padStart(5, '0')}`;
  }
  function fmtDate(t) {
    try { return new Date(t).toLocaleString('ar-LY-u-nu-latn', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return new Date(t).toLocaleString(); }
  }
  const invTotals = v => { const sub = v.lines.reduce((s, l) => s + l.price * l.q, 0), fee = v.fee || 0; return { sub, fee, total: sub + fee }; };

  /* ورقة الفاتورة (HTML). كل ما يُطبع تراه هنا */
  function sheetHTML(v) {
    const t = invTotals(v);
    const rows = v.lines.map((l, i) => `<tr><td>${i + 1}</td><td>${esc(l.name)}</td><td class="num">${l.q}</td><td class="num">${money(l.price)}</td><td class="num">${money(l.price * l.q)}</td></tr>`).join('');
    return `<div class="inv ${paper === 'p80' ? 'p80' : 'a4'}" dir="rtl">
      <div class="inv-h"><img src="images/icon.svg" alt="">
        <div><h2>${esc(C.name)}</h2><p>${esc(C.address)}</p><p>هاتف: <span dir="ltr">${esc(C.phoneDisplay)}</span>${INV.taxNo ? ' — سجل: ' + esc(INV.taxNo) : ''}</p></div>
        <div class="inv-t"><strong>${esc(INV.title)}</strong><span>${esc(v.no)}</span></div></div>
      <div class="inv-meta">
        <div><b>التاريخ:</b> ${esc(fmtDate(v.t))}</div>
        <div><b>العميل:</b> ${esc(v.name || 'عميل نقدي')}</div>
        ${v.phone ? `<div><b>هاتف العميل:</b> <span dir="ltr">${esc(v.phone)}</span></div>` : ''}
        <div><b>الاستلام:</b> ${v.method === 'delivery' ? 'توصيل — ' + esc(v.areaName) : 'من المتجر'}</div>
        ${v.addr ? `<div><b>العنوان:</b> ${esc(v.addr)}</div>` : ''}
        ${v.orderNo ? `<div><b>رقم الطلب:</b> <span dir="ltr">${esc(v.orderNo)}</span></div>` : ''}
        <div><b>الدفع:</b> نقداً</div></div>
      <table class="inv-table"><thead><tr><th>#</th><th>الصنف</th><th class="num">الكمية</th><th class="num">السعر</th><th class="num">الإجمالي</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="inv-sum"><div><span>المنتجات</span><span>${money(t.sub)}</span></div>
        ${v.method === 'delivery' ? `<div><span>التوصيل</span><span>${money(t.fee)}</span></div>` : ''}
        <div class="tot"><span>الإجمالي</span><span>${money(t.total)}</span></div></div>
      ${v.note ? `<p class="inv-note">ملاحظات الطلب: ${esc(v.note)}</p>` : ''}
      <p class="inv-foot">${esc(INV.footer)}</p>${INV.note ? `<p class="inv-note">${esc(INV.note)}</p>` : ''}</div>`;
  }
  const paintSheet = () => { $('#invSheet').innerHTML = sheetHTML(inv); applyPaper(); };

  /* مقاس الورق للطباعة يُحقن في الصفحة حسب الاختيار.
     A4 = ورقة عادية. إيصال 80 مم = العرض 80مم والطول يُحسب من طول الفاتورة الفعلي
     (لأن Chrome لا يدعم الطول "auto"). إن كان درايفر طابعتك يضبط الطول وحده فلا مشكلة. */
  function applyPaper() {
    let s = $('#invPageStyle');
    if (!s) { s = document.createElement('style'); s.id = 'invPageStyle'; document.head.append(s); }
    const el = $('#invSheet .inv');
    const h = el ? Math.ceil(el.offsetHeight * 25.4 / 96) + 10 : 200;
    s.textContent = paper === 'p80' ? `@page{size:80mm ${h}mm;margin:2mm}` : '@page{size:A4;margin:12mm}';
  }

  function openInvoice(v) {
    inv = v;
    const one = v.editable ? v.lines[0] : null;
    $('#invTools').innerHTML = `<strong class="inv-ttl">🧾 معاينة الفاتورة</strong>
      ${v.editable ? `<label>اسم العميل <input id="invName" placeholder="اختياري" autocomplete="off"></label>
        <label>الكمية <span class="qty"><button type="button" data-iq="-1" aria-label="تقليل">−</button><span id="invQ">${one.q}</span><button type="button" data-iq="1" aria-label="زيادة">+</button></span></label>` : ''}
      <label>الورق <select id="invPaper"><option value="a4" ${paper === 'a4' ? 'selected' : ''}>A4 عادي</option><option value="p80" ${paper === 'p80' ? 'selected' : ''}>إيصال حراري 80 مم</option></select></label>
      <button type="button" class="btn" id="invPrint">🖨️ طباعة</button>
      <button type="button" class="btn ghost" id="invClose">إغلاق</button>
      <p class="note inv-hint">وصّل الطابعة بجهازك ثم اضغط «طباعة» واختر الطابعة من نافذة المتصفح. ${v.editable ? 'هذه عملية شراء تجريبية: لا يُخصم مخزون ولا يُرسل طلب.' : ''}</p>`;
    $('#invModal').hidden = false; paintSheet();
  }
  function closeInvoice() { $('#invModal').hidden = true; }

  function printInvoice() {
    applyPaper();   // تأكيد المقاس قبل الطباعة
    const old = document.title; document.title = inv.no;       // اسم ملف PDF عند الحفظ
    setTimeout(() => { window.print(); document.title = old; }, 60);
  }

  $('#invModal').addEventListener('click', e => {
    const q = e.target.closest('[data-iq]');
    if (q && inv) { const l = inv.lines[0]; l.q = Math.max(1, Math.min(l.max || 99, l.q + +q.dataset.iq)); $('#invQ').textContent = l.q; paintSheet(); }
    else if (e.target.closest('#invPrint')) printInvoice();
    else if (e.target.id === 'invModal' || e.target.closest('#invClose')) closeInvoice();
  });
  $('#invModal').addEventListener('input', e => { if (e.target.id === 'invName' && inv) { inv.name = e.target.value.trim(); paintSheet(); } });
  $('#invModal').addEventListener('change', e => {
    if (e.target.id === 'invPaper') { paper = e.target.value; store.set('nova_paper', paper); paintSheet(); }
  });

  /* زر «اشترِ الآن» (وهمي): يفتح فاتورة بمنتج واحد قابلة للتعديل ثم الطباعة */
  function buyNow(id, qty = 1) {
    const p = byId(id); if (!p) return;
    if (p.stock < 1) { toast('هذا المنتج غير متوفر حالياً', 'warn'); return; }
    closeQV();
    openInvoice({ no: newInvNo(), t: Date.now(), name: '', phone: '', method: 'pickup', fee: 0, note: '', editable: true,
      lines: [{ id: p.id, name: p.name, price: p.price, q: Math.max(1, Math.min(qty, p.stock)), max: p.stock }] });
  }
  function openOrderInvoice(i) {
    const o = store.get('nova_orders', [])[i];
    if (o && o.inv) openInvoice(o.inv); else toast('لا توجد فاتورة محفوظة لهذا الطلب', 'warn');
  }
  NOVA.addToCart = addToCart; NOVA.buyNow = buyNow; NOVA.openQV = openQV; NOVA.toast = toast;


  /* ┌────────────────────────────────────────────────────────────────
     │ (8) العرض السريع والمقارنة والمشاركة — [كما كان]
     │ [معدّل] العرض السريع صار فيه زر «اشترِ الآن» ورابط «صفحة المنتج الكاملة»
     │         والمشاركة تنسخ رابط صفحة المنتج الجديدة
     │ [معدّل] المقارنة تُحفظ، وزرها صار شريطاً عائماً يظهر في كل الصفحات
     └──────────────────────────────────────────────────────────────── */
  function toast(msg, type = 'ok') {
    const d = document.createElement('div'); d.className = 'toast ' + type; d.textContent = msg;
    $('#toasts').append(d); setTimeout(() => d.remove(), 2800);
  }

  function openQV(id) {
    const p = byId(id); if (!p) return;
    NOVA.addRecent(id);
    const off = p.oldPrice > p.price, imgs = p.images && p.images.length ? p.images : [p.image || 'images/p' + p.id + '.jpg'];
    const main = imgs.length ? `<img id="qvMain" src="${esc(imgs[0])}" alt="${esc(p.name)}" data-zoom onerror="this.outerHTML='<div class=qv-em data-zoom>${p.emoji || '📦'}</div>'">` : `<div class="qv-em" data-zoom aria-hidden="true">${p.emoji || '📦'}</div>`;
    const thumbs = imgs.length > 1 ? `<div class="thumbs">${imgs.map(s => `<button data-th="${esc(s)}" aria-label="صورة"><img src="${esc(s)}" alt=""></button>`).join('')}</div>` : '';
    const sim = P.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
    $('#qvBody').innerHTML = `<button class="icon-btn qv-x" data-close aria-label="إغلاق">✕</button>${main}${thumbs}
      <h2>${esc(p.name)}</h2><span class="brand">${esc(p.brand)} — ${esc(catName(p.cat))}</span>
      <div class="price">${money(p.price)}${off ? `<s>${money(p.oldPrice)}</s>` : ''}</div>
      <p>${esc(p.desc)}</p>${p.models.length ? `<p class="note">متوافق مع: ${p.models.map(esc).join('، ')}</p>` : ''}
      <button class="btn" data-addq="${p.id}" ${p.stock < 1 ? 'disabled' : ''}>${p.stock < 1 ? 'غير متوفر حالياً' : 'أضف للسلة'}</button>
      <button class="btn buy" data-buy="${p.id}" ${p.stock < 1 ? 'disabled' : ''}>🧾 اشترِ الآن</button>
      <a class="btn ghost" href="${link.product(p.id)}">صفحة المنتج الكاملة</a>
      <button class="btn ghost" data-share="${p.id}">مشاركة المنتج</button>
      <a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent('أريد الاستفسار عن: ' + p.name + ' (' + money(p.price) + ')')}">اسأل عن هذا المنتج</a>
      ${sim.length ? `<h3>منتجات مشابهة</h3><div class="sim">${sim.map(x => `<button data-qvo="${x.id}">${x.emoji || '📦'} ${esc(x.name)}</button>`).join('')}</div>` : ''}`;
    $('#qv').hidden = false; refresh();
  }
  function closeQV() { $('#qv').hidden = true; }

  async function share(id) {
    const p = byId(id), url = new URL(link.product(id), location.href).href;
    try { if (navigator.share) await navigator.share({ title: p.name, url }); else { await navigator.clipboard.writeText(url); toast('تم نسخ رابط المنتج'); } }
    catch (e) { if (e.name !== 'AbortError') toast('تعذّرت المشاركة', 'err'); }
  }
  NOVA.share = share;

  $('#qv').onclick = e => {
    const g = k => e.target.closest(`[data-${k}]`)?.dataset[k];
    if (g('addq')) { const id = +g('addq'); closeQV(); addToCart(id); }
    else if (g('qvo')) openQV(+g('qvo'));
    else if (g('th')) { const m = $('#qvMain'); if (m) m.src = g('th'); }
    else if (g('share')) share(+g('share'));
    else if (e.target.closest('[data-zoom]')) { const el = e.target.closest('[data-zoom]'); zoomShow(el); }
    else if (e.target.id === 'qv' || e.target.closest('[data-close]')) closeQV();
  };
  function zoomShow(el) { $('#zoom').innerHTML = el.tagName === 'IMG' ? `<img src="${esc(el.src)}" alt="">` : `<div class="zbig">${el.textContent}</div>`; $('#zoom').hidden = false; }
  NOVA.zoomShow = zoomShow;
  $('#zoom').onclick = () => { $('#zoom').hidden = true; };

  function toggleCmp(id) {
    if (cmp.includes(id)) cmp = cmp.filter(x => x !== id);
    else if (cmp.length >= 3) return toast('يمكن مقارنة 3 منتجات كحد أقصى', 'warn');
    else cmp.push(id);
    store.set('nova_cmp', cmp); refresh();
  }
  $('#cmpBtn').onclick = () => {
    const ps = cmp.map(byId).filter(Boolean);
    const rows = [['السعر', p => money(p.price)], ['العلامة', p => p.brand], ['التصنيف', p => catName(p.cat)], ['التوفر', p => p.stock < 1 ? 'غير متوفر' : 'متوفر'], ['متوافق مع', p => p.models.join('، ') || 'عام'], ['الوصف', p => p.desc]];
    $('#qvBody').innerHTML = `<button class="icon-btn qv-x" data-close aria-label="إغلاق">✕</button><h2>مقارنة المنتجات</h2><div class="cmp"><table><tr><th></th>${ps.map(p => `<th>${esc(p.name)}</th>`).join('')}</tr>${rows.map(([l, f]) => `<tr><th>${l}</th>${ps.map(p => `<td>${esc(f(p))}</td>`).join('')}</tr>`).join('')}</table></div><button class="btn ghost" id="cmpClear">مسح المقارنة</button>`;
    $('#qv').hidden = false;
    $('#cmpClear').onclick = () => { cmp = []; store.set('nova_cmp', cmp); closeQV(); refresh(); };
  };


  /* ┌────────────────────────────────────────────────────────────────
     │ (9) طلباتي — [كما كان] + [جديد] زر «فاتورة» لكل طلب
     └──────────────────────────────────────────────────────────────── */
  function showOrders() {
    openDrawer(); $('#dTitle').textContent = 'طلباتي على هذا الجهاز';
    const h = store.get('nova_orders', []);
    body.innerHTML = !h.length ? '<p class="empty">لا توجد طلبات أُرسلت من هذا الجهاز بعد.</p>'
      : '<p class="note">هذه الطلبات أُرسلت عبر واتساب من هذا الجهاز. حالتها الفعلية يؤكدها لك المتجر.</p>' +
        h.map((o, i) => `<div class="row"><div class="n"><strong dir="ltr">${esc(o.no)}</strong><br>${new Date(o.t).toLocaleDateString('ar-LY')} — ${money(o.total)}</div>${o.inv ? `<button class="btn ghost" data-inv="${i}">🖨️ فاتورة</button>` : ''}<button class="btn ghost" data-re="${i}">أعد الطلب</button></div>`).join('');
  }
  $('#ordersBtn').onclick = showOrders;
  function reorder(i) {
    const o = store.get('nova_orders', [])[i]; if (!o) return;
    let n = 0; o.items.forEach(({ id, q }) => { const p = byId(id); if (p && p.stock > 0) { cart[id] = Math.min((cart[id] || 0) + q, p.stock); n++; } });
    toast(n ? 'أُضيفت المنتجات المتوفرة بأسعارها الحالية' : 'هذه المنتجات غير متوفرة حالياً', n ? 'ok' : 'warn');
  }


  /* ┌────────────────────────────────────────────────────────────────
     │ (10) البحث — [كما كان] الاقتراحات وسجل البحث والبحث الصوتي
     │ [معدّل] عند الضغط Enter من أي صفحة غير التصنيفات ننتقل لصفحة النتائج
     │         category.html?q=...  أما داخل صفحة التصنيفات فتتحدث النتائج مباشرة
     └──────────────────────────────────────────────────────────────── */
  const sg = $('#sugg');
  function showSugg() {
    const q = norm($('#q').value.trim()); let h = '';
    if (q) h = P.filter(p => norm(p.name + ' ' + p.brand).includes(q)).slice(0, 5).map(p => `<button type="button" data-s="${esc(p.name)}">${esc(p.name)}</button>`).join('');
    else if (recS.length) h = '<div class="sg-h"><span>عمليات البحث الأخيرة</span><button type="button" data-clr>مسح السجل</button></div>' + recS.map(s => `<button type="button" data-s="${esc(s)}">${esc(s)}</button>`).join('');
    sg.innerHTML = h; sg.hidden = !h;
  }
  function saveRecentQ(s) { s = s.trim(); if (s.length < 2) return; recS = [s, ...recS.filter(x => x !== s)].slice(0, 5); store.set('nova_recent_q', recS); }
  function doSearch(q) {                    // [جديد] ينفّذ البحث حسب الصفحة
    saveRecentQ(q); sg.hidden = true;
    if (NOVA.hooks.search) NOVA.hooks.search(q); else location.href = link.search(q);
  }
  let t; $('#q').addEventListener('input', e => {
    showSugg();
    if (NOVA.hooks.search) { clearTimeout(t); t = setTimeout(() => NOVA.hooks.search(e.target.value), 200); }
  });
  $('#q').addEventListener('focus', showSugg);
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(e.target.value); });
  sg.onclick = e => {
    if (e.target.closest('[data-clr]')) { recS = []; store.set('nova_recent_q', recS); sg.hidden = true; return; }
    const b = e.target.closest('[data-s]'); if (!b) return;
    $('#q').value = b.dataset.s; doSearch(b.dataset.s);
  };
  document.addEventListener('click', e => { if (!e.target.closest('.search')) sg.hidden = true; });

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    $('#mic').hidden = false;
    $('#mic').onclick = () => {
      const r = new SR(); r.lang = 'ar-SA';
      r.onresult = e => { const v = e.results[0][0].transcript; $('#q').value = v; doSearch(v); };
      r.onerror = () => toast('تعذّر التعرف على الصوت', 'err');
      toast('تكلّم الآن…'); r.start();
    };
  }
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#q').focus(); }
  });


  /* ┌────────────────────────────────────────────────────────────────
     │ (11) التنقل السفلي والمظهر وحجم النص والتثبيت كتطبيق — [كما كان]
     │ [معدّل] أزرار التنقل صارت تنتقل بين الصفحات الحقيقية، والمفضلة صفحة مستقلة
     └──────────────────────────────────────────────────────────────── */
  $('#favBtn').onclick = () => { location.href = (PAGE === 'category' && QS.get('view') === 'fav') ? link.category('') : link.view('fav'); };
  $('#bnav').onclick = e => {
    const k = e.target.closest('[data-nav]')?.dataset.nav; if (!k) return;
    if (k === 'home') { if (PAGE === 'home') scrollTo({ top: 0, behavior: smooth }); else location.href = link.home; }
    else if (k === 'search') { scrollTo({ top: 0 }); $('#q').focus(); }
    else if (k === 'cats') $('#side').scrollIntoView({ behavior: smooth, block: 'center' });
    else if (k === 'fav') $('#favBtn').click();
    else $('#cartBtn').click();
  };
  const topBtn = $('#toTop');
  addEventListener('scroll', () => { topBtn.hidden = scrollY < 600; }, { passive: true });
  topBtn.onclick = () => scrollTo({ top: 0, behavior: smooth });

  const paintTheme = () => {
    const d = root.dataset.theme === 'dark';
    $('#themeBtn').textContent = d ? '☀️' : '🌙';
    $('#themeBtn').setAttribute('aria-label', d ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي');
  };
  $('#themeBtn').onclick = () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; store.set('nova_theme', root.dataset.theme); paintTheme(); };
  paintTheme();

  const sizes = [100, 112, 125]; let fs = store.get('nova_fs', 0);
  const paintFs = () => { root.style.fontSize = sizes[fs] + '%'; };
  $('#fontBtn').onclick = () => { fs = (fs + 1) % 3; store.set('nova_fs', fs); paintFs(); toast('حجم النص: ' + ['عادي', 'كبير', 'أكبر'][fs]); };
  paintFs();

  let dip; addEventListener('beforeinstallprompt', e => { e.preventDefault(); dip = e; $('#install').hidden = false; });
  $('#install').onclick = () => { if (dip) { dip.prompt(); dip = null; $('#install').hidden = true; } };
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});


  /* ┌────────────────────────────────────────────────────────────────
     │ (12) تحديث الواجهة وتشغيل الصفحة
     │ refresh() تُستدعى بعد أي تغيير (سلة/مفضلة/مقارنة): تحدّث العدادات
     │ وشريط المقارنة والقائمة الجانبية ثم تطلب من الصفحة إعادة رسم منتجاتها
     └──────────────────────────────────────────────────────────────── */
  function refresh() {
    const n = Object.values(cart).reduce((a, b) => a + b, 0);
    $('#cartCount').textContent = n; $('#cartCount').hidden = !n;
    $('#navCart').textContent = n; $('#navCart').hidden = !n;
    $('#favCount').textContent = favs.length; $('#favCount').hidden = !favs.length;
    $('#favBtn').setAttribute('aria-pressed', PAGE === 'category' && QS.get('view') === 'fav');
    $('#cmpBar').hidden = cmp.length < 2; $('#cmpBtn').textContent = `قارن (${cmp.length})`;
    renderSide();
    if (NOVA.hooks.render) NOVA.hooks.render();
  }
  NOVA.refresh = refresh;
  refresh();
})();
