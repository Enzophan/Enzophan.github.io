const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/pages/blogs.html',
    '/js/app.js',
    '/css/smooth-scroll.js',
    '/css/index.css',
    '/img/background.jpg',
    '/img/user1.png',
    '/img/nhan-logo.png',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'
]

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
            return Promise.all(keys.filter(key => key !== staticCacheName).map(key => caches.delete(key)))
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
                        return fetchRes;
                    })
            })
        })

    )
})