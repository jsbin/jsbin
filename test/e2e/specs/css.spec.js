module.exports = {
  'Basic CSS test' : function (client) {
   var data = client.globals;
    client
      .url(client.launch_url)
      .waitForElementVisible('#panel-css')
      .click('#panel-css')
      .waitForElementVisible('.css .CodeMirror')
        .insert('.css .CodeMirror')
        .frame(1)
        .pause(data.defaultTime)
        .frame(0)
        .expect.element('body').to.have.css('backgroundColor').which.equals('rgba(0, 0, 0, 1)');
      client.assert.urlMatch(/\/\w+\/edit\?html,css,output$/);

      client.end();

  },

  'Test processor-CSS  test' : function (client) {
       var data = client.globals;
        client
          .css_processors('a[id="processor-css"]');
  },
  'Test processor-less  test' : function (client) {
       var data = client.globals;
        client
          .css_processors('a[id="processor-less"]');
  },
  'Test processor-myth  test' : function (client) {
       var data = client.globals;
        client
          .css_processors('a[id="processor-myth"]');
  },
  'Test processor-scss  test' : function (client) {
       var data = client.globals;
        client
          .css_processors('a[id="processor-scss"]');
  },
  'Test processor-stylus  test' : function (client) {
       var data = client.globals;
        client
          .css_processors('a[id="processor-stylus"]');
  },
  'Test processor-convert-css  test' : function (client) {
       var data = client.globals;
        client
          .css_processors('a[id="processor-convert-css"]');
  }

};
