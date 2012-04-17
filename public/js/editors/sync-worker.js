// directly from @wookiehangover's amazing demo: https://github.com/wookiehangover/pandaco.de
var reader = new FileReader();

var modified_cache;

self.addEventListener('message', function(e){

  var interval = 500;

  var multiplier = 1;

  var poll = function(){
    reader.readAsText(e.data);
    setTimeout(poll, interval * multiplier);
  };

  poll();

  reader.onload = function(file){
    var modified = +new Date(e.data.lastModifiedDate);

    if( modified_cache !== modified ){

      multiplier = 1;
      modified_cache = modified;

      postMessage({
        body: file.target.result,
        size: file.total,
        lastModified: file.timeStamp
      });
    } else {
      delete file;
    }

    if( multiplier < 8 )
      multiplier += 1;
  };

}, false);