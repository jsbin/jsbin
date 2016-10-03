module.exports = {
  'General JavaScript  test' : function (client) {
    var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-javascript')
      .click('#panel-javascript')
      .waitForElementVisible('.javascript .CodeMirror')
      client.execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, ["document.body.innerHTML = 'Hello'"])
      .frame(2)
      .assert.containsText('body', 'Hello')
      .assert.urlMatch(/\/\w+\/edit\?html,js,output$/)
      .end();
  },

  'Test processor-javascript' : function (client) {
    client
        .js_processors('a[id="processor-javascript"]');
  },

  'Test processor-babel' : function (client) {
    client
        .js_processors('a[id="processor-babel"]');
  },

  'Test processor-jsx' : function (client) {
    client
        .js_processors('a[id="processor-jsx"]');
  },

  'Test processor-coffeescript' : function (client) {
    client
          .js_processors('a[id="processor-coffeescript"]');
  },

  'Test processor-traceur' : function (client) {
    client
      .js_processors('a[id="processor-traceur"]');
  },

  'Test processor-typescript' : function (client) {
    client
      .js_processors('a[id="processor-typescript"]');
  },

  'Test processor-processing' : function (client) {
    client
      .js_processors('a[id="processor-processing"]');
  },

  'Test processor-livescript' : function (client) {
    client
      .js_processors('a[id="processor-livescript"]');
  },

  'Test processor-convert' : function (client) {
    client
      .js_processors('a[id="processor-convert"]');
  }
};


