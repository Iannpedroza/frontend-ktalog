/* const CACHE_NAME = "ktalog-cache";

const assets = [
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/index.html",
  "/home",
  "/",
];

this.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          // Open a cache and cache our files
          return cache.addAll(assets);
        })
    );
  });



self.addEventListener("activate", (evt) => {
  //console.log('activate sw');
}); 

self.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    console.log(event);
    event.respondWith(
      caches.match(event.request)
        .then((resp) => {
          if(resp){
            return resp;
          }
        })
    )
  }
}); */