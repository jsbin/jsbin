function allowDrop(holder) {
  holder.ondragover = function () { 
    return false; 
  };

  holder.ondragend = function () { 
    return false; 
  };
  
  holder.ondrop = function (e) {
    e.preventDefault();

    var file = e.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = function (event) {
      // put JS in the JavaScript panel
      editors[file.type.indexOf('javascript') > 0 ? 'javascript' : 'html'].setCode(event.target.result);
    };
    reader.readAsText(file);
    
    return false;
  };
}

$document.one('jsbinReady', function () {
  if (typeof window.FileReader !== 'undefined') {
    allowDrop(editors.html.win);
    allowDrop(editors.javascript.win);
    allowDrop(window);
  }
});