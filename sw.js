const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/pages/blogs.html',
    '/pages/fallback.html',
    '/js/app.js',
    '/css/smooth-scroll.js',
    '/css/index.css',
    '/img/background.jpg',
    '/img/user1.png',
    '/img/nhan-logo.png',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'
];

// Limiting cache size
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

// Install service worker
self.addEventListener('install', evt => {
    // console.log("Service  worker has been installed")
    evt.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                console.log("caching shell assets")
                cache.addAll(assets)
            })
    )
})

// Activate service worker
self.addEventListener('activate', evt => {
    // console.log("Service worker has been activated")
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys)
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key)))
        })
    )
})

// Fetch events
self.addEventListener('fetch', evt => {
    // console.log("fetch event", evt)
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName)
                    .then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    })
            })
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {
                return caches.match('/pages/fallback.html')
            }
        })

    )
})