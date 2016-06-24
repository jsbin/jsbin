/*jshint esversion: 6*/
/*global caches, binCache, staticCacheName */

this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      const keep = [binCache, staticCacheName];
      const trash = names.filter(
        name => !keep.includes(name)
      ).map(
        name => caches.delete(name)
      );

      return Promise.all(trash).catch(e => {
        console.log('failed to clean up');
        console.log(e);
      });
    })
  );
});
