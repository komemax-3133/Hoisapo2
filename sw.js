const CACHE="hoisapo-v14";
const ASSETS=["./","./index.html","./manifest.webmanifest","./hoisapo_template.xlsx"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req=event.request;
  if(req.mode==="navigate" || req.url.includes("index.html") || req.url.includes("hoisapo_template.xlsx")){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
        return res;
      }).catch(()=>caches.match(req))
    );
  }else{
    event.respondWith(caches.match(req).then(r=>r||fetch(req)));
  }
});
