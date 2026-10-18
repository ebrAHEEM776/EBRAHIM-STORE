/* sw.js — يعمل بأسلوب "الشبكة أولاً" حتى تصل التعديلات فوراً، ويستخدم النسخة المخزنة عند انقطاع الاتصال
   [معدّل] رفعت رقم النسخة إلى nova-v3 لتتحدث ملفات الزوار، وأضفت الصفحتين الجديدتين.
   عند أي تعديل كبير لاحقاً: غيّر الرقم (v3 → v4) ليتجدد التخزين عند الزوار. */
const CACHE = 'nova-v3';
const FILES = ['./', 'index.html', 'category.html', 'product.html', 'css/style.css', 'js/config.js', 'js/app.js', 'js/home.js', 'js/category.js', 'js/product.js', 'images/icon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
