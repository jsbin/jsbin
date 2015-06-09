if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(jsbin.root + '/sw.js').then(function(sw) {
    // registration worked!
        console.log('ServiceWorker registration successful with scope: ',    sw.scope);

    console.log('service worker registered');
  }).catch(function(e) {
    // registration failed :(
    console.log('failed to register');
    console.log(e);
  });
} else {
  console.log('no service worker');
}