self.addEventListener('install', e => {
	console.log('service worker instalado.', e);
});

self.addEventListener('activate', e => {
	console.log('service worker ativado.', e);
});

self.addEventListener('fetch', e => {
	console.log('fetch', e);
});