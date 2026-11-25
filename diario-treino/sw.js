const C="dt-v25";
self.addEventListener("install",()=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);if(u.hostname.endsWith("supabase.co"))return;
  e.respondWith(fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r).then(m=>m||(r.mode==="navigate"?caches.match(self.registration.scope):undefined))));
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(cs=>{for(const c of cs){if("focus"in c)return c.focus()}return self.clients.openWindow(self.registration.scope)}))});
