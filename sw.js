const CACHE='tabishoku-autumn-v4';
const HOME=new URL('./index.html',self.location).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.add(new Request(HOME,{cache:'reload'}));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('tabishoku-autumn-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||event.request.mode!=='navigate'||!['index.html',''].includes(url.pathname.slice(url.pathname.lastIndexOf('/')+1)))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(event.request,{signal:AbortSignal.timeout(4000)});if(!response.ok)throw Error('offline');await cache.put(HOME,response.clone());return response}catch{return (await cache.match(HOME))||Response.error()}})());
});
