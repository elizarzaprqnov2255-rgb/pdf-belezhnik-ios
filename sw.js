// PDF бележник — офлайн кеш. Смени VERSION при нова версия (build.py го прави сам).
const VERSION='pdfb-346d473a';
const CORE=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/favicon.png", "lib/pdf.min.mjs", "lib/pdf.worker.min.mjs", "lib/pdf-lib.min.js"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  // страницата: първо мрежата (за нови версии), после кеша
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('./',c));return res}).catch(()=>caches.match('./')));return}
  // всичко останало: кеш, после мрежа (шрифтовете и cmaps се кешират при нужда)
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c))}return res})));
});
