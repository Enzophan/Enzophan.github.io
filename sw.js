const staticCacheName = 'site-static';
const assets = [
    '/',
    '/index.html',
    '/blogs.html',
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
})

// Fetch events
self.addEventListener('fetch', evt => {
    // console.log("fetch event", evt)
})