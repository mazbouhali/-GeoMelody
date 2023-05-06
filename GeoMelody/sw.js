//This service worker file is essential for a PWA. Allows for:
// 1. Load content online/offline
// 2. Use background sync
// 3. Use push notifications
// Runs in the background and handles the app-like functionality like push messages
// Also listens to life cycle events
// When the service worker is active it can listen to fetch requests and interceprt them if needed

const staticCacheName = 'site-static-v16';
const dynamicCache = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/common.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/music.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html',
    '/pages/about.html',
    '/pages/history.html'
];

//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
};


//install service worker
self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

//activate service worker
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
    evt.waitUntil(
        //This code deletes all redundant caches
        caches.keys().then(keys => {
            console.log(keys); 
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
   // evt.respondWith(
     //   //This code checks all the chaches for a request
       // caches.match(evt.request).then(cacheRes => {
         //   return cacheRes || fetch(evt.request).then(fetchRes => {
           //     return caches.open(dynamicCacheName).then(cache => {
             //       cache.put(evt.request.url, fetchRes.clone());
               //     limitCacheSize(dynamicCacheName, 15);
                 //   return fetchRes;
               // })
           // });
        //}).catch(() => {
          //  if(evt.request.url.indexOf('.html') > -1){
            //    return caches.match('/pages/fallback.html');
            //}
        //})
    //);
});

//Now, when we're making fetch requests online or offline we're intercepting the fetch, 
//seeing if the fetch request is in the cache
//if so it returns it to the user