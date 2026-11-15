const CACHE='mind-reader-v0.2.3';
const ASSETS=['./','./index.html','./styles.css','./manifest.webmanifest','./icon.svg','./js/app.js','./js/engine.js','./js/data.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('mind-reader-')&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 // Always check the network for the main document, but keep offline fallback.
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const response=await fetch(request,{cache:'no-store'});
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}
    return response;
   }catch{
    return (await caches.match(request))||(await caches.match('./index.html'))||Response.error();
   }
  })());
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
