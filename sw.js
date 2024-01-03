const staticCacheName = 'shopping-list-static-v1.2';
const assets = [
	'/',
	'index.html',
	'shopping_list.html',
	'css/index.css',
	'css/main.css',
	'css/shoppingList.css',
	'css/variables.css',
	'js/app.js',
	'js/index.js',
	'js/shoppingList.js',
	'js/UserData.js',
	'js/utils.js',
	'assets/icons/icon-72x72.png',
	'assets/icons/icon-96x96.png',
	'assets/icons/icon-128x128.png',
	'assets/icons/icon-144x144.png',
	'assets/icons/icon-152x152.png',
	'assets/icons/icon-192x192.png',
	'assets/icons/icon-384x384.png',
	'assets/icons/icon-512x512.png',
	'assets/images/add.svg',
	'assets/images/back.svg',
	'assets/images/delete.svg',
	'assets/images/next.svg',
	'assets/images/tick.svg'
];

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(staticCacheName).then(cache => {
			cache.addAll(assets);
		})
	);
});

self.addEventListener('activate', e => {
	e.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName)
				.map(key => caches.delete(key))
			)
		})
	);
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request).then(cacheRes => {
			return cacheRes || fetch(e.request);
		})
	);
});