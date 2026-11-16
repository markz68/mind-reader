const CACHE='mind-reader-v0.3.1';
const ASSETS=['./','./index.html','./styles.css','./manifest.webmanifest','./icon.svg','./js/app.js?v=0.3.1','./js/storage.js?v=0.3.1','./js/engine.js?v=0.3.1','./js/data.js?v=0.3.1'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('mind-reader-')&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(request,{cache:'no-store'});
   if(response.ok)await cache.put(request,response.clone());
   return response;
  }catch{
   return (await cache.match(request))||(request.mode==='navigate'?await cache.match('./index.html'):undefined)||Response.error();
  }
 })());
});
