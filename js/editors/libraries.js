//= require "../chrome/storage"

// shortcut method
var push = Array.prototype.push;

var Libraries = function () {
  this.init();

  this.userSpecified = JSON.parse(localStorage.getItem('libraries') || "[]");
  
  // read from storage
  for (var i = 0; i < this.userSpecified.length; i++) {
    push.call(this, this.userSpecified[i]);
  }
};

Libraries.prototype.init = function () {
  var libs = {
    datatables: {
      text: 'DataTables',
      scripts: [
        { text: 'Nightly', url: 'http://datatables.net/download/build/jquery.dataTables.nightly.js'},
        { text: 'v1.9.1', url: '/release-builds/jquery.datatables.1.9.1.js'},
        { text: 'v1.9.0', url: '/release-builds/jquery.datatables.1.9.0.js'},
        { text: 'v1.8.2', url: '/release-builds/jquery.datatables.1.8.2.js'},
        { text: 'v1.8.1', url: '/release-builds/jquery.datatables.1.8.1.js'},
        { text: 'v1.8.0', url: '/release-builds/jquery.datatables.1.8.0.js'},
        { text: 'v1.7.6', url: '/release-builds/jquery.datatables.1.7.6.js'},
        { text: 'v1.6.2', url: '/release-builds/jquery.datatables.1.6.2.js'}
      ]
    },
    extras: {
      text: 'Extras',
      scripts: [
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'AutoFill (latest)', url: 'http://datatables.net/download/build/AutoFill.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'ColReorder (latest)', url: 'http://datatables.net/download/build/ColReorder.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'ColVis (latest)', url: 'http://datatables.net/download/build/ColVis.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'FixedColumns (latest)', url: 'http://datatables.net/download/build/FixedColumns.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'FixedHeader (latest)', url: 'http://datatables.net/download/build/FixedHeader.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'KeyTable (latest)', url: 'http://datatables.net/download/build/KeyTable.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'Scroller (latest)', url: 'http://datatables.net/download/build/Scroller.js'},
        { requires: 'http://datatables.net/download/build/jquery.dataTables.nightly.js', text: 'TableTools (latest)', url: 'http://datatables.net/download/build/TableTools.min.js'}
      ]
    }
  },
  // NOTE if a new library category is added, you need to add it here
  order = 'datatables extras'.split(' '),
  i = 0;
    
  this.length = 0; // triggers support for length prop
  for (i = 0; i < order.length; i++) {
    push.call(this, libs[order[i]]);
  }
};

Libraries.prototype.add = function (lib) {
  // save to localStorage
  this.userSpecified.push(lib);
  try {
    localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
  push.call(this, lib);
  $('#library').trigger('init');
};

Libraries.prototype.clear = function () {
  this.userSpecified = [];
  localStorage.removeItem('libraries');
  this.init();
  $('#library').trigger('init');
};

// OO based to all me to fiddle the object to resemble an array
var libraries = new Libraries();
window.libraries = libraries; // expose a command line API