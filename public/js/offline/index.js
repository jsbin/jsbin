if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/offline/serviceWorker.js').then(function(sw) {
    // registration worked!
    console.log('service worker registered');
  }).catch(function(e) {
    // registration failed :(
    console.log('failed to register');
    console.log(e);
  });
} else {
  console.log('no service worker');
}