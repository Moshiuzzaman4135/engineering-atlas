const CACHE='engineering-atlas-v4';
const ASSETS=[
  './','./index.html','./START_HERE.html','./manifest.webmanifest','./css/styles.css',
  './js/data.js','./js/expanded-data.js','./js/store.js','./js/scheduler.js','./js/simulations.js','./js/diagrams.js','./js/app.js',
  './assets/icon-192.png','./assets/icon-512.png','./assets/atlas-mark.svg'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    const copy=response.clone();
    if(new URL(event.request.url).origin===self.location.origin)caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match('./index.html'))));
});
