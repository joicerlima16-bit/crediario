// Guarda o app no celular para abrir mesmo sem internet.
const CACHE='crediario-v1';
const ARQS=['./','index.html','config.js','manifest.webmanifest','icone-180.png','icone-192.png','icone-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  // bibliotecas do Firebase e fontes: versão fixa, pode usar a cópia guardada
  if(u.hostname==='www.gstatic.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='fonts.googleapis.com'){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return res; })));
    return;
  }
  // arquivos do próprio app: tenta a versão nova, se não tiver internet usa a guardada
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return res; }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }
});
