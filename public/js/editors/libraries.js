window.libraries = window.libraries || []; // expose a command line API

libraries.userSpecified = JSON.parse(store.localStorage.getItem('libraries') || '[]');
for (var i = 0; i < libraries.userSpecified.length; i++) {
  libraries.push(libraries.userSpecified[i]);
}

libraries.add = function (lib) {
  // Extract each script from a list (as documented) or use the default way
  if (lib.scripts) {
    lib.scripts.forEach(function (script) {
      script.group = lib.text;
      script.label = script.text;
      libraries.userSpecified.push(script);
      libraries.push(script);
    });
  } else {
    // Adding a lib according to the above schema
    lib.group = 'Custom';
    libraries.userSpecified.push(lib);
    libraries.push(lib);
  }
  try {
    store.localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
  $('#library').trigger('init');
};

libraries.clear = function () {
  libraries.userSpecified = [];
  store.localStorage.removeItem('libraries');
  var length = libraries.length;
  for (var i = 0; i < length; i++) {
    if (libraries[i].group === 'Custom') {
      libraries.splice(i, 1);
      length--;
    }
  }
  // force a refresh?
  $('#library').trigger('init');
};
