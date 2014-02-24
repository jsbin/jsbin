// this will happen if a url from IE8-9 has been shared
if (location.hash && (/#\/.*?\/(\d+\/)?edit/i).test(location.hash)) {
  // redirect
  window.location = jsbin.root + location.hash.substring(1) + location.search;
}